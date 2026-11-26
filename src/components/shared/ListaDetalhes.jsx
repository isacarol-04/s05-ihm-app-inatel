import { cn } from "@/lib/utils"

// lista "rótulo ........ valor" dentro de um card (dados do aluno, resumo do pedido)
export function ListaDetalhes({ itens, className }) {
  return (
    <dl className={cn("space-y-2 rounded-2xl bg-card px-4 py-3.5 text-sm shadow-card", className)}>
      {itens.map(({ rotulo, valor }) => (
        <div key={rotulo} className="flex items-baseline justify-between gap-4">
          <dt className="shrink-0 text-muted-foreground">{rotulo}</dt>
          <dd className="min-w-0 text-right font-semibold">{valor}</dd>
        </div>
      ))}
    </dl>
  )
}
