import { formatarDataHora, formatarDiaMes, lerData } from "@/lib/format"
import { STATUS_FINAIS } from "@/services/secretariaService"
import { STATUS_VISUAL } from "./statusPedido"

// cor da bolinha quando a etapa é a atual
const TOM_ATUAL = {
  PENDENTE: "warning",
  PRONTA: "success",
  ENTREGUE: "success",
  CANCELADA: "danger",
}

// texto das etapas que ainda não aconteceram
function descricaoFutura(status, pedido) {
  if (status === "EM_ANALISE") return "A secretaria vai conferir seus dados"
  if (status === "PRONTA") return `Previsão: até ${formatarDiaMes(lerData(pedido.prazo))}`
  return "Retirada no balcão da secretaria"
}

// Monta a linha do tempo do pedido:
// - o que já aconteceu vem do histórico (com data e hora);
// - depois, as etapas que ainda faltam até ficar pronto (em cinza).
// Pedido entregue ou cancelado não tem etapa futura.
export function montarEtapas(pedido) {
  const passadas = pedido.historico.map((item, i, lista) => {
    const atual = i === lista.length - 1
    return {
      status: item.status,
      titulo: STATUS_VISUAL[item.status].rotulo,
      descricao: formatarDataHora(item.data),
      estado: atual ? "atual" : "feito",
      tom: atual ? (TOM_ATUAL[item.status] ?? "primary") : "primary",
    }
  })

  if (STATUS_FINAIS.includes(pedido.status)) return passadas

  const proximas = ["RECEBIDA", "EM_ANALISE", "PRONTA"]
  if (pedido.formaEntrega === "impresso") proximas.push("ENTREGUE")

  const jaAconteceu = new Set(pedido.historico.map((item) => item.status))
  const futuras = proximas
    .filter((status) => !jaAconteceu.has(status))
    .map((status) => ({
      status,
      titulo: STATUS_VISUAL[status].rotulo,
      descricao: descricaoFutura(status, pedido),
      estado: "futuro",
    }))

  return [...passadas, ...futuras]
}
