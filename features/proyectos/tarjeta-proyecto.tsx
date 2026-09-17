import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Tarjeta } from "@/components/ui/tarjeta";
import { EtapaPildora } from "@/components/ui/etapa";
import { solesMiles } from "@/lib/formato";
import { plural } from "@/lib/texto";
import { precioDesde, unidadesDisponibles } from "@/lib/data/proyectos";
import type { Proyecto } from "@/lib/types";

export function TarjetaProyecto({
  proyecto,
  leads,
}: {
  proyecto: Proyecto;
  leads: number;
}) {
  const porDormitorio = proyecto.unidades
    .filter((u) => u.disponibles > 0)
    .reduce<Record<number, number>>((acc, u) => {
      acc[u.dormitorios] = (acc[u.dormitorios] ?? 0) + u.disponibles;
      return acc;
    }, {});

  return (
    <Tarjeta className="flex flex-col p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-[15px]">{proyecto.nombre}</h2>
          <p className="mt-1 text-[12px] text-tenue">{proyecto.distrito}</p>
        </div>
        <EtapaPildora etapa={proyecto.etapa} />
      </div>

      <div className="mt-6 flex items-end gap-8">
        <div>
          <p className="text-[30px] leading-none font-normal tabular-nums">
            {unidadesDisponibles(proyecto)}
          </p>
          <p className="mt-2 text-[11px] text-tenue">unidades disponibles</p>
        </div>
        <div>
          <p className="text-[15px] tabular-nums">
            {solesMiles(precioDesde(proyecto))}
          </p>
          <p className="mt-1.5 text-[11px] text-tenue">precio desde</p>
        </div>
      </div>

      <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-1.5 text-[12px] text-suave">
        {Object.entries(porDormitorio).map(([dorm, cantidad]) => (
          <li key={dorm}>
            {cantidad} de {dorm} {Number(dorm) === 1 ? "dormitorio" : "dormitorios"}
          </li>
        ))}
      </ul>

      <div className="mt-auto flex items-center justify-between gap-3 pt-6">
        <span className="text-[12px] text-tenue">
          {plural(leads, "lead interesado", "leads interesados")}
        </span>
        <Link
          href={`/proyectos/${proyecto.id}`}
          className="inline-flex items-center gap-2 rounded-full border border-borde px-3.5 py-2 text-[12px] transition-colors duration-200 hover:bg-elevado"
        >
          Ver proyecto
          <ArrowRight className="size-3.5" strokeWidth={1.5} />
        </Link>
      </div>
    </Tarjeta>
  );
}
