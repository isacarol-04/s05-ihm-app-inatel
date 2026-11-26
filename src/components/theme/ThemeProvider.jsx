import { useEffect, useState } from "react"
import { ThemeContext, TEMA_PADRAO, aplicarTema } from "@/lib/theme"
import { load, save } from "@/services/storage"
import { SeletorTema } from "./SeletorTema"

export function ThemeProvider({ children }) {
  const [tema, setTema] = useState(() => load("tema", TEMA_PADRAO))
  // o seletor fica aqui para poder ser aberto de qualquer tela (Início, Perfil)
  const [seletorAberto, setSeletorAberto] = useState(false)

  useEffect(() => {
    aplicarTema(tema)
    save("tema", tema)

    if (tema !== "auto") return
    // no automático, acompanha se o sistema mudar com o app aberto
    const media = window.matchMedia("(prefers-color-scheme: dark)")
    const onChange = () => aplicarTema("auto")
    media.addEventListener("change", onChange)
    return () => media.removeEventListener("change", onChange)
  }, [tema])

  const value = {
    tema,
    setTema,
    abrirSeletor: () => setSeletorAberto(true),
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
      <SeletorTema aberto={seletorAberto} onAbertoChange={setSeletorAberto} />
    </ThemeContext.Provider>
  )
}
