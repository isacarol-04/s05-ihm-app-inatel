import { BookOpen, House, LayoutGrid, User } from "lucide-react"

// abas principais do app (barra inferior no celular, lateral no desktop)
export const navItems = [
  { to: "/", label: "Início", icon: House, end: true },
  { to: "/aulas", label: "Aulas", icon: BookOpen },
  { to: "/servicos", label: "Serviços", icon: LayoutGrid },
  { to: "/perfil", label: "Perfil", icon: User },
]
