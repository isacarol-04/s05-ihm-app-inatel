import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

// faixa de informação com ícone (status do armário, resumo dos pedidos, avisos)
const infoBoxVariants = cva("flex items-start gap-2.5 rounded-xl px-3.5 py-3 text-[13px] font-medium [&>svg]:mt-px [&>svg]:size-4 [&>svg]:shrink-0", {
  variants: {
    tom: {
      info: "bg-accent text-foreground [&>svg]:text-primary",
      success: "bg-success-soft text-foreground [&>svg]:text-success",
      warning: "bg-warning-soft text-foreground [&>svg]:text-warning",
      danger: "bg-destructive-soft text-foreground [&>svg]:text-destructive",
    },
  },
  defaultVariants: { tom: "info" },
})

export function InfoBox({ icone: Icone, tom, className, children, ...props }) {
  return (
    <div className={cn(infoBoxVariants({ tom }), className)} {...props}>
      {Icone && <Icone aria-hidden />}
      <p>{children}</p>
    </div>
  )
}
