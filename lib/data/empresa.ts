import type { Asesor } from "../types";

export const EMPRESA = {
  nombre: "Grupo Vertiente",
  usuaria: {
    nombre: "Mariana Cáceres",
    saludo: "Mariana",
    cargo: "Gerente comercial",
  },
};

export const ASESORES: Asesor[] = [
  {
    id: "rocio",
    nombre: "Rocío Delgado",
    telefono: "+51 987 214 550",
    proyectos: ["altavista", "mirador"],
  },
  {
    id: "diego",
    nombre: "Diego Paredes",
    telefono: "+51 991 337 208",
    proyectos: ["nova48", "alba"],
  },
  {
    id: "sandra",
    nombre: "Sandra Villena",
    telefono: "+51 975 662 143",
    proyectos: ["terrazas", "alba"],
  },
  {
    id: "oscar",
    nombre: "Óscar Chumpitaz",
    telefono: "+51 962 480 917",
    proyectos: ["altavista", "terrazas"],
  },
];

export function nombreAsesor(id: string | null): string {
  if (!id) return "Sin asignar";
  return ASESORES.find((a) => a.id === id)?.nombre ?? "Sin asignar";
}

/** Ticket promedio de cierre de Grupo Vertiente, en soles. */
export const TICKET_PROMEDIO = 455909;

/** Tiempo de primera respuesta antes de KLYP: 4 h 10 min. */
export const RESPUESTA_ANTES_SEG = 15000;

/** Meta mensual de captacion del equipo comercial. */
export const META_LEADS_MES = 70;
