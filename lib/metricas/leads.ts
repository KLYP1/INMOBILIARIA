import { alcanzaPresupuesto } from "../scoring";
import { sinOfertaEnZona } from "../recomendacion";
import { TICKET_PROMEDIO } from "../data/empresa";
import type { Datos } from "../base/datos";
import type { Lead } from "../types";
import { diasAtras, esDelMesActual } from "./_comun";

export function leadsDelMes(datos: Datos): Lead[] {
  return datos.leads.filter((l) => esDelMesActual(l.creadoEn));
}

/** Calificados que ningun asesor ha tomado todavia. El dato del producto. */
export function calificadosEnEspera(datos: Datos): Lead[] {
  return datos.leads.filter(
    (l) => l.estado === "calificado" && !l.asesorAsignado,
  );
}

export function valorEnRiesgo(datos: Datos): number {
  return calificadosEnEspera(datos).length * TICKET_PROMEDIO;
}

export function respuestaPromedioSeg(datos: Datos): number {
  if (datos.leads.length === 0) return 0;
  const total = datos.leads.reduce((t, l) => t + l.primeraRespuestaSeg, 0);
  return Math.round(total / datos.leads.length);
}

/** Las ultimas conversaciones, marcando las contestadas en menos de 45 s. */
export function puntosRespuesta(datos: Datos, cantidad = 42): boolean[] {
  return datos.leads.slice(0, cantidad).map((l) => l.primeraRespuestaSeg < 45);
}

export type PuntoSemana = {
  etiqueta: string;
  actual: number | null;
  previo: number | null;
};

/** Cuatro semanas contra las cuatro anteriores, medidas desde hoy. */
export function leadsPorSemana(datos: Datos): PuntoSemana[] {
  const cubos = Array.from({ length: 8 }, () => 0);
  for (const lead of datos.leads) {
    const semana = Math.floor(Math.max(diasAtras(lead.creadoEn), 0) / 7);
    if (semana < 8) cubos[semana] += 1;
  }
  return [3, 2, 1, 0].map((i, indice) => ({
    etiqueta: `S${indice + 1}`,
    actual: cubos[i],
    previo: cubos[i + 4],
  }));
}

/**
 * Calificado, quiere mudarse ya, su presupuesto alcanza y nadie lo ha tomado.
 * Es el lead que se pierde si nadie contesta en la siguiente hora.
 */
export function leadsCalientes(datos: Datos): Lead[] {
  return datos.leads.filter(
    (l) =>
      l.estado === "calificado" &&
      !l.asesorAsignado &&
      l.plazoMudanza === "inmediato" &&
      alcanzaPresupuesto(l, datos.proyectos),
  );
}

/**
 * Pidieron un distrito donde no hay proyecto y aun asi llegaron a calificado o
 * a visita agendada. Es la prueba en soles de por que tener varios proyectos
 * en varios distritos se paga.
 */
export function leadsRescatados(datos: Datos): Lead[] {
  return datos.leads.filter(
    (l) =>
      sinOfertaEnZona(l, datos.proyectos) &&
      (l.estado === "calificado" || l.estado === "visita_agendada"),
  );
}
