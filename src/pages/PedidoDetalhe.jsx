import { useCallback, useState } from "react"
import { Navigate, useParams } from "react-router-dom"
import { CircleCheck, Info, MapPin, TriangleAlert } from "lucide-react"
import { HeaderInterno } from "@/components/layout/HeaderInterno"
import { RodapeAcoes } from "@/components/layout/RodapeAcoes"
import { AvaliacaoAtendimento } from "@/components/pedidos/AvaliacaoAtendimento"
import { AvisoPendencia } from "@/components/pedidos/AvisoPendencia"
import { CampoResposta } from "@/components/pedidos/CampoResposta"
import { ConversaSecretaria } from "@/components/pedidos/ConversaSecretaria"
import { DocumentoPronto } from "@/components/pedidos/DocumentoPronto"
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
import { cn } from "@/lib/utils"
import { FORMAS_ENTREGA, STATUS, STATUS_FINAIS, avaliar, cancelar, confirmarRetirada, dataDoStatusAtual, getSolicitacao, observarSolicitacoes, podeAvaliarAtendimento, podeCancelar, podeConfirmarRetirada, responderPendencia } from "@/services/secretariaService"

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
  const { data: pedido, loading, atualizar, recarregar } = useAsync(carregar, observarSolicitacoes)
  const [confirmando, setConfirmando] = useState(false)
  const [confirmandoRetirada, setConfirmandoRetirada] = useState(false)
  const [respondido, setRespondido] = useState(false)
  const [erro, setErro] = useState(null)
  const [agora] = useState(() => new Date())

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
  const pendente = pedido.status === STATUS.PENDENTE
  // documento pronto em PDF (tela 15): a tela mostra o arquivo em vez da linha do tempo
  const pdfPronto = pedido.status === STATUS.PRONTA && pedido.formaEntrega === "pdf" && pedido.documento
  const podeAvaliar = podeAvaliarAtendimento(pedido)
  const retiradaDisponivel = podeConfirmarRetirada(pedido)

  async function cancelarPedido() {
    setErro(null)
    try {
      atualizar(await cancelar(pedido.protocolo))
    } catch (e) {
      setErro(e.message)
      recarregar()
    }
  }

  async function avaliarAtendimento(nota) {
    // a estrela acende na hora; o service grava em seguida
    setErro(null)
    atualizar({ ...pedido, avaliacao: { nota } })
    try {
      atualizar(await avaliar(pedido.protocolo, nota))
    } catch (e) {
      setErro(e.message)
      recarregar()
    }
  }

  async function registrarRetirada() {
    setErro(null)
    try {
      atualizar(await confirmarRetirada(pedido.protocolo))
    } catch (e) {
      setErro(e.message)
      recarregar()
    }
  }

  async function responder(resposta) {
    setErro(null)
    try {
      atualizar(await responderPendencia(pedido.protocolo, resposta))
      setRespondido(true)
    } catch (e) {
      setErro(e.message)
    }
  }

  return (
    <>
      <HeaderInterno titulo={`Pedido #${pedido.protocolo}`} voltarPara="/secretaria" />

      {respondido && pedido.status === STATUS.EM_ANALISE && (
        <InfoBox icone={CircleCheck} tom="success" className="mt-3" role="status">
          Resposta enviada! A secretaria volta a analisar o seu pedido.
        </InfoBox>
      )}

      {/* pendente (tela 14) e PDF pronto (tela 15): só nome + status no topo, o resto da tela é a ação */}
      {pendente && <AvisoPendencia className="mt-3" />}
      {pendente || pdfPronto ? (
        <div className={cn("mb-3 flex items-center justify-between gap-3", pendente ? "mt-5" : "mt-3")}>
          <h2 className="text-lg leading-snug font-bold">{pedido.tipo.nome}</h2>
          <StatusBadge status={pedido.status} className="shrink-0" />
        </div>
      ) : (
        <>
          <section className="mt-3 flex items-center gap-3.5 rounded-3xl bg-card p-4 shadow-card">
            <IconeDocumento apagado={finalizado} />
            <div className="min-w-0 flex-1">
              <h2 className="text-base leading-snug font-bold">{pedido.tipo.nome}</h2>
              <p className="mt-0.5 text-[13px] text-muted-foreground">Pedido em {formatarDataHora(pedido.dataPedido)}</p>
            </div>
            <StatusBadge status={pedido.status} compacto className="shrink-0 px-2.5 font-semibold" />
          </section>
          <SectionHeader titulo="Andamento" className="mt-6" />
        </>
      )}

      {pdfPronto ? <DocumentoPronto pedido={pedido} /> : <LinhaDoTempo etapas={montarEtapas(pedido)} />}

      {/* impresso pronto: diz onde e quando retirar */}
      {retiradaDisponivel && (
        <InfoBox icone={MapPin} tom="success" className="mt-4">
          Pronto para retirada na Secretaria Acadêmica (Prédio 1, segundo andar), de seg. a sex., das 8h às 17h. Leve um
          documento com foto.
        </InfoBox>
      )}

      {pedido.formaEntrega === "impresso" && pedido.status === STATUS.ENTREGUE && (
        <InfoBox icone={CircleCheck} tom="success" className="mt-4" role="status">
          Retirada confirmada em {formatarDataHora(dataDoStatusAtual(pedido))}. Seu pedido foi concluído.
        </InfoBox>
      )}

      {pedido.pendencias.length > 0 && !pdfPronto && (
        <ConversaSecretaria mensagens={pedido.pendencias} agora={agora} className="mt-4" />
      )}

      {pendente && <CampoResposta onEnviar={responder} className="mt-4" />}
      {!pendente && !pdfPronto && <ListaDetalhes className="mt-4" itens={detalhesDoPedido(pedido)} />}

      {podeAvaliar && (
        <AvaliacaoAtendimento nota={pedido.avaliacao?.nota} onAvaliar={avaliarAtendimento} className="mt-3" />
      )}

      {pedido.status === STATUS.EM_ANALISE && !respondido && (
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

      {retiradaDisponivel && (
        <RodapeAcoes legenda="Confirme após receber o documento na secretaria.">
          <Button size="xl" className="w-full" onClick={() => setConfirmandoRetirada(true)}>
            <MapPin className="size-5" /> Confirmar retirada
          </Button>
        </RodapeAcoes>
      )}

      <ConfirmarDialog
        aberto={confirmandoRetirada}
        onAbertoChange={setConfirmandoRetirada}
        icone={MapPin}
        tom="primary"
        titulo="Confirmar retirada?"
        descricao={`Você já recebeu o documento de ${pedido.tipo.nome} na secretaria? Ao confirmar, o pedido será marcado como entregue.`}
        textoCancelar="Ainda não"
        textoConfirmar="Sim, já retirei"
        onConfirmar={registrarRetirada}
      />

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
