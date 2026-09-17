import type { ReactNode, SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";

const CONTROL =
  "w-full rounded-[10px] border border-borde bg-elevado px-3 py-2 text-[12px] text-texto outline-none transition-colors duration-200 focus:border-tenue";

export function Selector({
  etiqueta,
  children,
  ...props
}: { etiqueta?: string; children: ReactNode } & SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <label className="block">
      {etiqueta && <span className="mb-1.5 block text-[11px] text-tenue">{etiqueta}</span>}
      <span className="relative block">
        <select {...props} className={`${CONTROL} appearance-none pr-8`}>
          {children}
        </select>
        <ChevronDown
          className="pointer-events-none absolute top-1/2 right-2.5 size-3.5 -translate-y-1/2 text-tenue"
          strokeWidth={1.5}
        />
      </span>
    </label>
  );
}

export const claseCampo = CONTROL;

export function Boton({
  children,
  variante = "claro",
  ...props
}: {
  children: ReactNode;
  variante?: "ambar" | "tinta" | "claro";
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const tonos = {
    ambar: "bg-ambar text-tinta hover:bg-tinta hover:text-tinta-texto",
    tinta: "bg-tinta text-tinta-texto hover:bg-texto/85",
    claro: "border border-borde text-texto hover:bg-elevado",
  };
  return (
    <button
      {...props}
      className={`rounded-full px-4 py-2.5 text-[13px] transition-colors duration-200 disabled:opacity-50 ${tonos[variante]}`}
    >
      {children}
    </button>
  );
}
