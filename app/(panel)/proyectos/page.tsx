import { Tarjeta } from "@/components/ui/tarjeta";
import { TarjetaProyecto } from "@/features/proyectos/tarjeta-proyecto";
import { BotonImportar } from "@/features/proyectos/boton-importar";
import { PROYECTOS, unidadesDisponibles } from "@/lib/data/proyectos";
import { LEADS } from "@/lib/data/leads";

export default function ProyectosPage() {
  const total = PROYECTOS.reduce((t, p) => t + unidadesDisponibles(p), 0);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-5 pt-2">
        <div>
          <h1 className="text-[27px] leading-tight font-normal">Proyectos</h1>
          <p className="mt-1.5 text-[13px] text-tenue">
            El inventario con el que responde el asistente.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <BotonImportar />
          <Tarjeta oscura className="px-5 py-4">
            <p className="text-[30px] leading-none font-normal tabular-nums">
              {total}
            </p>
            <p className="mt-2 text-[11px] text-tinta-tenue">
              unidades disponibles
            </p>
          </Tarjeta>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {PROYECTOS.map((proyecto) => (
          <TarjetaProyecto
            key={proyecto.id}
            proyecto={proyecto}
            leads={
              LEADS.filter((l) => l.proyectoInteres === proyecto.id).length
            }
          />
        ))}
      </div>
    </div>
  );
}
