import { Button } from "@/components/ui/button"
import { IconeDocumento } from "./IconeDocumento"
import { resumoDocumento } from "./documento"

// resumo do documento na etapa 2, com o atalho para voltar e trocar
export function DocumentoEscolhido({ tipo, onTrocar }) {
  return (
    <div className="mt-4 flex items-center gap-3.5 rounded-3xl border-2 border-primary bg-card p-4 shadow-card">
      <IconeDocumento />
      <div className="min-w-0 flex-1">
        <h3 className="text-base leading-snug font-bold">{tipo.nome}</h3>
        <p className="mt-0.5 text-[13px] text-muted-foreground">{resumoDocumento(tipo)}</p>
      </div>
      <Button
        variant="ghost"
        className="h-10 px-3 text-[15px] font-bold text-primary hover:bg-accent hover:text-primary"
        onClick={onTrocar}
      >
        Trocar
      </Button>
    </div>
  )
}
