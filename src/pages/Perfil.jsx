import { useCallback, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Bell, CircleHelp, LogOut, Moon, User } from "lucide-react"
import { PageHeader } from "@/components/layout/PageHeader"
import { AjudaPainel } from "@/components/perfil/AjudaPainel"
import { DadosPessoaisPainel } from "@/components/perfil/DadosPessoaisPainel"
import { MenuItem, MenuLista } from "@/components/perfil/MenuLista"
import { NotificacoesPainel } from "@/components/perfil/NotificacoesPainel"
import { PerfilCard } from "@/components/perfil/PerfilCard"
import { SairDialog } from "@/components/perfil/SairDialog"
import { Skeleton } from "@/components/ui/skeleton"
import { useAsync } from "@/hooks/useAsync"
import { useTheme } from "@/hooks/useTheme"
import { TEMAS } from "@/lib/theme"
import { atualizarNotificacoes, getUsuario, restaurarDadosDeExemplo } from "@/services/usuarioService"

export default function Perfil() {
  const navigate = useNavigate()
  const { tema, abrirSeletor } = useTheme()
  const { data: usuarioCarregado } = useAsync(getUsuario)
  // cópia local para a tela atualizar na hora quando mudar as notificações
  const [usuarioEditado, setUsuarioEditado] = useState(null)
  const usuario = usuarioEditado ?? usuarioCarregado

  // qual painel está aberto: "dados", "notificacoes", "ajuda" ou "sair"
  const [painel, setPainel] = useState(null)
  const fechar = useCallback(() => setPainel(null), [])
  const controle = (nome) => ({
    aberto: painel === nome,
    onAbertoChange: (aberto) => (aberto ? setPainel(nome) : fechar()),
  })

  async function alterarNotificacoes(notificacoes) {
    setUsuarioEditado({ ...usuario, notificacoes })
    setUsuarioEditado(await atualizarNotificacoes(notificacoes))
  }

  function restaurar() {
    restaurarDadosDeExemplo()
    // recarrega para todas as telas lerem os dados de exemplo de novo
    window.location.assign("/")
  }

  const notificacoesAtivas = usuario && Object.values(usuario.notificacoes).some(Boolean)
  const nomeTema = TEMAS.find((opcao) => opcao.id === tema)?.nome

  return (
    <>
      {/* tela de configurações: uma coluna só, centralizada e sem esticar no desktop */}
      <div className="mx-auto w-full max-w-2xl">
        <PageHeader titulo="Perfil" />

        <div className="mt-4 space-y-4">
          {usuario ? <PerfilCard usuario={usuario} /> : <Skeleton className="h-[218px] rounded-3xl md:h-32" />}

          <MenuLista>
            <MenuItem icone={User} label="Dados pessoais" onClick={() => setPainel("dados")} />
            <MenuItem
              icone={Bell}
              label="Notificações"
              valor={usuario && (notificacoesAtivas ? "Ativadas" : "Desativadas")}
              onClick={() => setPainel("notificacoes")}
            />
            <MenuItem icone={Moon} label="Aparência" valor={nomeTema} onClick={abrirSeletor} />
            <MenuItem icone={CircleHelp} label="Ajuda e suporte" onClick={() => setPainel("ajuda")} />
          </MenuLista>

          <MenuLista>
            <MenuItem icone={LogOut} label="Sair da conta" tom="danger" semSeta onClick={() => setPainel("sair")} />
          </MenuLista>
        </div>
      </div>

      {usuario && (
        <>
          <DadosPessoaisPainel usuario={usuario} {...controle("dados")} />
          <NotificacoesPainel
            notificacoes={usuario.notificacoes}
            onAlterar={alterarNotificacoes}
            {...controle("notificacoes")}
          />
        </>
      )}
      <AjudaPainel onRestaurar={restaurar} {...controle("ajuda")} />
      <SairDialog {...controle("sair")} onConfirmar={() => navigate("/saiu", { replace: true })} />
    </>
  )
}
