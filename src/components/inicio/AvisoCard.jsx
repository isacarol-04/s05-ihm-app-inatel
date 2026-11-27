import { Link } from "react-router-dom"
import { Columns2, FileText, MessageCircleWarning, Wallet } from "lucide-react"
import { IconCircle } from "@/components/shared/IconCircle"
import { formatarDataHora } from "@/lib/format"
import { cn } from "@/lib/utils"

const ICONES = {
  documento: FileText,
  armario: Columns2,
  financeiro: Wallet,
  mensagem: MessageCircleWarning,
}

export function AvisoCard({ aviso, className, onClick, data, naoLida = false }) {
  const Icone = ICONES[aviso.icone] ?? FileText

  return (
    <Link
      to={aviso.para}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 rounded-2xl bg-card p-4 shadow-card transition-all hover:bg-muted/60 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
        className
      )}
    >
      <IconCircle tom={aviso.tom}>
        <Icone />
      </IconCircle>
      <span className="min-w-0 flex-1">
        <span className={cn("text-[15px] font-semibold", data ? "block leading-snug" : "line-clamp-1 md:line-clamp-2")}>{aviso.titulo}</span>
        <span className={cn("mt-0.5 text-xs text-muted-foreground", data ? "block leading-relaxed" : "line-clamp-1")}>{aviso.descricao}</span>
        {data && <time dateTime={data} className="mt-1.5 block text-[11px] text-muted-foreground">{formatarDataHora(data)}</time>}
      </span>
      {naoLida && (
        <span className="size-2 shrink-0 rounded-full bg-primary">
          <span className="sr-only">Não lida</span>
        </span>
      )}
    </Link>
  )
}
