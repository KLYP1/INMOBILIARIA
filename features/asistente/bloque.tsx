import type { ReactNode } from "react";
import { Tarjeta, TituloTarjeta } from "@/components/ui/tarjeta";

export function Bloque({
  titulo,
  descripcion,
  children,
}: {
  titulo: string;
  descripcion: string;
  children: ReactNode;
}) {
  return (
    <Tarjeta className="p-5">
      <TituloTarjeta>{titulo}</TituloTarjeta>
      <p className="mt-1 text-[12px] text-tenue">{descripcion}</p>
      <div className="mt-5">{children}</div>
    </Tarjeta>
  );
}
