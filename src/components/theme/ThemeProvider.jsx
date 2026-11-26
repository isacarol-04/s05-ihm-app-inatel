import { useEffect, useState } from "react"
import { ThemeContext, TEMA_PADRAO, aplicarTema } from "@/lib/theme"
import { load, save } from "@/services/storage"

export function ThemeProvider({ children }) {
  const [tema, setTema] = useState(() => load("tema", TEMA_PADRAO))

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

  return (
    <ThemeContext.Provider value={{ tema, setTema }}>
      {children}
    </ThemeContext.Provider>
  )
}
