import { cn } from "@/lib/utils"

// rótulo pequeno em caixa alta acima de um campo ou grupo ("FINALIDADE")
export function RotuloSecao({ children, className, ...props }) {
  return (
    <p className={cn("mt-5 mb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase", className)} {...props}>
      {children}
    </p>
  )
}
