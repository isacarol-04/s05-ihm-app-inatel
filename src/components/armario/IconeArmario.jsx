// desenho de uma porta (padrão) ou duas portas (duplo) de armário
export function IconeArmario({ duplo = false, className }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden className={className}>
      {duplo ? (
        <>
          <rect x="6" y="7" width="16" height="34" rx="3" />
          <rect x="26" y="7" width="16" height="34" rx="3" />
          <path d="M18 21v6M30 21v6" />
        </>
      ) : (
        <>
          <rect x="13" y="7" width="22" height="34" rx="3" />
          <path d="M29 21v6" />
        </>
      )}
    </svg>
  )
}
