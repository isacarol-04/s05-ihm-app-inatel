import { cn } from "@/lib/utils"

// título de seção com uma ação opcional à direita ("Ver todos")
export function SectionHeader({ titulo, acao, className, id }) {
  return (
    <div className={cn("mb-3 flex items-center justify-between gap-3", className)}>
      <h2 id={id} className="text-[17px] font-bold tracking-tight">
        {titulo}
      </h2>
      {acao}
    </div>
  )
}
