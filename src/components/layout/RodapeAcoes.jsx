import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

// Botões principais da tela.
// Celular/tablet: fixos embaixo (fácil de alcançar com o polegar), um embaixo do outro.
// Computador: no fim do conteúdo, lado a lado, com o principal (o primeiro) à direita.
// "legenda" é um texto curto embaixo dos botões ("Você acompanha tudo em Meus pedidos.").
export function RodapeAcoes({ children, legenda, className }) {
  const ref = useRef(null)

  // avisa a página da altura real do rodapé (1 botão, 2 botões, botão + legenda...),
  // assim ela reserva só o espaço necessário embaixo e não sobra rolagem à toa
  useEffect(() => {
    const raiz = document.documentElement
    const observador = new ResizeObserver(([entrada]) => {
      raiz.style.setProperty("--altura-rodape", `${entrada.borderBoxSize[0].blockSize}px`)
    })
    observador.observe(ref.current)
    return () => {
      observador.disconnect()
      raiz.style.removeProperty("--altura-rodape")
    }
  }, [])

  return (
    <div
      ref={ref}
      className={cn(
        "fixed inset-x-0 bottom-0 z-30 border-t bg-card px-5 pt-4 pb-[calc(1rem+env(safe-area-inset-bottom))]",
        "lg:static lg:mt-8 lg:border-0 lg:bg-transparent lg:p-0",
        className
      )}
    >
      <div className="mx-auto max-w-xl lg:max-w-none">
        <div className="flex flex-col gap-2.5 lg:flex-row-reverse lg:*:flex-1">{children}</div>
        {legenda && <p className="mt-2.5 text-center text-xs text-muted-foreground">{legenda}</p>}
      </div>
    </div>
  )
}
