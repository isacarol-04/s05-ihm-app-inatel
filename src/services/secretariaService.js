import tiposDocumento from "@/data/tiposDocumento.json"
import solicitacoesIniciais from "@/data/solicitacoes.json"
import { delay, load } from "./storage"

// status possíveis de uma solicitação (igual ao diagrama de classes)
export const STATUS = {
  RECEBIDA: "RECEBIDA",
  EM_ANALISE: "EM_ANALISE",
  PENDENTE: "PENDENTE",
  PRONTA: "PRONTA",
  ENTREGUE: "ENTREGUE",
  CANCELADA: "CANCELADA",
}

export function getTipo(tipoId) {
  return tiposDocumento.find((tipo) => tipo.id === tipoId)
}

export function lerSolicitacoes() {
  return load("solicitacoes", solicitacoesIniciais)
}

export async function listarSolicitacoes() {
  await delay()
  return lerSolicitacoes().map((solicitacao) => ({
    ...solicitacao,
    tipo: getTipo(solicitacao.tipoId),
  }))
}

// pedidos que já terminaram (não aparecem em "em andamento")
export const STATUS_FINAIS = [STATUS.ENTREGUE, STATUS.CANCELADA]

// para o card de Serviços: "3 pedidos em andamento · 1 pronto"
export async function getResumoPedidos() {
  await delay()
  const solicitacoes = lerSolicitacoes()
  return {
    emAndamento: solicitacoes.filter((s) => !STATUS_FINAIS.includes(s.status)).length,
    prontos: solicitacoes.filter((s) => s.status === STATUS.PRONTA).length,
    pendentes: solicitacoes.filter((s) => s.status === STATUS.PENDENTE).length,
  }
}

// ordem na lista "em andamento": primeiro o que precisa da pessoa
const PRIORIDADE = {
  PRONTA: 0,
  PENDENTE: 1,
  EM_ANALISE: 2,
  RECEBIDA: 3,
}

// separa os pedidos em "em andamento" e "concluídos" (entregues ou cancelados)
export async function listarPedidos() {
  const pedidos = await listarSolicitacoes()
  const finalizado = (pedido) => STATUS_FINAIS.includes(pedido.status)

  return {
    emAndamento: pedidos
      .filter((pedido) => !finalizado(pedido))
      .sort((a, b) => PRIORIDADE[a.status] - PRIORIDADE[b.status] || new Date(b.dataPedido) - new Date(a.dataPedido)),
    concluidos: pedidos
      .filter(finalizado)
      .sort((a, b) => new Date(b.dataPedido) - new Date(a.dataPedido)),
  }
}

// data em que o pedido entrou no status atual (último item do histórico)
export function dataDoStatusAtual(pedido) {
  return pedido.historico.at(-1)?.data ?? pedido.dataPedido
}
