import { Badge } from "@/components/ui/badge"
import { STATUS_VISUAL } from "./statusPedido"

// "compacto": só o texto, menor (cabeçalho do pedido, onde o espaço é curto)
export function StatusBadge({ status, compacto = false, className }) {
  const { rotulo, tom, icone: Icone } = STATUS_VISUAL[status]
  return (
    <Badge variant={tom} size={compacto ? "md" : "lg"} className={className}>
      {!compacto && <Icone />} {rotulo}
    </Badge>
  )
}
