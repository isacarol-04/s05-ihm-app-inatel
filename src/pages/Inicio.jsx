import { useState } from "react"
import { HeaderInicio } from "@/components/layout/HeaderInicio"
import { Atalhos } from "@/components/inicio/Atalhos"
import { AvisosLista } from "@/components/inicio/AvisosLista"
import { EventosCarrossel } from "@/components/inicio/EventosCarrossel"
import { InicioSkeleton } from "@/components/inicio/InicioSkeleton"
import { ProximaAulaCard } from "@/components/inicio/ProximaAulaCard"
import { Saudacao } from "@/components/inicio/Saudacao"
import { useAsync } from "@/hooks/useAsync"
import { getProximaAula } from "@/services/aulasService"
import { getAvisos } from "@/services/avisosService"
import { getEventos } from "@/services/eventosService"
import { getUsuario } from "@/services/usuarioService"

async function carregarInicio() {
  const [usuario, avisos, proximaAula, eventos] = await Promise.all([
    getUsuario(),
    getAvisos(),
    getProximaAula(),
    getEventos(),
  ])
  return { usuario, avisos, proximaAula, eventos }
}

export default function Inicio() {
  const { data, loading } = useAsync(carregarInicio)
  const [agora] = useState(() => new Date())

  return (
    <>
      <HeaderInicio temNotificacao={data?.avisos.length > 0} />

      <div className="mt-4 lg:mt-2 lg:grid lg:grid-cols-12 lg:gap-10">
        <div className="space-y-6 lg:col-span-7">
          {loading || !data ? (
            <InicioSkeleton />
          ) : (
            <>
              <Saudacao nome={data.usuario.nome} data={agora} />
              <AvisosLista avisos={data.avisos} />
              <ProximaAulaCard proxima={data.proximaAula} agora={agora} />
            </>
          )}
        </div>

        <div className="mt-7 space-y-7 lg:col-span-5 lg:mt-0">
          <Atalhos />
          {data && <EventosCarrossel eventos={data.eventos} />}
        </div>
      </div>
    </>
  )
}
