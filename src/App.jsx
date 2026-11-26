import { Route, Routes } from "react-router-dom"
import { AppShell } from "@/components/layout/AppShell"
import Inicio from "@/pages/Inicio"
import Aulas from "@/pages/Aulas"
import Servicos from "@/pages/Servicos"
import Perfil from "@/pages/Perfil"
import EmConstrucao from "@/pages/EmConstrucao"
import Saiu from "@/pages/Saiu"

function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<Inicio />} />
        <Route path="aulas" element={<Aulas />} />
        <Route path="servicos" element={<Servicos />} />
        <Route path="perfil" element={<Perfil />} />
        <Route path="*" element={<EmConstrucao />} />
      </Route>
      <Route path="saiu" element={<Saiu />} />
    </Routes>
  )
}

export default App
