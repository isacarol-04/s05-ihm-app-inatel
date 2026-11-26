import { PainelResponsivo } from "@/components/shared/PainelResponsivo"
import { Button } from "@/components/ui/button"

// dados vêm do cadastro da faculdade, então aqui é só leitura
export function DadosPessoaisPainel({ usuario, aberto, onAbertoChange }) {
  const campos = [
    ["Nome", usuario.nomeCompleto],
    ["Matrícula", usuario.matricula],
    ["Curso", `${usuario.curso} · ${usuario.periodo}º período`],
    ["E-mail", usuario.email],
    ["Telefone", usuario.telefone],
  ]

  return (
    <PainelResponsivo
      aberto={aberto}
      onAbertoChange={onAbertoChange}
      titulo="Dados pessoais"
      descricao="Para corrigir algum dado, fale com a secretaria."
    >
      <dl className="divide-y rounded-2xl border px-4">
        {campos.map(([rotulo, valor]) => (
          <div key={rotulo} className="flex items-center justify-between gap-4 py-3">
            <dt className="text-sm text-muted-foreground">{rotulo}</dt>
            <dd className="text-right text-sm font-semibold break-all">{valor}</dd>
          </div>
        ))}
      </dl>

      <Button size="xl" className="w-full" onClick={() => onAbertoChange(false)}>
        Fechar
      </Button>
    </PainelResponsivo>
  )
}
