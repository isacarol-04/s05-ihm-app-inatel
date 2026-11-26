import { LogOut } from "lucide-react"
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

// confirmação antes de sair (ação que tira a pessoa do app)
export function SairDialog({ aberto, onAbertoChange, onConfirmar }) {
  return (
    <AlertDialog open={aberto} onOpenChange={onAbertoChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive-soft text-destructive">
            <LogOut />
          </AlertDialogMedia>
          <AlertDialogTitle>Sair da conta?</AlertDialogTitle>
          <AlertDialogDescription>
            Você vai precisar entrar de novo com sua matrícula para usar o app.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel size="xl" className="sm:flex-1">
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction size="xl" variant="destructive" className="bg-destructive text-white hover:bg-destructive/90 sm:flex-1" onClick={onConfirmar}>
            Sair
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
