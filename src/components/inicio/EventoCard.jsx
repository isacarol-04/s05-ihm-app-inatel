import { CalendarDays, Clock, MapPin } from "lucide-react"
import { separarDiaMes } from "@/lib/format"
import { cn } from "@/lib/utils"

// cada tipo de evento tem uma cor na capa
const CAPAS = {
  tech: "from-primary to-primary/50",
  cultural: "from-warning to-warning/50",
  academic: "from-success to-success/50",
}

export function EventoCard({ evento }) {
  const { dia, mes } = separarDiaMes(evento.data)

  return (
    <article className="h-full overflow-hidden rounded-3xl bg-card shadow-card">
      <div className={cn("relative h-[150px] overflow-hidden bg-linear-to-r", CAPAS[evento.tipo] ?? CAPAS.tech)}>
        <div className="absolute top-4 left-4 flex size-12 flex-col items-center justify-center rounded-xl bg-card leading-none text-primary shadow-card">
          <span className="text-xl font-bold">{dia}</span>
          <span className="mt-0.5 text-[10px] font-semibold text-foreground">{mes}</span>
        </div>
        <CalendarDays
          aria-hidden
          strokeWidth={1.5}
          className="absolute right-3 -bottom-4 size-28 text-white/25"
        />
      </div>

      <div className="p-4">
        <h3 className="text-[17px] font-bold">{evento.titulo}</h3>
        <p className="mt-1 line-clamp-2 text-[13px] text-muted-foreground">{evento.descricao}</p>
        <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Clock className="size-3.5" /> {evento.hora}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="size-3.5" /> {evento.local}
          </span>
        </div>
      </div>
    </article>
  )
}
