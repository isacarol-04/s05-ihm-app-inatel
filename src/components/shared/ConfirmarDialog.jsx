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
}) {
  return (
    <AlertDialog open={aberto} onOpenChange={onAbertoChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          {Icone && (
            <AlertDialogMedia className="bg-destructive-soft text-destructive">
              <Icone />
            </AlertDialogMedia>
          )}
          <AlertDialogTitle>{titulo}</AlertDialogTitle>
          <AlertDialogDescription>{descricao}</AlertDialogDescription>
        </AlertDialogHeader>
        {/* botões lado a lado como no Figma: "manter" (seguro) à esquerda, ação destrutiva à direita */}
        <AlertDialogFooter className="flex-row gap-2.5">
          <AlertDialogCancel variant="soft" size="xl" className="min-w-0 flex-1 px-3">
            {textoCancelar}
          </AlertDialogCancel>
          <AlertDialogAction
            size="xl"
            className="min-w-0 flex-1 bg-destructive px-3 text-white hover:bg-destructive/90"
            onClick={onConfirmar}
          >
            {textoConfirmar}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
