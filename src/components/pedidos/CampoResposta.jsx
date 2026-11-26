import { useState } from "react"
import { Paperclip, SendHorizontal, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

// campo para responder a secretaria, com anexo opcional (no mock guardamos só o nome)
export function CampoResposta({ onEnviar, className }) {
  const [texto, setTexto] = useState("")
  const [anexo, setAnexo] = useState(null)
  const [enviando, setEnviando] = useState(false)
  const podeEnviar = texto.trim().length > 0 && !enviando

  function escolherArquivo(evento) {
    const arquivo = evento.target.files?.[0]
    if (arquivo) setAnexo({ nome: arquivo.name, tamanho: arquivo.size })
    evento.target.value = ""
  }

  async function enviar(evento) {
    evento.preventDefault()
    if (!podeEnviar) return
    setEnviando(true)
    try {
      await onEnviar({ texto: texto.trim(), anexo })
    } finally {
      setEnviando(false)
    }
  }

  return (
    <form onSubmit={enviar} className={cn("rounded-2xl bg-card shadow-card ring-1 ring-border", className)}>
      {anexo && (
        <div className="flex items-center gap-2 border-b px-4 py-2 text-sm">
          <Paperclip className="size-4 shrink-0 text-primary" />
          <span className="min-w-0 flex-1 truncate font-medium">{anexo.nome}</span>
          <Button type="button" variant="ghost" size="icon-sm" aria-label="Remover anexo" onClick={() => setAnexo(null)}>
            <X />
          </Button>
        </div>
      )}

      <div className="flex items-center gap-1 py-1.5 pr-1.5 pl-4">
        <Input
          value={texto}
          onChange={(evento) => setTexto(evento.target.value)}
          placeholder="Escreva sua resposta..."
          aria-label="Sua resposta para a secretaria"
          className="h-11 flex-1 border-0 bg-transparent px-0 text-base shadow-none focus-visible:ring-0 md:text-[15px] dark:bg-transparent"
        />
        <label
          className="flex size-10 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground has-focus-visible:ring-2 has-focus-visible:ring-ring"
          title="Anexar arquivo"
        >
          <Paperclip className="size-5" />
          <span className="sr-only">Anexar arquivo</span>
          <input type="file" accept=".pdf,image/*" className="sr-only" onChange={escolherArquivo} />
        </label>
        <Button type="submit" size="icon-lg" className="size-11 rounded-xl" disabled={!podeEnviar} aria-label="Enviar resposta">
          <SendHorizontal className="size-5" />
        </Button>
      </div>
    </form>
  )
}
