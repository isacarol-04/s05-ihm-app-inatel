import usuarioInicial from "@/data/usuario.json"
import { delay, load, save } from "./storage"

const CHAVE = "usuario"

export function lerUsuario() {
  return load(CHAVE, usuarioInicial)
}

export function salvarUsuario(usuario) {
  save(CHAVE, usuario)
}

export async function getUsuario() {
  await delay()
  return lerUsuario()
}
