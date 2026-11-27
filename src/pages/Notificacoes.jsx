import { HeaderInterno } from "@/components/layout/HeaderInterno"
import { ListaNotificacoes } from "@/components/inicio/ListaNotificacoes"
import { useNotificacoes } from "@/hooks/useNotificacoes"

export default function Notificacoes() {
  const { notificacoes, loading } = useNotificacoes()

  return (
    <>
      <HeaderInterno titulo="Notificações" voltarPara="/" />
      <p className="mt-2 text-sm text-muted-foreground">Acompanhe as atualizações dos seus pedidos.</p>
      <div className="mt-5">
        <ListaNotificacoes notificacoes={notificacoes} loading={loading} />
      </div>
    </>
  )
}
