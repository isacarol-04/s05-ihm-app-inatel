import { Outlet } from "react-router-dom"
import { cn } from "@/lib/utils"
import { SideNav } from "./SideNav"
import { TabBar } from "./TabBar"

// semTabBar: telas internas (reservar armário, pedidos...) não mostram a barra de baixo,
// porque elas têm o próprio botão de ação fixo no rodapé
export function AppShell({ semTabBar = false }) {
  return (
    <div className="min-h-dvh">
      <SideNav />

      <div className="lg:pl-64">
        <main
          className={cn(
            "mx-auto w-full max-w-xl px-5 pt-4 md:max-w-3xl md:px-8 md:pt-6 lg:max-w-6xl lg:px-10 lg:pt-8 lg:pb-12",
            semTabBar ? "pb-36" : "pb-28"
          )}
        >
          <Outlet />
        </main>
      </div>

      {!semTabBar && <TabBar />}
    </div>
  )
}
