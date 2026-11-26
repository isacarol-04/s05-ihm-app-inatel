import { SectionHeader } from "@/components/shared/SectionHeader"
import { capitalizar, formatarDiaMes, formatarDiaRelativo } from "@/lib/format"

// lista das provas da semana (aparece na coluna da direita em telas largas)
export function ProvasSemana({ provas, agora, className }) {
  return (
    <section aria-labelledby="provas-titulo" className={className}>
      <SectionHeader id="provas-titulo" titulo="Provas e entregas" />
      {provas.length === 0 ? (
        <p className="rounded-2xl bg-card p-4 text-sm text-muted-foreground shadow-card">
          Nada marcado nesta semana.
        </p>
      ) : (
        <ul className="divide-y rounded-2xl bg-card shadow-card">
          {provas.map(({ aula, data, descricao }) => (
            <li key={`${aula.id}-${data.getTime()}`} className="flex items-center justify-between gap-3 p-4">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">
                  {aula.codigo} · {aula.disciplina}
                </p>
                <p className="text-xs text-muted-foreground">
                  {descricao} · {formatarDiaMes(data)}
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-destructive-soft px-2.5 py-1 text-xs font-semibold text-destructive">
                {capitalizar(formatarDiaRelativo(data, agora))}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
