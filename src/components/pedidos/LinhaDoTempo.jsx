import { Check, X } from "lucide-react"
import { cn } from "@/lib/utils"

const COR_ATUAL = {
  primary: "bg-primary ring-accent",
  warning: "bg-warning ring-warning-soft",
  success: "bg-success ring-success-soft",
  danger: "bg-destructive ring-destructive-soft",
}

// bolinha de cada etapa: feita (azul com check), atual (cheia com halo) ou futura (só o contorno)
function Marcador({ estado, tom }) {
  if (estado === "futuro") {
    return <span className="relative z-10 size-5 shrink-0 rounded-full border-2 border-border bg-card" />
  }

  // pendente: anel laranja vazado (esperando a pessoa)
  if (estado === "atual" && tom === "warning") {
    return <span className="relative z-10 size-5 shrink-0 rounded-full border-[5px] border-warning bg-card ring-4 ring-warning-soft" />
  }

  const Icone = tom === "danger" ? X : Check
  const mostrarIcone = estado === "feito" || tom === "success" || tom === "danger"

  return (
    <span
      className={cn(
        "relative z-10 flex size-5 shrink-0 items-center justify-center rounded-full text-white",
        estado === "feito" ? "bg-primary" : cn("ring-4", COR_ATUAL[tom])
      )}
    >
      {mostrarIcone && <Icone className="size-3" strokeWidth={3} />}
    </span>
  )
}

// linha do tempo vertical do pedido (Recebido → Em análise → Pronto)
export function LinhaDoTempo({ etapas, className }) {
  return (
    <ol className={cn("rounded-3xl bg-card p-5 shadow-card", className)}>
      {etapas.map((etapa, i) => {
        const proxima = etapas[i + 1]
        const futuro = etapa.estado === "futuro"

        return (
          <li
            key={`${etapa.status}-${i}`}
            className="relative flex gap-3.5 pb-5 last:pb-0"
            aria-current={etapa.estado === "atual" ? "step" : undefined}
          >
            {/* traço até a próxima etapa: azul se ela já aconteceu */}
            {proxima && (
              <span
                aria-hidden
                className={cn(
                  "absolute top-6 bottom-1 left-[9px] w-0.5 rounded-full",
                  proxima.estado === "futuro" ? "bg-border" : "bg-primary"
                )}
              />
            )}
            <Marcador estado={etapa.estado} tom={etapa.tom} />
            <div className="-mt-0.5 min-w-0">
              <p
                className={cn(
                  "text-[15px] font-bold",
                  futuro && "font-semibold text-subtle",
                  etapa.estado === "atual" && etapa.tom === "warning" && "text-warning"
                )}
              >
                {etapa.titulo}
              </p>
              <p className="text-xs text-muted-foreground">{etapa.descricao}</p>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
