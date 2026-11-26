import { Link } from "react-router-dom"
import { InatelLogo } from "@/components/brand/InatelLogo"
import { Button } from "@/components/ui/button"

// tela simples depois de sair (o login de verdade não faz parte do protótipo)
export default function Saiu() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-6 px-6 text-center">
      <InatelLogo className="h-10" />
      <div>
        <h1 className="text-2xl font-bold">Você saiu da conta</h1>
        <p className="mt-1 text-sm text-muted-foreground">Até a próxima! Seus pedidos continuam salvos.</p>
      </div>
      <Button size="xl" className="w-full max-w-xs" nativeButton={false} render={<Link to="/" replace />}>
        Entrar novamente
      </Button>
    </main>
  )
}
