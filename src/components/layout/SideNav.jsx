import { NavLink } from "react-router-dom"
import { InatelLogo } from "@/components/brand/InatelLogo"
import { cn } from "@/lib/utils"
import { navItems } from "./navItems"

// no desktop a barra inferior vira essa barra lateral
export function SideNav() {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r bg-sidebar px-4 py-8 lg:flex">
      <NavLink to="/" className="mb-10 px-3" aria-label="Ir para o início">
        <InatelLogo className="h-8" />
      </NavLink>

      <nav aria-label="Navegação principal">
        <ul className="flex flex-col gap-1">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                className={({ isActive }) =>
                  cn(
                    "flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                    isActive && "bg-accent font-semibold text-accent-foreground hover:bg-accent hover:text-accent-foreground"
                  )
                }
              >
                <Icon className="size-5" />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <p className="mt-auto px-3 text-xs text-subtle">App Inatel · S05 IHM</p>
    </aside>
  )
}
