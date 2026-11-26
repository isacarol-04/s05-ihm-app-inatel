import { Button } from "@/components/ui/button"
import { RadioGroup } from "@/components/ui/radio-group"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet"
import { useMediaQuery } from "@/hooks/useMediaQuery"
import { useTheme } from "@/hooks/useTheme"
import { TEMAS } from "@/lib/theme"
import { TemaOpcao } from "./TemaOpcao"

// O conteúdo é o mesmo; muda só o "recipiente":
// no celular e no tablet abre de baixo (sheet), no desktop abre no meio (dialog).
export function SeletorTema({ aberto, onAbertoChange }) {
  const desktop = useMediaQuery("(min-width: 1024px)")
  const { tema, setTema } = useTheme()

  const Recipiente = desktop ? Dialog : Sheet
  const Conteudo = desktop ? DialogContent : SheetContent
  const Titulo = desktop ? DialogTitle : SheetTitle
  const Descricao = desktop ? DialogDescription : SheetDescription
  const propsConteudo = desktop
    ? { className: "gap-5 rounded-3xl p-6 sm:max-w-lg" }
    : { side: "bottom", className: "mx-auto max-w-xl gap-5 px-5 pt-3 tela-baixa:gap-3.5 tela-baixa:pb-[calc(1rem+env(safe-area-inset-bottom))] pb-[calc(1.5rem+env(safe-area-inset-bottom))] md:max-w-2xl md:gap-6 md:px-8 md:pt-4 md:pb-[calc(2rem+env(safe-area-inset-bottom))]" }

  return (
    <Recipiente open={aberto} onOpenChange={onAbertoChange}>
      <Conteudo {...propsConteudo}>
        {/* alcinha de arrastar, só no sheet */}
        {!desktop && <span aria-hidden className="mx-auto h-1 w-10 shrink-0 rounded-full bg-border" />}

        <div className="pr-12">
          <Titulo className="text-[22px] font-bold tracking-tight tela-baixa:text-xl md:text-2xl">Aparência</Titulo>
          <Descricao className="mt-0.5 text-[13px] md:text-sm">Muda na hora, sem reiniciar o app.</Descricao>
        </div>

        <RadioGroup
          aria-label="Tema do app"
          value={tema}
          onValueChange={setTema}
          className="grid-cols-2 gap-3 tela-baixa:gap-2.5 md:gap-4"
        >
          {TEMAS.map((opcao) => (
            <TemaOpcao key={opcao.id} tema={opcao} selecionado={opcao.id === tema} />
          ))}
        </RadioGroup>

        <Button size="xl" className="w-full" onClick={() => onAbertoChange(false)}>
          Pronto
        </Button>
      </Conteudo>
    </Recipiente>
  )
}
