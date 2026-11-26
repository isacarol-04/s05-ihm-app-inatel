import { useCallback, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Clock, PersonStanding, TriangleAlert, Undo2 } from "lucide-react"
import { TipoArmarioOpcao } from "@/components/armario/TipoArmarioOpcao"
import { HeaderInterno } from "@/components/layout/HeaderInterno"
import { RodapeAcoes } from "@/components/layout/RodapeAcoes"
import { ConfirmarDialog } from "@/components/shared/ConfirmarDialog"
import { IconCircle } from "@/components/shared/IconCircle"
import { InfoBox } from "@/components/shared/InfoBox"
import { Button } from "@/components/ui/button"
import { RadioGroup } from "@/components/ui/radio-group"
import { Skeleton } from "@/components/ui/skeleton"
import { Switch } from "@/components/ui/switch"
import { useAsync } from "@/hooks/useAsync"
import { formatarDiaRelativo, formatarHora } from "@/lib/format"
import { FORMATOS, HORAS_RESERVA, devolver, getDisponiveis, lerReservaAtual, reservar } from "@/services/armarioService"
import { lerUsuario } from "@/services/usuarioService"

export default function ReservarArmario() {
  const navigate = useNavigate()
  const [formato, setFormato] = useState("padrao")
  // começa com a preferência de acessibilidade do cadastro (igual ao app antigo)
  const [acessivel, setAcessivel] = useState(() => lerUsuario().acessibilidade)
  const [reservaAtual, setReservaAtual] = useState(() => lerReservaAtual())
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState(null)
  const [confirmarDevolucao, setConfirmarDevolucao] = useState(false)
  // número guardado ao abrir a confirmação: a reserva some ao devolver, mas o texto
  // do diálogo continua aparecendo enquanto ele fecha
  const [armarioDevolvido, setArmarioDevolvido] = useState(null)

  // recarrega as quantidades quando muda a acessibilidade
  const carregarDisponiveis = useCallback(() => getDisponiveis(acessivel), [acessivel])
  const { data: disponiveis, recarregar } = useAsync(carregarDisponiveis)

  const esgotado = disponiveis && disponiveis[formato] === 0
  const podeReservar = disponiveis && !reservaAtual && !esgotado && !enviando

  async function confirmarReserva() {
    setErro(null)
    setEnviando(true)
    try {
      await reservar({ formato, acessivel })
      // replace: voltando da confirmação, a pessoa cai em Serviços e não no formulário
      navigate("/servicos/armario/reserva", { replace: true, state: { nova: true } })
    } catch (e) {
      setErro(e.message)
      setEnviando(false)
    }
  }

  async function devolverAtual() {
    await devolver()
    setReservaAtual(null)
    recarregar() // o armário devolvido volta a contar como disponível
  }

  return (
    <div>
      <HeaderInterno titulo="Reservar armário" voltarPara="/servicos" />

      {reservaAtual && (
        <InfoBox icone={TriangleAlert} tom="warning" className="mt-3">
          Você já está com o armário {reservaAtual.armarioId} até{" "}
          {formatarDiaRelativo(new Date(reservaAtual.devolverAte))} às {formatarHora(reservaAtual.devolverAte)}. Devolva
          antes de reservar outro.
          <span className="mt-2 flex gap-2">
            <Button variant="outline" className="h-9 bg-card" nativeButton={false} render={<Link to="/servicos/armario/reserva" />}>
              Ver reserva
            </Button>
            <Button
              variant="outline"
              className="h-9 bg-card"
              onClick={() => {
                setArmarioDevolvido(reservaAtual.armarioId)
                setConfirmarDevolucao(true)
              }}
            >
              <Undo2 /> Devolver
            </Button>
          </span>
        </InfoBox>
      )}

      <h2 className="mt-5 text-xl font-bold">Escolha o tipo</h2>

      {disponiveis ? (
        <RadioGroup
          aria-label="Tipo de armário"
          value={formato}
          onValueChange={setFormato}
          className="mt-3 grid-cols-2 gap-3"
        >
          {Object.entries(FORMATOS).map(([valor, nome]) => (
            <TipoArmarioOpcao
              key={valor}
              valor={valor}
              nome={nome}
              disponiveis={disponiveis[valor]}
              selecionado={formato === valor}
            />
          ))}
        </RadioGroup>
      ) : (
        <div className="mt-3 grid grid-cols-2 gap-3">
          <Skeleton className="h-[200px] rounded-3xl" />
          <Skeleton className="h-[200px] rounded-3xl" />
        </div>
      )}

      <label className="mt-4 flex items-center gap-3 rounded-3xl bg-card p-4 shadow-card">
        <IconCircle tom="primary" tamanho="md">
          <PersonStanding />
        </IconCircle>
        <span className="flex-1">
          <span className="block text-[15px] font-bold">Armário acessível</span>
          <span className="block text-xs text-muted-foreground">Mais baixo e com abertura facilitada</span>
        </span>
        <Switch checked={acessivel} onCheckedChange={setAcessivel} />
      </label>

      <InfoBox icone={Clock} tom="info" className="mt-4">
        Você fica com o armário por {HORAS_RESERVA} horas. A devolução é no almoxarifado.
      </InfoBox>

      {erro && (
        <InfoBox icone={TriangleAlert} tom="danger" className="mt-3" role="alert">
          {erro}
        </InfoBox>
      )}

      <RodapeAcoes>
        <Button size="xl" className="w-full" disabled={!podeReservar} onClick={confirmarReserva}>
          {enviando ? "Reservando..." : "Reservar armário"}
        </Button>
      </RodapeAcoes>

      <ConfirmarDialog
        aberto={confirmarDevolucao}
        onAbertoChange={setConfirmarDevolucao}
        icone={Undo2}
        titulo="Devolver o armário?"
        descricao={`Confirme só depois de entregar a chave do armário ${armarioDevolvido} no almoxarifado.`}
        textoConfirmar="Já devolvi"
        onConfirmar={devolverAtual}
      />
    </div>
  )
}
