import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

// círculo verde com check que "aparece" nas telas de confirmação
export function IconeSucesso({ className }) {
  return (
    <span
      className={cn(
        "flex size-20 items-center justify-center rounded-full bg-success-soft text-success animate-in zoom-in-50 fade-in duration-500 [&>svg]:size-10",
        className
      )}
    >
      <Check strokeWidth={2.5} />
    </span>
  )
}
