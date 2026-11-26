import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Columns2 } from "lucide-react"
import { CardReserva } from "@/components/armario/CardReserva"
import { RegrasPainel } from "@/components/armario/RegrasPainel"
import { HeaderInterno } from "@/components/layout/HeaderInterno"
import { RodapeAcoes } from "@/components/layout/RodapeAcoes"
import { IconeSucesso } from "@/components/shared/IconeSucesso"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useAsync } from "@/hooks/useAsync"
import { getReservaAtual } from "@/services/armarioService"

export default function ArmarioReserva() {
  const navigate = useNavigate()
  // "nova" vem da tela de reservar: aí mostramos o feedback de sucesso
  const nova = useLocation().state?.nova === true
  const { data: reserva, loading } = useAsync(getReservaAtual)
  const [regrasAbertas, setRegrasAbertas] = useState(false)
  const [agora] = useState(() => new Date())

  if (loading) {
    return (
      <div>
        <HeaderInterno titulo="Armário" voltarPara="/servicos" />
        <Skeleton className="mt-8 h-72 rounded-3xl" />
      </div>
    )
  }

  if (!reserva) {
    return (
      <div>
        <HeaderInterno titulo="Armário" voltarPara="/servicos" />
        <section className="mt-10 flex flex-col items-center text-center">
          <span className="flex size-20 items-center justify-center rounded-full bg-muted text-subtle">
            <Columns2 className="size-9" />
          </span>
          <h2 className="mt-4 text-xl font-bold">Você não tem armário reservado</h2>
          <p className="mt-1 text-sm text-muted-foreground">Reserve um para guardar seus projetos e equipamentos.</p>
        </section>
        <RodapeAcoes>
          <Button size="xl" className="w-full" nativeButton={false} render={<Link to="/servicos/armario" replace />}>
            Reservar armário
          </Button>
        </RodapeAcoes>
      </div>
    )
  }

  const atrasada = new Date(reserva.devolverAte) < agora

  return (
    <div>
      <HeaderInterno titulo="Armário" voltarPara="/servicos" />

      <section className="mt-6 flex flex-col items-center text-center">
        {nova && <IconeSucesso />}
        <h2 className="mt-4 text-2xl font-bold">{nova ? "Armário reservado!" : "Sua reserva"}</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {atrasada
            ? "O prazo de devolução já passou. Procure o almoxarifado."
            : "O número também fica salvo em Serviços."}
        </p>
      </section>

      <div className="mt-6">
        <CardReserva reserva={reserva} atrasada={atrasada} />
      </div>

      <RodapeAcoes>
        <Button size="xl" className="w-full" onClick={() => navigate("/servicos")}>
          Voltar para Serviços
        </Button>
        <Button size="xl" variant="soft" className="w-full" onClick={() => setRegrasAbertas(true)}>
          Ver regras de uso
        </Button>
      </RodapeAcoes>

      <RegrasPainel aberto={regrasAbertas} onAbertoChange={setRegrasAbertas} />
    </div>
  )
}
