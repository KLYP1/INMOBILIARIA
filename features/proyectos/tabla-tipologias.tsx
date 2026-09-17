import { Tarjeta, TituloTarjeta } from "@/components/ui/tarjeta";
import { Pildora } from "@/components/ui/pildora";
import { dormitorios, metraje, soles } from "@/lib/formato";
import type { Unidad } from "@/lib/types";

export function TablaTipologias({ unidades }: { unidades: Unidad[] }) {
  return (
    <Tarjeta className="p-5">
      <TituloTarjeta>Tipologías</TituloTarjeta>

      <table className="mt-4 w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-borde">
            {["Dormitorios", "Metraje", "Precio", "Disponibles"].map((c, i) => (
              <th
                key={c}
                scope="col"
                className={`py-2.5 text-[11px] font-normal text-tenue ${i > 0 ? "text-right" : ""}`}
              >
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {unidades.map((unidad) => (
            <tr key={unidad.id} className="border-b border-borde/60">
              <td className="py-3 text-[13px]">{dormitorios(unidad.dormitorios)}</td>
              <td className="py-3 text-right text-[13px] text-suave tabular-nums">
                {metraje(unidad.metraje)}
              </td>
              <td className="py-3 text-right text-[13px] tabular-nums">
                {soles(unidad.precio)}
              </td>
              <td className="py-3 text-right">
                {unidad.disponibles > 0 ? (
                  <Pildora tono="borde" className="tabular-nums">
                    {unidad.disponibles}
                  </Pildora>
                ) : (
                  <Pildora tono="peligro">Agotado</Pildora>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Tarjeta>
  );
}
