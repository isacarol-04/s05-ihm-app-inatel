import { Badge } from "@/components/ui/badge"
import { iniciais } from "@/lib/format"

// no celular fica centralizado (como no Figma); do tablet em diante fica na horizontal
export function PerfilCard({ usuario }) {
  return (
    <section className="flex flex-col items-center rounded-3xl bg-card px-5 py-6 text-center shadow-card md:flex-row md:gap-5 md:p-6 md:text-left">
      <span
        aria-hidden
        className="flex size-20 shrink-0 items-center justify-center rounded-full bg-linear-135 from-primary to-primary/55 text-2xl font-bold text-primary-foreground"
      >
        {iniciais(usuario.nome)}
      </span>
      <div className="flex flex-col items-center md:items-start">
        <h2 className="mt-3 text-[22px] font-bold md:mt-0">{usuario.nome}</h2>
        <p className="mt-0.5 text-[13px] text-muted-foreground">
          {usuario.curso} · {usuario.periodo}º período
        </p>
        <Badge variant="neutral" size="lg" className="mt-3 font-semibold text-foreground/80 md:mt-2">
          Matrícula {usuario.matricula}
        </Badge>
      </div>
    </section>
  )
}
