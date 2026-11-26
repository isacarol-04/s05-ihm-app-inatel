import { Link } from "react-router-dom"
import { Construction } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function EmConstrucao({ titulo = "Em construção" }) {
  return (
    <section className="flex flex-col items-center gap-3 py-24 text-center">
      <span className="flex size-14 items-center justify-center rounded-full bg-accent text-primary">
        <Construction className="size-7" />
      </span>
      <h1 className="text-xl font-bold">{titulo}</h1>
      <p className="max-w-xs text-sm text-muted-foreground">
        Essa tela ainda está sendo feita. Volte mais tarde!
      </p>
      <Button variant="soft" size="xl" className="mt-2" nativeButton={false} render={<Link to="/" />}>
        Voltar ao início
      </Button>
    </section>
  )
}
