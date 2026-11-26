import { RadioGroupItem } from "@/components/ui/radio-group"
import { cn } from "@/lib/utils"

// card de forma de entrega: radio visível à esquerda, o card inteiro é clicável
export function OpcaoEntrega({ valor, titulo, descricao, selecionado, desabilitado }) {
  return (
    <label
      className={cn(
        "flex items-center gap-3 rounded-2xl border-2 border-transparent bg-card px-3.5 py-3 shadow-card transition-all",
        "hover:border-border has-focus-visible:ring-2 has-focus-visible:ring-ring active:scale-[0.98]",
        selecionado && "border-primary hover:border-primary",
        desabilitado && "cursor-not-allowed opacity-55 hover:border-transparent active:scale-100"
      )}
    >
      <RadioGroupItem value={valor} disabled={desabilitado} className="size-5 border-2 border-subtle" />
      <span className="min-w-0">
        <span className="block text-[15px] font-bold">{titulo}</span>
        <span className="block text-xs text-muted-foreground">{descricao}</span>
      </span>
    </label>
  )
}
