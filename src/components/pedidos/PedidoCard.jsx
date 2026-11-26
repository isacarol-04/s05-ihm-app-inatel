import { Link } from "react-router-dom"
import { ChevronRight } from "lucide-react"
import { formatarDiaMes, lerData } from "@/lib/format"
import { cn } from "@/lib/utils"
import { dataDoStatusAtual } from "@/services/secretariaService"
import { IconeDocumento } from "./IconeDocumento"
import { StatusBadge } from "./StatusBadge"

// texto à direita do status: o que a pessoa precisa saber/fazer agora
function dicaDoPedido(pedido) {
  switch (pedido.status) {
    case "PRONTA":
      return pedido.formaEntrega === "pdf" ? "Baixe o PDF" : "Retire no balcão"
    case "PENDENTE":
      return "Responda a secretaria"
    case "ENTREGUE":
      return `Entregue em ${formatarDiaMes(dataDoStatusAtual(pedido))}`
    case "CANCELADA":
      return `Cancelado em ${formatarDiaMes(dataDoStatusAtual(pedido))}`
    default:
      return `Previsão: ${formatarDiaMes(lerData(pedido.prazo))}`
  }
}

export function PedidoCard({ pedido }) {
  const pendente = pedido.status === "PENDENTE"
  const finalizado = pedido.status === "ENTREGUE" || pedido.status === "CANCELADA"

  return (
    <Link
      to={`/secretaria/pedidos/${pedido.protocolo}`}
      className={cn(
        "group block rounded-3xl border-2 border-transparent bg-card p-4 shadow-card transition-all outline-none",
        "hover:-translate-y-0.5 hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.99]",
        pendente && "border-warning"
      )}
    >
      <div className="flex items-center gap-3.5">
        <IconeDocumento apagado={finalizado} />
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-bold">{pedido.tipo.nome}</h3>
          <p className="text-[13px] text-muted-foreground">Protocolo #{pedido.protocolo}</p>
        </div>
        <ChevronRight className="size-5 shrink-0 text-subtle transition-transform group-hover:translate-x-0.5" />
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <StatusBadge status={pedido.status} />
        <span className="truncate text-[13px] text-muted-foreground">{dicaDoPedido(pedido)}</span>
      </div>
    </Link>
  )
}
