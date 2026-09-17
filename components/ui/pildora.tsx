import type { ReactNode } from "react";

type Tono = "neutro" | "tinta" | "ambar" | "exito" | "aviso" | "peligro" | "borde";

const TONOS: Record<Tono, string> = {
  neutro: "bg-elevado text-suave",
  tinta: "bg-tinta text-tinta-texto",
  ambar: "bg-ambar text-tinta",
  exito: "bg-exito-fondo text-exito",
  aviso: "bg-aviso-fondo text-aviso",
  peligro: "bg-peligro-fondo text-peligro",
  borde: "border border-borde text-suave",
};

export function Pildora({
  children,
  tono = "neutro",
  className = "",
}: {
  children: ReactNode;
  tono?: Tono;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] whitespace-nowrap ${TONOS[tono]} ${className}`}
    >
      {children}
    </span>
  );
}
