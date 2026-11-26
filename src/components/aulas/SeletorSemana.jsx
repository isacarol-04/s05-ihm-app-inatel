import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

function formatarPeriodo(semana) {
  const inicio = semana[0].data
  const fim = semana[semana.length - 1].data
  const mes = (data) => data.toLocaleDateString("pt-BR", { month: "long" })
  if (inicio.getMonth() === fim.getMonth()) {
    return `${inicio.getDate()} a ${fim.getDate()} de ${mes(fim)}`
  }
  return `${inicio.getDate()} de ${mes(inicio)} a ${fim.getDate()} de ${mes(fim)}`
}

// troca a semana mostrada na grade (‹ 23 a 27 de novembro ›)
export function SeletorSemana({ semana, atual, podeVoltar, podeAvancar, onVoltar, onAvancar }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <Button variant="ghost" size="icon-lg" className="rounded-full" aria-label="Semana anterior" disabled={!podeVoltar} onClick={onVoltar}>
        <ChevronLeft />
      </Button>
      <p className="text-center text-sm font-semibold" aria-live="polite">
        {formatarPeriodo(semana)}
        {atual && <span className="ml-1.5 font-normal text-muted-foreground">· esta semana</span>}
      </p>
      <Button variant="ghost" size="icon-lg" className="rounded-full" aria-label="Próxima semana" disabled={!podeAvancar} onClick={onAvancar}>
        <ChevronRight />
      </Button>
    </div>
  )
}
