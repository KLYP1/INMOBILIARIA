import { porcentaje } from "../formato";
import type { Datos } from "../base/datos";
import { contarPorZona, type Distrito } from "./_comun";

export type { Distrito };

/** Los tres distritos mas pedidos y el resto agrupado, para la dona. */
export function distritosPedidos(datos: Datos): {
  partes: Distrito[];
  total: number;
} {
  const todos = contarPorZona(datos);
  const principales = todos.slice(0, 3);
  const resto = todos.slice(3);
  const leadsResto = resto.reduce((t, d) => t + d.leads, 0);
  const partes = leadsResto
    ? [
        ...principales,
        {
          nombre: "Otros distritos",
          leads: leadsResto,
          porcentaje: porcentaje(leadsResto, datos.leads.length),
        },
      ]
    : principales;
  return { partes, total: datos.leads.length };
}

/** Distritos que los leads piden y donde la constructora no tiene proyecto. */
export function demandaNoAtendida(datos: Datos): Distrito[] {
  const conProyecto = new Set(datos.proyectos.map((p) => p.distrito));
  return contarPorZona(datos).filter((d) => !conProyecto.has(d.nombre));
}

export function leadsSinOferta(datos: Datos): number {
  return demandaNoAtendida(datos).reduce((t, d) => t + d.leads, 0);
}
