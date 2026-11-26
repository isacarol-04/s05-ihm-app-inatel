import armariosIniciais from "@/data/armarios.json"
import { delay, load, save } from "./storage"

export const HORAS_RESERVA = 24

export const FORMATOS = {
  padrao: "Padrão",
  duplo: "Duplo",
}

// no protótipo a Ana Clara já começa com o armário 12, devolvendo às 18h
function reservaInicial() {
  const devolverAte = new Date()
  devolverAte.setHours(18, 0, 0, 0)
  if (devolverAte < new Date()) devolverAte.setDate(devolverAte.getDate() + 1)

  const reservadoEm = new Date(devolverAte.getTime() - HORAS_RESERVA * 60 * 60 * 1000)

  return {
    armarioId: 12,
    formato: "padrao",
    bloco: "P1",
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

// quantos armários livres de cada formato, já filtrando por acessibilidade
export async function getDisponiveis(acessivel) {
  await delay()
  const livres = lerArmarios().filter((armario) => armario.disponivel && armario.acessivel === acessivel)
  return {
    padrao: livres.filter((armario) => armario.formato === "padrao").length,
    duplo: livres.filter((armario) => armario.formato === "duplo").length,
  }
}

// Mesma lógica do reservarArmario do app antigo: filtra pelo formato e pela
// acessibilidade, sorteia um dos livres e marca a devolução para 24h depois.
export async function reservar({ formato, acessivel }) {
  await delay(400)

  if (lerReservaAtual()) {
    throw new Error("Você já tem um armário reservado. Devolva antes de reservar outro.")
  }

  const armarios = lerArmarios()
  const livres = armarios.filter(
    (armario) => armario.formato === formato && armario.disponivel && armario.acessivel === acessivel
  )
  if (livres.length === 0) {
    throw new Error("Nenhum armário disponível para o tipo selecionado.")
  }

  const sorteado = livres[Math.floor(Math.random() * livres.length)]
  const reservadoEm = new Date()
  const devolverAte = new Date(reservadoEm.getTime() + HORAS_RESERVA * 60 * 60 * 1000)

  save(
    "armarios",
    armarios.map((armario) => (armario.id === sorteado.id ? { ...armario, disponivel: false } : armario))
  )

  const reserva = {
    armarioId: sorteado.id,
    formato: sorteado.formato,
    bloco: sorteado.bloco,
    reservadoEm: reservadoEm.toISOString(),
    devolverAte: devolverAte.toISOString(),
  }
  save("reserva", reserva)
  return reserva
}

// devolve o armário atual (ele volta a ficar livre para outra pessoa)
export async function devolver() {
  await delay(300)
  const reserva = lerReservaAtual()
  if (!reserva) return

  save(
    "armarios",
    lerArmarios().map((armario) => (armario.id === reserva.armarioId ? { ...armario, disponivel: true } : armario))
  )
  save("reserva", null)
}

// para o card de Serviços: reserva atual (se tiver) e quantos armários estão livres
export async function getResumoArmario() {
  await delay()
  return {
    reserva: lerReservaAtual(),
    disponiveis: lerArmarios().filter((armario) => armario.disponivel).length,
  }
}
