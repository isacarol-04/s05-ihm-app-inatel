import { Check } from "lucide-react"
import { RadioGroupItem } from "@/components/ui/radio-group"
import { cn } from "@/lib/utils"
import { TemaPreview } from "./TemaPreview"

// card de um tema: o card inteiro é o label, então tocar em qualquer parte seleciona
export function TemaOpcao({ tema, selecionado }) {
  return (
    <label
      className={cn(
        "flex cursor-pointer flex-col gap-2.5 rounded-2xl border bg-card p-2.5 tela-baixa:gap-2 tela-baixa:p-2 md:gap-3 md:p-3 transition-all hover:bg-muted/50 active:scale-[0.98] has-focus-visible:ring-2 has-focus-visible:ring-ring",
        selecionado && "border-primary ring-1 ring-primary hover:bg-card"
      )}
    >
      <TemaPreview preview={tema.preview} />

      <span className="flex items-center justify-between gap-2 px-1 pb-1 tela-baixa:pb-0.5">
        <span className="min-w-0">
          <span className="block text-[15px] font-semibold md:text-base">{tema.nome}</span>
          <span className="block text-xs leading-snug text-muted-foreground md:text-[13px]">{tema.descricao}</span>
        </span>
        <RadioGroupItem
          value={tema.id}
          className="size-6 border-2 focus-visible:ring-0 tela-baixa:size-5"
          indicator={<Check className="size-3.5 text-primary-foreground" strokeWidth={3} />}
        />
      </span>
    </label>
  )
}
