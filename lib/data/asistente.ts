export type Tono = "cercano" | "formal" | "directo";

/**
 * Fuera de la ventana de 24 h que abre el cliente al escribir, WhatsApp exige
 * una plantilla aprobada por Meta. Las de utilidad son baratas y gratis dentro
 * de la ventana; las de marketing siempre se cobran.
 */
export type CategoriaPlantilla = "utilidad" | "marketing";

export type ConfigAsistente = {
  nombre: string;
  tono: Tono;
  horaInicio: string;
  horaFin: string;
  fueraHorario: string;
  preguntas: { id: string; texto: string; activa: boolean }[];
  umbral: number;
  palabras: string[];
  reactivacion: {
    id: string;
    cuando: string;
    categoria: CategoriaPlantilla;
    texto: string;
  }[];
  confirmacion: {
    nocheAnterior: boolean;
    dosHorasAntes: boolean;
    reprogramarSolo: boolean;
    mensajes: {
      id: string;
      cuando: string;
      categoria: CategoriaPlantilla;
      texto: string;
    }[];
  };
  avisos: {
    briefing: boolean;
    leadCaliente: boolean;
  };
};

export const SALUDOS: Record<Tono, (nombre: string) => string> = {
  cercano: (n) =>
    `Hola, soy ${n} de Grupo Vertiente. ¿Qué proyecto te llamó la atención?`,
  formal: (n) =>
    `Buenos días, le saluda ${n}, asistente de Grupo Vertiente. ¿Sobre qué proyecto desea información?`,
  directo: (n) =>
    `Hola, soy ${n} de Grupo Vertiente. ¿En qué distrito buscas y con qué presupuesto?`,
};

export const CONFIG_INICIAL: ConfigAsistente = {
  nombre: "Camila",
  tono: "cercano",
  horaInicio: "08:00",
  horaFin: "21:00",
  fueraHorario:
    "Gracias por escribir. En este momento estamos fuera de horario, pero te respondo apenas abramos a las 8 de la mañana.",
  preguntas: [
    { id: "presupuesto", texto: "Presupuesto aproximado", activa: true },
    { id: "zona", texto: "Distrito donde busca", activa: true },
    { id: "dormitorios", texto: "Número de dormitorios", activa: true },
    { id: "pago", texto: "Forma de pago", activa: true },
    { id: "plazo", texto: "Plazo de mudanza", activa: true },
    { id: "primera", texto: "Si es su primera vivienda", activa: true },
    { id: "trabajo", texto: "Dónde trabaja, para calcular distancias", activa: false },
    { id: "familia", texto: "Cuántas personas se mudarían", activa: false },
  ],
  umbral: 70,
  palabras: ["abogado", "reclamo", "contrato", "descuento especial", "gerente"],
  reactivacion: [
    {
      id: "24h",
      cuando: "24 horas",
      categoria: "marketing",
      texto:
        "Hola, te quedé debiendo la información del departamento que viste. ¿Te la mando por acá?",
    },
    {
      id: "72h",
      cuando: "72 horas",
      categoria: "marketing",
      texto:
        "Se liberó una unidad en el piso que te interesaba. ¿Quieres que te reserve el precio de esta semana?",
    },
    {
      id: "7d",
      cuando: "7 días",
      categoria: "marketing",
      texto:
        "Última consulta y no te escribo más: ¿sigues buscando departamento o lo dejamos para más adelante?",
    },
  ],
  confirmacion: {
    nocheAnterior: true,
    dosHorasAntes: true,
    reprogramarSolo: true,
    mensajes: [
      {
        id: "noche",
        cuando: "La noche anterior",
        categoria: "utilidad",
        texto:
          "Hola, mañana te esperamos a las {hora} en {proyecto}. ¿Confirmas que puedes venir?",
      },
      {
        id: "dos-horas",
        cuando: "Dos horas antes",
        categoria: "utilidad",
        texto:
          "En dos horas te esperamos en {proyecto}. Si se te complicó, dime y lo movemos sin problema.",
      },
    ],
  },
  avisos: {
    briefing: true,
    leadCaliente: true,
  },
};
