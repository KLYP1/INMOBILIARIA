import type { Lead, Proyecto } from "./types";
import { DISTRITOS } from "./data/distritos";

const RADIO_TIERRA_KM = 6371;

function aRadianes(grados: number): number {
  return (grados * Math.PI) / 180;
}

/** Distancia en kilometros entre dos coordenadas. */
export function haversine(
  latA: number,
  lngA: number,
  latB: number,
  lngB: number,
): number {
  const dLat = aRadianes(latB - latA);
  const dLng = aRadianes(lngB - lngA);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(aRadianes(latA)) *
      Math.cos(aRadianes(latB)) *
      Math.sin(dLng / 2) ** 2;
  return RADIO_TIERRA_KM * 2 * Math.asin(Math.sqrt(a));
}

export type Alternativa = {
  proyecto: Proyecto;
  distanciaKm: number;
  desde: number;
  unidadesEnRango: number;
};

/**
 * Proyectos ordenados por cercania al distrito que pidio el lead, filtrando
 * los que no tienen ninguna unidad disponible dentro de su presupuesto.
 * Es la funcion que evita perder a quien pide un distrito sin stock.
 */
export function recomendarPorCercania(
  lead: Pick<Lead, "zonaSolicitada" | "presupuestoMin" | "presupuestoMax" | "dormitorios">,
  proyectos: Proyecto[],
): Alternativa[] {
  const origen = DISTRITOS[lead.zonaSolicitada];
  if (!origen) return [];

  return proyectos
    .map((proyecto) => {
      const enRango = proyecto.unidades.filter(
        (u) =>
          u.disponibles > 0 &&
          u.precio <= lead.presupuestoMax &&
          (lead.dormitorios === null || u.dormitorios === lead.dormitorios),
      );
      const desde = enRango.length
        ? Math.min(...enRango.map((u) => u.precio))
        : 0;
      return {
        proyecto,
        distanciaKm: haversine(origen.lat, origen.lng, proyecto.lat, proyecto.lng),
        desde,
        unidadesEnRango: enRango.reduce((t, u) => t + u.disponibles, 0),
      };
    })
    .filter((a) => a.unidadesEnRango > 0)
    .sort((a, b) => a.distanciaKm - b.distanciaKm);
}

/** El lead pidio un distrito donde la constructora no tiene proyecto. */
export function sinOfertaEnZona(
  lead: Pick<Lead, "zonaSolicitada">,
  proyectos: Proyecto[],
): boolean {
  return !proyectos.some((p) => p.distrito === lead.zonaSolicitada);
}
