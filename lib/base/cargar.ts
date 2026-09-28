import "server-only";
import { clienteServidor } from "./servidor";
import { aLeadCrudo, aMensaje, aProyecto, aVisita, type Fila } from "./mapeo";
import { calcularScore } from "../scoring";
import type { ConfigAsistente } from "../data/asistente";
import type { Asesor, Lead, Mensaje, Proyecto, Visita } from "../types";

/**
 * Una foto completa de una inmobiliaria, leida de una vez.
 *
 * Las metricas y los modelos de vista reciben esta foto en vez de ir a buscar
 * los datos cada una: son dieciseis funciones y consultar por separado seria
 * dieciseis viajes a la base para pintar una sola pantalla.
 */
export type Datos = {
  inmobiliariaId: string;
  nombre: string;
  leads: Lead[];
  proyectos: Proyecto[];
  visitas: Visita[];
  asesores: Asesor[];
  config: ConfigAsistente;
};

function error(paso: string, detalle: string): never {
  throw new Error(`No se pudo leer ${paso}: ${detalle}`);
}

const COLUMNAS_PROYECTO =
  "id, slug, nombre, distrito, lat, lng, etapa, unidades(id, dormitorios, metraje, precio, disponibles)";

export async function cargarDatos(): Promise<Datos> {
  const base = clienteServidor();

  const { data: inmobiliarias, error: e1 } = await base
    .from("inmobiliarias")
    .select("id, nombre")
    .order("creada_en")
    .limit(1);
  if (e1) error("la inmobiliaria", e1.message);
  const inmobiliaria = inmobiliarias?.[0];
  if (!inmobiliaria) {
    throw new Error(
      "La base no tiene ninguna inmobiliaria. Corre: npm run sembrar",
    );
  }
  const tenant = inmobiliaria.id as string;

  const [proyectosRes, asesoresRes, vinculosRes, leadsRes, mensajesRes, visitasRes, configRes] =
    await Promise.all([
      base.from("proyectos").select(COLUMNAS_PROYECTO).eq("inmobiliaria_id", tenant).order("nombre"),
      base.from("asesores").select("id, nombre, telefono").eq("inmobiliaria_id", tenant).order("nombre"),
      base.from("asesores_proyectos").select("asesor_id, proyecto_id"),
      base.from("leads").select("*").eq("inmobiliaria_id", tenant).order("ultimo_contacto", { ascending: false }),
      base.from("mensajes").select("lead_id, autor, texto, propio, enviado_en").order("enviado_en"),
      base.from("visitas").select("*").eq("inmobiliaria_id", tenant).order("fecha_hora"),
      base.from("config_asistente").select("config").eq("inmobiliaria_id", tenant).limit(1),
    ]);

  for (const [paso, res] of [
    ["los proyectos", proyectosRes],
    ["los asesores", asesoresRes],
    ["los vinculos de asesores", vinculosRes],
    ["los leads", leadsRes],
    ["los mensajes", mensajesRes],
    ["las visitas", visitasRes],
    ["la configuracion", configRes],
  ] as const) {
    if (res.error) error(paso, res.error.message);
  }

  // El dominio identifica los proyectos por slug; la base, por uuid.
  const slug = new Map<string, string>();
  for (const p of (proyectosRes.data ?? []) as Fila[]) {
    slug.set(String(p.id), String(p.slug));
  }
  const slugDe = (id: unknown) => slug.get(String(id)) ?? "";

  const proyectos = ((proyectosRes.data ?? []) as Fila[]).map(aProyecto);

  const porAsesor = new Map<string, string[]>();
  for (const v of (vinculosRes.data ?? []) as Fila[]) {
    const s = slugDe(v.proyecto_id);
    if (!s) continue;
    const lista = porAsesor.get(String(v.asesor_id)) ?? [];
    lista.push(s);
    porAsesor.set(String(v.asesor_id), lista);
  }

  const asesores: Asesor[] = ((asesoresRes.data ?? []) as Fila[]).map((a) => ({
    id: String(a.id),
    nombre: String(a.nombre),
    telefono: String(a.telefono ?? ""),
    proyectos: porAsesor.get(String(a.id)) ?? [],
  }));

  const conversaciones = new Map<string, Mensaje[]>();
  for (const m of (mensajesRes.data ?? []) as Fila[]) {
    const lista = conversaciones.get(String(m.lead_id)) ?? [];
    lista.push(aMensaje(m));
    conversaciones.set(String(m.lead_id), lista);
  }

  const leads: Lead[] = ((leadsRes.data ?? []) as Fila[]).map((fila) => {
    const crudo = aLeadCrudo(fila, slugDe, conversaciones.get(String(fila.id)) ?? []);
    // El score se calcula al leer, contra el inventario de ahora. Guardarlo
    // envejece mal: el lead no cambio, pero se agoto la unidad que le calzaba.
    return { ...crudo, score: calcularScore(crudo, proyectos) };
  });

  const visitas = ((visitasRes.data ?? []) as Fila[]).map((v) => aVisita(v, slugDe));

  return {
    inmobiliariaId: tenant,
    nombre: String(inmobiliaria.nombre),
    leads,
    proyectos,
    visitas,
    asesores,
    config: configRes.data?.[0]?.config as ConfigAsistente,
  };
}
