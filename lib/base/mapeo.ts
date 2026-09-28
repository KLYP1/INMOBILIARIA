import { hora } from "../fechas";
import type { LeadCrudo, Mensaje, Proyecto, Visita } from "../types";

/**
 * Traduccion de filas de Postgres a los tipos del dominio, en un solo sitio.
 *
 * Lo usan tanto cargar.ts (la foto completa del panel) como lectura-ligera.ts
 * (las consultas chicas del trabajador de WhatsApp). Si cada uno tradujera por
 * su cuenta, el primer cambio de esquema arreglaria uno y dejaria el otro roto
 * en silencio.
 *
 * Sin `server-only`: el trabajador corre fuera de Next.
 */

/** Una fila cruda de Supabase. Se valida al mapear, no antes. */
export type Fila = Record<string, unknown>;

/**
 * Postgres devuelve "2026-09-24T22:15:00+00:00" y el resto del proyecto
 * escribe "2026-09-24T22:15:00.000Z". Es el mismo instante, pero hay codigo
 * que compara fechas como cadenas: mejor un solo formato.
 */
export function iso(valor: unknown): string {
  return new Date(String(valor)).toISOString();
}

/**
 * La forma canonica del telefono: solo digitos. Es como lo entrega WhatsApp
 * (`jid.split("@")[0]`) y como lo guarda la base. El "+" es presentacion.
 */
export function normalizarTelefono(valor: string): string {
  return valor.replace(/\D/g, "");
}

export function aProyecto(fila: Fila): Proyecto {
  const unidades = (fila.unidades ?? []) as Fila[];
  return {
    // El slug es el id en el dominio: mantiene /proyectos/altavista.
    id: String(fila.slug),
    nombre: String(fila.nombre),
    distrito: String(fila.distrito),
    lat: Number(fila.lat),
    lng: Number(fila.lng),
    etapa: fila.etapa as Proyecto["etapa"],
    unidades: unidades.map((u) => ({
      id: String(u.id),
      dormitorios: Number(u.dormitorios),
      metraje: Number(u.metraje),
      precio: Number(u.precio),
      disponibles: Number(u.disponibles),
    })),
  };
}

export function aMensaje(fila: Fila): Mensaje {
  return {
    autor: fila.autor as Mensaje["autor"],
    texto: String(fila.texto),
    hora: hora(String(fila.enviado_en)),
    ...(fila.propio ? { propio: true } : {}),
  };
}

export function aLeadCrudo(
  fila: Fila,
  slugDeProyecto: (id: unknown) => string,
  conversacion: Mensaje[],
): LeadCrudo {
  return {
    id: String(fila.id),
    nombre: String(fila.nombre),
    telefono: String(fila.telefono),
    origen: fila.origen as LeadCrudo["origen"],
    canal: fila.canal as LeadCrudo["canal"],
    proyectoInteres: slugDeProyecto(fila.proyecto_id),
    presupuestoMin: Number(fila.presupuesto_min),
    presupuestoMax: Number(fila.presupuesto_max),
    formaPago: fila.forma_pago as LeadCrudo["formaPago"],
    dormitorios: fila.dormitorios === null ? null : Number(fila.dormitorios),
    zonaSolicitada: String(fila.zona_solicitada),
    plazoMudanza: fila.plazo_mudanza as LeadCrudo["plazoMudanza"],
    estado: fila.estado as LeadCrudo["estado"],
    objecion: (fila.objecion ?? null) as LeadCrudo["objecion"],
    asesorAsignado: (fila.asesor_id as string | null) ?? null,
    primeraRespuestaSeg: Number(fila.primera_respuesta_seg ?? 0),
    creadoEn: iso(fila.creado_en),
    ultimoContacto: iso(fila.ultimo_contacto),
    resumenIA: String(fila.resumen_ia ?? ""),
    botPausado: Boolean(fila.bot_pausado),
    conversacion,
  };
}

export function aVisita(
  fila: Fila,
  slugDeProyecto: (id: unknown) => string,
): Visita {
  return {
    id: String(fila.id),
    leadId: String(fila.lead_id),
    proyectoId: slugDeProyecto(fila.proyecto_id),
    fechaHora: iso(fila.fecha_hora),
    asesor: (fila.asesor_id as string | null) ?? "",
    estado: fila.estado as Visita["estado"],
  };
}
