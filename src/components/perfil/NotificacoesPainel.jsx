import { PainelResponsivo } from "@/components/shared/PainelResponsivo"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"

const OPCOES = [
  { id: "secretaria", titulo: "Pedidos da secretaria", descricao: "Quando o status de um pedido mudar" },
  { id: "aulas", titulo: "Aulas e provas", descricao: "Lembrete antes da aula e das provas" },
  { id: "eventos", titulo: "Eventos do campus", descricao: "Novidades e inscrições abertas" },
]

export function NotificacoesPainel({ notificacoes, onAlterar, aberto, onAbertoChange }) {
  return (
    <PainelResponsivo
      aberto={aberto}
      onAbertoChange={onAbertoChange}
      titulo="Notificações"
      descricao="Escolha o que o app pode te avisar."
    >
      <ul className="divide-y rounded-2xl border px-4">
        {OPCOES.map((opcao) => (
          <li key={opcao.id}>
            <label className="flex cursor-pointer items-center justify-between gap-4 py-3.5">
              <span>
                <span className="block text-[15px] font-semibold">{opcao.titulo}</span>
                <span className="block text-xs text-muted-foreground">{opcao.descricao}</span>
              </span>
              <Switch
                checked={notificacoes[opcao.id]}
                onCheckedChange={(ativo) => onAlterar({ ...notificacoes, [opcao.id]: ativo })}
              />
            </label>
          </li>
        ))}
      </ul>

      <Button size="xl" className="w-full" onClick={() => onAbertoChange(false)}>
        Pronto
      </Button>
    </PainelResponsivo>
  )
}
