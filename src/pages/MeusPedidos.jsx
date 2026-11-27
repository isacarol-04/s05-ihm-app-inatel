import { useState } from "react"
import { Link } from "react-router-dom"
import { CircleHelp, FileText, Plus } from "lucide-react"
import { HeaderInterno } from "@/components/layout/HeaderInterno"
import { PedidoCard } from "@/components/pedidos/PedidoCard"
import { InfoBox } from "@/components/shared/InfoBox"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAsync } from "@/hooks/useAsync"
import { listarPedidos, observarSolicitacoes } from "@/services/secretariaService"

function ListaPedidos({ pedidos, vazio }) {
  if (pedidos.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-3xl bg-card px-6 py-10 text-center shadow-card">
        <span className="flex size-14 items-center justify-center rounded-full bg-muted text-subtle">
          <FileText className="size-6" />
        </span>
        <p className="mt-3 font-semibold">{vazio}</p>
      </div>
    )
  }

  return (
    <ul className="space-y-3">
      {pedidos.map((pedido) => (
        <li key={pedido.protocolo}>
          <PedidoCard pedido={pedido} />
        </li>
      ))}
    </ul>
  )
}

export default function MeusPedidos() {
  const { data } = useAsync(listarPedidos, observarSolicitacoes)
  const [aba, setAba] = useState("andamento")

  return (
    <div>
      <HeaderInterno titulo="Secretaria" voltarPara="/servicos" />

      <Button size="xl" className="mt-3 w-full" nativeButton={false} render={<Link to="/secretaria/novo" />}>
        <Plus className="size-5" /> Novo pedido
      </Button>

      <Tabs value={aba} onValueChange={setAba} className="mt-4 gap-3">
        <TabsList className="h-11 w-full rounded-xl bg-secondary p-1">
          <TabsTrigger value="andamento" className="h-full rounded-lg text-sm font-semibold data-active:bg-card">
            Em andamento{data && ` (${data.emAndamento.length})`}
          </TabsTrigger>
          <TabsTrigger value="concluidos" className="h-full rounded-lg text-sm font-semibold data-active:bg-card">
            Concluídos
          </TabsTrigger>
        </TabsList>

        {data ? (
          <>
            <TabsContent value="andamento">
              <ListaPedidos pedidos={data.emAndamento} vazio="Nenhum pedido em andamento" />
            </TabsContent>
            <TabsContent value="concluidos">
              <ListaPedidos pedidos={data.concluidos} vazio="Nenhum pedido concluído ainda" />
            </TabsContent>
          </>
        ) : (
          <div className="space-y-3">
            <Skeleton className="h-28 rounded-3xl" />
            <Skeleton className="h-28 rounded-3xl" />
          </div>
        )}
      </Tabs>

      <InfoBox icone={CircleHelp} className="mt-4 bg-secondary text-xs text-muted-foreground [&>svg]:text-muted-foreground">
        Atendimento presencial: seg. a sex., das 8h às 17h.
      </InfoBox>
    </div>
  )
}
