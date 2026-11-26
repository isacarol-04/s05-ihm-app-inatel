import { CalendarDays, MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { formatarDiaMes } from "@/lib/format"
import { cn } from "@/lib/utils"
import { corDasFaltas, corDoCR, formatarNota, proximaProva } from "@/services/aulasService"

// uma linha da grade do dia: horário à esquerda e o card da aula à direita
export function AulaTimelineItem({ item, proxima, agora }) {
  const { aula, horario } = item
  // conta a partir do dia da aula mostrada (numa semana futura não aparece prova que já terá passado)
  const prova = proximaProva(aula, item.inicio > agora ? item.inicio : agora)

  return (
    <li className="grid grid-cols-[52px_1fr] gap-3 md:grid-cols-[64px_1fr] md:gap-4">
      <div className="pt-4 leading-tight">
        <p className="text-[15px] font-bold">{horario.inicio}</p>
        <p className="text-xs text-subtle">{horario.fim}</p>
      </div>

      <article
        className={cn(
          "rounded-2xl border border-transparent bg-card p-4 shadow-card",
          proxima && "border-2 border-primary"
        )}
      >
        {proxima && (
          <Badge variant="info" size="lg" className="mb-2">
            Próxima
          </Badge>
        )}

        <h3 className="text-base leading-snug font-bold">
          {aula.codigo} · {aula.disciplina}
        </h3>
        <p className="mt-1.5 flex items-center gap-1.5 text-[13px] text-muted-foreground">
          <MapPin className="size-3.5" /> {horario.local}
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
          <Badge variant={corDasFaltas(aula.faltas, aula.limiteFaltas)} size="lg">
            Faltas {aula.faltas}/{aula.limiteFaltas}
          </Badge>
          <Badge variant={corDoCR(aula.nota)} size="lg">
            CR {formatarNota(aula.nota)}
          </Badge>
          {prova && (
            <Badge variant="danger" size="lg">
              <CalendarDays /> {prova.descricao} {formatarDiaMes(prova.data)}
            </Badge>
          )}
        </div>
      </article>
    </li>
  )
}
