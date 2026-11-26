import { useNavigate } from "react-router-dom"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

// cabeçalho das telas internas: botão de voltar redondo + título
// "voltarPara" é usado quando a pessoa chegou direto pela URL (sem histórico)
export function HeaderInterno({ titulo, voltarPara = "/", acao }) {
  const navigate = useNavigate()

  function voltar() {
    if (window.history.state?.idx > 0) navigate(-1)
    else navigate(voltarPara, { replace: true })
  }

  return (
    <header className="flex items-center gap-3.5 py-2">
      <Button variant="surface" size="icon-xl" aria-label="Voltar" onClick={voltar}>
        <ChevronLeft />
      </Button>
      <h1 className="flex-1 truncate text-lg font-bold">{titulo}</h1>
      {acao}
    </header>
  )
}
