import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { marcarComoLida, observarNovasNotificacoes } from "@/services/notificacoesService"
import { observarSolicitacoes } from "@/services/secretariaService"
import { AvisoCard } from "./AvisoCard"

export function NotificacaoFlutuante() {
  const { pathname, key } = useLocation()
  if (pathname === "/saiu") return null
  return <AvisoTemporario key={key} pathname={pathname} />
}

function AvisoTemporario({ pathname }) {
  const [notificacao, setNotificacao] = useState(null)

  useEffect(() => {
    // Mantém o processamento ativo também em Aulas, Perfil e demais telas.
    const pararPedidos = observarSolicitacoes(() => {})
    const pararAvisos = observarNovasNotificacoes((novas) => {
      if (pathname === "/notificacoes") return
      const recebidas = novas.filter((item) => (
        pathname !== item.para &&
        pathname !== `${item.para}/enviado` &&
        !(item.status === "RECEBIDA" && pathname === "/secretaria/novo")
      ))
      // Se houve várias etapas durante uma ausência, destaca a mais recente.
      const ultima = recebidas.sort((a, b) => new Date(a.data) - new Date(b.data)).at(-1)
      if (ultima) setNotificacao(ultima)
    })
    return () => {
      pararPedidos()
      pararAvisos()
    }
  }, [pathname])

  useEffect(() => {
    if (!notificacao) return
    const tempo = setTimeout(() => setNotificacao(null), 7000)
    return () => clearTimeout(tempo)
  }, [notificacao])

  if (!notificacao) return null

  return (
    <div role="status" aria-live="polite" aria-atomic="true" className="pointer-events-none fixed inset-x-0 top-[calc(1rem+env(safe-area-inset-top))] z-[70] px-4">
      <div className="pointer-events-auto mx-auto flex w-full max-w-md animate-in items-start rounded-3xl bg-card shadow-lg ring-1 ring-border fade-in slide-in-from-top-2 motion-reduce:animate-none">
        <AvisoCard
          aviso={notificacao}
          data={notificacao.data}
          className="min-w-0 flex-1 rounded-3xl pr-2 shadow-none"
          onClick={() => {
            marcarComoLida(notificacao.id)
            setNotificacao(null)
          }}
        />
        <Button variant="ghost" size="icon-sm" className="mt-3 mr-2 shrink-0" aria-label="Fechar notificação" onClick={() => setNotificacao(null)}>
          <X className="size-4" />
        </Button>
      </div>
    </div>
  )
}
