/**
 * Formateo sin Intl para numeros: el servidor y el navegador producen
 * exactamente la misma cadena y la hidratacion nunca discrepa.
 */

function conMiles(n: number): string {
  return Math.round(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function soles(n: number): string {
  return `S/ ${conMiles(n)}`;
}

/** 380000 -> "S/ 380 mil" */
export function solesMiles(n: number): string {
  return `S/ ${Math.round(n / 1000)} mil`;
}

/** 380000 y 420000 -> "S/ 380-420 mil" */
export function rangoMiles(min: number, max: number): string {
  if (!min && !max) return "Sin declarar";
  return `S/ ${Math.round(min / 1000)}-${Math.round(max / 1000)} mil`;
}

/** 8660271 -> "S/ 8.6 millones" */
export function solesMillones(n: number): string {
  return `S/ ${unDecimal(n / 1_000_000)} millones`;
}

export function unDecimal(n: number): string {
  return (Math.round(n * 10) / 10).toFixed(1);
}

export function porcentaje(parte: number, total: number): number {
  if (!total) return 0;
  return Math.round((parte / total) * 100);
}

/** 42 -> "42 s"; 15000 -> "4 h 10 min" */
export function duracion(segundos: number): string {
  if (segundos < 60) return `${Math.round(segundos)} s`;
  if (segundos < 3600) return `${Math.round(segundos / 60)} min`;
  const horas = Math.floor(segundos / 3600);
  const minutos = Math.round((segundos % 3600) / 60);
  return minutos ? `${horas} h ${minutos} min` : `${horas} h`;
}

export function metraje(m2: number): string {
  return `${m2} m²`;
}

const ETIQUETAS: Record<string, string> = {
  meta_ads: "Meta Ads",
  whatsapp: "WhatsApp",
  instagram: "Instagram",
  messenger: "Messenger",
  portal: "Portal",
  web: "Web",
  organico: "Orgánico",
  referido: "Referido",
  contado: "Contado",
  credito_hipotecario: "Crédito hipotecario",
  mivivienda: "Mivivienda",
  no_definido: "Sin definir",
  inmediato: "Inmediato",
  "3_6_meses": "3 a 6 meses",
  "6_12_meses": "6 a 12 meses",
  solo_explorando: "Explorando",
  nuevo: "Nuevo",
  en_conversacion: "En conversación",
  calificado: "Calificado",
  visita_agendada: "Visita agendada",
  frio: "Frío",
  descartado: "Descartado",
  en_planos: "En planos",
  en_construccion: "En construcción",
  entrega_inmediata: "Entrega inmediata",
  confirmada: "Confirmada",
  pendiente_confirmacion: "Por confirmar",
  asistio: "Asistió",
  no_asistio: "No asistió",
  reprogramada: "Reprogramada",
  precio: "Precio",
  ubicacion: "Ubicación",
  financiamiento: "Financiamiento",
  plazo_entrega: "Plazo de entrega",
};

export function etiqueta(clave: string | null): string {
  if (!clave) return "—";
  return ETIQUETAS[clave] ?? clave;
}

/** En una frase que se lee de corrido no cabe la abreviatura "2 dorm.". */
export function dormitoriosEnFrase(n: number | null): string {
  if (n === null) return "todavía no dice cuántos dormitorios";
  if (n === 0) return "un estudio";
  if (n === 1) return "un dormitorio";
  return `${n} dormitorios`;
}

export function dormitorios(n: number | null): string {
  if (n === null) return "Sin definir";
  if (n === 0) return "Estudio";
  return `${n} dorm.`;
}

export function iniciales(nombre: string): string {
  const partes = nombre.trim().split(/\s+/);
  return (partes[0][0] + (partes[1]?.[0] ?? "")).toUpperCase();
}

/** Trunca en lugar de redondear: el dinero en riesgo nunca se exagera. */
export function solesMillonesPiso(n: number): string {
  return `S/ ${(Math.floor(n / 100_000) / 10).toFixed(1)} millones`;
}
