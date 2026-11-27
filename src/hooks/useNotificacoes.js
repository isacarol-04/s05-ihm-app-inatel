import { useAsync } from "./useAsync"
import { listarNotificacoes, observarNotificacoes } from "@/services/notificacoesService"
import { lerSolicitacoes, observarSolicitacoes } from "@/services/secretariaService"

async function carregarNotificacoes() {
  // Recupera primeiro as etapas que avançaram enquanto a tela estava fechada.
  lerSolicitacoes()
  return listarNotificacoes()
}

function observarAtualizacoes(atualizar) {
  const pararPedidos = observarSolicitacoes(atualizar)
  const pararNotificacoes = observarNotificacoes(atualizar)
  return () => {
    pararPedidos()
    pararNotificacoes()
  }
}

export function useNotificacoes() {
  const { data, loading } = useAsync(carregarNotificacoes, observarAtualizacoes)
  return { notificacoes: data ?? [], loading }
}
