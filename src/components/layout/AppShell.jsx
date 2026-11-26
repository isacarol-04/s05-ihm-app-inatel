import { Outlet } from "react-router-dom"
import { cn } from "@/lib/utils"
import { SideNav } from "./SideNav"
import { TabBar } from "./TabBar"

// No computador todas as telas usam a mesma largura (56rem de conteúdo, centralizada),
// então título e conteúdo começam e terminam sempre no mesmo lugar ao trocar de tela.
// semTabBar: telas internas (reservar armário, pedidos...) não mostram a barra de baixo,
// porque elas têm o próprio botão de ação fixo no rodapé
export function AppShell({ semTabBar = false }) {
  return (
    <div className="min-h-dvh">
      <SideNav />

      <div className="lg:pl-64">
        <main
          className={cn(
            "mx-auto w-full max-w-xl px-5 pt-4 md:max-w-3xl md:px-8 md:pt-6 lg:max-w-[61rem] lg:px-10 lg:pt-8 lg:pb-12",
            // espaço embaixo só do tamanho do que fica fixo ali (rodapé da tela ou barra de abas), para não sobrar rolagem
            semTabBar ? "pb-[calc(var(--altura-rodape,0px)+1rem)]" : "pb-[calc(5.5rem+env(safe-area-inset-bottom))]"
          )}
        >
          <Outlet />
        </main>
      </div>

      {!semTabBar && <TabBar />}
    </div>
  )
}
