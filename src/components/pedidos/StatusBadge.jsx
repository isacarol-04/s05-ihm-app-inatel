import { Badge } from "@/components/ui/badge"
import { STATUS_VISUAL } from "./statusPedido"

export function StatusBadge({ status, className }) {
  const { rotulo, tom, icone: Icone } = STATUS_VISUAL[status]
  return (
    <Badge variant={tom} size="lg" className={className}>
      <Icone /> {rotulo}
    </Badge>
  )
}
