import { LogOut } from "lucide-react"
import { ConfirmarDialog } from "@/components/shared/ConfirmarDialog"

// confirmação antes de sair (ação que tira a pessoa do app)
export function SairDialog({ aberto, onAbertoChange, onConfirmar }) {
  return (
    <ConfirmarDialog
      aberto={aberto}
      onAbertoChange={onAbertoChange}
      icone={LogOut}
      titulo="Sair da conta?"
      descricao="Você vai precisar entrar de novo com sua matrícula para usar o app."
      textoConfirmar="Sair"
      onConfirmar={onConfirmar}
    />
  )
}
