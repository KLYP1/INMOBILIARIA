import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Tarjeta, TituloTarjeta } from "@/components/ui/tarjeta";
import { Pildora } from "@/components/ui/pildora";
import { visitasDeHoy } from "@/lib/metricas";
import { AHORA, hora } from "@/lib/fechas";
import { obtenerDatos } from "@/lib/base/datos";

export async function VisitasHoy() {
  const datos = await obtenerDatos();
  const visitas = visitasDeHoy(datos);
  const proxima =
    visitas.find((v) => new Date(v.fechaHora).getTime() >= AHORA) ?? visitas[0];

  return (
    <Tarjeta className="flex flex-col p-5">
      <TituloTarjeta>Visitas de hoy</TituloTarjeta>

      {visitas.length === 0 ? (
        <p className="mt-6 text-[13px] text-suave">
          No hay visitas para hoy. La agenda de la semana tiene{" "}
          <span className="text-texto">las próximas</span>.
        </p>
      ) : (
        <ol className="mt-5 space-y-4">
          {visitas.map((visita) => {
            const esProxima = visita.id === proxima?.id;
            const lead = datos.leads.find((l) => l.id === visita.leadId);
            return (
              <li key={visita.id} className="flex items-start gap-3">
                <Pildora
                  tono={esProxima ? "tinta" : "neutro"}
                  className="mt-0.5 tabular-nums"
                >
                  {hora(visita.fechaHora)}
                </Pildora>
                <div className="min-w-0">
                  <p className="truncate text-[13px] text-texto">
                    {datos.proyectos.find((p) => p.id === visita.proyectoId)
                      ?.nombre ?? "Sin proyecto"}
                  </p>
                  <p className="truncate text-[11px] text-tenue">
                    {lead?.nombre ?? "Lead"}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      )}

      <Link
        href="/agenda"
        className="mt-auto flex items-center justify-between gap-2 pt-6 text-[12px] text-suave transition-colors duration-200 hover:text-texto"
      >
        Ver la semana
        <ArrowRight className="size-3.5" strokeWidth={1.5} />
      </Link>
    </Tarjeta>
  );
}
