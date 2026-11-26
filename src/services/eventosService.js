import eventos from "@/data/eventos.json"
import { lerData } from "./aulasService"
import { delay } from "./storage"

// eventos que ainda vão acontecer, do mais próximo para o mais distante
export async function getEventos(agora = new Date()) {
  await delay()
  const hoje = new Date(agora)
  hoje.setHours(0, 0, 0, 0)

  return eventos
    .map((evento) => ({ ...evento, data: lerData(evento.data) }))
    .filter((evento) => evento.data >= hoje)
    .sort((a, b) => a.data - b.data)
}
