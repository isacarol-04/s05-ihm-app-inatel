import { NavLink } from "react-router-dom"
import { cn } from "@/lib/utils"
import { navItems } from "./navItems"

export function TabBar() {
  return (
    <nav
      aria-label="Navegação principal"
      className="fixed inset-x-0 bottom-0 z-40 border-t bg-card pb-safe lg:hidden"
    >
      <ul className="mx-auto grid max-w-xl grid-cols-4 md:max-w-3xl">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  "group flex flex-col items-center gap-1 pt-2.5 pb-2 text-[11px] font-medium text-muted-foreground transition-colors outline-none focus-visible:text-foreground",
                  isActive && "font-semibold text-primary"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={cn(
                      "flex h-8 w-14 items-center justify-center rounded-full transition-colors group-focus-visible:ring-2 group-focus-visible:ring-ring",
                      isActive && "bg-accent"
                    )}
                  >
                    <Icon className="size-[22px]" strokeWidth={isActive ? 2.2 : 1.8} />
                  </span>
                  {label}
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
