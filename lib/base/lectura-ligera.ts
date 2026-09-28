import { crearClienteServicio } from "./cliente-supabase";
import { aLeadCrudo, aMensaje, aProyecto, normalizarTelefono, type Fila } from "./mapeo";
import type { ConfigAsistente } from "../data/asistente";
import type { LeadCrudo, Mensaje, Proyecto } from "../types";

/**
 * Consultas chicas para el trabajador de canales.
 *
 * cargarDatos() trae la inmobiliaria entera, que es lo correcto para pintar
 * una pantalla y un desperdicio para contestar un mensaje: traer sesenta leads
 * y ciento cuarenta mensajes por cada "hola" que llega no tiene sentido.
 *
 * Sin `server-only`: el trabajador corre fuera de Next.
 */

const COLUMNAS_PROYECTO =
  "id, slug, nombre, distrito, lat, lng, etapa, unidades(id, dormitorios, metraje, precio, disponibles)";

export async function obtenerInmobiliariaPrincipal(): Promise<{
  id: string;
  nombre: string;
}> {
  const base = crearClienteServicio();
  const { data, error } = await base
    .from("inmobiliarias")
    .select("id, nombre")
    .order("creada_en")
    .limit(1);
  if (error) throw new Error(`No se pudo leer la inmobiliaria: ${error.message}`);
  const fila = data?.[0];
  if (!fila) {
    throw new Error(
      "La base no tiene ninguna inmobiliaria. Corre: npm run sembrar",
    );
  }
  return { id: String(fila.id), nombre: String(fila.nombre) };
}

/** Lo que el bot necesita saber una vez, no en cada mensaje. */
export async function cargarContextoAsistente(): Promise<{
  inmobiliariaId: string;
  nombre: string;
  proyectos: Proyecto[];
  config: ConfigAsistente;
}> {
  const base = crearClienteServicio();
  const inmobiliaria = await obtenerInmobiliariaPrincipal();

  const [proyectosRes, configRes] = await Promise.all([
    base.from("proyectos").select(COLUMNAS_PROYECTO)
      .eq("inmobiliaria_id", inmobiliaria.id).order("nombre"),
    base.from("config_asistente").select("config")
      .eq("inmobiliaria_id", inmobiliaria.id).limit(1),
  ]);

  if (proyectosRes.error) {
    throw new Error(`No se pudieron leer los proyectos: ${proyectosRes.error.message}`);
  }
  if (configRes.error) {
    throw new Error(`No se pudo leer la configuracion: ${configRes.error.message}`);
  }

  const config = configRes.data?.[0]?.config as ConfigAsistente | undefined;
  if (!config) {
    throw new Error(
      "Esta inmobiliaria no tiene configuracion de asistente. Corre: npm run sembrar",
    );
  }

  return {
    inmobiliariaId: inmobiliaria.id,
    nombre: inmobiliaria.nombre,
    proyectos: ((proyectosRes.data ?? []) as Fila[]).map(aProyecto),
    config,
  };
}

/**
 * El lead de un telefono con su conversacion. Devuelve null si nunca escribio:
 * quien decide crearlo es escribir.ts, no esta consulta.
 */
export async function obtenerLeadConHistorial(
  inmobiliariaId: string,
  telefono: string,
): Promise<{ lead: LeadCrudo; mensajes: Mensaje[] } | null> {
  const base = crearClienteServicio();

  const { data, error } = await base
    .from("leads")
    .select("*, proyectos(slug)")
    .eq("inmobiliaria_id", inmobiliariaId)
    .eq("telefono", normalizarTelefono(telefono))
    .limit(1);
  if (error) throw new Error(`No se pudo buscar el lead: ${error.message}`);

  const fila = data?.[0] as Fila | undefined;
  if (!fila) return null;

  const { data: msj, error: e2 } = await base
    .from("mensajes")
    .select("autor, texto, propio, enviado_en")
    .eq("lead_id", String(fila.id))
    .order("enviado_en");
  if (e2) throw new Error(`No se pudieron leer los mensajes: ${e2.message}`);

  const mensajes = ((msj ?? []) as Fila[]).map(aMensaje);
  const slug = (fila.proyectos as { slug?: string } | null)?.slug ?? "";

  return {
    lead: aLeadCrudo(fila, () => slug, mensajes),
    mensajes,
  };
}
