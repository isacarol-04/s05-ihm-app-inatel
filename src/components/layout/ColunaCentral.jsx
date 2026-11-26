import { cn } from "@/lib/utils"

// Coluna das telas de tarefa (armário, pedidos, novo pedido, perfil): no computador
// todas têm a mesma largura e ficam centralizadas, com título, conteúdo e botões juntos.
export function ColunaCentral({ children, className }) {
  return <div className={cn("mx-auto w-full max-w-[45rem]", className)}>{children}</div>
}
