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
        <AlertDialogFooter>
          <AlertDialogCancel size="xl" className="sm:flex-1">
            {textoCancelar}
          </AlertDialogCancel>
          <AlertDialogAction
            size="xl"
            className="bg-destructive text-white hover:bg-destructive/90 sm:flex-1"
            onClick={onConfirmar}
          >
            {textoConfirmar}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
