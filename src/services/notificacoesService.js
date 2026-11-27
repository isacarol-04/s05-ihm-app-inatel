import solicitacoesIniciais from "@/data/solicitacoes.json"
import tiposDocumento from "@/data/tiposDocumento.json"
import { lerUsuario } from "./usuarioService"
import { load, save } from "./storage"

const CHAVE = "notificacoes"
const observadores = new Set()

function avisarAtualizacao() {
  observadores.forEach((atualizar) => atualizar())
}

function sincronizarEntreAbas(evento) {
  if ([null, "app-inatel:notificacoes", "app-inatel:usuario"].includes(evento.key)) avisarAtualizacao()
}

export function observarNotificacoes(atualizar) {
  observadores.add(atualizar)
  if (observadores.size === 1) window.addEventListener("storage", sincronizarEntreAbas)
  return () => {
    observadores.delete(atualizar)
    if (observadores.size === 0) window.removeEventListener("storage", sincronizarEntreAbas)
  }
}

function idDaAtualizacao(protocolo, etapa) {
  return `${protocolo}:${etapa.status}:${etapa.data}`
}

function criarNotificacao(pedido, etapa) {
  const tipo = tiposDocumento.find((item) => item.id === pedido.tipoId)
  const dados = {
    RECEBIDA: { titulo: "Pedido recebido", tom: "primary", icone: "documento" },
    EM_ANALISE: { titulo: "Seu pedido está em análise", tom: "primary", icone: "documento" },
    PENDENTE: { titulo: "A secretaria precisa de você", tom: "warning", icone: "mensagem" },
    PRONTA: { titulo: tipo.avisoPronto, tom: "success", icone: "documento" },
    ENTREGUE: { titulo: "Documento entregue", tom: "success", icone: "documento" },
    CANCELADA: { titulo: "Pedido cancelado", tom: "danger", icone: "documento" },
  }[etapa.status]

  let orientacao = ""
  if (etapa.status === "PENDENTE") orientacao = " · Responda à secretaria"
  if (etapa.status === "PRONTA") orientacao = pedido.formaEntrega === "pdf" ? " · Baixe o PDF" : " · Retire no balcão"

  return {
    ...dados,
    id: idDaAtualizacao(pedido.protocolo, etapa),
    protocolo: pedido.protocolo,
    status: etapa.status,
    descricao: `${tipo.nome} · #${pedido.protocolo}${orientacao}`,
    para: `/secretaria/pedidos/${pedido.protocolo}`,
    data: etapa.data,
    lida: false,
  }
}

function podeNotificar(etapa, usuario) {
  return usuario.notificacoes.secretaria && (
    !usuario.notificacoesSecretariaAtivadasEm ||
    new Date(etapa.data) >= new Date(usuario.notificacoesSecretariaAtivadasEm)
  )
}

// Na primeira abertura, apresenta a última atualização de cada pedido já
// existente. A partir daí, o histórico de notificações tem leitura própria.
export function lerNotificacoes(solicitacoes = load("solicitacoes", solicitacoesIniciais)) {
  const salvas = load(CHAVE, null)
  if (salvas !== null) return salvas

  const usuario = lerUsuario()
  const iniciais = solicitacoes.flatMap((pedido) => {
    const etapa = pedido.historico.at(-1)
    return etapa && podeNotificar(etapa, usuario) ? [criarNotificacao(pedido, etapa)] : []
  })
  save(CHAVE, iniciais)
  return iniciais
}

// Compara o histórico anterior com o salvo: uma avaliação ou uma nova
// leitura não repete avisos, e duas passagens por "Em análise" são distintas.
export function registrarAtualizacoes(anteriores, atuais) {
  const notificacoes = lerNotificacoes(anteriores)
  const usuario = lerUsuario()
  const conhecidas = new Set(notificacoes.map((item) => item.id))
  const etapasAnteriores = new Set(anteriores.flatMap((pedido) => (
    pedido.historico.map((etapa) => idDaAtualizacao(pedido.protocolo, etapa))
  )))
  const novas = []

  atuais.forEach((pedido) => {
    pedido.historico.forEach((etapa) => {
      const id = idDaAtualizacao(pedido.protocolo, etapa)
      if (etapasAnteriores.has(id) || conhecidas.has(id) || !podeNotificar(etapa, usuario)) return
      novas.push(criarNotificacao(pedido, etapa))
      conhecidas.add(id)
    })
  })

  if (novas.length > 0) {
    save(CHAVE, [...novas, ...notificacoes])
    avisarAtualizacao()
  }
}

export async function listarNotificacoes() {
  return lerNotificacoes().sort((a, b) => new Date(b.data) - new Date(a.data))
}

export function marcarComoLida(id) {
  const notificacoes = lerNotificacoes()
  const notificacao = notificacoes.find((item) => item.id === id)
  if (!notificacao || notificacao.lida) return
  notificacao.lida = true
  save(CHAVE, notificacoes)
  avisarAtualizacao()
}

export function marcarTodasComoLidas() {
  const notificacoes = lerNotificacoes()
  if (notificacoes.every((item) => item.lida)) return
  save(CHAVE, notificacoes.map((item) => ({ ...item, lida: true })))
  avisarAtualizacao()
}

export function apagarNotificacao(id) {
  const notificacoes = lerNotificacoes()
  const restantes = notificacoes.filter((item) => item.id !== id)
  if (restantes.length === notificacoes.length) return
  save(CHAVE, restantes)
  avisarAtualizacao()
}

export function apagarNotificacoesLidas() {
  const notificacoes = lerNotificacoes()
  const restantes = notificacoes.filter((item) => !item.lida)
  if (restantes.length === notificacoes.length) return
  save(CHAVE, restantes)
  avisarAtualizacao()
}
