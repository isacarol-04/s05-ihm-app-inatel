import { useRef, useState } from "react"
import { Receipt, TriangleAlert } from "lucide-react"
import { RodapeAcoes } from "@/components/layout/RodapeAcoes"
import { InfoBox } from "@/components/shared/InfoBox"
import { ListaDetalhes } from "@/components/shared/ListaDetalhes"
import { RotuloSecao } from "@/components/shared/RotuloSecao"
import { Button } from "@/components/ui/button"
import { RadioGroup } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatarMoeda } from "@/lib/format"
import { FINALIDADES } from "@/services/secretariaService"
import { AnexoOpcional } from "./AnexoOpcional"
import { DocumentoEscolhido } from "./DocumentoEscolhido"
import { Etapas } from "./Etapas"
import { OpcaoEntrega } from "./OpcaoEntrega"

// etapa 2 do novo pedido: dados já preenchidos, finalidade, entrega e anexo
export function ConferirPedido({ tipo, usuario, formulario, onFormularioChange, onTrocar, onEnviar, enviando, erro }) {
  const [faltaFinalidade, setFaltaFinalidade] = useState(false)
  const finalidadeRef = useRef(null)

  const { finalidade, entrega, anexo } = formulario
  const alterar = (campo, valor) => onFormularioChange({ ...formulario, [campo]: valor })
  const aceitaImpresso = tipo.formatos.includes("impresso")

  function enviar() {
    // finalidade é obrigatória: avisa e leva o foco até o campo
    if (!finalidade) {
      setFaltaFinalidade(true)
      finalidadeRef.current?.focus()
      return
    }
    onEnviar()
  }

  return (
    <>
      <Etapas atual={2} total={2} titulo="Confira e envie" />

      <DocumentoEscolhido tipo={tipo} onTrocar={onTrocar} />

      {tipo.taxa > 0 && (
        <InfoBox icone={Receipt} tom="warning" className="mt-3">
          Este documento tem taxa de {formatarMoeda(tipo.taxa)}, cobrada no próximo boleto.
        </InfoBox>
      )}

      <RotuloSecao>Seus dados · preenchidos automaticamente</RotuloSecao>
      <ListaDetalhes
        itens={[
          { rotulo: "Nome", valor: usuario.nome },
          { rotulo: "Matrícula", valor: usuario.matricula },
          { rotulo: "Curso", valor: `${usuario.cursoAbreviado} · ${usuario.periodo}º período` },
        ]}
      />

      <RotuloSecao id="rotulo-finalidade">Finalidade</RotuloSecao>
      <Select
        value={finalidade}
        onValueChange={(valor) => {
          setFaltaFinalidade(false)
          alterar("finalidade", valor)
        }}
      >
        <SelectTrigger
          ref={finalidadeRef}
          size="lg"
          aria-labelledby="rotulo-finalidade"
          aria-invalid={faltaFinalidade || undefined}
          aria-describedby={faltaFinalidade ? "erro-finalidade" : undefined}
          className="aria-invalid:ring-2 aria-invalid:ring-destructive"
        >
          <SelectValue placeholder="Para que você precisa?" />
        </SelectTrigger>
        <SelectContent alignItemWithTrigger={false}>
          {FINALIDADES.map((opcao) => (
            <SelectItem key={opcao} value={opcao}>
              {opcao}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {faltaFinalidade && (
        <p id="erro-finalidade" className="mt-1.5 text-xs font-medium text-destructive">
          Escolha a finalidade para continuar.
        </p>
      )}

      <RotuloSecao id="rotulo-entrega">Forma de entrega</RotuloSecao>
      <RadioGroup
        aria-labelledby="rotulo-entrega"
        value={entrega}
        onValueChange={(valor) => alterar("entrega", valor)}
        className="grid-cols-2 gap-3"
      >
        <OpcaoEntrega valor="pdf" titulo="PDF no app" descricao="Mais rápido" selecionado={entrega === "pdf"} />
        <OpcaoEntrega
          valor="impresso"
          titulo="Impresso"
          descricao={aceitaImpresso ? "Retirar no balcão" : "Só em PDF"}
          selecionado={entrega === "impresso"}
          desabilitado={!aceitaImpresso}
        />
      </RadioGroup>

      <AnexoOpcional anexo={anexo} onAnexoChange={(valor) => alterar("anexo", valor)} />

      {erro && (
        <InfoBox icone={TriangleAlert} tom="danger" className="mt-3" role="alert">
          {erro}
        </InfoBox>
      )}

      <RodapeAcoes legenda="Você acompanha tudo em Meus pedidos.">
        <Button size="xl" className="w-full" disabled={enviando} onClick={enviar}>
          {enviando ? "Enviando..." : "Enviar pedido"}
        </Button>
      </RodapeAcoes>
    </>
  )
}
