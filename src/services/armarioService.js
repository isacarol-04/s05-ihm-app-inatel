import armariosIniciais from "@/data/armarios.json"
import { delay, load } from "./storage"

export const HORAS_RESERVA = 24

// no protótipo a Ana Clara já começa com o armário 12, devolvendo às 18h
function reservaInicial() {
  const devolverAte = new Date()
  devolverAte.setHours(18, 0, 0, 0)
  if (devolverAte < new Date()) devolverAte.setDate(devolverAte.getDate() + 1)

  const reservadoEm = new Date(devolverAte.getTime() - HORAS_RESERVA * 60 * 60 * 1000)

  return {
    armarioId: 12,
    formato: "padrao",
    reservadoEm: reservadoEm.toISOString(),
    devolverAte: devolverAte.toISOString(),
  }
}

export function lerArmarios() {
  return load("armarios", armariosIniciais)
}

export function lerReservaAtual() {
  return load("reserva", reservaInicial)
}

export async function getReservaAtual() {
  await delay()
  return lerReservaAtual()
}

// para o card de Serviços: reserva atual (se tiver) e quantos armários estão livres
export async function getResumoArmario() {
  await delay()
  return {
    reserva: lerReservaAtual(),
    disponiveis: lerArmarios().filter((armario) => armario.disponivel).length,
  }
}
