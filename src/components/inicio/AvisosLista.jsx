import { AvisoCard } from "./AvisoCard"
import { agruparDocumentosProntos } from "@/lib/avisos"

// no celular os avisos rolam para o lado; do tablet em diante viram uma grade
export function AvisosLista({ avisos }) {
  if (avisos.length === 0) return null
  const agrupados = agruparDocumentosProntos(avisos)

  return (
    <section aria-label="Avisos">
      <ul className="-mx-5 flex snap-x snap-mandatory scroll-px-5 gap-3 overflow-x-auto px-5 pt-1 pb-3 scrollbar-none md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:px-0 md:pb-0">
        {agrupados.map((aviso) => (
          <li key={aviso.id} className="w-[min(262px,78vw)] shrink-0 snap-start md:w-auto">
            <AvisoCard aviso={aviso} className="h-full" />
          </li>
        ))}
      </ul>
    </section>
  )
}
