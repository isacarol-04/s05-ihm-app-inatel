import { cn } from "@/lib/utils"

// os 5 dias úteis da semana; o selecionado fica azul
export function SeletorDias({ dias, selecionado, onSelecionar }) {
  return (
    <div role="tablist" aria-label="Dia da semana" className="grid grid-cols-5 gap-2 md:gap-3">
      {dias.map((dia) => {
        const ativo = dia.data.toDateString() === selecionado.toDateString()
        return (
          <button
            key={dia.numero}
            type="button"
            role="tab"
            aria-selected={ativo}
            aria-label={`${dia.rotulo} ${dia.numero}${dia.hoje ? ", hoje" : ""}`}
            onClick={() => onSelecionar(dia.data)}
            className={cn(
              "relative flex h-14 flex-col items-center justify-center rounded-2xl border bg-card leading-tight transition-colors outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring md:h-16",
              ativo && "border-primary bg-primary text-primary-foreground hover:bg-primary"
            )}
          >
            <span className={cn("text-[13px]", ativo ? "text-primary-foreground/85" : "text-muted-foreground")}>
              {dia.rotulo}
            </span>
            <span className="text-lg font-bold">{dia.numero}</span>
            {/* pontinho marcando o dia de hoje quando ele não está selecionado */}
            {dia.hoje && !ativo && <span className="absolute bottom-1.5 size-1 rounded-full bg-primary" />}
          </button>
        )
      })}
    </div>
  )
}
