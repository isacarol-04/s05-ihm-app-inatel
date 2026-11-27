import { useState } from "react"
import { Link } from "react-router-dom"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverDescription, PopoverTitle, PopoverTrigger } from "@/components/ui/popover"
import { useMediaQuery } from "@/hooks/useMediaQuery"
import { useNotificacoes } from "@/hooks/useNotificacoes"
import { ListaNotificacoes } from "./ListaNotificacoes"

export function CentralNotificacoes() {
  const desktop = useMediaQuery("(min-width: 1024px)")
  const { notificacoes, loading } = useNotificacoes()
  const [aberto, setAberto] = useState(false)
  const naoLidas = notificacoes.filter((item) => !item.lida).length

  const icone = (
    <>
      <Bell />
      {naoLidas > 0 && <span aria-hidden="true" className="absolute top-2.5 right-3 size-2 rounded-full bg-destructive ring-2 ring-card" />}
    </>
  )
  const rotulo = naoLidas > 0 ? "Notificações, há atualizações não lidas" : "Notificações"

  if (!desktop) {
    return (
      <Button variant="surface" size="icon-xl" className="relative" aria-label={rotulo} nativeButton={false} render={<Link to="/notificacoes" />}>
        {icone}
      </Button>
    )
  }

  return (
    <Popover open={aberto} onOpenChange={setAberto}>
      <PopoverTrigger render={<Button variant="surface" size="icon-xl" className="relative" aria-label={rotulo} />}>
        {icone}
      </PopoverTrigger>
      <PopoverContent>
        <div className="shrink-0">
          <PopoverTitle className="text-xl font-bold tracking-tight">Notificações</PopoverTitle>
          <PopoverDescription className="mt-1 text-sm text-muted-foreground">
            {naoLidas > 0 ? `${naoLidas} ${naoLidas === 1 ? "atualização não lida" : "atualizações não lidas"}.` : "Você está em dia com seus pedidos."}
          </PopoverDescription>
        </div>
        <ListaNotificacoes notificacoes={notificacoes} loading={loading} compacta onSelecionar={() => setAberto(false)} />
      </PopoverContent>
    </Popover>
  )
}
