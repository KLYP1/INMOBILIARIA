import type { EstadoVisita } from "@/lib/types";

/** Confirmada en ambar, por confirmar en gris con borde, no asistio en rojo tenue. */
export const COLOR_VISITA: Record<EstadoVisita, string> = {
  confirmada: "bg-ambar text-tinta",
  pendiente_confirmacion: "border border-dashed border-borde bg-elevado text-suave",
  asistio: "bg-exito-fondo text-exito",
  no_asistio: "bg-peligro-fondo text-peligro",
  reprogramada: "bg-aviso-fondo text-aviso",
};

export const HORA_INICIO = 9;
export const HORA_FIN = 18;
export const ALTO_HORA = 82;
