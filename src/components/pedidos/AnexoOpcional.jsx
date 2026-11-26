import { FileText, Paperclip, X } from "lucide-react"
import { Button } from "@/components/ui/button"

function formatarTamanho(bytes) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`
  return `${(bytes / 1024 / 1024).toFixed(1).replace(".", ",")} MB`
}

// botão tracejado para anexar um arquivo; depois de escolher mostra o nome e o "remover"
// (no mock guardamos só o nome e o tamanho do arquivo)
export function AnexoOpcional({ anexo, onAnexoChange }) {
  function escolher(evento) {
    const arquivo = evento.target.files?.[0]
    if (arquivo) onAnexoChange({ nome: arquivo.name, tamanho: arquivo.size })
    evento.target.value = ""
  }

  if (anexo) {
    return (
      <div className="mt-4 flex items-center gap-3 rounded-2xl bg-card py-2 pr-2 pl-3.5 shadow-card">
        <FileText className="size-5 shrink-0 text-primary" />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-semibold">{anexo.nome}</span>
          <span className="block text-xs text-muted-foreground">{formatarTamanho(anexo.tamanho)}</span>
        </span>
        <Button variant="ghost" size="icon-lg" aria-label="Remover anexo" onClick={() => onAnexoChange(null)}>
          <X />
        </Button>
      </div>
    )
  }

  return (
    <label className="mt-4 flex h-13 items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-subtle/60 text-sm font-semibold text-muted-foreground transition-colors hover:border-primary hover:bg-accent hover:text-primary has-focus-visible:ring-2 has-focus-visible:ring-ring">
      <Paperclip className="size-4" />
      Anexar arquivo (opcional)
      <input type="file" accept=".pdf,image/*" className="sr-only" onChange={escolher} />
    </label>
  )
}
