import { Skeleton } from "@/components/ui/skeleton"

// placeholder enquanto os dados da tela inicial carregam
export function InicioSkeleton() {
  return (
    <div aria-busy="true" aria-label="Carregando" className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-8 w-56" />
      </div>
      <div className="flex gap-3">
        <Skeleton className="h-[76px] w-[262px] rounded-2xl" />
        <Skeleton className="hidden h-[76px] flex-1 rounded-2xl md:block" />
      </div>
      <Skeleton className="h-[168px] rounded-3xl" />
    </div>
  )
}
