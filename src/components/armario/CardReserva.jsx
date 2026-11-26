import { Badge } from "@/components/ui/badge"
import { formatarDiaMes, formatarHora } from "@/lib/format"
import { cn } from "@/lib/utils"
import { FORMATOS } from "@/services/armarioService"

function dataHora(iso) {
  return `${formatarDiaMes(iso)} às ${formatarHora(iso)}`
}

// "cartão" com o número do armário e as datas da reserva
export function CardReserva({ reserva, atrasada = false }) {
  return (
    <section className="rounded-3xl bg-card p-5 text-center shadow-card">
      <p className="text-xs font-bold tracking-widest text-muted-foreground">ARMÁRIO</p>
      <p className="mt-1 text-6xl font-extrabold tracking-tight text-primary">Nº {reserva.armarioId}</p>
      <Badge variant="info" size="lg" className="mt-3">
        {FORMATOS[reserva.formato]} · Bloco {reserva.bloco}
      </Badge>

      <dl className="mt-4 space-y-2 border-t pt-4 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Reservado em</dt>
          <dd className="font-bold">{dataHora(reserva.reservadoEm)}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Devolver até</dt>
          <dd className={cn("font-bold", atrasada ? "text-destructive" : "text-warning")}>
            {dataHora(reserva.devolverAte)}
          </dd>
        </div>
      </dl>
    </section>
  )
}
