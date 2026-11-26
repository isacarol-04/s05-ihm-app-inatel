import { useState } from "react"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

const ROTULOS = ["Muito ruim", "Ruim", "Ok", "Bom", "Excelente"]

// "Como foi o atendimento?" com 5 estrelas; dá para trocar a nota depois
export function AvaliacaoAtendimento({ nota, onAvaliar, className }) {
  // nota em destaque enquanto o mouse passa por cima (só no computador)
  const [previa, setPrevia] = useState(null)
  const mostrada = previa ?? nota ?? 0

  return (
    <section className={cn("rounded-3xl bg-card p-4 shadow-card", className)}>
      <div className="flex items-baseline justify-between gap-3">
        <h3 id="titulo-avaliacao" className="text-[15px] font-bold">
          Como foi o atendimento?
        </h3>
        <span className="text-xs text-subtle">{nota ? ROTULOS[nota - 1] : "Opcional"}</span>
      </div>

      <div
        role="radiogroup"
        aria-labelledby="titulo-avaliacao"
        className="mt-2 -ml-1.5 flex"
        onMouseLeave={() => setPrevia(null)}
      >
        {ROTULOS.map((rotulo, i) => {
          const valor = i + 1
          const acesa = valor <= mostrada
          return (
            <button
              key={valor}
              type="button"
              role="radio"
              aria-checked={nota === valor}
              aria-label={`${valor} de 5 – ${rotulo}`}
              onMouseEnter={() => setPrevia(valor)}
              onClick={() => onAvaliar(valor)}
              className="flex size-11 items-center justify-center rounded-full outline-none transition-transform focus-visible:ring-2 focus-visible:ring-ring active:scale-90"
            >
              <Star
                className={cn("size-7 transition-colors", acesa ? "fill-amber-400 text-amber-400" : "text-subtle")}
                strokeWidth={1.75}
              />
            </button>
          )
        })}
      </div>

      {nota && (
        <p aria-live="polite" className="mt-1 text-xs text-muted-foreground">
          Obrigado pela avaliação! Ela ajuda a secretaria a melhorar o atendimento.
        </p>
      )}
    </section>
  )
}
