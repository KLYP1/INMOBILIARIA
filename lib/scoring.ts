import type { LeadCrudo, Proyecto } from "./types";

export type Semaforo = "calificado" | "en_conversacion" | "frio";

const PUNTOS_PAGO: Record<string, number> = {
  contado: 20,
  credito_hipotecario: 18,
  mivivienda: 15,
  no_definido: 0,
};

const PUNTOS_PLAZO: Record<string, number> = {
  inmediato: 25,
  "3_6_meses": 18,
  "6_12_meses": 10,
  solo_explorando: 3,
};

/** Hay al menos una unidad disponible dentro del rango declarado. */
export function alcanzaPresupuesto(
  lead: Pick<LeadCrudo, "presupuestoMin" | "presupuestoMax">,
  proyectos: Proyecto[],
): boolean {
  if (!lead.presupuestoMax) return false;
  return proyectos.some((p) =>
    p.unidades.some(
      (u) =>
        u.disponibles > 0 &&
        u.precio <= lead.presupuestoMax &&
        u.precio >= lead.presupuestoMin * 0.85,
    ),
  );
}

/** Score de calificacion de 0 a 100. Nunca se guarda en los datos. */
export function calcularScore(lead: LeadCrudo, proyectos: Proyecto[]): number {
  let score = 0;

  if (lead.presupuestoMin > 0 && lead.presupuestoMax > 0) score += 25;
  score += PUNTOS_PAGO[lead.formaPago] ?? 0;
  score += PUNTOS_PLAZO[lead.plazoMudanza] ?? 0;
  if (lead.zonaSolicitada && lead.dormitorios !== null) score += 15;
  if (alcanzaPresupuesto(lead, proyectos)) score += 15;

  return score;
}

export function semaforo(score: number): Semaforo {
  if (score >= 70) return "calificado";
  if (score >= 40) return "en_conversacion";
  return "frio";
}

export const COLOR_SEMAFORO: Record<Semaforo, string> = {
  calificado: "bg-exito",
  en_conversacion: "bg-ambar",
  frio: "bg-tenue",
};
