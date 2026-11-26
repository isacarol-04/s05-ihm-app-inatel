import { FileText } from "lucide-react"
import { cn } from "@/lib/utils"

// quadradinho azul com o ícone de documento (cards de pedido e de tipo de documento)
export function IconeDocumento({ apagado = false, className }) {
  return (
    <span
      className={cn(
        "flex size-12 shrink-0 items-center justify-center rounded-2xl transition-colors",
        apagado ? "bg-muted text-subtle" : "bg-accent text-primary",
        className
      )}
    >
      <FileText className="size-5" />
    </span>
  )
}
