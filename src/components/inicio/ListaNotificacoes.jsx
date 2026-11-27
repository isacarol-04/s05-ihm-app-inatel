import { useState } from "react"
import { Bell, CheckCheck, Trash2 } from "lucide-react"
import { ConfirmarDialog } from "@/components/shared/ConfirmarDialog"
import { IconCircle } from "@/components/shared/IconCircle"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { apagarNotificacao, apagarNotificacoesLidas, marcarComoLida, marcarTodasComoLidas } from "@/services/notificacoesService"
import { AvisoCard } from "./AvisoCard"

export function ListaNotificacoes({ notificacoes, loading, compacta = false, onSelecionar }) {
  const [aba, setAba] = useState("naolidas")
  const [confirmando, setConfirmando] = useState(false)
  const naoLidas = notificacoes.filter((item) => !item.lida)
  const lidas = notificacoes.filter((item) => item.lida)

  function conteudo(itens, lidas) {
    if (loading) {
      return <div className="space-y-3"><Skeleton className="h-28 rounded-2xl" /><Skeleton className="h-28 rounded-2xl" /></div>
    }

    if (itens.length === 0) {
      return (
        <div className="flex flex-col items-center px-4 py-8 text-center">
          <IconCircle tamanho="lg"><Bell /></IconCircle>
          <p className="mt-4 font-semibold">{lidas ? "Nenhuma notificação lida" : "Nenhuma notificação não lida"}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {lidas ? "As notificações que você abrir ficam aqui." : "Você está em dia. Novas atualizações aparecem aqui."}
          </p>
        </div>
      )
    }

    return (
      <ul className="space-y-3">
        {itens.map((notificacao) => (
          <li key={notificacao.id} className={cn("flex items-start rounded-2xl bg-card ring-1 ring-border", !notificacao.lida && "bg-accent/40 ring-primary/20")}>
            <AvisoCard
              aviso={notificacao}
              data={notificacao.data}
              naoLida={!notificacao.lida}
              className="min-w-0 flex-1 bg-transparent pr-2 shadow-none"
              onClick={() => {
                marcarComoLida(notificacao.id)
                onSelecionar?.()
              }}
            />
            <Button
              variant="ghost"
              size="icon-sm"
              className="mt-3 mr-2 shrink-0 text-muted-foreground hover:bg-destructive-soft hover:text-destructive"
              aria-label={`Apagar notificação: ${notificacao.titulo}, pedido #${notificacao.protocolo}`}
              onClick={() => apagarNotificacao(notificacao.id)}
            >
              <Trash2 className="size-4" />
            </Button>
          </li>
        ))}
      </ul>
    )
  }

  return (
    <>
      <Tabs value={aba} onValueChange={setAba} className="min-h-0 flex-1 gap-3">
        <TabsList className="h-11 w-full shrink-0 rounded-xl bg-secondary p-1">
          <TabsTrigger value="naolidas" className="h-full rounded-lg text-sm font-semibold data-active:bg-card">
            Não lidas ({naoLidas.length})
          </TabsTrigger>
          <TabsTrigger value="lidas" className="h-full rounded-lg text-sm font-semibold data-active:bg-card">
            Lidas ({lidas.length})
          </TabsTrigger>
        </TabsList>

        {aba === "naolidas" ? (
          <Button variant="soft" className="w-full shrink-0" disabled={naoLidas.length === 0} onClick={marcarTodasComoLidas}>
            <CheckCheck className="size-4" /> Marcar todas como lidas
          </Button>
        ) : (
          <Button variant="soft" className="w-full shrink-0 text-destructive" disabled={lidas.length === 0} onClick={() => setConfirmando(true)}>
            <Trash2 className="size-4" /> Apagar lidas
          </Button>
        )}

        <TabsContent value="naolidas" className={cn("-mx-1 min-h-0 px-1 py-1", compacta && "max-h-[50dvh] overflow-y-auto")}>
          {conteudo(naoLidas, false)}
        </TabsContent>
        <TabsContent value="lidas" className={cn("-mx-1 min-h-0 px-1 py-1", compacta && "max-h-[50dvh] overflow-y-auto")}>
          {conteudo(lidas, true)}
        </TabsContent>
      </Tabs>

      <ConfirmarDialog
        aberto={confirmando}
        onAbertoChange={setConfirmando}
        icone={Trash2}
        titulo="Apagar notificações lidas?"
        descricao="As notificações lidas serão apagadas. Seus pedidos continuam disponíveis na Secretaria."
        textoCancelar="Manter"
        textoConfirmar="Sim, apagar"
        onConfirmar={apagarNotificacoesLidas}
      />
    </>
  )
}
