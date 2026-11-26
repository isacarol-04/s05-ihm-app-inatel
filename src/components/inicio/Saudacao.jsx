import { formatarDataExtenso } from "@/lib/format"

export function Saudacao({ nome, data }) {
  return (
    <div>
      <p className="text-[13px] text-muted-foreground">{formatarDataExtenso(data)}</p>
      <h1 className="mt-0.5 text-[26px] leading-tight font-bold tracking-tight md:text-3xl">
        Olá, {nome}
      </h1>
    </div>
  )
}
