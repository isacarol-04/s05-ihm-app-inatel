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
