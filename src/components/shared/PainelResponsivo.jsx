import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet"
import { useArrastarParaFechar } from "@/hooks/useArrastarParaFechar"
import { useMediaQuery } from "@/hooks/useMediaQuery"
import { cn } from "@/lib/utils"

// Mesmo conteúdo, "recipiente" diferente: no celular e no tablet abre de baixo
// (sheet), no desktop abre no meio da tela (dialog).
export function PainelResponsivo({ aberto, onAbertoChange, titulo, descricao, className, children }) {
  const desktop = useMediaQuery("(min-width: 1024px)")
  const arrastar = useArrastarParaFechar(() => onAbertoChange(false))

  const cabecalho = (
    <div className="pr-12">
      {desktop ? (
        <>
          <DialogTitle className="text-[22px] font-bold tracking-tight md:text-2xl">{titulo}</DialogTitle>
          {descricao && <DialogDescription className="mt-0.5 text-sm">{descricao}</DialogDescription>}
        </>
      ) : (
        <>
          <SheetTitle className="text-[22px] font-bold tracking-tight tela-baixa:text-xl md:text-2xl">{titulo}</SheetTitle>
          {descricao && <SheetDescription className="mt-0.5 text-[13px] md:text-sm">{descricao}</SheetDescription>}
        </>
      )}
    </div>
  )

  if (desktop) {
    return (
      <Dialog open={aberto} onOpenChange={onAbertoChange}>
        <DialogContent className={cn("gap-5 rounded-3xl p-6 sm:max-w-lg", className)}>
          {cabecalho}
          {children}
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Sheet
      open={aberto}
      onOpenChange={onAbertoChange}
      // quando termina de fechar, zera o arraste para abrir certinho da próxima vez
      onOpenChangeComplete={(abriu) => !abriu && arrastar.resetar()}
    >
      <SheetContent
        side="bottom"
        style={arrastar.estilo}
        className={cn(
          "mx-auto max-w-xl gap-5 px-5 pt-0 pb-[calc(1.5rem+env(safe-area-inset-bottom))] tela-baixa:gap-3.5 tela-baixa:pb-[calc(1rem+env(safe-area-inset-bottom))] md:max-w-2xl md:gap-6 md:px-8 md:pb-[calc(2rem+env(safe-area-inset-bottom))]",
          className
        )}
      >
        {/* alcinha + título: dá para arrastar para baixo e fechar */}
        <div {...arrastar.alcaProps} className="-mx-5 cursor-grab px-5 pt-3 active:cursor-grabbing md:-mx-8 md:px-8 md:pt-4">
          <span aria-hidden className="mx-auto mb-4 block h-1 w-10 rounded-full bg-border tela-baixa:mb-3" />
          {cabecalho}
        </div>
        {children}
      </SheetContent>
    </Sheet>
  )
}
