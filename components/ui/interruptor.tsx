"use client";

export function Interruptor({
  activo,
  etiqueta,
  onCambio,
}: {
  activo: boolean;
  etiqueta: string;
  onCambio: (valor: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={activo}
      aria-label={etiqueta}
      onClick={() => onCambio(!activo)}
      className={`relative h-5 w-9 shrink-0 rounded-full transition-colors duration-200 ${
        activo ? "bg-tinta" : "border border-borde bg-elevado"
      }`}
    >
      <span
        className={`absolute top-1/2 size-3.5 -translate-y-1/2 rounded-full transition-all duration-200 ${
          activo ? "left-[18px] bg-tinta-texto" : "left-[3px] bg-tenue"
        }`}
      />
    </button>
  );
}
