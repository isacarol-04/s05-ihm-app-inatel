import { Paperclip, UserRound } from "lucide-react"
import { formatarTempoRelativo } from "@/lib/format"
import { cn } from "@/lib/utils"

function MensagemSecretaria({ mensagem, agora }) {
  return (
    <li>
      <div className="flex items-center gap-2.5">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent text-primary">
          <UserRound className="size-4" />
        </span>
        <div>
          <p className="text-sm font-bold">Secretaria Acadêmica</p>
          <p className="text-xs text-muted-foreground">{formatarTempoRelativo(mensagem.data, agora)}</p>
        </div>
      </div>
      <p className="mt-3 rounded-2xl bg-background px-4 py-3 text-[15px] leading-relaxed">{mensagem.texto}</p>
    </li>
  )
}

function MensagemAluno({ mensagem, agora }) {
  return (
    <li className="flex flex-col items-end">
      <p className="text-xs text-muted-foreground">Você · {formatarTempoRelativo(mensagem.data, agora)}</p>
      <p className="mt-1.5 max-w-[85%] rounded-2xl rounded-br-md bg-primary px-4 py-3 text-[15px] leading-relaxed text-primary-foreground">
        {mensagem.texto}
      </p>
      {mensagem.anexo && (
        <span className="mt-1.5 flex max-w-[85%] items-center gap-1.5 text-xs text-muted-foreground">
          <Paperclip className="size-3.5 shrink-0" />
          <span className="truncate">{mensagem.anexo.nome}</span>
        </span>
      )}
    </li>
  )
}

// conversa sobre a pendência: mensagens da secretaria à esquerda, as suas à direita
export function ConversaSecretaria({ mensagens, agora, className }) {
  return (
    <section aria-label="Mensagens da secretaria" className={cn("rounded-3xl bg-card p-4 shadow-card", className)}>
      <ul className="space-y-4">
        {mensagens.map((mensagem) =>
          mensagem.autor === "secretaria" ? (
            <MensagemSecretaria key={mensagem.id} mensagem={mensagem} agora={agora} />
          ) : (
            <MensagemAluno key={mensagem.id} mensagem={mensagem} agora={agora} />
          )
        )}
      </ul>
    </section>
  )
}
