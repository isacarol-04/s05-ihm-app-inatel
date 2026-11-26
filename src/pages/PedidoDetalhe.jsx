import { useCallback, useState } from "react"
import { Navigate, useParams } from "react-router-dom"
import { Info, TriangleAlert } from "lucide-react"
import { HeaderInterno } from "@/components/layout/HeaderInterno"
import { RodapeAcoes } from "@/components/layout/RodapeAcoes"
import { IconeDocumento } from "@/components/pedidos/IconeDocumento"
import { LinhaDoTempo } from "@/components/pedidos/LinhaDoTempo"
import { StatusBadge } from "@/components/pedidos/StatusBadge"
import { montarEtapas } from "@/components/pedidos/etapasPedido"
import { ConfirmarDialog } from "@/components/shared/ConfirmarDialog"
import { InfoBox } from "@/components/shared/InfoBox"
import { ListaDetalhes } from "@/components/shared/ListaDetalhes"
import { SectionHeader } from "@/components/shared/SectionHeader"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useAsync } from "@/hooks/useAsync"
import { formatarDataHora, formatarDiaMes, lerData } from "@/lib/format"
import { FORMAS_ENTREGA, STATUS, STATUS_FINAIS, cancelar, getSolicitacao, podeCancelar } from "@/services/secretariaService"

function detalhesDoPedido(pedido) {
  const itens = [
    { rotulo: "Finalidade", valor: pedido.finalidade },
    { rotulo: "Entrega", valor: FORMAS_ENTREGA[pedido.formaEntrega] },
  ]
  // prazo só interessa enquanto o documento ainda não ficou pronto
  if (!STATUS_FINAIS.includes(pedido.status) && pedido.status !== STATUS.PRONTA) {
    itens.push({ rotulo: "Prazo", valor: `até ${formatarDiaMes(lerData(pedido.prazo))}` })
  }
  if (pedido.anexo) itens.push({ rotulo: "Anexo", valor: pedido.anexo.nome })
  return itens
}

export default function PedidoDetalhe() {
  const { protocolo } = useParams()
  const carregar = useCallback(() => getSolicitacao(protocolo), [protocolo])
  const { data, loading } = useAsync(carregar)
  // depois de cancelar, a tela mostra o pedido atualizado sem buscar de novo
  const [pedidoAtualizado, setPedidoAtualizado] = useState(null)
  const pedido = pedidoAtualizado ?? data
  const [confirmando, setConfirmando] = useState(false)
  const [erro, setErro] = useState(null)

  if (loading) {
    return (
      <>
        <HeaderInterno titulo={`Pedido #${protocolo}`} voltarPara="/secretaria" />
        <Skeleton className="mt-3 h-20 rounded-3xl" />
        <Skeleton className="mt-12 h-44 rounded-3xl" />
      </>
    )
  }

  // protocolo que não existe (ex.: URL digitada errada): volta para a lista
  if (!pedido) return <Navigate to="/secretaria" replace />

  const finalizado = STATUS_FINAIS.includes(pedido.status)

  async function cancelarPedido() {
    setErro(null)
    try {
      setPedidoAtualizado(await cancelar(pedido.protocolo))
    } catch (e) {
      setErro(e.message)
    }
  }

  return (
    <>
      <HeaderInterno titulo={`Pedido #${pedido.protocolo}`} voltarPara="/secretaria" />

      <section className="mt-3 flex items-center gap-3.5 rounded-3xl bg-card p-4 shadow-card">
        <IconeDocumento apagado={finalizado} />
        <div className="min-w-0 flex-1">
          <h2 className="text-base leading-snug font-bold">{pedido.tipo.nome}</h2>
          <p className="mt-0.5 text-[13px] text-muted-foreground">Pedido em {formatarDataHora(pedido.dataPedido)}</p>
        </div>
        <StatusBadge status={pedido.status} compacto className="shrink-0 px-2.5 font-semibold" />
      </section>

      <SectionHeader titulo="Andamento" className="mt-6" />
      <LinhaDoTempo etapas={montarEtapas(pedido)} />

      <ListaDetalhes className="mt-4" itens={detalhesDoPedido(pedido)} />

      {pedido.status === STATUS.EM_ANALISE && (
        <InfoBox icone={Info} className="mt-4">
          Seu pedido já está em análise, então não dá mais para cancelar pelo app. Se precisar, fale com a secretaria.
        </InfoBox>
      )}

      {erro && (
        <InfoBox icone={TriangleAlert} tom="danger" className="mt-4" role="alert">
          {erro}
        </InfoBox>
      )}

      {podeCancelar(pedido) && (
        <RodapeAcoes legenda="Disponível até o pedido entrar em análise.">
          <Button size="xl" variant="destructive" className="w-full" onClick={() => setConfirmando(true)}>
            Cancelar pedido
          </Button>
        </RodapeAcoes>
      )}

      <ConfirmarDialog
        aberto={confirmando}
        onAbertoChange={setConfirmando}
        icone={TriangleAlert}
        titulo="Cancelar pedido?"
        descricao={`O pedido de ${pedido.tipo.nome} (#${pedido.protocolo}) será cancelado. Se precisar depois, é só fazer um novo pedido.`}
        textoCancelar="Manter"
        textoConfirmar="Sim, cancelar"
        onConfirmar={cancelarPedido}
      />
    </>
  )
}
