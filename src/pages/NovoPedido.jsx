import { useEffect, useState } from "react"
import { useLocation, useNavigate, useSearchParams } from "react-router-dom"
import { HeaderInterno } from "@/components/layout/HeaderInterno"
import { ConferirPedido } from "@/components/pedidos/ConferirPedido"
import { EscolherDocumento } from "@/components/pedidos/EscolherDocumento"
import { criarSolicitacao, getTipo } from "@/services/secretariaService"
import { lerUsuario } from "@/services/usuarioService"

const FORMULARIO_INICIAL = { finalidade: null, entrega: "pdf", anexo: null }

// Novo pedido em 2 etapas. A etapa fica na URL (?tipo=...), então o "voltar"
// do navegador e o do cabeçalho levam da etapa 2 para a 1 sem perder o que foi preenchido.
export default function NovoPedido() {
  const navigate = useNavigate()
  const location = useLocation()
  const [params, setParams] = useSearchParams()
  const tipoId = params.get("tipo")
  const tipo = tipoId ? getTipo(tipoId) : null

  const [usuario] = useState(() => lerUsuario())
  const [busca, setBusca] = useState("")
  // último documento escolhido: fica marcado na lista quando a pessoa volta para trocar
  const [escolhido, setEscolhido] = useState(null)
  const [formulario, setFormulario] = useState(FORMULARIO_INICIAL)
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState(null)

  // cada etapa começa do topo
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [tipoId])

  // se trocar para um documento que só sai em PDF, a entrega volta para PDF
  const entrega = tipo?.formatos.includes(formulario.entrega) ? formulario.entrega : "pdf"

  function trocar() {
    if (location.state?.daLista) navigate(-1)
    else setParams({}, { replace: true })
  }

  async function enviar() {
    setErro(null)
    setEnviando(true)
    try {
      const pedido = await criarSolicitacao({
        tipoId: tipo.id,
        finalidade: formulario.finalidade,
        formaEntrega: entrega,
        anexo: formulario.anexo,
      })
      // replace: voltando da confirmação a pessoa não cai no formulário já enviado
      navigate(`/secretaria/pedidos/${pedido.protocolo}/enviado`, { replace: true })
    } catch (e) {
      setErro(e.message)
      setEnviando(false)
    }
  }

  return (
    <>
      <HeaderInterno titulo="Novo pedido" voltarPara={tipo ? "/secretaria/novo" : "/secretaria"} />

      {tipo ? (
        <ConferirPedido
          tipo={tipo}
          usuario={usuario}
          formulario={{ ...formulario, entrega }}
          onFormularioChange={setFormulario}
          onTrocar={trocar}
          onEnviar={enviar}
          enviando={enviando}
          erro={erro}
        />
      ) : (
        <EscolherDocumento busca={busca} onBuscaChange={setBusca} escolhido={escolhido} onEscolher={setEscolhido} />
      )}
    </>
  )
}
