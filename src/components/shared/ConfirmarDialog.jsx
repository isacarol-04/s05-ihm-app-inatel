import { useState } from "react"
import { cn } from "@/lib/utils"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

// confirmação para ações que não dá para desfazer (sair, devolver armário, cancelar pedido)
export function ConfirmarDialog({
  aberto,
  onAbertoChange,
  icone: Icone,
  titulo,
  descricao,
  textoCancelar = "Cancelar",
  textoConfirmar,
  onConfirmar,
  tom = "danger",
}) {
  const [executando, setExecutando] = useState(false)

  // o botão de confirmar não fecha sozinho: espera a ação terminar (ex.: devolver o armário)
  // e só então fecha; enquanto isso os botões ficam travados para não clicar duas vezes
  async function confirmar() {
    setExecutando(true)
    try {
      await onConfirmar()
    } finally {
      setExecutando(false)
      onAbertoChange(false)
    }
  }

  return (
    <AlertDialog open={aberto} onOpenChange={(valor) => !executando && onAbertoChange(valor)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          {Icone && (
            <AlertDialogMedia className={tom === "primary" ? "bg-accent text-primary" : "bg-destructive-soft text-destructive"}>
              <Icone />
            </AlertDialogMedia>
          )}
          <AlertDialogTitle>{titulo}</AlertDialogTitle>
          <AlertDialogDescription>{descricao}</AlertDialogDescription>
        </AlertDialogHeader>
        {/* botões lado a lado como no Figma: "manter" (seguro) à esquerda, ação destrutiva à direita */}
        <AlertDialogFooter className="flex-row gap-2.5">
          <AlertDialogCancel variant="soft" size="xl" className="min-w-0 flex-1 px-3" disabled={executando}>
            {textoCancelar}
          </AlertDialogCancel>
          <AlertDialogAction
            size="xl"
            className={cn("min-w-0 flex-1 px-3", tom === "danger" && "bg-destructive text-white hover:bg-destructive/90")}
            disabled={executando}
            onClick={confirmar}
          >
            {executando ? "Aguarde..." : textoConfirmar}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
