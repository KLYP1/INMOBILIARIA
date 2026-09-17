import type { ReactNode } from "react";

type TarjetaProps = {
  children: ReactNode;
  className?: string;
  /** Reservada para el dato mas importante de la pantalla. Solo una por vista. */
  oscura?: boolean;
};

export function Tarjeta({ children, className = "", oscura }: TarjetaProps) {
  const base = oscura
    ? "bg-tinta text-tinta-texto"
    : "bg-superficie border border-borde";
  return (
    <section className={`rounded-[16px] ${base} ${className}`}>
      {children}
    </section>
  );
}

export function TituloTarjeta({
  children,
  accion,
  oscura,
}: {
  children: ReactNode;
  accion?: ReactNode;
  oscura?: boolean;
}) {
  return (
    <header className="flex items-center justify-between gap-3">
      <h2
        className={`text-[14px] font-medium ${oscura ? "text-tinta-texto" : "text-texto"}`}
      >
        {children}
      </h2>
      {accion}
    </header>
  );
}

export function Etiqueta({ children }: { children: ReactNode }) {
  return <span className="text-[11px] text-tenue">{children}</span>;
}
