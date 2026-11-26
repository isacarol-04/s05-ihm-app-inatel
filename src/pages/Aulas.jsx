import { useCallback, useState } from "react"
import { BookOpen, CalendarDays, TriangleAlert } from "lucide-react"
import { AulaTimelineItem } from "@/components/aulas/AulaTimelineItem"
import { ProvasSemana } from "@/components/aulas/ProvasSemana"
import { ResumoCard } from "@/components/aulas/ResumoCard"
import { SeletorDias } from "@/components/aulas/SeletorDias"
import { SeletorSemana } from "@/components/aulas/SeletorSemana"
import { PageHeader } from "@/components/layout/PageHeader"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useAsync } from "@/hooks/useAsync"
import {
  getAulasDoDia,
  getProvas,
  getProximaAula,
  getSemanas,
  indiceDaSemanaAtual,
} from "@/services/aulasService"

function nomeDoDia(data) {
  const nome = data.toLocaleDateString("pt-BR", { weekday: "long" }).replace("-feira", "")
  return `${nome === "sábado" || nome === "domingo" ? "no" : "na"} ${nome}`
}

function plural(n, singular, pluralTexto) {
  return `${n} ${n === 1 ? singular : pluralTexto}`
}

// dia que abre ao entrar numa semana: hoje, se estiver nela, senão a segunda
function diaInicialDa(semana) {
  return (semana.find((dia) => dia.hoje) ?? semana[0]).data
}

export default function Aulas() {
  const [agora] = useState(() => new Date())
  const [semanas] = useState(() => getSemanas(agora))
  const indiceAtual = indiceDaSemanaAtual(semanas, agora)

  const [indiceSemana, setIndiceSemana] = useState(indiceAtual)
  const [diaSelecionado, setDiaSelecionado] = useState(() => diaInicialDa(semanas[indiceAtual]))
  const semana = semanas[indiceSemana]
  const ehSemanaAtual = indiceSemana === indiceAtual

  function irParaSemana(indice) {
    setIndiceSemana(indice)
    setDiaSelecionado(diaInicialDa(semanas[indice]))
  }

  const carregarDia = useCallback(() => getAulasDoDia(diaSelecionado), [diaSelecionado])
  const carregarProxima = useCallback(() => getProximaAula(agora), [agora])
  // provas da semana escolhida que ainda não passaram
  const carregarProvas = useCallback(() => {
    const inicio = semana[0].data > agora ? semana[0].data : agora
    return getProvas(inicio, semana[4].data)
  }, [semana, agora])

  const { data: aulasDoDia, loading } = useAsync(carregarDia)
  const { data: proxima } = useAsync(carregarProxima)
  const { data: provas } = useAsync(carregarProvas)

  const ehHoje = diaSelecionado.toDateString() === agora.toDateString()
  const ehProxima = (item) =>
    proxima && item.aula.id === proxima.aula.id && item.inicio.getTime() === proxima.inicio.getTime()

  return (
    <>
      <PageHeader
        titulo="Aulas"
        acao={
          <Button variant="surface" size="icon-xl" aria-label="Voltar para hoje" onClick={() => irParaSemana(indiceAtual)}>
            <CalendarDays />
          </Button>
        }
      />

      <div className="mt-3 grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px] xl:gap-x-10">
        <div className="space-y-2 xl:col-start-1">
          <SeletorSemana
            semana={semana}
            atual={ehSemanaAtual}
            podeVoltar={indiceSemana > 0}
            podeAvancar={indiceSemana < semanas.length - 1}
            onVoltar={() => irParaSemana(indiceSemana - 1)}
            onAvancar={() => irParaSemana(indiceSemana + 1)}
          />
          <SeletorDias dias={semana} selecionado={diaSelecionado} onSelecionar={setDiaSelecionado} />
        </div>

        {/* no celular os resumos ficam lado a lado; em telas largas vão para a coluna da direita */}
        <aside className="grid grid-cols-2 content-start gap-3 xl:col-start-2 xl:row-span-2 xl:row-start-1 xl:grid-cols-1">
          <ResumoCard
            icone={BookOpen}
            tom="primary"
            valor={aulasDoDia ? plural(aulasDoDia.length, "aula", "aulas") : "–"}
            legenda={ehHoje ? "hoje" : nomeDoDia(diaSelecionado)}
          />
          <ResumoCard
            icone={TriangleAlert}
            tom="danger"
            valor={provas ? plural(provas.length, "prova", "provas") : "–"}
            legenda={ehSemanaAtual ? "nesta semana" : "nessa semana"}
          />
          {provas && <ProvasSemana provas={provas} agora={agora} className="mt-4 hidden xl:block" />}
        </aside>

        <section aria-label="Aulas do dia" className="xl:col-start-1">
          {loading && !aulasDoDia ? (
            <div className="space-y-4">
              <Skeleton className="h-32 rounded-2xl" />
              <Skeleton className="h-32 rounded-2xl" />
            </div>
          ) : aulasDoDia.length === 0 ? (
            <div className="rounded-2xl bg-card p-6 text-center shadow-card">
              <p className="font-semibold">Sem aulas {ehHoje ? "hoje" : nomeDoDia(diaSelecionado)}</p>
              <p className="mt-1 text-sm text-muted-foreground">Aproveite para revisar a matéria.</p>
            </div>
          ) : (
            <ol className="space-y-4">
              {aulasDoDia.map((item) => (
                <AulaTimelineItem
                  key={`${item.aula.id}-${item.horario.inicio}`}
                  item={item}
                  proxima={ehProxima(item)}
                  agora={agora}
                />
              ))}
            </ol>
          )}
        </section>
      </div>
    </>
  )
}
