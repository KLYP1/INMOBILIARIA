import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Tarjeta } from "@/components/ui/tarjeta";
import { EtapaPildora } from "@/components/ui/etapa";
import { TablaTipologias } from "@/features/proyectos/tabla-tipologias";
import { LeadsProyecto } from "@/features/proyectos/leads-proyecto";
import { proyectoPorId, unidadesDisponibles } from "@/lib/data/proyectos";
import { leadsDeProyecto } from "@/lib/data/leads";

export default async function ProyectoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const proyecto = proyectoPorId(id);
  if (!proyecto) notFound();

  const leads = leadsDeProyecto(proyecto.id);

  return (
    <div className="space-y-5">
      <Link
        href="/proyectos"
        className="mt-2 inline-flex items-center gap-2 text-[12px] text-suave transition-colors duration-200 hover:text-texto"
      >
        <ArrowLeft className="size-3.5" strokeWidth={1.5} />
        Proyectos
      </Link>

      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-[27px] leading-tight font-normal">
              {proyecto.nombre}
            </h1>
            <EtapaPildora etapa={proyecto.etapa} />
          </div>
          <p className="mt-1.5 text-[13px] text-tenue">{proyecto.distrito}</p>
        </div>

        <Tarjeta oscura className="px-5 py-4">
          <p className="text-[30px] leading-none font-normal tabular-nums">
            {unidadesDisponibles(proyecto)}
          </p>
          <p className="mt-2 text-[11px] text-tinta-tenue">
            unidades disponibles
          </p>
        </Tarjeta>
      </div>

      <div className="grid gap-5 lg:grid-cols-[62fr_38fr]">
        <TablaTipologias unidades={proyecto.unidades} />
        <LeadsProyecto leads={leads} />
      </div>
    </div>
  );
}
