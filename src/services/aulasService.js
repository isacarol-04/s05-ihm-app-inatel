import aulas from "@/data/aulas.json"
import { delay } from "./storage"

const DIAS_SEMANA = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]

// junta a data do dia com o horário "10:00"
function dataComHora(dia, hora) {
  const [h, m] = hora.split(":").map(Number)
  const data = new Date(dia)
  data.setHours(h, m, 0, 0)
  return data
}

function inicioDoDia(data) {
  const copia = new Date(data)
  copia.setHours(0, 0, 0, 0)
  return copia
}

// "2026-11-27" -> Date no fuso local (sem o problema do UTC)
export function lerData(iso) {
  const [ano, mes, dia] = iso.split("-").map(Number)
  return new Date(ano, mes - 1, dia)
}

export async function getAulas() {
  await delay()
  return aulas
}

// segunda a sexta da semana atual (no fim de semana já mostra a próxima)
export function getSemana(agora = new Date()) {
  const segunda = inicioDoDia(agora)
  const diaSemana = segunda.getDay()
  const ate = diaSemana === 0 ? 1 : diaSemana === 6 ? 2 : 1 - diaSemana
  segunda.setDate(segunda.getDate() + ate)

  return Array.from({ length: 5 }, (_, i) => {
    const data = new Date(segunda)
    data.setDate(segunda.getDate() + i)
    return {
      data,
      diaSemana: data.getDay(),
      rotulo: DIAS_SEMANA[data.getDay()],
      numero: data.getDate(),
      hoje: data.toDateString() === agora.toDateString(),
    }
  })
}

function aulasNaData(data) {
  return aulas
    .flatMap((aula) =>
      aula.horarios
        .filter((horario) => horario.dia === data.getDay())
        .map((horario) => ({
          aula,
          horario,
          inicio: dataComHora(data, horario.inicio),
          fim: dataComHora(data, horario.fim),
        }))
    )
    .sort((a, b) => a.inicio - b.inicio)
}

// aulas de uma data, em ordem de horário
export async function getAulasDoDia(data) {
  await delay()
  return aulasNaData(data)
}

// procura a próxima aula (ou a que está acontecendo agora) nos próximos 7 dias
export async function getProximaAula(agora = new Date()) {
  await delay()
  for (let i = 0; i < 7; i++) {
    const dia = new Date(agora)
    dia.setDate(agora.getDate() + i)

    const proxima = aulasNaData(dia).find(({ fim }) => fim > agora)
    if (proxima) return proxima
  }
  return null
}

// provas marcadas entre duas datas (inclusive)
export async function getProvas(de, ate) {
  await delay()
  const inicio = inicioDoDia(de)
  const fim = inicioDoDia(ate)

  return aulas
    .filter((aula) => aula.prova)
    .map((aula) => ({ aula, data: lerData(aula.prova) }))
    .filter(({ data }) => data >= inicio && data <= fim)
    .sort((a, b) => a.data - b.data)
}

// a prova só aparece como alerta se ainda não passou (igual ao prova_alert do app antigo)
export function provaPendente(aula, agora = new Date()) {
  return Boolean(aula.prova) && lerData(aula.prova) >= inicioDoDia(agora)
}

// mesma regra do app antigo: abaixo de 6 vermelho, abaixo de 8 amarelo, senão verde
export function corDoCR(nota) {
  if (nota < 6) return "danger"
  if (nota < 8) return "warning"
  return "success"
}

// a partir de 40% do limite já vale ficar de olho; a partir de 75% é perigo
export function corDasFaltas(faltas, limite) {
  const uso = faltas / limite
  if (uso >= 0.75) return "danger"
  if (uso >= 0.4) return "warning"
  return "neutral"
}

// "7,0", "5,5"; o 10 fica sem casa decimal
export function formatarNota(nota) {
  return nota === 10 ? "10" : nota.toFixed(1).replace(".", ",")
}
