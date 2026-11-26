import { cn } from "@/lib/utils"

// título grande das telas principais (Aulas, Serviços, Perfil) com ação opcional à direita
export function PageHeader({ titulo, descricao, acao, className }) {
  return (
    <header className={cn("flex items-start justify-between gap-4 py-2", className)}>
      <div>
        <h1 className="text-[30px] leading-tight font-bold tracking-tight">{titulo}</h1>
        {descricao && <p className="mt-0.5 text-sm text-muted-foreground">{descricao}</p>}
      </div>
      {acao}
    </header>
  )
}
