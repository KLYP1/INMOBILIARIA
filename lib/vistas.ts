import { semaforo, type Semaforo } from "./scoring";
import { recomendarPorCercania, sinOfertaEnZona } from "./recomendacion";
import { ahora, relativo } from "./fechas";
import { briefingVisita } from "./briefing";
import type { Datos } from "./base/datos";
import type { Lead, Visita } from "./types";

export type AlternativaVista = {
  id: string;
  nombre: string;
  distrito: string;
  distanciaKm: number;
  desde: number;
  unidades: number;
};

export type LeadVista = Lead & {
  proyectoNombre: string;
  /** Resuelto en el servidor. El cliente no puede recalcularlo: su reloj es
   *  otro y la hidratacion fallaria al comparar las dos cadenas. */
  contactoRelativo: string;
  asesorNombre: string;
  nivel: Semaforo;
  sinOferta: boolean;
  alternativas: AlternativaVista[];
};

/**
 * Los nombres se resuelven contra la foto de datos, no contra un modulo
 * estatico: con Supabase los identificadores son UUID y cualquier tabla de
 * nombres escrita a mano quedaria desfasada en cuanto se agregue un asesor.
 */
function nombreDeProyecto(datos: Datos, id: string): string {
  return datos.proyectos.find((p) => p.id === id)?.nombre ?? "Sin proyecto";
}

function nombreDeAsesor(datos: Datos, id: string | null): string {
  if (!id) return "Sin asignar";
  return datos.asesores.find((a) => a.id === id)?.nombre ?? "Sin asignar";
}

function aVista(lead: Lead, datos: Datos): LeadVista {
  const sinOferta = sinOfertaEnZona(lead, datos.proyectos);
  return {
    ...lead,
    proyectoNombre: nombreDeProyecto(datos, lead.proyectoInteres),
    contactoRelativo: relativo(lead.ultimoContacto),
    asesorNombre: nombreDeAsesor(datos, lead.asesorAsignado),
    nivel: semaforo(lead.score),
    sinOferta,
    alternativas: sinOferta
      ? recomendarPorCercania(lead, datos.proyectos)
          .slice(0, 3)
          .map((a) => ({
            id: a.proyecto.id,
            nombre: a.proyecto.nombre,
            distrito: a.proyecto.distrito,
            distanciaKm: a.distanciaKm,
            desde: a.desde,
            unidades: a.unidadesEnRango,
          }))
      : [],
  };
}

/** Los leads con todo lo que la interfaz necesita ya resuelto. */
export function leadsVista(datos: Datos): LeadVista[] {
  return datos.leads.map((lead) => aVista(lead, datos));
}

export type VisitaVista = Visita & {
  leadNombre: string;
  proyectoNombre: string;
  asesorNombre: string;
  /**
   * Resuelto en el servidor. Comparar contra el reloj dentro de un componente
   * de cliente romperia la hidratacion, como ya paso con las etiquetas de
   * tiempo relativo.
   */
  momento: "pasada" | "proxima" | "despues";
  briefing: string[];
  lead: LeadVista | null;
};

export function visitasVista(datos: Datos): VisitaVista[] {
  // Un solo instante para toda la lista: si cada visita leyera el reloj por su
  // cuenta, dos podrian quedar marcadas como "la proxima".
  const momento = ahora();
  const proximaId = datos.visitas.find(
    (v) => new Date(v.fechaHora).getTime() >= momento,
  )?.id;

  return datos.visitas.map((visita) => {
    const lead = datos.leads.find((l) => l.id === visita.leadId) ?? null;
    const proyecto = datos.proyectos.find((p) => p.id === visita.proyectoId);
    const pasada = new Date(visita.fechaHora).getTime() < momento;

    return {
      ...visita,
      leadNombre: lead?.nombre ?? "Lead",
      proyectoNombre: nombreDeProyecto(datos, visita.proyectoId),
      asesorNombre: nombreDeAsesor(datos, visita.asesor),
      momento: pasada
        ? ("pasada" as const)
        : visita.id === proximaId
          ? ("proxima" as const)
          : ("despues" as const),
      briefing: lead ? briefingVisita(lead, proyecto, visita.fechaHora) : [],
      lead: lead ? aVista(lead, datos) : null,
    };
  });
}
