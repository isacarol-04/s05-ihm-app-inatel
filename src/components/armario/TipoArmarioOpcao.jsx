import { Check } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { RadioGroupItem } from "@/components/ui/radio-group"
import { cn } from "@/lib/utils"
import { IconeArmario } from "./IconeArmario"

// card de escolha do tipo de armário (o card inteiro é o label do radio)
export function TipoArmarioOpcao({ valor, nome, disponiveis, selecionado }) {
  const esgotado = disponiveis === 0

  return (
    <label
      className={cn(
        "relative flex flex-col items-center gap-3 rounded-3xl border-2 border-transparent bg-card p-4 shadow-card transition-all",
        "hover:border-border has-focus-visible:ring-2 has-focus-visible:ring-ring active:scale-[0.98]",
        selecionado && "border-primary hover:border-primary",
        esgotado && "cursor-not-allowed opacity-60 active:scale-100"
      )}
    >
      {/* radio fica escondido; o visual é o próprio card */}
      <RadioGroupItem value={valor} disabled={esgotado} className="sr-only" />

      {selecionado && (
        <span className="absolute top-3 right-3 flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Check className="size-3.5" strokeWidth={3} />
        </span>
      )}

      <span
        className={cn(
          "flex size-24 items-center justify-center rounded-2xl transition-colors",
          selecionado ? "bg-accent text-primary" : "bg-muted text-subtle"
        )}
      >
        <IconeArmario duplo={valor === "duplo"} className="size-14" />
      </span>

      <span className="text-lg font-bold">{nome}</span>
      <Badge variant={esgotado ? "danger" : selecionado ? "info" : "neutral"} size="lg">
        {esgotado ? "Esgotado" : `${disponiveis} ${disponiveis === 1 ? "disponível" : "disponíveis"}`}
      </Badge>
    </label>
  )
}
