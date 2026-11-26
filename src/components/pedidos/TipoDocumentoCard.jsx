import { Link } from "react-router-dom"
import { ChevronRight, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { formatarDiasUteis } from "@/lib/format"
import { cn } from "@/lib/utils"
import { IconeDocumento } from "./IconeDocumento"
import { rotuloFormatos, rotuloTaxa } from "./documento"

// opção da etapa 1: o card inteiro leva para a etapa 2 com esse documento
export function TipoDocumentoCard({ tipo, destacado = false, onEscolher }) {
  return (
    <Link
      to={`?tipo=${tipo.id}`}
      state={{ daLista: true }}
      onClick={() => onEscolher?.(tipo.id)}
      className={cn(
        "group flex items-center gap-3 rounded-3xl border-2 border-transparent bg-card p-4 shadow-card transition-all outline-none",
        "hover:-translate-y-0.5 hover:border-border hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.99]",
        destacado && "border-primary hover:border-primary"
      )}
    >
      <IconeDocumento className="size-11" />
      <div className="min-w-0 flex-1">
        <h3 className="text-base leading-snug font-bold">{tipo.nome}</h3>
        <div className="mt-1.5 flex flex-wrap gap-1">
          <Badge variant="neutral" size="md">
            <Clock /> {formatarDiasUteis(tipo.prazoDias)}
          </Badge>
          <Badge variant={tipo.taxa > 0 ? "warning" : "success"} size="md">
            {rotuloTaxa(tipo.taxa)}
          </Badge>
          <Badge variant="info" size="md">
            {rotuloFormatos(tipo.formatos)}
          </Badge>
        </div>
      </div>
      <ChevronRight className="size-5 shrink-0 text-subtle transition-transform group-hover:translate-x-0.5" />
    </Link>
  )
}
