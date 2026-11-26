import { PainelResponsivo } from "@/components/shared/PainelResponsivo"
import { Button } from "@/components/ui/button"

const REGRAS = [
  "A reserva vale por 24 horas a partir do momento em que você reserva.",
  "A chave é retirada e devolvida no almoxarifado, no Prédio 1.",
  "Não guarde alimentos, líquidos abertos ou objetos de valor.",
  "Devolver com atraso bloqueia novas reservas por 7 dias.",
  "Você pode ter só um armário reservado por vez.",
]

export function RegrasPainel({ aberto, onAbertoChange }) {
  return (
    <PainelResponsivo aberto={aberto} onAbertoChange={onAbertoChange} titulo="Regras de uso" descricao="Vale para todos os armários do campus.">
      <ol className="space-y-3 rounded-2xl border p-4">
        {REGRAS.map((regra, i) => (
          <li key={regra} className="flex gap-3 text-sm">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-primary">
              {i + 1}
            </span>
            <span className="pt-0.5">{regra}</span>
          </li>
        ))}
      </ol>
      <Button size="xl" className="w-full" onClick={() => onAbertoChange(false)}>
        Entendi
      </Button>
    </PainelResponsivo>
  )
}
