import { Link } from "react-router-dom"
import { Clock, MapPin } from "lucide-react"
import { formatarNota, lerData, provaPendente } from "@/services/aulasService"
import { formatarDiaMes, formatarTempoAte } from "@/lib/format"
import { cn } from "@/lib/utils"

function Chip({ children, className }) {
  return (
    <span className={cn("inline-flex h-7 items-center rounded-full bg-white/15 px-3 text-xs font-medium", className)}>
      {children}
    </span>
  )
}

export function ProximaAulaCard({ proxima, agora }) {
  if (!proxima) return null
  const { aula, horario, inicio, fim } = proxima
  const quando = formatarTempoAte(inicio, fim, agora)

  return (
    <Link
      to="/aulas"
      aria-label={`Próxima aula: ${aula.codigo} ${aula.disciplina}, ${quando}`}
      className="block rounded-3xl bg-linear-135 from-primary to-primary-strong p-5 text-primary-foreground shadow-card transition-transform focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none active:scale-[0.99]"
    >
      <div className="flex items-center justify-between gap-3">
        <Chip>{quando === "agora" ? "Aula agora" : "Próxima aula"}</Chip>
        {quando !== "agora" && <span className="text-[13px] font-semibold">{quando}</span>}
      </div>

      <h2 className="mt-4 text-[19px] leading-snug font-bold">
        {aula.codigo} · {aula.disciplina}
      </h2>

      <div className="mt-2.5 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm">
        <span className="inline-flex items-center gap-1.5">
          <Clock className="size-4" /> {horario.inicio} – {horario.fim}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <MapPin className="size-4" /> {horario.local}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Chip>
          Faltas {aula.faltas}/{aula.limiteFaltas}
        </Chip>
        <Chip>CR {formatarNota(aula.nota)}</Chip>
        {provaPendente(aula, agora) && (
          <Chip className="bg-card text-primary">Prova {formatarDiaMes(lerData(aula.prova))}</Chip>
        )}
      </div>
    </Link>
  )
}
