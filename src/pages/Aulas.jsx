import { useCallback, useState } from "react"
import { BookOpen, CalendarDays, TriangleAlert } from "lucide-react"
import { AulaTimelineItem } from "@/components/aulas/AulaTimelineItem"
import { ProvasSemana } from "@/components/aulas/ProvasSemana"
import { ResumoCard } from "@/components/aulas/ResumoCard"
import { SeletorDias } from "@/components/aulas/SeletorDias"
import { PageHeader } from "@/components/layout/PageHeader"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useAsync } from "@/hooks/useAsync"
import { getAulasDoDia, getProvas, getProximaAula, getSemana } from "@/services/aulasService"

function nomeDoDia(data) {
  const nome = data.toLocaleDateString("pt-BR", { weekday: "long" }).replace("-feira", "")
  return `${nome === "sábado" || nome === "domingo" ? "no" : "na"} ${nome}`
}

function plural(n, singular, pluralTexto) {
  return `${n} ${n === 1 ? singular : pluralTexto}`
}

export default function Aulas() {
  const [agora] = useState(() => new Date())
  const [dias] = useState(() => getSemana(agora))
  const diaInicial = dias.find((dia) => dia.hoje)?.data ?? dias[0].data
  const [diaSelecionado, setDiaSelecionado] = useState(diaInicial)

  const carregarDia = useCallback(() => getAulasDoDia(diaSelecionado), [diaSelecionado])
  const carregarSemana = useCallback(
    () =>
      Promise.all([getProximaAula(agora), getProvas(agora, dias[4].data)]).then(([proxima, provas]) => ({
        proxima,
        provas,
      })),
    [agora, dias]
  )

  const { data: aulasDoDia, loading } = useAsync(carregarDia)
  const { data: semana } = useAsync(carregarSemana)

  const ehHoje = diaSelecionado.toDateString() === agora.toDateString()
  const proxima = semana?.proxima
  const ehProxima = (item) =>
    proxima && item.aula.id === proxima.aula.id && item.inicio.getTime() === proxima.inicio.getTime()

  return (
    <>
      <PageHeader
        titulo="Aulas"
        acao={
          <Button variant="surface" size="icon-xl" aria-label="Voltar para hoje" onClick={() => setDiaSelecionado(diaInicial)}>
            <CalendarDays />
          </Button>
        }
      />

      <div className="mt-4 grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px] xl:gap-x-10">
        <div className="xl:col-start-1">
          <SeletorDias dias={dias} selecionado={diaSelecionado} onSelecionar={setDiaSelecionado} />
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
            valor={semana ? plural(semana.provas.length, "prova", "provas") : "–"}
            legenda="nesta semana"
          />
          {semana && <ProvasSemana provas={semana.provas} agora={agora} className="mt-4 hidden xl:block" />}
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
