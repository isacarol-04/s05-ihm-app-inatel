import { TriangleAlert } from "lucide-react"
import { cn } from "@/lib/utils"

// faixa laranja no topo do pedido pendente: deixa claro que a próxima ação é da pessoa
export function AvisoPendencia({ className }) {
  return (
    <div role="status" className={cn("flex items-center gap-3 rounded-2xl bg-warning-soft p-4", className)}>
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-card text-warning">
        <TriangleAlert className="size-5" />
      </span>
      <p className="text-sm leading-snug font-semibold">A secretaria precisa de uma informação para continuar.</p>
    </div>
  )
}
