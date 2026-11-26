import { useRef, useState } from "react"

const DISTANCIA_PARA_FECHAR = 110 // px
const VELOCIDADE_PARA_FECHAR = 0.8 // px por ms (um "peteleco" rápido também fecha)

// Deixa o sheet ser arrastado para baixo pela alcinha/título.
// Se passar do limite (ou for rápido), fecha; senão volta para o lugar.
export function useArrastarParaFechar(onFechar) {
  const [deslocamento, setDeslocamento] = useState(0)
  const [arrastando, setArrastando] = useState(false)
  const inicio = useRef(null)

  function onPointerDown(e) {
    // só o botão principal do mouse ou o dedo
    if (e.button !== 0) return
    inicio.current = { y: e.clientY, ultimoY: e.clientY, tempo: performance.now() }
    setArrastando(true)
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  function onPointerMove(e) {
    if (!inicio.current) return
    inicio.current.ultimoY = e.clientY
    // para cima não sai do lugar, só para baixo
    setDeslocamento(Math.max(0, e.clientY - inicio.current.y))
  }

  function onPointerUp() {
    if (!inicio.current) return
    // usa a última posição do movimento: no "cancel" o navegador manda clientY = 0
    const distancia = Math.max(0, inicio.current.ultimoY - inicio.current.y)
    const velocidade = distancia / (performance.now() - inicio.current.tempo)
    inicio.current = null
    setArrastando(false)

    if (distancia > DISTANCIA_PARA_FECHAR || (distancia > 50 && velocidade > VELOCIDADE_PARA_FECHAR)) {
      onFechar()
    } else {
      setDeslocamento(0)
    }
  }

  return {
    // vai na área que pode ser arrastada
    alcaProps: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel: onPointerUp,
      style: { touchAction: "none" },
    },
    // vai no próprio sheet
    estilo: {
      transform: deslocamento ? `translateY(${deslocamento}px)` : undefined,
      transition: arrastando ? "none" : undefined,
    },
    // chamar quando o sheet abrir de novo, para começar do zero
    resetar: () => setDeslocamento(0),
  }
}
