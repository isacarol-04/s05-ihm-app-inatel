// Funções de data e texto usadas em várias telas

const MESES_CURTOS = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"]
const DIAS_CURTOS = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"]

// "2026-11-27" -> Date no fuso local (sem o problema do UTC)
export function lerData(iso) {
  const [ano, mes, dia] = iso.split("-").map(Number)
  return new Date(ano, mes - 1, dia)
}

// Date -> "2026-11-27" (no fuso local)
export function paraDataIso(data) {
  const mes = String(data.getMonth() + 1).padStart(2, "0")
  const dia = String(data.getDate()).padStart(2, "0")
  return `${data.getFullYear()}-${mes}-${dia}`
}

// "1 dia útil", "3 dias úteis"
export function formatarDiasUteis(dias) {
  return dias === 1 ? "1 dia útil" : `${dias} dias úteis`
}

// 15 -> "R$ 15,00"
export function formatarMoeda(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
}

export function capitalizar(texto) {
  return texto.charAt(0).toUpperCase() + texto.slice(1)
}

// "Terça, 11 de novembro"
export function formatarDataExtenso(data = new Date()) {
  const diaSemana = data.toLocaleDateString("pt-BR", { weekday: "long" }).replace("-feira", "")
  const diaMes = data.toLocaleDateString("pt-BR", { day: "numeric", month: "long" })
  return `${capitalizar(diaSemana)}, ${diaMes}`
}

// "18:00"
export function formatarHora(data) {
  return new Date(data).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
}

// "11/11"
export function formatarDiaMes(data) {
  return new Date(data).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })
}

// "10/11 às 09:12"
export function formatarDataHora(data) {
  return `${formatarDiaMes(data)} às ${formatarHora(data)}`
}

// quanto tempo faz: "agora", "há 5 min", "há 2 horas", "ontem", "há 3 dias"
export function formatarTempoRelativo(data, agora = new Date()) {
  const minutos = Math.round((agora - new Date(data)) / 60000)
  if (minutos < 1) return "agora"
  if (minutos < 60) return `há ${minutos} min`
  const horas = Math.floor(minutos / 60)
  if (horas < 24) return horas === 1 ? "há 1 hora" : `há ${horas} horas`
  const dias = Math.floor(horas / 24)
  return dias === 1 ? "ontem" : `há ${dias} dias`
}

// Date -> { dia: "12", mes: "MAI" }
export function separarDiaMes(data) {
  return { dia: String(data.getDate()).padStart(2, "0"), mes: MESES_CURTOS[data.getMonth()] }
}

function mesmoDia(a, b) {
  return a.toDateString() === b.toDateString()
}

// "hoje", "amanhã" ou "seg"
export function formatarDiaRelativo(data, agora = new Date()) {
  const amanha = new Date(agora)
  amanha.setDate(agora.getDate() + 1)
  if (mesmoDia(data, agora)) return "hoje"
  if (mesmoDia(data, amanha)) return "amanhã"
  return DIAS_CURTOS[data.getDay()]
}

// texto curto de quanto falta: "agora", "em 25 min", "em 2 h", "amanhã, 08:00"
export function formatarTempoAte(inicio, fim, agora = new Date()) {
  if (agora >= inicio && agora < fim) return "agora"

  const minutos = Math.round((inicio - agora) / 60000)
  if (minutos < 60) return `em ${minutos} min`

  if (mesmoDia(inicio, agora)) {
    const horas = Math.floor(minutos / 60)
    return `em ${horas} h`
  }
  return `${formatarDiaRelativo(inicio, agora)}, ${formatarHora(inicio)}`
}

export function iniciais(nome) {
  return nome
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0].toUpperCase())
    .join("")
}
