import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

// ícone dentro de um círculo colorido (avisos, serviços, status)
const iconCircleVariants = cva("flex shrink-0 items-center justify-center rounded-full", {
  variants: {
    tom: {
      primary: "bg-accent text-accent-foreground",
      success: "bg-success-soft text-success",
      warning: "bg-warning-soft text-warning",
      danger: "bg-destructive-soft text-destructive",
    },
    tamanho: {
      sm: "size-9 [&_svg]:size-4",
      md: "size-11 [&_svg]:size-5",
      lg: "size-14 [&_svg]:size-6",
    },
  },
  defaultVariants: { tom: "primary", tamanho: "md" },
})

export function IconCircle({ tom, tamanho, className, children }) {
  return <span className={cn(iconCircleVariants({ tom, tamanho }), className)}>{children}</span>
}
