import { usePaginaRolada } from "@/hooks/usePaginaRolada"
import { cn } from "@/lib/utils"

// Deixa o topo da tela (título, voltar, ações) preso em cima enquanto a página rola.
// As margens negativas fazem o fundo cobrir a largura toda do conteúdo, e a linha
// embaixo só aparece depois que algo começou a passar por baixo dele.
export function CabecalhoFixo({ children, className }) {
  const rolada = usePaginaRolada()

  return (
    <div
      className={cn(
        "sticky top-0 z-20 -mx-5 -mt-4 bg-background px-5 pt-[calc(1rem+env(safe-area-inset-top))] pb-1 transition-shadow duration-200",
        "md:-mx-8 md:-mt-6 md:px-8 md:pt-[calc(1.5rem+env(safe-area-inset-top))] lg:-mx-10 lg:-mt-8 lg:px-10 lg:pt-8",
        rolada && "shadow-[0_1px_0_var(--border)]",
        className
      )}
    >
      {children}
    </div>
  )
}
