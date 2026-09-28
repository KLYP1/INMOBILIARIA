import { crearClienteServicio } from "./cliente-supabase";
import { aLeadCrudo, normalizarTelefono, type Fila } from "./mapeo";
import type {
  Canal,
  EstadoLead,
  LeadCrudo,
  Mensaje,
  Origen,
} from "../types";

/**
 * El unico punto de escritura de la aplicacion.
 *
 * Hasta aca todo lo que modificaba la base eran scripts de mantenimiento que
 * se corren a mano. Esto es lo que permite que una conversacion real deje
 * rastro: un mensaje que llega por WhatsApp se guarda, y el panel lo ve.
 *
 * Nunca escribe `score`. Se calcula al leer, contra el inventario del momento,
 * y guardarlo lo volveria una cifra que envejece sola.
 *
 * Sin `server-only`: el trabajador corre fuera de Next.
 */

function fallo(accion: string, detalle: string): never {
  throw new Error(`No se pudo ${accion}: ${detalle}`);
}

/**
 * Busca por telefono y crea si no existe.
 *
 * La busqueda va contra la forma canonica (solo digitos) porque WhatsApp
 * entrega el numero sin "+": comparar sin normalizar crearia un lead nuevo en
 * cada mensaje del mismo cliente.
 */
export async function obtenerOCrearLead(
  inmobiliariaId: string,
  telefonoCrudo: string,
  iniciales: { origen: Origen; canal: Canal; nombre?: string },
): Promise<LeadCrudo> {
  const base = crearClienteServicio();
  const telefono = normalizarTelefono(telefonoCrudo);
  if (!telefono) fallo("crear el lead", "el telefono llego vacio");

  const existente = await base
    .from("leads")
    .select("*, proyectos(slug)")
    .eq("inmobiliaria_id", inmobiliariaId)
    .eq("telefono", telefono)
    .limit(1);
  if (existente.error) fallo("buscar el lead", existente.error.message);

  const fila = existente.data?.[0] as Fila | undefined;
  if (fila) {
    const slug = (fila.proyectos as { slug?: string } | null)?.slug ?? "";
    return aLeadCrudo(fila, () => slug, []);
  }

  const creado = await base
    .from("leads")
    .insert({
      inmobiliaria_id: inmobiliariaId,
      // Sin nombre todavia: el bot lo pregunta y se completa despues.
      nombre: iniciales.nombre?.trim() || "Sin nombre",
      telefono,
      origen: iniciales.origen,
      canal: iniciales.canal,
    })
    .select("*")
    .single();
  if (creado.error) fallo("crear el lead", creado.error.message);

  return aLeadCrudo(creado.data as Fila, () => "", []);
}

export async function registrarMensaje(
  leadId: string,
  autor: Mensaje["autor"],
  texto: string,
  opciones?: { propio?: boolean },
): Promise<string> {
  const limpio = texto.trim();
  if (!limpio) fallo("guardar el mensaje", "el texto llego vacio");

  const base = crearClienteServicio();
  const { data, error } = await base
    .from("mensajes")
    .insert({
      lead_id: leadId,
      autor,
      texto: limpio,
      propio: opciones?.propio ?? false,
    })
    .select("id")
    .single();
  if (error) fallo("guardar el mensaje", error.message);

  // Cada mensaje mueve el ultimo contacto: es el orden de la bandeja.
  const tocado = await base
    .from("leads")
    .update({ ultimo_contacto: new Date().toISOString() })
    .eq("id", leadId);
  if (tocado.error) fallo("actualizar el ultimo contacto", tocado.error.message);

  return String(data.id);
}

type CamposCalificacion = Partial<
  Pick<
    LeadCrudo,
    | "nombre"
    | "presupuestoMin"
    | "presupuestoMax"
    | "zonaSolicitada"
    | "dormitorios"
    | "formaPago"
    | "plazoMudanza"
    | "objecion"
  >
>;

/** La traduccion a snake_case vive solo aca, simetrica a la de mapeo.ts. */
const COLUMNA: Record<keyof CamposCalificacion, string> = {
  nombre: "nombre",
  presupuestoMin: "presupuesto_min",
  presupuestoMax: "presupuesto_max",
  zonaSolicitada: "zona_solicitada",
  dormitorios: "dormitorios",
  formaPago: "forma_pago",
  plazoMudanza: "plazo_mudanza",
  objecion: "objecion",
};

export async function actualizarCalificacion(
  leadId: string,
  campos: CamposCalificacion,
  opciones?: { estado?: EstadoLead; botPausado?: boolean; asesorId?: string | null },
): Promise<void> {
  const cambios: Record<string, unknown> = {};
  for (const [clave, valor] of Object.entries(campos)) {
    if (valor === undefined) continue;
    cambios[COLUMNA[clave as keyof CamposCalificacion]] = valor;
  }
  if (opciones?.estado) cambios.estado = opciones.estado;
  if (opciones?.botPausado !== undefined) cambios.bot_pausado = opciones.botPausado;
  if (opciones?.asesorId !== undefined) cambios.asesor_id = opciones.asesorId;

  if (Object.keys(cambios).length === 0) return;

  const base = crearClienteServicio();
  const { error } = await base.from("leads").update(cambios).eq("id", leadId);
  if (error) fallo("actualizar el lead", error.message);
}

export async function actualizarResumen(
  leadId: string,
  resumenIA: string,
): Promise<void> {
  const base = crearClienteServicio();
  const { error } = await base
    .from("leads")
    .update({ resumen_ia: resumenIA })
    .eq("id", leadId);
  if (error) fallo("guardar el resumen", error.message);
}

/** Lo que costo un turno. Se mide desde el primer dia para poder poner precio. */
export async function registrarUsoIA(entrada: {
  inmobiliariaId: string;
  leadId?: string | null;
  mensajeId?: string | null;
  modelo: string;
  tokensEntrada: number;
  tokensSalida: number;
  costoUsd: number;
}): Promise<void> {
  const base = crearClienteServicio();
  const { error } = await base.from("uso_ia").insert({
    inmobiliaria_id: entrada.inmobiliariaId,
    lead_id: entrada.leadId ?? null,
    mensaje_id: entrada.mensajeId ?? null,
    modelo: entrada.modelo,
    tokens_entrada: entrada.tokensEntrada,
    tokens_salida: entrada.tokensSalida,
    costo_usd: entrada.costoUsd,
  });
  // El costo es contabilidad, no parte de la conversacion: si falla se anota y
  // se sigue. Perder una fila de metrica no justifica dejar sin responder.
  if (error) console.error(`No se pudo registrar el uso de IA: ${error.message}`);
}
