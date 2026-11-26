import { PainelResponsivo } from "@/components/shared/PainelResponsivo"
import { Button } from "@/components/ui/button"
import { RadioGroup } from "@/components/ui/radio-group"
import { useTheme } from "@/hooks/useTheme"
import { TEMAS } from "@/lib/theme"
import { TemaOpcao } from "./TemaOpcao"

export function SeletorTema({ aberto, onAbertoChange }) {
  const { tema, setTema } = useTheme()

  return (
    <PainelResponsivo
      aberto={aberto}
      onAbertoChange={onAbertoChange}
      titulo="Aparência"
      descricao="Muda na hora, sem reiniciar o app."
    >
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
    </PainelResponsivo>
  )
}
