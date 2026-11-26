// miniatura de uma tela do app com as cores do tema
export function TemaPreview({ preview }) {
  const { fundo, barra, linha, bolinha, metadeEscura } = preview

  return (
    <div aria-hidden className="relative h-[88px] overflow-hidden rounded-xl tela-baixa:h-16 md:h-32" style={{ backgroundColor: fundo }}>
      {/* no automático, metade clara e metade escura */}
      {metadeEscura && <div className="absolute inset-y-0 right-0 w-1/2" style={{ backgroundColor: metadeEscura }} />}

      <div className="relative flex h-full flex-col gap-2 p-2.5 tela-baixa:gap-1.5 tela-baixa:p-2 md:gap-3 md:p-4">
        <span className="h-1.5 w-2/5 rounded-full" style={{ backgroundColor: barra }} />
        <span className="h-3.5 w-3/5 rounded-md tela-baixa:h-2.5 md:h-5" style={{ backgroundColor: linha }} />
        <span className="h-3.5 w-2/5 rounded-md tela-baixa:h-2.5 md:h-5" style={{ backgroundColor: linha }} />
      </div>
      <span className="absolute right-3 bottom-3 size-4 rounded-full tela-baixa:right-2.5 tela-baixa:bottom-2.5 tela-baixa:size-3.5 md:right-4 md:bottom-4 md:size-5" style={{ backgroundColor: bolinha }} />
    </div>
  )
}
