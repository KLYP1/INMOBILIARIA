import { LEADS } from "./data/leads";
import { PROYECTOS } from "./data/proyectos";
import { VISITAS, visitasPorVenir } from "./data/visitas";
import { META_LEADS_MES, TICKET_PROMEDIO } from "./data/empresa";
import { HOY, MS, partes } from "./fechas";
import { alcanzaPresupuesto } from "./scoring";
import { sinOfertaEnZona } from "./recomendacion";
import { porcentaje } from "./formato";
import type { Canal, Lead } from "./types";

const HOY_PARTES = partes(new Date(HOY).toISOString());

function diasAtras(iso: string): number {
  return Math.ceil((HOY - new Date(iso).getTime()) / MS.DIA);
}

export function leadsDelMes(): Lead[] {
  return LEADS.filter((l) => {
    const p = partes(l.creadoEn);
    return p.mes === HOY_PARTES.mes && p.anio === HOY_PARTES.anio;
  });
}

/** Calificados que ningun asesor ha tomado todavia. El dato del producto. */
export function calificadosEnEspera(): Lead[] {
  return LEADS.filter((l) => l.estado === "calificado" && !l.asesorAsignado);
}

export function valorEnRiesgo(): number {
  return calificadosEnEspera().length * TICKET_PROMEDIO;
}

export function respuestaPromedioSeg(): number {
  const total = LEADS.reduce((t, l) => t + l.primeraRespuestaSeg, 0);
  return Math.round(total / LEADS.length);
}

/** Las ultimas conversaciones, marcando las contestadas en menos de 45 s. */
export function puntosRespuesta(cantidad = 42): boolean[] {
  return LEADS.slice(0, cantidad).map((l) => l.primeraRespuestaSeg < 45);
}

export function resumenCabecera() {
  const delMes = leadsDelMes();
  const agendadas = visitasPorVenir().length;
  const calificados = calificadosEnEspera().length;
  return {
    leadsMes: delMes.length,
    calificados,
    agendadas,
    metaLeads: META_LEADS_MES,
    avanceMeta: porcentaje(delMes.length, META_LEADS_MES),
    tasaCalificados: porcentaje(calificados, delMes.length),
    tasaAgendadas: porcentaje(agendadas, delMes.length),
  };
}

export type PuntoSemana = {
  etiqueta: string;
  actual: number | null;
  previo: number | null;
};

/** Cuatro semanas contra las cuatro anteriores, medidas desde hoy. */
export function leadsPorSemana(): PuntoSemana[] {
  const cubos = Array.from({ length: 8 }, () => 0);
  for (const lead of LEADS) {
    const semana = Math.floor(Math.max(diasAtras(lead.creadoEn), 0) / 7);
    if (semana < 8) cubos[semana] += 1;
  }
  return [3, 2, 1, 0].map((i, indice) => ({
    etiqueta: `S${indice + 1}`,
    actual: cubos[i],
    previo: cubos[i + 4],
  }));
}

export type Distrito = { nombre: string; leads: number; porcentaje: number };

function contarPorZona(): Distrito[] {
  const conteo = new Map<string, number>();
  for (const lead of LEADS) {
    conteo.set(lead.zonaSolicitada, (conteo.get(lead.zonaSolicitada) ?? 0) + 1);
  }
  return [...conteo.entries()]
    .map(([nombre, leads]) => ({
      nombre,
      leads,
      porcentaje: porcentaje(leads, LEADS.length),
    }))
    .sort((a, b) => b.leads - a.leads);
}

/** Los tres distritos mas pedidos y el resto agrupado, para la dona. */
export function distritosPedidos(): { partes: Distrito[]; total: number } {
  const todos = contarPorZona();
  const principales = todos.slice(0, 3);
  const resto = todos.slice(3);
  const leadsResto = resto.reduce((t, d) => t + d.leads, 0);
  const partes = leadsResto
    ? [
        ...principales,
        {
          nombre: "Otros distritos",
          leads: leadsResto,
          porcentaje: porcentaje(leadsResto, LEADS.length),
        },
      ]
    : principales;
  return { partes, total: LEADS.length };
}

/** Distritos que los leads piden y donde la constructora no tiene proyecto. */
export function demandaNoAtendida(): Distrito[] {
  const conProyecto = new Set(PROYECTOS.map((p) => p.distrito));
  return contarPorZona().filter((d) => !conProyecto.has(d.nombre));
}

export function leadsSinOferta(): number {
  return demandaNoAtendida().reduce((t, d) => t + d.leads, 0);
}

export function visitasDeHoy() {
  return VISITAS.filter((v) => diasAtras(v.fechaHora) === 0);
}

export function agendaSemana() {
  const total = VISITAS.length;
  const confirmadas = VISITAS.filter((v) => v.estado === "confirmada").length;
  const porConfirmar = VISITAS.filter(
    (v) => v.estado === "pendiente_confirmacion",
  ).length;
  const asistio = VISITAS.filter((v) => v.estado === "asistio").length;
  const noAsistio = VISITAS.filter((v) => v.estado === "no_asistio").length;
  return {
    total,
    confirmadas,
    tasaConfirmacion: porcentaje(confirmadas, confirmadas + porConfirmar),
    tasaAsistencia: porcentaje(asistio, asistio + noAsistio),
  };
}

export function conversacionesPorCanal(): Record<Canal, number> {
  const conteo: Record<Canal, number> = {
    whatsapp: 0,
    instagram: 0,
    messenger: 0,
  };
  for (const lead of LEADS) conteo[lead.canal] += 1;
  return conteo;
}

/**
 * Calificado, quiere mudarse ya, su presupuesto alcanza y nadie lo ha tomado.
 * Es el lead que se pierde si nadie contesta en la siguiente hora.
 */
export function leadsCalientes(): Lead[] {
  return LEADS.filter(
    (l) =>
      l.estado === "calificado" &&
      !l.asesorAsignado &&
      l.plazoMudanza === "inmediato" &&
      alcanzaPresupuesto(l, PROYECTOS),
  );
}

/**
 * Pidieron un distrito donde no hay proyecto y aun asi llegaron a calificado o
 * a visita agendada. Es la prueba en soles de por que tener varios proyectos
 * en varios distritos se paga.
 */
export function leadsRescatados(): Lead[] {
  return LEADS.filter(
    (l) =>
      sinOfertaEnZona(l, PROYECTOS) &&
      (l.estado === "calificado" || l.estado === "visita_agendada"),
  );
}

/** El informe del lunes. No calcula nada nuevo: compone lo que ya existe. */
export function informeSemanal() {
  const semanas = leadsPorSemana();
  const agenda = agendaSemana();
  return {
    leadsSemana: semanas.at(-1)?.actual ?? 0,
    leadsSemanaPrevia: semanas.at(-2)?.actual ?? 0,
    enEspera: calificadosEnEspera().length,
    calientes: leadsCalientes().length,
    valorEnRiesgo: valorEnRiesgo(),
    respuestaSeg: respuestaPromedioSeg(),
    visitas: agenda.total,
    tasaConfirmacion: agenda.tasaConfirmacion,
    tasaAsistencia: agenda.tasaAsistencia,
    sinOferta: demandaNoAtendida().slice(0, 3),
    rescatados: leadsRescatados().length,
  };
}
