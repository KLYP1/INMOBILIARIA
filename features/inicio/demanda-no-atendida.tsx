import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Tarjeta, TituloTarjeta } from "@/components/ui/tarjeta";
import { demandaNoAtendida, leadsSinOferta } from "@/lib/metricas";
import { LEADS } from "@/lib/data/leads";
import { porcentaje } from "@/lib/formato";
import { plural } from "@/lib/texto";

/** Dinero que se pierde por no tener proyecto donde el mercado lo pide. */
export function DemandaNoAtendida() {
  const distritos = demandaNoAtendida().slice(0, 3);
  const totalSinOferta = porcentaje(leadsSinOferta(), LEADS.length);

  return (
    <Tarjeta className="p-6">
      <TituloTarjeta
        accion={
          <span className="text-[11px] text-tenue">
            {totalSinOferta}% de tus leads pidió un distrito sin proyecto
          </span>
        }
      >
        Demanda no atendida
      </TituloTarjeta>

      <ul className="mt-5 grid gap-4 md:grid-cols-3">
        {distritos.map((distrito) => (
          <li
            key={distrito.nombre}
            className="rounded-[10px] bg-elevado px-4 py-4"
          >
            <p className="text-[30px] leading-none font-normal tabular-nums text-ambar">
              {distrito.porcentaje}%
            </p>
            <p className="mt-3 text-[13px] text-texto">
              de tus leads pidió {distrito.nombre}.
            </p>
            <p className="mt-1 text-[13px] text-suave">
              No tienes proyecto ahí.
            </p>
            <p className="mt-3 text-[11px] text-tenue">
              {plural(distrito.leads, "lead", "leads")} este periodo
            </p>
          </li>
        ))}
      </ul>

      <Link
        href="/leads"
        className="mt-5 inline-flex items-center gap-2 text-[13px] text-suave transition-colors duration-200 hover:text-texto"
      >
        Ver quiénes son
        <ArrowRight className="size-3.5" strokeWidth={1.5} />
      </Link>
    </Tarjeta>
  );
}
