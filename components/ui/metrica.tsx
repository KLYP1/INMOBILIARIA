/** Numero grande y delgado, como panel de instrumentos. Nunca en negrita. */
export function Metrica({
  valor,
  etiqueta,
  destacado,
}: {
  valor: string;
  etiqueta: string;
  destacado?: boolean;
}) {
  return (
    <div className="min-w-[68px]">
      <p
        className={`text-[34px] leading-none font-normal tabular-nums ${destacado ? "text-ambar" : "text-texto"}`}
      >
        {valor}
      </p>
      <p className="mt-2 text-[11px] text-tenue">{etiqueta}</p>
    </div>
  );
}
