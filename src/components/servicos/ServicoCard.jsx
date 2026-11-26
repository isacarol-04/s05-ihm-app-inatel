import { Link } from "react-router-dom"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

// card de um serviço do campus (Armário, Secretaria): descrição, status e duas ações
export function ServicoCard({ icone: Icone, titulo, novo = false, descricao, status, acoes }) {
  return (
    <article className="flex flex-col rounded-3xl bg-card p-4 shadow-card md:p-5">
      <div className="flex items-start gap-3.5">
        <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-accent text-primary">
          <Icone className="size-6" />
        </span>
        <div className="min-w-0 pt-0.5">
          <h2 className="flex items-center gap-2 text-lg font-bold">
            {titulo}
            {novo && (
              <Badge variant="success" className="h-6 px-2.5">
                Novo
              </Badge>
            )}
          </h2>
          <p className="mt-0.5 text-[13px] leading-snug text-muted-foreground">{descricao}</p>
        </div>
      </div>

      {/* enquanto carrega, guarda o espaço do status para a tela não pular */}
      <div className="mt-4 flex-1">{status ?? <Skeleton className="h-11 rounded-xl" />}</div>

      <div className={cn("mt-3 grid gap-3", acoes.length > 1 && "grid-cols-2")}>
        {acoes.map((acao) => (
          <Button
            key={acao.label}
            size="xl"
            variant={acao.principal ? "default" : "soft"}
            nativeButton={false}
            render={<Link to={acao.para} />}
          >
            {acao.label}
          </Button>
        ))}
      </div>
    </article>
  )
}
