import tiposDocumento from "@/data/tiposDocumento.json"
import solicitacoesIniciais from "@/data/solicitacoes.json"
import { paraDataIso } from "@/lib/format"
import { delay, load, save } from "./storage"

const CHAVE = "solicitacoes"

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
  return load(CHAVE, solicitacoesIniciais)
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

// finalidades oferecidas no formulário de novo pedido
export const FINALIDADES = ["Estágio", "Trabalho", "Transporte", "Bolsa", "Intercâmbio", "Outra"]

export const FORMAS_ENTREGA = {
  pdf: "PDF no app",
  impresso: "Impresso",
}

// tira acentos e deixa minúsculo, para "estagio" achar "Estágio"
function normalizar(texto) {
  return texto.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().trim()
}

// palavras que não ajudam a achar o documento ("comprovante PARA estágio")
const PALAVRAS_IGNORADAS = ["de", "da", "do", "das", "dos", "para", "pra", "com", "uma", "um", "meu", "minha"]

// tipos de documento; a busca olha nome, descrição e palavras-chave.
// Cada palavra digitada que bate conta um ponto e os que batem mais aparecem primeiro.
// (síncrona porque roda a cada tecla digitada no campo de busca)
export function buscarTipos(busca = "") {
  const palavras = normalizar(busca)
    .split(/\s+/)
    .filter((palavra) => palavra && !PALAVRAS_IGNORADAS.includes(palavra))
  if (palavras.length === 0) return tiposDocumento

  return tiposDocumento
    .map((tipo) => {
      const texto = normalizar([tipo.nome, tipo.descricao, ...tipo.palavrasChave].join(" "))
      return { tipo, pontos: palavras.filter((palavra) => texto.includes(palavra)).length }
    })
    .filter(({ pontos }) => pontos > 0)
    .sort((a, b) => b.pontos - a.pontos)
    .map(({ tipo }) => tipo)
}

export async function listarTipos(busca = "") {
  await delay(150)
  return buscarTipos(busca)
}

// soma dias úteis (pula sábado e domingo)
export function somarDiasUteis(data, dias) {
  const resultado = new Date(data)
  let faltam = dias
  while (faltam > 0) {
    resultado.setDate(resultado.getDate() + 1)
    const diaSemana = resultado.getDay()
    if (diaSemana !== 0 && diaSemana !== 6) faltam--
  }
  return resultado
}

// próximo número de protocolo do ano: "2026-0421"
function proximoProtocolo(solicitacoes, ano) {
  const maior = solicitacoes
    .filter((s) => s.protocolo.startsWith(`${ano}-`))
    .reduce((max, s) => Math.max(max, Number(s.protocolo.split("-")[1])), 0)
  return `${ano}-${String(maior + 1).padStart(4, "0")}`
}

export async function getSolicitacao(protocolo) {
  await delay()
  const solicitacao = lerSolicitacoes().find((s) => s.protocolo === protocolo)
  return solicitacao ? { ...solicitacao, tipo: getTipo(solicitacao.tipoId) } : null
}

// cria o pedido já com o status RECEBIDA no histórico (igual ao diagrama de classes)
export async function criarSolicitacao({ tipoId, finalidade, formaEntrega, anexo = null }, agora = new Date()) {
  await delay(500)
  const tipo = getTipo(tipoId)
  if (!tipo) throw new Error("Documento não encontrado.")
  if (!tipo.formatos.includes(formaEntrega)) throw new Error("Esse documento não está disponível nessa forma de entrega.")

  const solicitacoes = lerSolicitacoes()
  const dataPedido = agora.toISOString()
  const solicitacao = {
    protocolo: proximoProtocolo(solicitacoes, agora.getFullYear()),
    tipoId,
    finalidade,
    formaEntrega,
    anexo,
    status: STATUS.RECEBIDA,
    dataPedido,
    prazo: paraDataIso(somarDiasUteis(agora, tipo.prazoDias)),
    historico: [{ status: STATUS.RECEBIDA, data: dataPedido }],
    pendencias: [],
    documento: null,
    avaliacao: null,
  }

  save(CHAVE, [solicitacao, ...solicitacoes])
  return { ...solicitacao, tipo }
}
