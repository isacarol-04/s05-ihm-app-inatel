import { formatarDiasUteis, formatarMoeda } from "@/lib/format"

// textos curtos que descrevem um tipo de documento (usados nos cards e no resumo)
export function rotuloFormatos(formatos) {
  if (formatos.length > 1) return "PDF ou impresso"
  return formatos[0] === "pdf" ? "PDF" : "Impresso"
}

export function rotuloTaxa(taxa) {
  return taxa > 0 ? "Com taxa" : "Gratuita"
}

// "1 dia útil · Gratuita" / "3 dias úteis · R$ 15,00"
export function resumoDocumento(tipo) {
  return `${formatarDiasUteis(tipo.prazoDias)} · ${tipo.taxa > 0 ? formatarMoeda(tipo.taxa) : "Gratuita"}`
}
