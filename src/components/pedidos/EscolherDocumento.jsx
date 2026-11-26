import { SearchX, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { buscarTipos } from "@/services/secretariaService"
import { Etapas } from "./Etapas"
import { TipoDocumentoCard } from "./TipoDocumentoCard"

function FaleComSecretaria({ className }) {
  return (
    <p className={className}>
      Não achou?{" "}
      <a href="mailto:secretaria@inatel.br" className="font-bold text-primary hover:underline">
        Fale com a secretaria
      </a>
    </p>
  )
}

// etapa 1 do novo pedido: busca + lista de tipos de documento
export function EscolherDocumento({ busca, onBuscaChange, escolhido, onEscolher }) {
  const tipos = buscarTipos(busca)

  return (
    <>
      <Etapas atual={1} total={2} titulo="Qual documento você precisa?" />

      <div className="relative mt-4">
        <Search className="pointer-events-none absolute top-1/2 left-4 size-[18px] -translate-y-1/2 text-subtle" />
        <Input
          type="search"
          value={busca}
          onChange={(evento) => onBuscaChange(evento.target.value)}
          placeholder="Ex.: comprovante para estágio"
          aria-label="Buscar documento"
          className="h-13 rounded-2xl border-transparent bg-card pr-4 pl-11 text-base shadow-card placeholder:text-sm md:text-[15px] dark:bg-card"
        />
      </div>

      {tipos.length > 0 ? (
        <ul className="mt-4 space-y-3">
          {tipos.map((tipo) => (
            <li key={tipo.id}>
              <TipoDocumentoCard tipo={tipo} destacado={tipo.id === escolhido} onEscolher={onEscolher} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-4 flex flex-col items-center rounded-3xl bg-card px-6 py-10 text-center shadow-card">
          <span className="flex size-14 items-center justify-center rounded-full bg-muted text-subtle">
            <SearchX className="size-6" />
          </span>
          <p className="mt-3 font-semibold">Nenhum documento encontrado</p>
          <p className="mt-1 text-sm text-muted-foreground">Tente outra palavra, como “histórico” ou “matrícula”.</p>
        </div>
      )}

      <FaleComSecretaria className="mt-5 text-center text-sm text-muted-foreground" />
    </>
  )
}
