import eventos from "@/data/eventos.json"
import { delay } from "./storage"

export async function getEventos() {
  await delay()
  return eventos
}
