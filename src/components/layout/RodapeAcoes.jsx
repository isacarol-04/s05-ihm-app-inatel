import { cn } from "@/lib/utils"

// botões principais da tela: no celular/tablet ficam fixos embaixo (fácil de alcançar
// com o polegar); no desktop ficam no fim do conteúdo, porque lá não tem barra embaixo
export function RodapeAcoes({ children, className }) {
  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-30 border-t bg-card px-5 pt-4 pb-[calc(1rem+env(safe-area-inset-bottom))]",
        "lg:static lg:mt-8 lg:border-0 lg:bg-transparent lg:p-0",
        className
      )}
    >
      <div className="mx-auto flex max-w-xl flex-col gap-2.5 lg:mx-0">{children}</div>
    </div>
  )
}
