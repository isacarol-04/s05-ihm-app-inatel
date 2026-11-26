import { cn } from "@/lib/utils"

// "Etapa 1 de 2" + título + barrinhas de progresso
export function Etapas({ atual, total, titulo }) {
  return (
    <div className="mt-3">
      <p className="text-xs font-bold text-primary">
        Etapa {atual} de {total}
      </p>
      <h2 className="mt-1 text-[22px] leading-tight font-bold tracking-tight">{titulo}</h2>
      <div
        className="mt-3 flex gap-1.5"
        role="progressbar"
        aria-label="Progresso do pedido"
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuenow={atual}
      >
        {Array.from({ length: total }, (_, i) => (
          <span
            key={i}
            className={cn("h-1 flex-1 rounded-full transition-colors duration-500", i < atual ? "bg-primary" : "bg-border")}
          />
        ))}
      </div>
    </div>
  )
}
