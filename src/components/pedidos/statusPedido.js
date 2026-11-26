import { Ban, Check, CircleCheckBig, Clock, Inbox, TriangleAlert } from "lucide-react"

// como cada status aparece na tela (rótulo, cor do badge e ícone)
export const STATUS_VISUAL = {
  RECEBIDA: { rotulo: "Recebido", tom: "info", icone: Inbox },
  EM_ANALISE: { rotulo: "Em análise", tom: "info", icone: Clock },
  PENDENTE: { rotulo: "Pendente", tom: "warning", icone: TriangleAlert },
  PRONTA: { rotulo: "Pronto", tom: "success", icone: Check },
  ENTREGUE: { rotulo: "Entregue", tom: "neutral", icone: CircleCheckBig },
  CANCELADA: { rotulo: "Cancelado", tom: "neutral", icone: Ban },
}
