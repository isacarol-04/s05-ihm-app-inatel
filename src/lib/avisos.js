// Mantém um único card de documentos prontos, inclusive quando a tela
// ainda recebe os avisos individuais de uma atualização anterior.
export function agruparDocumentosProntos(avisos) {
  const documentoPronto = (aviso) => aviso.categoria === "documento-pronto" ||
    aviso.id === "documentos-prontos" || aviso.id?.startsWith("pronta-")
  const prontos = avisos.filter(documentoPronto)
  if (prontos.length < 2) return avisos

  const quantidade = prontos.reduce((total, aviso) => total + (aviso.quantidade ?? 1), 0)
  const agrupado = {
    ...prontos[0],
    id: "documentos-prontos",
    categoria: "documento-pronto",
    quantidade,
    titulo: `${quantidade} documentos prontos`,
    descricao: "Toque para ver seus pedidos",
    para: "/secretaria",
  }
  const primeiro = avisos.indexOf(prontos[0])

  return avisos.flatMap((aviso, indice) => {
    if (!documentoPronto(aviso)) return [aviso]
    return indice === primeiro ? [agrupado] : []
  })
}
