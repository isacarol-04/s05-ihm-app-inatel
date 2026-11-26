import { useEffect, useState } from "react"

// Chama uma função assíncrona (os services) e guarda o resultado,
// o carregamento e o erro. A função precisa ser estável (definida fora
// do componente ou com useCallback), senão a busca roda em todo render.
export function useAsync(funcao) {
  const [estado, setEstado] = useState({ data: null, loading: true, error: null })

  useEffect(() => {
    let ativo = true

    funcao()
      .then((data) => ativo && setEstado({ data, loading: false, error: null }))
      .catch((error) => ativo && setEstado({ data: null, loading: false, error }))

    return () => {
      ativo = false
    }
  }, [funcao])

  return estado
}
