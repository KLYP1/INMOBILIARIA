import { PantallaLeads } from "@/features/leads/pantalla-leads";
import { PROYECTOS } from "@/lib/data/proyectos";
import { LEADS } from "@/lib/data/leads";
import { leadsVista } from "@/lib/vistas";

type Params = {
  estado?: string;
  proyecto?: string;
  origen?: string;
  sinAsesor?: string;
  lead?: string;
};

const ESTADOS = new Set([
  "nuevo",
  "en_conversacion",
  "calificado",
  "visita_agendada",
  "frio",
  "descartado",
]);

const ORIGENES = new Set(["meta_ads", "portal", "web", "organico", "referido"]);

/**
 * Un valor que no existe se descarta en vez de aplicarse. Si no, la tabla
 * saldria vacia mientras los desplegables siguen diciendo "Todos", y no habria
 * forma de recuperarse salvo recargando.
 */
function valido(valor: string | undefined, permitidos: Set<string>): string {
  return valor && permitidos.has(valor) ? valor : "";
}

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<Params>;
}) {
  const p = await searchParams;
  const proyectos = PROYECTOS.map((x) => ({ id: x.id, nombre: x.nombre }));
  const existeLead = p.lead && LEADS.some((l) => l.id === p.lead);

  return (
    <PantallaLeads
      leads={leadsVista()}
      proyectos={proyectos}
      filtrosIniciales={{
        proyecto: valido(p.proyecto, new Set(proyectos.map((x) => x.id))),
        estado: valido(p.estado, ESTADOS),
        origen: valido(p.origen, ORIGENES),
        busqueda: "",
        sinAsesor: p.sinAsesor === "1",
      }}
      leadInicial={existeLead ? p.lead! : null}
    />
  );
}
