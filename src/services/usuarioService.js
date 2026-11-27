import usuarioInicial from "@/data/usuario.json"
import { delay, load, resetAll, save } from "./storage"

const CHAVE = "usuario"

export function lerUsuario() {
  return load(CHAVE, usuarioInicial)
}

export async function getUsuario() {
  await delay()
  return lerUsuario()
}

export async function atualizarNotificacoes(notificacoes) {
  await delay(150)
  const anterior = lerUsuario()
  const usuario = { ...anterior, notificacoes }
  // Reativar não envia mudanças ocorridas enquanto os avisos estavam desligados.
  if (!anterior.notificacoes.secretaria && notificacoes.secretaria) {
    usuario.notificacoesSecretariaAtivadasEm = new Date().toISOString()
  }
  save(CHAVE, usuario)
  return usuario
}

// volta pedidos, reservas e preferências para os dados de exemplo (o tema continua)
export function restaurarDadosDeExemplo() {
  resetAll()
}
