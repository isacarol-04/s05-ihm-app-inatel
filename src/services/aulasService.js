import aulas from "@/data/aulas.json"
import { delay } from "./storage"

// junta a data do dia com o horário "10:00"
function dataComHora(dia, hora) {
  const [h, m] = hora.split(":").map(Number)
  const data = new Date(dia)
  data.setHours(h, m, 0, 0)
  return data
}

export async function getAulas() {
  await delay()
  return aulas
}

// aulas de um dia da semana (0 = domingo ... 6 = sábado), em ordem de horário
export async function getAulasDoDia(diaSemana) {
  await delay()
  return aulas
    .flatMap((aula) =>
      aula.horarios
        .filter((horario) => horario.dia === diaSemana)
        .map((horario) => ({ ...aula, horario }))
    )
    .sort((a, b) => a.horario.inicio.localeCompare(b.horario.inicio))
}

// procura a próxima aula (ou a que está acontecendo agora) nos próximos 7 dias
export async function getProximaAula(agora = new Date()) {
  await delay()

  for (let i = 0; i < 7; i++) {
    const dia = new Date(agora)
    dia.setDate(agora.getDate() + i)

    const aulasDoDia = aulas
      .flatMap((aula) =>
        aula.horarios
          .filter((horario) => horario.dia === dia.getDay())
          .map((horario) => ({
            aula,
            horario,
            inicio: dataComHora(dia, horario.inicio),
            fim: dataComHora(dia, horario.fim),
          }))
      )
      .filter(({ fim }) => fim > agora)
      .sort((a, b) => a.inicio - b.inicio)

    if (aulasDoDia.length > 0) return aulasDoDia[0]
  }
  return null
}

// mesma regra do app antigo: abaixo de 6 vermelho, abaixo de 8 amarelo, senão verde
export function corDoCR(nota) {
  if (nota < 6) return "danger"
  if (nota < 8) return "warning"
  return "success"
}

export function formatarNota(nota) {
  return Number.isInteger(nota) ? String(nota) : nota.toFixed(1).replace(".", ",")
}
