import type { Lead, LeadCrudo } from "../../types";
import { calcularScore } from "../../scoring";
import { PROYECTOS } from "../proyectos";
import { CALIFICADOS } from "./calificados";
import { AGENDADOS } from "./agendados";
import { EN_CONVERSACION } from "./en-conversacion";
import { NUEVOS } from "./nuevos";
import { FRIOS } from "./frios";

const CRUDOS: LeadCrudo[] = [
  ...CALIFICADOS,
  ...AGENDADOS,
  ...EN_CONVERSACION,
  ...NUEVOS,
  ...FRIOS,
];

/** El score se calcula aqui, al leer. Nunca viene escrito en los datos. */
export const LEADS: Lead[] = CRUDOS.map((lead) => ({
  ...lead,
  score: calcularScore(lead, PROYECTOS),
})).sort(
  (a, b) =>
    new Date(b.ultimoContacto).getTime() - new Date(a.ultimoContacto).getTime(),
);

export function leadPorId(id: string): Lead | undefined {
  return LEADS.find((l) => l.id === id);
}

export function leadsDeProyecto(proyectoId: string): Lead[] {
  return LEADS.filter((l) => l.proyectoInteres === proyectoId);
}
