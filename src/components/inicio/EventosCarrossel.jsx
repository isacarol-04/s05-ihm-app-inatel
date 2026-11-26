import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useMediaQuery } from "@/hooks/useMediaQuery"
import { SectionHeader } from "@/components/shared/SectionHeader"
import { cn } from "@/lib/utils"
import { EventoCard } from "./EventoCard"

const INTERVALO = 5000

// Mesmo comportamento do carrossel do app antigo: passa sozinho a cada 5s,
// aceita arrastar para o lado e tem botões de anterior/próximo.
export function EventosCarrossel({ eventos }) {
  const [indice, setIndice] = useState(0)
  const [pausado, setPausado] = useState(false)
  const inicioToque = useRef(null)
  const total = eventos.length

  // no tablet cabem 2 eventos por vez; no celular e no desktop (coluna estreita), 1
  const tablet = useMediaQuery("(min-width: 768px) and (max-width: 1023px)")
  const porTela = tablet ? 2 : 1
  const paginas = Math.max(total - porTela + 1, 1)
  const atual = Math.min(indice, paginas - 1)

  const proximo = () => setIndice((i) => (Math.min(i, paginas - 1) + 1) % paginas)
  const anterior = () => setIndice((i) => (Math.min(i, paginas - 1) - 1 + paginas) % paginas)

  useEffect(() => {
    const reduzirMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (pausado || reduzirMovimento || paginas < 2) return
    const timer = setInterval(() => setIndice((i) => (Math.min(i, paginas - 1) + 1) % paginas), INTERVALO)
    return () => clearInterval(timer)
  }, [pausado, paginas])

  function onTouchStart(e) {
    inicioToque.current = e.touches[0].clientX
    setPausado(true)
  }

  function onTouchEnd(e) {
    const fim = e.changedTouches[0].clientX
    const distancia = inicioToque.current - fim
    if (distancia > 50) proximo()
    if (distancia < -50) anterior()
    setPausado(false)
  }

  if (total === 0) return null

  return (
    <section
      aria-labelledby="eventos-titulo"
      aria-roledescription="carrossel"
      onMouseEnter={() => setPausado(true)}
      onMouseLeave={() => setPausado(false)}
      onFocus={() => setPausado(true)}
      onBlur={() => setPausado(false)}
    >
      <SectionHeader
        id="eventos-titulo"
        titulo="Eventos"
        acao={
          <Link to="/eventos" className="rounded text-sm font-semibold text-primary hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none">
            Ver todos
          </Link>
        }
      />

      <div className="group relative">
        {/* o padding extra é só para a sombra do card não ser cortada */}
        <div className="-m-2 overflow-hidden py-2">
          <ul
            className="flex transition-transform duration-500 ease-out motion-reduce:transition-none"
            style={{ transform: `translateX(-${(atual * 100) / porTela}%)` }}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            {eventos.map((evento, i) => (
              <li
                key={evento.id}
                className="w-full shrink-0 px-2 md:w-1/2 lg:w-full"
                aria-hidden={i < atual || i >= atual + porTela}
                aria-roledescription="slide"
                aria-label={`${i + 1} de ${total}`}
              >
                <EventoCard evento={evento} />
              </li>
            ))}
          </ul>
        </div>

        {/* setas só aparecem onde tem mouse; no celular é arrastando */}
        <Button
          variant="surface"
          size="icon-lg"
          aria-label="Evento anterior"
          onClick={anterior}
          className="absolute top-[75px] left-3 hidden -translate-y-1/2 rounded-full opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100 md:inline-flex"
        >
          <ChevronLeft />
        </Button>
        <Button
          variant="surface"
          size="icon-lg"
          aria-label="Próximo evento"
          onClick={proximo}
          className="absolute top-[75px] right-3 hidden -translate-y-1/2 rounded-full opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100 md:inline-flex"
        >
          <ChevronRight />
        </Button>
      </div>

      <div className="mt-4 flex justify-center gap-1.5">
        {Array.from({ length: paginas }, (_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Ir para o evento ${i + 1}`}
            aria-current={i === atual}
            onClick={() => setIndice(i)}
            className="flex h-6 items-center outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-full"
          >
            <span
              className={cn(
                "block h-1.5 rounded-full transition-all",
                i === atual ? "w-5 bg-primary" : "w-1.5 bg-subtle/50"
              )}
            />
          </button>
        ))}
      </div>
    </section>
  )
}
