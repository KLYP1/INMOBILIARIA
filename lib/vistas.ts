import { LEADS } from "./data/leads";
import { VISITAS } from "./data/visitas";
import { PROYECTOS, nombreProyecto } from "./data/proyectos";
import { nombreAsesor } from "./data/empresa";
import { semaforo, type Semaforo } from "./scoring";
import { recomendarPorCercania, sinOfertaEnZona } from "./recomendacion";
import { relativo, AHORA } from "./fechas";
import { briefingVisita } from "./briefing";
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

function aVista(lead: Lead): LeadVista {
  const sinOferta = sinOfertaEnZona(lead, PROYECTOS);
  return {
    ...lead,
    proyectoNombre: nombreProyecto(lead.proyectoInteres),
    contactoRelativo: relativo(lead.ultimoContacto),
    asesorNombre: nombreAsesor(lead.asesorAsignado),
    nivel: semaforo(lead.score),
    sinOferta,
    alternativas: sinOferta
      ? recomendarPorCercania(lead, PROYECTOS)
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
export function leadsVista(): LeadVista[] {
  return LEADS.map(aVista);
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

export function visitasVista(): VisitaVista[] {
  const proximaId = VISITAS.find(
    (v) => new Date(v.fechaHora).getTime() >= AHORA,
  )?.id;

  return VISITAS.map((visita) => {
    const lead = LEADS.find((l) => l.id === visita.leadId) ?? null;
    const proyecto = PROYECTOS.find((p) => p.id === visita.proyectoId);
    const pasada = new Date(visita.fechaHora).getTime() < AHORA;

    return {
      ...visita,
      leadNombre: lead?.nombre ?? "Lead",
      proyectoNombre: nombreProyecto(visita.proyectoId),
      asesorNombre: nombreAsesor(visita.asesor),
      momento: pasada
        ? ("pasada" as const)
        : visita.id === proximaId
          ? ("proxima" as const)
          : ("despues" as const),
      briefing: lead ? briefingVisita(lead, proyecto, visita.fechaHora) : [],
      lead: lead ? aVista(lead) : null,
    };
  });
}
