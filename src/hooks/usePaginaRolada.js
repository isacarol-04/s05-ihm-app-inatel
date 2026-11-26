import { useSyncExternalStore } from "react"

function assinar(avisar) {
  window.addEventListener("scroll", avisar, { passive: true })
  return () => window.removeEventListener("scroll", avisar)
}

// true quando a página já rolou um pouco (usado para mostrar a linha embaixo do cabeçalho fixo)
export function usePaginaRolada(limite = 4) {
  return useSyncExternalStore(
    assinar,
    () => window.scrollY > limite,
    () => false
  )
}
