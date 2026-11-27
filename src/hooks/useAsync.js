import { useCallback, useEffect, useState } from "react"

// Chama uma função assíncrona (os services) e guarda o resultado,
// o carregamento e o erro. A função precisa ser estável (definida fora
// do componente ou com useCallback), senão a busca roda em todo render.
// "recarregar" busca de novo (ex.: depois de devolver um armário).
// "observar" é opcional: inscreve a busca em atualizações do service.
export function useAsync(funcao, observar) {
  const [estado, setEstado] = useState({ data: null, loading: true, error: null })
  const [versao, setVersao] = useState(0)

  useEffect(() => {
    let ativo = true

    funcao()
      .then((data) => ativo && setEstado({ data, loading: false, error: null }))
      .catch((error) => ativo && setEstado({ data: null, loading: false, error }))

    return () => {
      ativo = false
    }
  }, [funcao, versao])

  const recarregar = useCallback(() => setVersao((v) => v + 1), [])
  const atualizar = useCallback((data) => setEstado({ data, loading: false, error: null }), [])

  useEffect(() => observar?.(recarregar), [observar, recarregar])

  return { ...estado, recarregar, atualizar }
}
