import { useCallback, useState } from "react"
import { Link, Navigate, useParams } from "react-router-dom"
import { RodapeAcoes } from "@/components/layout/RodapeAcoes"
import { IconeSucesso } from "@/components/shared/IconeSucesso"
import { ListaDetalhes } from "@/components/shared/ListaDetalhes"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useAsync } from "@/hooks/useAsync"
import { formatarDiaMes, lerData } from "@/lib/format"
import { FORMAS_ENTREGA, getSolicitacao } from "@/services/secretariaService"
import { lerUsuario } from "@/services/usuarioService"

export default function PedidoEnviado() {
  const { protocolo } = useParams()
  const carregar = useCallback(() => getSolicitacao(protocolo), [protocolo])
  const { data: pedido, loading } = useAsync(carregar)
  const [notificacoesAtivas] = useState(() => lerUsuario().notificacoes.secretaria)

  if (loading) {
    return <Skeleton className="mx-auto mt-16 h-80 max-w-xl rounded-3xl" />
  }

  // protocolo que não existe (ex.: URL digitada errada): volta para a lista
  if (!pedido) return <Navigate to="/secretaria" replace />

  const prazo = formatarDiaMes(lerData(pedido.prazo))

  return (
    <div className="pt-8 md:pt-12 lg:pt-6">
      <section className="flex flex-col items-center text-center">
        <IconeSucesso className="size-24 [&>svg]:size-12" />
        <h1 className="mt-6 text-[28px] leading-tight font-bold tracking-tight">Pedido enviado!</h1>
        <Badge variant="info" size="lg" className="mt-3 font-bold">
          Protocolo #{pedido.protocolo}
        </Badge>
      </section>

      <ListaDetalhes
        className="mt-6"
        itens={[
          { rotulo: "Documento", valor: pedido.tipo.nome },
          { rotulo: "Prazo", valor: `até ${prazo}` },
          { rotulo: "Entrega", valor: FORMAS_ENTREGA[pedido.formaEntrega] },
        ]}
      />

      <p className="mt-4 text-center text-[13px] text-muted-foreground">
        {notificacoesAtivas
          ? "Você recebe uma notificação a cada mudança de status."
          : "Ative as notificações da secretaria no Perfil para receber os avisos."}
      </p>

      <RodapeAcoes>
        <Button size="xl" className="w-full" nativeButton={false} render={<Link to={`/secretaria/pedidos/${pedido.protocolo}`} replace />}>
          Acompanhar pedido
        </Button>
        <Button size="xl" variant="soft" className="w-full" nativeButton={false} render={<Link to="/" />}>
          Voltar ao início
        </Button>
      </RodapeAcoes>
    </div>
  )
}
