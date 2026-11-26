import dados from "@/data/aulas.json"
import { delay } from "./storage"

const { calendario, disciplinas: aulas } = dados
const DIAS_SEMANA = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]

// "2026-11-27" -> Date no fuso local (sem o problema do UTC)
export function lerData(iso) {
  const [ano, mes, dia] = iso.split("-").map(Number)
  return new Date(ano, mes - 1, dia)
}

function inicioDoDia(data) {
  const copia = new Date(data)
  copia.setHours(0, 0, 0, 0)
  return copia
}

// junta a data do dia com o horário "10:00"
function dataComHora(dia, hora) {
  const [h, m] = hora.split(":").map(Number)
  const data = new Date(dia)
  data.setHours(h, m, 0, 0)
  return data
}

const INICIO_CALENDARIO = lerData(calendario.inicio)
const FIM_CALENDARIO = lerData(calendario.fim)

function dentroDoCalendario(data) {
  const dia = inicioDoDia(data)
  return dia >= INICIO_CALENDARIO && dia <= FIM_CALENDARIO
}

// segunda-feira da semana de uma data (sábado e domingo já contam como a próxima)
function segundaDaSemana(data) {
  const segunda = inicioDoDia(data)
  const diaSemana = segunda.getDay()
  const ate = diaSemana === 0 ? 1 : diaSemana === 6 ? 2 : 1 - diaSemana
  segunda.setDate(segunda.getDate() + ate)
  return segunda
}

function montarSemana(segunda, agora) {
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

// todas as semanas do calendário (de segunda a sexta)
export function getSemanas(agora = new Date()) {
  const semanas = []
  const segunda = segundaDaSemana(INICIO_CALENDARIO)
  while (segunda <= FIM_CALENDARIO) {
    semanas.push(montarSemana(segunda, agora))
    segunda.setDate(segunda.getDate() + 7)
  }
  return semanas
}

// posição da semana de hoje dentro do calendário (ou a mais próxima)
export function indiceDaSemanaAtual(semanas, agora = new Date()) {
  const segunda = segundaDaSemana(agora)
  const indice = semanas.findIndex((semana) => semana[0].data.getTime() === segunda.getTime())
  if (indice !== -1) return indice
  return segunda < semanas[0][0].data ? 0 : semanas.length - 1
}

function aulasNaData(data) {
  if (!dentroDoCalendario(data)) return []

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

export async function getAulas() {
  await delay()
  return aulas
}

// aulas de uma data, em ordem de horário
export async function getAulasDoDia(data) {
  await delay()
  return aulasNaData(data)
}

// procura a próxima aula (ou a que está acontecendo agora) nas próximas 2 semanas
export async function getProximaAula(agora = new Date()) {
  await delay()
  for (let i = 0; i < 14; i++) {
    const dia = new Date(agora)
    dia.setDate(agora.getDate() + i)

    const proxima = aulasNaData(dia).find(({ fim }) => fim > agora)
    if (proxima) return proxima
  }
  return null
}

// provas marcadas entre duas datas (inclusive), de todas as disciplinas
export async function getProvas(de, ate) {
  await delay()
  const inicio = inicioDoDia(de)
  const fim = inicioDoDia(ate)

  return aulas
    .flatMap((aula) => aula.provas.map((prova) => ({ aula, ...prova, data: lerData(prova.data) })))
    .filter(({ data }) => data >= inicio && data <= fim)
    .sort((a, b) => a.data - b.data)
}

// próxima prova da disciplina que ainda não passou (igual ao prova_alert do app antigo)
export function proximaProva(aula, agora = new Date()) {
  const hoje = inicioDoDia(agora)
  return (
    aula.provas
      .map((prova) => ({ ...prova, data: lerData(prova.data) }))
      .filter(({ data }) => data >= hoje)
      .sort((a, b) => a.data - b.data)[0] ?? null
  )
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
