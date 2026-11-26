import { Link } from "react-router-dom"
import { ChartNoAxesColumn, Columns2, FileText, List } from "lucide-react"
import { SectionHeader } from "@/components/shared/SectionHeader"

const ATALHOS = [
  { label: "Reservar armário", para: "/servicos/armario", icone: Columns2 },
  { label: "Pedir documento", para: "/secretaria/novo", icone: FileText },
  { label: "Meus pedidos", para: "/secretaria", icone: List },
  { label: "Minhas notas", para: "/aulas", icone: ChartNoAxesColumn },
]

function AtalhoItem({ label, para, icone: Icone }) {
  return (
    <Link to={para} className="group flex flex-col items-center gap-2 text-center outline-none">
      <span className="flex size-[58px] items-center justify-center rounded-2xl bg-card text-primary shadow-card transition-colors group-hover:bg-accent group-focus-visible:ring-2 group-focus-visible:ring-ring">
        <Icone className="size-[22px]" />
      </span>
      <span className="text-xs leading-tight font-medium text-balance">{label}</span>
    </Link>
  )
}

export function Atalhos() {
  return (
    <section aria-labelledby="atalhos-titulo">
      <SectionHeader id="atalhos-titulo" titulo="Atalhos" />
      <div className="grid grid-cols-4 gap-2">
        {ATALHOS.map((atalho) => (
          <AtalhoItem key={atalho.label} {...atalho} />
        ))}
      </div>
    </section>
  )
}
