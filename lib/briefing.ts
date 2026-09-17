import { PROYECTOS } from "./data/proyectos";
import { hora } from "./fechas";
import { dormitoriosEnFrase, etiqueta, metraje, soles } from "./formato";
import { recomendarPorCercania } from "./recomendacion";
import type { Lead, Proyecto, Unidad } from "./types";

/** La más cara que entra en su presupuesto: no deja ticket sobre la mesa. */
function unidadSugerida(lead: Lead, proyecto: Proyecto): Unidad | null {
  const candidatas = proyecto.unidades.filter(
    (u) =>
      u.disponibles > 0 &&
      (lead.dormitorios === null || u.dormitorios === lead.dormitorios) &&
      (!lead.presupuestoMax || u.precio <= lead.presupuestoMax),
  );
  if (candidatas.length === 0) return null;
  return candidatas.reduce((mejor, u) => (u.precio > mejor.precio ? u : mejor));
}

const COMO_PAGA: Record<string, string> = {
  contado: "paga al contado",
  credito_hipotecario: "va con crédito hipotecario",
  mivivienda: "va con Mivivienda",
  no_definido: "todavía no define cómo paga",
};

/**
 * Lo que el asesor recibe treinta minutos antes de la visita. Está pensado
 * para leerse de pie, en obra y desde el celular: cuatro frases, sin rodeos.
 */
export function briefingVisita(
  lead: Lead,
  proyecto: Proyecto | undefined,
  fechaHora: string,
): string[] {
  const lineas: string[] = [];

  lineas.push(
    `Llega ${lead.nombre} a las ${hora(fechaHora)}${
      proyecto ? ` en ${proyecto.nombre}` : ""
    }.`,
  );

  const presupuesto = lead.presupuestoMax
    ? `hasta ${soles(lead.presupuestoMax)}`
    : "sin presupuesto declarado";
  lineas.push(
    `Busca ${dormitoriosEnFrase(lead.dormitorios)}, ${presupuesto}, y ${
      COMO_PAGA[lead.formaPago]
    }.`,
  );

  if (lead.objecion) {
    lineas.push(
      `Espera objeción de ${etiqueta(lead.objecion).toLowerCase()}.`,
    );
  }

  const unidad = proyecto ? unidadSugerida(lead, proyecto) : null;
  if (unidad) {
    lineas.push(
      `Muéstrale el de ${metraje(unidad.metraje)} en ${soles(unidad.precio)}: es el que le calza.`,
    );
  } else {
    // Nada del proyecto entra en su presupuesto: ofrécele lo más cerca que sí.
    const alterna = recomendarPorCercania(lead, PROYECTOS)[0];
    lineas.push(
      alterna
        ? `Nada de este proyecto entra en su presupuesto. Ten a mano ${alterna.proyecto.nombre}, en ${alterna.proyecto.distrito}.`
        : "Nada del inventario entra en su presupuesto. Escucha primero y ajusta expectativas.",
    );
  }

  return lineas;
}
