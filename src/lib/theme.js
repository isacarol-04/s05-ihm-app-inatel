import { createContext } from "react"

export const TEMAS = [
  { id: "auto", nome: "Automático", descricao: "Segue o celular" },
  { id: "inatel", nome: "Inatel", descricao: "Claro, azul Inatel" },
  { id: "dark", nome: "Escuro", descricao: "Confortável à noite" },
  { id: "lim", nome: "Limão", descricao: "Verde e roxo" },
]

export const TEMA_PADRAO = "inatel"

export const ThemeContext = createContext(null)

export function aplicarTema(tema) {
  const html = document.documentElement
  const prefereEscuro = window.matchMedia("(prefers-color-scheme: dark)").matches
  const escuro = tema === "dark" || (tema === "auto" && prefereEscuro)

  html.classList.toggle("dark", escuro)
  html.classList.toggle("theme-lim", tema === "lim")
  html.style.colorScheme = escuro ? "dark" : "light"
}
