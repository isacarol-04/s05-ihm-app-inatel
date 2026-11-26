import { Outlet } from "react-router-dom"
import { SideNav } from "./SideNav"
import { TabBar } from "./TabBar"

export function AppShell() {
  return (
    <div className="min-h-dvh">
      <SideNav />

      <div className="lg:pl-64">
        <main className="mx-auto w-full max-w-xl px-5 pt-4 pb-28 md:max-w-3xl md:px-8 md:pt-6 lg:max-w-6xl lg:px-10 lg:pt-8 lg:pb-12">
          <Outlet />
        </main>
      </div>

      <TabBar />
    </div>
  )
}
