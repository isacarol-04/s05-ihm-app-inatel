import { useEffect, useState } from "react"

// true/false conforme a media query, atualizando quando a tela muda de tamanho
export function useMediaQuery(query) {
  const [corresponde, setCorresponde] = useState(() => window.matchMedia(query).matches)

  useEffect(() => {
    const media = window.matchMedia(query)
    const onChange = () => setCorresponde(media.matches)
    onChange()
    media.addEventListener("change", onChange)
    return () => media.removeEventListener("change", onChange)
  }, [query])

  return corresponde
}
