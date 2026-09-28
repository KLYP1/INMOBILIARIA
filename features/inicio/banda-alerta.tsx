import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { calificadosEnEspera, leadsCalientes, valorEnRiesgo } from "@/lib/metricas";
import { solesMillonesPiso } from "@/lib/formato";
import { obtenerDatos } from "@/lib/base/datos";

/** El dato mas fuerte del producto: lo que se esta escapando ahora mismo. */
export async function BandaAlerta() {
  const datos = await obtenerDatos();
  const enEspera = calificadosEnEspera(datos).length;
  const calientes = leadsCalientes(datos).length;

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-[16px] bg-ambar px-6 py-5">
      <div>
        <p className="text-[15px] text-tinta">
          {enEspera} leads calificados esperan contacto
          <span className="mx-2 text-tinta/50">·</span>
          {solesMillonesPiso(valorEnRiesgo(datos))} en juego
        </p>
        {calientes > 0 && (
          <p className="mt-1 text-[13px] text-tinta/70">
            {calientes} quieren mudarse de inmediato y su presupuesto alcanza.
          </p>
        )}
      </div>
      <Link
        href="/leads?estado=calificado&sinAsesor=1"
        className="inline-flex items-center gap-2 rounded-full bg-tinta px-4 py-2 text-[13px] text-tinta-texto transition-colors duration-200 hover:bg-texto/85"
      >
        Ver leads
        <ArrowRight className="size-3.5" strokeWidth={1.5} />
      </Link>
    </div>
  );
}
