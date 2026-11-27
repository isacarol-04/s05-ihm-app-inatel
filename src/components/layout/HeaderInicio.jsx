import { Bell, Moon, Sun } from "lucide-react"
import { InatelLogo } from "@/components/brand/InatelLogo"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/hooks/useTheme"
import { CabecalhoFixo } from "./CabecalhoFixo"

export function HeaderInicio({ temNotificacao = false }) {
  const { tema, abrirSeletor } = useTheme()
  const IconeTema = tema === "dark" ? Sun : Moon

  return (
    <CabecalhoFixo>
      <header className="flex items-center justify-between gap-4 py-2">
        {/* no desktop o logo já aparece na barra lateral */}
        <InatelLogo className="h-7 lg:invisible" />

        <div className="flex items-center gap-2.5">
          <Button variant="surface" size="icon-xl" aria-label="Trocar tema" onClick={abrirSeletor}>
            <IconeTema />
          </Button>
          <Button variant="surface" size="icon-xl" aria-label="Notificações" className="relative">
            <Bell />
            {temNotificacao && (
              <span className="absolute top-2.5 right-3 size-2 rounded-full bg-destructive ring-2 ring-card" />
            )}
          </Button>
        </div>
      </header>
    </CabecalhoFixo>
  )
}
