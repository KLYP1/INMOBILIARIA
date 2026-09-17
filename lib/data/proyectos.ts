import type { Proyecto } from "../types";
import { DISTRITOS } from "./distritos";

function coords(distrito: string) {
  return DISTRITOS[distrito];
}

export const PROYECTOS: Proyecto[] = [
  {
    id: "altavista",
    nombre: "Altavista",
    distrito: "Santiago de Surco",
    ...coords("Santiago de Surco"),
    etapa: "en_construccion",
    unidades: [
      { id: "altavista-a", dormitorios: 1, metraje: 48, precio: 398000, disponibles: 4 },
      { id: "altavista-b", dormitorios: 2, metraje: 68, precio: 512000, disponibles: 7 },
      { id: "altavista-c", dormitorios: 2, metraje: 76, precio: 565000, disponibles: 3 },
      { id: "altavista-d", dormitorios: 3, metraje: 92, precio: 689000, disponibles: 2 },
      { id: "altavista-e", dormitorios: 3, metraje: 110, precio: 758000, disponibles: 1 },
    ],
  },
  {
    id: "nova48",
    nombre: "Nova 48",
    distrito: "Pueblo Libre",
    ...coords("Pueblo Libre"),
    etapa: "entrega_inmediata",
    unidades: [
      { id: "nova48-a", dormitorios: 1, metraje: 42, precio: 318000, disponibles: 5 },
      { id: "nova48-b", dormitorios: 2, metraje: 62, precio: 429000, disponibles: 9 },
      { id: "nova48-c", dormitorios: 3, metraje: 84, precio: 548000, disponibles: 4 },
    ],
  },
  {
    id: "mirador",
    nombre: "Mirador",
    distrito: "Magdalena del Mar",
    ...coords("Magdalena del Mar"),
    etapa: "en_construccion",
    unidades: [
      { id: "mirador-a", dormitorios: 1, metraje: 45, precio: 352000, disponibles: 6 },
      { id: "mirador-b", dormitorios: 2, metraje: 65, precio: 462000, disponibles: 11 },
      { id: "mirador-c", dormitorios: 3, metraje: 88, precio: 598000, disponibles: 3 },
    ],
  },
  {
    id: "terrazas",
    nombre: "Terrazas del Sur",
    distrito: "Chorrillos",
    ...coords("Chorrillos"),
    etapa: "en_planos",
    unidades: [
      { id: "terrazas-a", dormitorios: 1, metraje: 40, precio: 238000, disponibles: 8 },
      { id: "terrazas-b", dormitorios: 2, metraje: 58, precio: 315000, disponibles: 14 },
      { id: "terrazas-c", dormitorios: 3, metraje: 78, precio: 398000, disponibles: 6 },
    ],
  },
  {
    id: "alba",
    nombre: "Alba",
    distrito: "San Miguel",
    ...coords("San Miguel"),
    etapa: "entrega_inmediata",
    unidades: [
      { id: "alba-a", dormitorios: 1, metraje: 44, precio: 289000, disponibles: 3 },
      { id: "alba-b", dormitorios: 2, metraje: 63, precio: 385000, disponibles: 8 },
      { id: "alba-c", dormitorios: 3, metraje: 80, precio: 478000, disponibles: 5 },
      { id: "alba-d", dormitorios: 3, metraje: 95, precio: 612000, disponibles: 1 },
    ],
  },
];

export function proyectoPorId(id: string): Proyecto | undefined {
  return PROYECTOS.find((p) => p.id === id);
}

export function nombreProyecto(id: string): string {
  return proyectoPorId(id)?.nombre ?? "Sin proyecto";
}

export function unidadesDisponibles(p: Proyecto): number {
  return p.unidades.reduce((t, u) => t + u.disponibles, 0);
}

export function precioDesde(p: Proyecto): number {
  const conStock = p.unidades.filter((u) => u.disponibles > 0);
  return conStock.length ? Math.min(...conStock.map((u) => u.precio)) : 0;
}
