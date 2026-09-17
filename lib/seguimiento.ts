import { desdeHoy, fechaCorta } from "./fechas";
import { dormitoriosEnFrase } from "./formato";
import type { Objecion, PlazoSeguimiento } from "./types";

export const PLAZOS: {
  clave: PlazoSeguimiento;
  texto: string;
  dias: number;
}[] = [
  { clave: "manana", texto: "Mañana", dias: 1 },
  { clave: "tres_dias", texto: "En 3 días", dias: 3 },
  { clave: "semana", texto: "En una semana", dias: 7 },
];

export function fechaSeguimiento(plazo: PlazoSeguimiento): string {
  const elegido = PLAZOS.find((p) => p.clave === plazo) ?? PLAZOS[0];
  // A las diez de la mañana: nadie retoma una compra a medianoche.
  return desdeHoy(elegido.dias, 10);
}

export function cuandoSale(plazo: PlazoSeguimiento): string {
  return fechaCorta(fechaSeguimiento(plazo));
}

/**
 * El segundo renglon ataca la objecion que quedo pendiente. Un seguimiento que
 * repite lo mismo que ya no funciono no recupera a nadie.
 */
const CIERRE: Record<string, string> = {
  precio:
    "Tenemos formas de pago que no alcanzamos a ver. ¿Le damos una vuelta juntos?",
  financiamiento:
    "Trabajamos con dos bancos y el trámite del crédito lo hacemos nosotros. ¿Lo vemos?",
  ubicacion: "Tengo dos opciones más cerca de donde buscabas. ¿Te las paso?",
  metraje: "Se liberó una unidad más grande que la que viste. ¿Te mando el plano?",
  plazo_entrega: "Ya tenemos fecha de entrega confirmada. ¿Te la comparto?",
};

const CIERRE_GENERICO =
  "¿Sigues con la idea de mudarte o lo dejamos para más adelante?";

export function mensajeSeguimiento(lead: {
  nombre: string;
  proyectoNombre: string;
  dormitorios: number | null;
  objecion: Objecion;
}): string {
  const primerNombre = lead.nombre.split(" ")[0];
  const que =
    lead.dormitorios === null
      ? `el departamento en ${lead.proyectoNombre}`
      : `el de ${dormitoriosEnFrase(lead.dormitorios)} en ${lead.proyectoNombre}`;
  const cierre =
    (lead.objecion && CIERRE[lead.objecion]) ?? CIERRE_GENERICO;
  return `Hola ${primerNombre}, te escribo por ${que}. ${cierre}`;
}
