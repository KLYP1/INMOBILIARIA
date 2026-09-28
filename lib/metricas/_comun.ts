import { MS, hoy, partes } from "../fechas";
import { porcentaje } from "../formato";
import type { Datos } from "../base/datos";

/**
 * Piezas que comparten los modulos de metricas. Todas reciben la foto de datos
 * en vez de leer una constante: asi cada metrica es una funcion pura sobre lo
 * que se le da, y se puede probar sin base ni servidor.
 */

// Se resuelve por llamada, no al importar: un proceso que vive dias
// congelaria el mes y "leads del mes" se quedaria en el mes del arranque.
function partesDeHoy() {
  return partes(new Date(hoy()).toISOString());
}

export function esDelMesActual(iso: string): boolean {
  const p = partes(iso);
  const h = partesDeHoy();
  return p.mes === h.mes && p.anio === h.anio;
}

export function diasAtras(iso: string): number {
  return Math.ceil((hoy() - new Date(iso).getTime()) / MS.DIA);
}

export type Distrito = { nombre: string; leads: number; porcentaje: number };

/** Cuantos leads pidio cada distrito, de mas a menos. */
export function contarPorZona(datos: Datos): Distrito[] {
  const conteo = new Map<string, number>();
  for (const lead of datos.leads) {
    conteo.set(lead.zonaSolicitada, (conteo.get(lead.zonaSolicitada) ?? 0) + 1);
  }
  return [...conteo.entries()]
    .map(([nombre, leads]) => ({
      nombre,
      leads,
      porcentaje: porcentaje(leads, datos.leads.length),
    }))
    .sort((a, b) => b.leads - a.leads);
}
