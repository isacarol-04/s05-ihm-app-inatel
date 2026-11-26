import { createContext } from "react"

// cores fixas da miniatura de cada tema (não mudam com o tema atual)
export const TEMAS = [
  {
    id: "auto",
    nome: "Automático",
    descricao: "Segue o celular",
    preview: { fundo: "#eef2f8", barra: "#126ae2", linha: "#ffffff", bolinha: "#126ae2", metadeEscura: "#141c2c" },
  },
  {
    id: "inatel",
    nome: "Inatel",
    descricao: "Claro, azul Inatel",
    preview: { fundo: "#eef2f8", barra: "#126ae2", linha: "#ffffff", bolinha: "#126ae2" },
  },
  {
    id: "lim",
    nome: "Limão",
    descricao: "Verde e roxo",
    preview: { fundo: "#cef09d", barra: "#38184c", linha: "#f3fae6", bolinha: "#38184c" },
  },
  {
    id: "dark",
    nome: "Escuro",
    descricao: "Confortável à noite",
    preview: { fundo: "#141c2c", barra: "#7faef5", linha: "#232d40", bolinha: "#7faef5" },
  },
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

  // cor da barra do navegador no celular acompanha o fundo do tema
  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) meta.content = getComputedStyle(html).getPropertyValue("--background").trim()
}
