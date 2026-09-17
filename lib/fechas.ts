/**
 * Lima no tiene horario de verano, asi que un desplazamiento fijo de -5 h
 * basta para leer y escribir fechas de forma identica en el servidor y en el
 * navegador. Todo se deriva de dos anclas de modulo (HOY y AHORA), nunca de
 * `new Date()` suelto, para que la hidratacion no discrepe.
 */
const OFFSET_LIMA = -5 * 60 * 60 * 1000;

const MS_MIN = 60_000;
const MS_HORA = 3_600_000;
const MS_DIA = 86_400_000;

function aLima(ms: number): Date {
  return new Date(ms + OFFSET_LIMA);
}

const reloj = new Date();
const relojLima = aLima(reloj.getTime());

/** Medianoche de hoy en Lima, en milisegundos UTC. */
export const HOY =
  Date.UTC(
    relojLima.getUTCFullYear(),
    relojLima.getUTCMonth(),
    relojLima.getUTCDate(),
  ) - OFFSET_LIMA;

/** Ahora truncado al minuto. Los datos de demostracion se generan como
 *  desplazamientos de esta ancla, de modo que "hace 20 min" siempre dice 20. */
export const AHORA = Math.floor(reloj.getTime() / MS_MIN) * MS_MIN;

export const MESES = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "setiembre",
  "octubre",
  "noviembre",
  "diciembre",
];

export const MESES_CORTOS = [
  "ene",
  "feb",
  "mar",
  "abr",
  "may",
  "jun",
  "jul",
  "ago",
  "set",
  "oct",
  "nov",
  "dic",
];

export const DIAS = [
  "domingo",
  "lunes",
  "martes",
  "miércoles",
  "jueves",
  "viernes",
  "sábado",
];

export const DIAS_CORTOS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

type Partes = {
  anio: number;
  mes: number;
  dia: number;
  diaSemana: number;
  hora: number;
  minuto: number;
};

export function partes(iso: string): Partes {
  const l = aLima(new Date(iso).getTime());
  return {
    anio: l.getUTCFullYear(),
    mes: l.getUTCMonth(),
    dia: l.getUTCDate(),
    diaSemana: l.getUTCDay(),
    hora: l.getUTCHours(),
    minuto: l.getUTCMinutes(),
  };
}

/** Construye un ISO a partir de un desplazamiento en dias sobre hoy. */
export function desdeHoy(dias: number, hora = 0, minuto = 0): string {
  return new Date(HOY + dias * MS_DIA + hora * MS_HORA + minuto * MS_MIN).toISOString();
}

/** Construye un ISO a partir de un desplazamiento en minutos sobre ahora. */
export function haceMinutos(minutos: number): string {
  return new Date(AHORA - minutos * MS_MIN).toISOString();
}

function dosDigitos(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

/** "10:00" */
export function hora(iso: string): string {
  const p = partes(iso);
  return `${dosDigitos(p.hora)}:${dosDigitos(p.minuto)}`;
}

/** "lunes 15 de setiembre" */
export function fechaLarga(iso: string): string {
  const p = partes(iso);
  return `${DIAS[p.diaSemana]} ${p.dia} de ${MESES[p.mes]}`;
}

/** "15 set" */
export function fechaCorta(iso: string): string {
  const p = partes(iso);
  return `${p.dia} ${MESES_CORTOS[p.mes]}`;
}

/** Clave de dia para agrupar: "2026-09-15" */
export function claveDia(iso: string): string {
  const p = partes(iso);
  return `${p.anio}-${dosDigitos(p.mes + 1)}-${dosDigitos(p.dia)}`;
}

export function esHoy(iso: string): boolean {
  return claveDia(iso) === claveDia(new Date(HOY).toISOString());
}

/** "hace 20 min", "hace 3 h", "ayer", "hace 4 d" */
export function relativo(iso: string): string {
  const diff = AHORA - new Date(iso).getTime();
  if (diff < MS_MIN) return "recién";
  if (diff < MS_HORA) return `hace ${Math.floor(diff / MS_MIN)} min`;
  if (diff < MS_DIA) return `hace ${Math.floor(diff / MS_HORA)} h`;
  const dias = Math.floor(diff / MS_DIA);
  if (dias === 1) return "ayer";
  if (dias < 30) return `hace ${dias} d`;
  return fechaCorta(iso);
}

/** Lunes de la semana que contiene la fecha dada, a medianoche. */
export function lunesDeLaSemana(ms: number): number {
  const l = aLima(ms);
  const diaSemana = l.getUTCDay();
  const retroceso = diaSemana === 0 ? 6 : diaSemana - 1;
  return ms - retroceso * MS_DIA;
}

export const MS = { MIN: MS_MIN, HORA: MS_HORA, DIA: MS_DIA };
