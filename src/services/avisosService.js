import { formatarDiaRelativo, formatarHora } from "@/lib/format"
import { lerReservaAtual } from "./armarioService"
import { STATUS, getTipo, lerSolicitacoes } from "./secretariaService"
import { lerUsuario } from "./usuarioService"
import { delay } from "./storage"

// Os avisos da tela inicial são montados a partir do que está acontecendo
// nos outros serviços (secretaria, armário e financeiro).
export async function getAvisos(agora = new Date()) {
  await delay()
  const avisos = []

  lerSolicitacoes().forEach((solicitacao) => {
    const tipo = getTipo(solicitacao.tipoId)

    if (solicitacao.status === STATUS.PRONTA) {
      avisos.push({
        id: `pronta-${solicitacao.protocolo}`,
        tom: "success",
        icone: "documento",
        titulo: tipo.avisoPronto,
        descricao: solicitacao.formaEntrega === "pdf" ? "Toque para baixar o PDF" : "Retire no balcão",
        para: `/secretaria/pedidos/${solicitacao.protocolo}`,
      })
    }

    if (solicitacao.status === STATUS.PENDENTE) {
      avisos.push({
        id: `pendente-${solicitacao.protocolo}`,
        tom: "warning",
        icone: "mensagem",
        titulo: "A secretaria precisa de você",
        descricao: `${tipo.nome} · responda`,
        para: `/secretaria/pedidos/${solicitacao.protocolo}`,
      })
    }
  })

  const reserva = lerReservaAtual()
  if (reserva) {
    const devolverAte = new Date(reserva.devolverAte)
    avisos.push({
      id: "armario",
      tom: "warning",
      icone: "armario",
      titulo: `Devolver armário ${formatarDiaRelativo(devolverAte, agora)}`,
      descricao: `Armário ${reserva.armarioId} · até ${formatarHora(devolverAte)}`,
      para: "/servicos/armario",
    })
  }

  if (lerUsuario().pendencias?.financeiro) {
    avisos.push({
      id: "financeiro",
      tom: "danger",
      icone: "financeiro",
      titulo: "Pendência no financeiro",
      descricao: "Toque para ver detalhes",
      para: "/financeiro",
    })
  }

  return avisos
}
