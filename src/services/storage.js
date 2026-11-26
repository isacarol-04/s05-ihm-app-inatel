// Guarda os dados mockados no localStorage para o que a pessoa cria
// (pedidos, reservas, tema) continuar lá depois de recarregar a página.

const PREFIXO = "app-inatel:"

export function load(chave, valorInicial) {
  try {
    const salvo = localStorage.getItem(PREFIXO + chave)
    if (salvo !== null) return JSON.parse(salvo)
  } catch {
    // se o localStorage estiver bloqueado, segue com o valor inicial
  }
  return typeof valorInicial === "function" ? valorInicial() : structuredClone(valorInicial)
}

export function save(chave, valor) {
  try {
    localStorage.setItem(PREFIXO + chave, JSON.stringify(valor))
  } catch {
    // sem localStorage os dados ficam só na memória
  }
}

export function resetAll() {
  try {
    Object.keys(localStorage)
      .filter((chave) => chave.startsWith(PREFIXO) && chave !== PREFIXO + "tema")
      .forEach((chave) => localStorage.removeItem(chave))
  } catch {
    // nada para limpar
  }
}

// simula o tempo de resposta de uma API
export function delay(ms = 250) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
