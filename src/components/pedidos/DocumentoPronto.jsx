import { useState } from "react"
import { FileText, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"

// protótipo: todo documento pronto baixa o mesmo PDF de exemplo (fica em public/)
const PDF_EXEMPLO = `${import.meta.env.BASE_URL}documento-exemplo.pdf`

// "folha" desenhada só com blocos, imitando a primeira página do PDF
function PreviaFolha() {
  return (
    <div aria-hidden className="mx-auto flex aspect-[3/4] w-40 flex-col gap-2.5 rounded-md bg-white p-4 shadow-md">
      <span className="h-2.5 w-16 rounded-full bg-primary" />
      <span className="mt-2 h-1.5 w-full rounded-full bg-slate-200" />
      <span className="h-1.5 w-5/6 rounded-full bg-slate-200" />
      <span className="h-1.5 w-full rounded-full bg-slate-200" />
      <span className="h-1.5 w-2/3 rounded-full bg-slate-200" />
      <span className="mt-2 h-1.5 w-full rounded-full bg-slate-200" />
      <span className="h-1.5 w-4/5 rounded-full bg-slate-200" />
      <span className="h-1.5 w-3/5 rounded-full bg-slate-200" />
      <span className="mt-auto ml-auto h-1 w-3/5 rounded-full bg-slate-400" />
    </div>
  )
}

// documento pronto em PDF: prévia, selo de assinatura e as ações de baixar/compartilhar
export function DocumentoPronto({ pedido }) {
  const { documento } = pedido
  const [aviso, setAviso] = useState(null)

  // celular: abre o compartilhar do sistema com o PDF; sem suporte, copia o código de validação
  async function compartilhar() {
    const titulo = `${pedido.tipo.nome} – Inatel`
    try {
      const resposta = await fetch(PDF_EXEMPLO)
      const arquivo = new File([await resposta.blob()], documento.arquivo, { type: "application/pdf" })
      if (navigator.canShare?.({ files: [arquivo] })) {
        await navigator.share({ files: [arquivo], title: titulo })
        return
      }
      if (navigator.share) {
        await navigator.share({ title: titulo, text: `${titulo}. Código de validação: ${documento.codigoValidacao}` })
        return
      }
      await navigator.clipboard.writeText(`${titulo}. Código de validação: ${documento.codigoValidacao}`)
      setAviso("Código de validação copiado. É só colar onde quiser enviar.")
    } catch (erro) {
      // fechar o compartilhar do sistema não é erro
      if (erro.name !== "AbortError") setAviso("Não deu para compartilhar agora. Tente baixar o PDF.")
    }
  }

  return (
    <>
      <div className="rounded-3xl bg-secondary px-4 pt-5 pb-4">
        <PreviaFolha />
        <p className="mt-4 flex items-center justify-center gap-1.5 text-[13px] text-muted-foreground">
          <FileText className="size-4 shrink-0" />
          <span className="truncate">
            {documento.arquivo} · {documento.tamanhoKb} KB
          </span>
        </p>
      </div>

      <div className="mt-3 flex items-center gap-3 rounded-2xl bg-success-soft px-4 py-3">
        <ShieldCheck className="size-6 shrink-0 text-success" />
        <div>
          <p className="text-sm font-bold">Assinado digitalmente</p>
          <p className="text-xs text-muted-foreground">Código de validação: {documento.codigoValidacao}</p>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2.5">
        {/* link de download comum: o navegador baixa o arquivo com o nome do documento */}
        <Button
          size="xl"
          className="w-full"
          nativeButton={false}
          render={<a href={PDF_EXEMPLO} download={documento.arquivo} />}
          onClick={() => setAviso("Download iniciado.")}
        >
          Baixar PDF
        </Button>
        <Button size="xl" variant="soft" className="w-full" onClick={compartilhar}>
          Compartilhar
        </Button>
      </div>

      <p aria-live="polite" className="mt-2 text-center text-xs text-muted-foreground empty:mt-0">
        {aviso}
      </p>
    </>
  )
}
