/** De dónde vino el lead. */
export type Origen = "meta_ads" | "portal" | "web" | "organico" | "referido";

/**
 * Por dónde ocurre la conversación, que no es lo mismo que el origen: un lead
 * de Meta Ads puede escribir por WhatsApp si el anuncio es click-to-WhatsApp,
 * o por mensaje directo de Instagram.
 */
export type Canal = "whatsapp" | "instagram" | "messenger";

export type FormaPago =
  | "contado"
  | "credito_hipotecario"
  | "mivivienda"
  | "no_definido";

export type Plazo =
  | "inmediato"
  | "3_6_meses"
  | "6_12_meses"
  | "solo_explorando";

export type EstadoLead =
  | "nuevo"
  | "en_conversacion"
  | "calificado"
  | "visita_agendada"
  | "frio"
  | "descartado";

export type Objecion =
  | "precio"
  | "ubicacion"
  | "financiamiento"
  | "metraje"
  | "plazo_entrega"
  | null;

export type Mensaje = {
  autor: "lead" | "asistente" | "asesor";
  texto: string;
  hora: string;
  /** Lo escribio quien esta usando el panel, no un asesor del historico. */
  propio?: boolean;
};

export type Lead = {
  id: string;
  nombre: string;
  telefono: string;
  origen: Origen;
  canal: Canal;
  proyectoInteres: string;
  presupuestoMin: number;
  presupuestoMax: number;
  formaPago: FormaPago;
  dormitorios: number | null;
  zonaSolicitada: string;
  plazoMudanza: Plazo;
  score: number;
  estado: EstadoLead;
  objecion: Objecion;
  asesorAsignado: string | null;
  primeraRespuestaSeg: number;
  creadoEn: string;
  ultimoContacto: string;
  resumenIA: string;
  /** Un humano tomo la conversacion y el asistente se calla hasta que la suelte. */
  botPausado: boolean;
  conversacion: Mensaje[];
};

/** Lo que vive en los archivos de datos: el score nunca se escribe a mano. */
export type LeadCrudo = Omit<Lead, "score">;

export type Unidad = {
  id: string;
  dormitorios: number;
  metraje: number;
  precio: number;
  disponibles: number;
};

export type Etapa = "en_planos" | "en_construccion" | "entrega_inmediata";

export type Proyecto = {
  id: string;
  nombre: string;
  distrito: string;
  lat: number;
  lng: number;
  etapa: Etapa;
  unidades: Unidad[];
};

export type EstadoVisita =
  | "confirmada"
  | "pendiente_confirmacion"
  | "asistio"
  | "no_asistio"
  | "reprogramada";

export type Visita = {
  id: string;
  leadId: string;
  proyectoId: string;
  fechaHora: string;
  asesor: string;
  estado: EstadoVisita;
};

export type Asesor = {
  id: string;
  nombre: string;
  telefono: string;
  proyectos: string[];
};

/** Cuando el asistente vuelve a escribirle a un lead que se enfrio. */
export type PlazoSeguimiento = "manana" | "tres_dias" | "semana";

export type Seguimiento = {
  plazo: PlazoSeguimiento;
  /** Dia en que sale el mensaje, en ISO. */
  fecha: string;
};

export type ResultadoVisita = {
  interes: "alto" | "medio" | "bajo";
  siguientePaso:
    | "cotizacion"
    | "segunda_visita"
    | "separacion"
    | "seguimiento"
    | "descartar";
  nota: string;
};
