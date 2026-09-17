import type { Visita } from "../types";
import { desdeHoy } from "../fechas";

type Plan = {
  id: string;
  leadId: string;
  proyectoId: string;
  /** Dias respecto de hoy. */
  dia: number;
  hora: number;
  minuto: number;
  asesor: string;
  estado: Visita["estado"];
};

/** Doce visitas repartidas en la semana en curso. */
const PLAN: Plan[] = [
  { id: "v-01", leadId: "l-20", proyectoId: "mirador", dia: -1, hora: 10, minuto: 30, asesor: "rocio", estado: "asistio" },
  { id: "v-02", leadId: "l-29", proyectoId: "mirador", dia: -1, hora: 12, minuto: 0, asesor: "rocio", estado: "reprogramada" },
  { id: "v-03", leadId: "l-21", proyectoId: "altavista", dia: -1, hora: 15, minuto: 0, asesor: "oscar", estado: "asistio" },
  { id: "v-04", leadId: "l-58", proyectoId: "terrazas", dia: -1, hora: 17, minuto: 0, asesor: "sandra", estado: "no_asistio" },

  { id: "v-05", leadId: "l-22", proyectoId: "altavista", dia: 0, hora: 10, minuto: 0, asesor: "rocio", estado: "confirmada" },
  { id: "v-06", leadId: "l-23", proyectoId: "nova48", dia: 0, hora: 12, minuto: 30, asesor: "diego", estado: "confirmada" },
  { id: "v-07", leadId: "l-24", proyectoId: "mirador", dia: 0, hora: 16, minuto: 0, asesor: "rocio", estado: "pendiente_confirmacion" },

  { id: "v-08", leadId: "l-25", proyectoId: "alba", dia: 1, hora: 11, minuto: 0, asesor: "diego", estado: "confirmada" },
  { id: "v-09", leadId: "l-26", proyectoId: "terrazas", dia: 1, hora: 17, minuto: 0, asesor: "sandra", estado: "pendiente_confirmacion" },

  { id: "v-10", leadId: "l-27", proyectoId: "altavista", dia: 2, hora: 9, minuto: 30, asesor: "oscar", estado: "confirmada" },
  { id: "v-11", leadId: "l-28", proyectoId: "nova48", dia: 2, hora: 15, minuto: 0, asesor: "diego", estado: "confirmada" },

  { id: "v-12", leadId: "l-29", proyectoId: "mirador", dia: 4, hora: 11, minuto: 0, asesor: "rocio", estado: "confirmada" },
];

export const VISITAS: Visita[] = PLAN.map((p) => ({
  id: p.id,
  leadId: p.leadId,
  proyectoId: p.proyectoId,
  fechaHora: desdeHoy(p.dia, p.hora, p.minuto),
  asesor: p.asesor,
  estado: p.estado,
})).sort(
  (a, b) => new Date(a.fechaHora).getTime() - new Date(b.fechaHora).getTime(),
);

/** La agenda muestra siete dias corridos a partir de ayer, de modo que la
 *  demostracion siempre abre con visitas visibles sea cual sea el dia. */
export const DIA_INICIO_AGENDA = -1;
export const DIAS_AGENDA = 7;

const PENDIENTES: Visita["estado"][] = [
  "confirmada",
  "pendiente_confirmacion",
];

export function visitasPorVenir(): Visita[] {
  return VISITAS.filter((v) => PENDIENTES.includes(v.estado));
}
