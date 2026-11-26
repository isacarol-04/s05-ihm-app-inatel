import { Link } from "react-router-dom"
import { Columns2, FileText, MessageCircleWarning, Wallet } from "lucide-react"
import { IconCircle } from "@/components/shared/IconCircle"
import { cn } from "@/lib/utils"

const ICONES = {
  documento: FileText,
  armario: Columns2,
  financeiro: Wallet,
  mensagem: MessageCircleWarning,
}

export function AvisoCard({ aviso, className }) {
  const Icone = ICONES[aviso.icone] ?? FileText

  return (
    <Link
      to={aviso.para}
      className={cn(
        "flex items-center gap-3 rounded-2xl bg-card p-4 shadow-card transition-colors hover:bg-muted/60 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
        className
      )}
    >
      <IconCircle tom={aviso.tom}>
        <Icone />
      </IconCircle>
      <span className="min-w-0">
        <span className="line-clamp-1 text-[15px] font-semibold md:line-clamp-2">{aviso.titulo}</span>
        <span className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{aviso.descricao}</span>
      </span>
    </Link>
  )
}
