import { useState } from "react"
import { Clock, Mail, MapPin, RotateCcw } from "lucide-react"
import { PainelResponsivo } from "@/components/shared/PainelResponsivo"
import { Button } from "@/components/ui/button"

const CONTATOS = [
  { icone: Clock, texto: "Atendimento presencial: seg. a sex., das 8h às 17h" },
  { icone: MapPin, texto: "Secretaria Acadêmica – Prédio 1, térreo" },
  { icone: Mail, texto: "secretaria@inatel.br" },
]

export function AjudaPainel({ aberto, onAbertoChange, onRestaurar }) {
  // pede uma segunda confirmação antes de apagar o que foi criado no app
  const [confirmando, setConfirmando] = useState(false)

  function mudarAberto(valor) {
    if (!valor) setConfirmando(false)
    onAbertoChange(valor)
  }

  return (
    <PainelResponsivo
      aberto={aberto}
      onAbertoChange={mudarAberto}
      titulo="Ajuda e suporte"
      descricao="Ficou com dúvida? Fale com a secretaria."
    >
      <ul className="space-y-3 rounded-2xl border p-4">
        {CONTATOS.map(({ icone: Icone, texto }) => (
          <li key={texto} className="flex items-start gap-3 text-sm">
            <Icone className="mt-0.5 size-4 shrink-0 text-primary" />
            {texto}
          </li>
        ))}
      </ul>

      <div className="rounded-2xl bg-muted/60 p-4">
        <p className="text-sm font-semibold">Restaurar dados de exemplo</p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Apaga os pedidos e reservas feitos no app e volta tudo como no começo.
        </p>
        {confirmando ? (
          <div className="mt-3 flex gap-2">
            <Button variant="outline" className="h-10 flex-1" onClick={() => setConfirmando(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" className="h-10 flex-1" onClick={onRestaurar}>
              Sim, restaurar
            </Button>
          </div>
        ) : (
          <Button variant="outline" className="mt-3 h-10" onClick={() => setConfirmando(true)}>
            <RotateCcw /> Restaurar
          </Button>
        )}
      </div>
    </PainelResponsivo>
  )
}
