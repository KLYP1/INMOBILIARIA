import { ArrowUpRight } from "lucide-react";
import { Tarjeta, TituloTarjeta } from "@/components/ui/tarjeta";
import { puntosRespuesta, respuestaPromedioSeg } from "@/lib/metricas";
import { RESPUESTA_ANTES_SEG } from "@/lib/data/empresa";
import { duracion } from "@/lib/formato";
import { obtenerDatos } from "@/lib/base/datos";

/** La unica tarjeta negra de la pantalla de inicio. */
export async function TiempoRespuesta() {
  const datos = await obtenerDatos();
  const puntos = puntosRespuesta(datos);

  return (
    <Tarjeta oscura className="flex flex-col p-5">
      <TituloTarjeta oscura>Respuesta</TituloTarjeta>

      <div className="mt-5 flex items-baseline gap-2">
        <p className="text-[36px] leading-none font-normal tabular-nums">
          {duracion(respuestaPromedioSeg(datos))}
        </p>
        <ArrowUpRight className="size-4 text-ambar" strokeWidth={1.5} />
      </div>
      <p className="mt-2 text-[12px] text-tinta-tenue">
        Antes: {duracion(RESPUESTA_ANTES_SEG)}
      </p>

      <div className="mt-auto pt-6">
        <div className="grid grid-cols-7 gap-2">
          {puntos.map((rapido, i) => (
            <span
              key={i}
              className={`size-2 rounded-full ${rapido ? "bg-ambar" : "bg-tinta-punto"}`}
            />
          ))}
        </div>
        <p className="mt-3 text-[11px] text-tinta-tenue">
          Últimas {puntos.length} conversaciones
        </p>
      </div>
    </Tarjeta>
  );
}
