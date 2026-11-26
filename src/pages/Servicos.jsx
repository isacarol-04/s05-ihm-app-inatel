import { useState } from "react"
import { Clock, Columns2, FileText, List, TriangleAlert } from "lucide-react"
import { PageHeader } from "@/components/layout/PageHeader"
import { ServicoCard } from "@/components/servicos/ServicoCard"
import { InfoBox } from "@/components/shared/InfoBox"
import { useAsync } from "@/hooks/useAsync"
import { formatarDiaRelativo, formatarHora } from "@/lib/format"
import { getResumoArmario } from "@/services/armarioService"
import { getResumoPedidos } from "@/services/secretariaService"

function plural(n, singular, pluralTexto) {
  return `${n} ${n === 1 ? singular : pluralTexto}`
}

function StatusArmario({ resumo, agora }) {
  const { reserva, disponiveis } = resumo

  if (!reserva) {
    return (
      <InfoBox icone={Columns2} tom="info">
        {disponiveis > 0 ? `${plural(disponiveis, "armário disponível", "armários disponíveis")} agora` : "Nenhum armário livre no momento"}
      </InfoBox>
    )
  }

  const devolverAte = new Date(reserva.devolverAte)
  if (devolverAte < agora) {
    return (
      <InfoBox icone={TriangleAlert} tom="danger">
        Armário {reserva.armarioId} · devolução atrasada, procure o almoxarifado
      </InfoBox>
    )
  }

  return (
    <InfoBox icone={Clock} tom="warning">
      Armário {reserva.armarioId} · devolver {formatarDiaRelativo(devolverAte, agora)} até {formatarHora(devolverAte)}
    </InfoBox>
  )
}

function StatusPedidos({ resumo }) {
  const { emAndamento, prontos } = resumo

  if (emAndamento === 0) {
    return <InfoBox icone={List}>Nenhum pedido em andamento</InfoBox>
  }

  const partes = [plural(emAndamento, "pedido em andamento", "pedidos em andamento")]
  if (prontos > 0) partes.push(plural(prontos, "pronto", "prontos"))

  return <InfoBox icone={List}>{partes.join(" · ")}</InfoBox>
}

export default function Servicos() {
  const [agora] = useState(() => new Date())
  const { data: armario } = useAsync(getResumoArmario)
  const { data: pedidos } = useAsync(getResumoPedidos)

  return (
    <>
      <PageHeader titulo="Serviços" descricao="Resolva sua vida no campus pelo app." />

      {/* sem painel lateral: aqui os dois serviços são o conteúdo todo, então usam a largura inteira */}
      <div className="mt-4 grid gap-4 md:grid-cols-2 md:gap-5">
        <ServicoCard
          icone={Columns2}
          titulo="Armário"
          descricao="Guarde seus projetos e equipamentos."
          status={armario && <StatusArmario resumo={armario} agora={agora} />}
          // "Ver reserva" só aparece quando tem um armário reservado
          acoes={[
            armario?.reserva !== null && { label: "Ver reserva", para: "/servicos/armario/reserva" },
            { label: "Reservar", para: "/servicos/armario", principal: true },
          ].filter(Boolean)}
        />

        <ServicoCard
          icone={FileText}
          titulo="Secretaria"
          novo
          descricao="Peça declarações e histórico sem ir ao balcão."
          status={pedidos && <StatusPedidos resumo={pedidos} />}
          acoes={[
            { label: "Meus pedidos", para: "/secretaria" },
            { label: "Novo pedido", para: "/secretaria/novo", principal: true },
          ]}
        />
      </div>
    </>
  )
}
