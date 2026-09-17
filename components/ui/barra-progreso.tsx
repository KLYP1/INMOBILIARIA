type Props = {
  etiqueta: string;
  porcentaje: number;
  tono?: "tinta" | "ambar" | "claro";
};

const RELLENO = {
  tinta: "bg-tinta text-tinta-texto",
  ambar: "bg-ambar text-tinta",
  claro: "bg-elevado text-suave",
};

/** Barra en forma de pildora con el porcentaje escrito dentro del relleno. */
export function BarraProgreso({ etiqueta, porcentaje, tono = "claro" }: Props) {
  const ancho = Math.max(Math.min(porcentaje, 100), 14);
  return (
    <div>
      <p className="mb-2 text-[11px] text-tenue">{etiqueta}</p>
      <div className="h-8 rounded-full bg-elevado border border-borde">
        <div
          className={`flex h-full items-center rounded-full px-3 text-[12px] tabular-nums ${RELLENO[tono]}`}
          style={{ width: `${ancho}%` }}
        >
          {porcentaje}%
        </div>
      </div>
    </div>
  );
}
