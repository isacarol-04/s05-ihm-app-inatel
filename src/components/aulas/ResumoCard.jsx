import { IconCircle } from "@/components/shared/IconCircle"

// cardzinho de resumo: "3 aulas hoje", "2 provas nesta semana"
export function ResumoCard({ icone: Icone, tom, valor, legenda }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-card p-3.5 shadow-card">
      <IconCircle tom={tom} tamanho="sm">
        <Icone />
      </IconCircle>
      <div className="min-w-0 leading-tight">
        <p className="truncate text-[15px] font-bold">{valor}</p>
        <p className="truncate text-xs text-muted-foreground">{legenda}</p>
      </div>
    </div>
  )
}
