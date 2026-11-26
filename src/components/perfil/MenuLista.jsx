import { ChevronRight } from "lucide-react"
import { IconCircle } from "@/components/shared/IconCircle"
import { cn } from "@/lib/utils"

// card com itens de menu separados por linha (Dados pessoais, Notificações...)
export function MenuLista({ children, className }) {
  return (
    <ul className={cn("divide-y rounded-3xl bg-card px-2 shadow-card [&>li]:border-border/70", className)}>
      {children}
    </ul>
  )
}

export function MenuItem({ icone: Icone, label, valor, tom = "primary", onClick, semSeta = false }) {
  const perigo = tom === "danger"

  return (
    <li className="py-1">
      <button
        type="button"
        onClick={onClick}
        className={cn(
          "group flex min-h-14 w-full items-center gap-3.5 rounded-2xl px-2 py-2 text-left transition-colors outline-none",
          "hover:bg-muted/70 focus-visible:ring-2 focus-visible:ring-ring active:bg-muted",
          perigo && "hover:bg-destructive-soft/60 active:bg-destructive-soft"
        )}
      >
        <IconCircle tom={tom} tamanho="sm" className="size-10">
          <Icone />
        </IconCircle>
        <span className={cn("flex-1 text-base font-semibold", perigo && "font-medium text-destructive")}>
          {label}
        </span>
        {valor && <span className="text-[13px] text-muted-foreground">{valor}</span>}
        {!semSeta && (
          <ChevronRight className="size-5 text-subtle transition-transform group-hover:translate-x-0.5 group-hover:text-muted-foreground" />
        )}
      </button>
    </li>
  )
}
