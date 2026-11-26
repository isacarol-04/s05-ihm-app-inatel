import { Route, Routes } from "react-router-dom"
import { AppShell } from "@/components/layout/AppShell"
import Inicio from "@/pages/Inicio"
import Aulas from "@/pages/Aulas"
import Servicos from "@/pages/Servicos"
import Perfil from "@/pages/Perfil"
import EmConstrucao from "@/pages/EmConstrucao"
import Saiu from "@/pages/Saiu"
import ReservarArmario from "@/pages/ReservarArmario"
import ArmarioReserva from "@/pages/ArmarioReserva"
import MeusPedidos from "@/pages/MeusPedidos"

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
      {/* telas internas: cabeçalho com voltar e sem a barra de baixo */}
      <Route element={<AppShell semTabBar />}>
        <Route path="servicos/armario" element={<ReservarArmario />} />
        <Route path="servicos/armario/reserva" element={<ArmarioReserva />} />
        <Route path="secretaria" element={<MeusPedidos />} />
      </Route>
      <Route path="saiu" element={<Saiu />} />
    </Routes>
  )
}

export default App
