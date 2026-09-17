import type {
  Canal,
  EstadoLead,
  FormaPago,
  LeadCrudo,
  Objecion,
  Origen,
  Plazo,
} from "../../types";
import { desdeHoy, haceMinutos } from "../../fechas";
import { CONVERSACIONES } from "../conversaciones";

export type Entrada = {
  id: string;
  nombre: string;
  /** Nueve digitos, sin prefijo. Se enmascara al construir. */
  tel: string;
  origen: Origen;
  /** WhatsApp domina en Perú, así que solo se declara la excepción. */
  canal?: Canal;
  proyecto: string;
  /** [min, max] en soles. [0, 0] cuando el lead no lo declaro. */
  pres: [number, number];
  pago: FormaPago;
  dorm: number | null;
  zona: string;
  plazo: Plazo;
  estado: EstadoLead;
  objecion?: Objecion;
  asesor?: string | null;
  /** Segundos que tardo la primera respuesta del asistente. */
  resp: number;
  /** Dias atras en que entro el lead. */
  dias: number;
  /** Minutos desde el ultimo contacto. */
  contacto: number;
  resumen: string;
};

/** "987214550" -> "+51 987 ••• 550" */
function enmascarar(tel: string): string {
  return `+51 ${tel.slice(0, 3)} ••• ${tel.slice(6)}`;
}

/** Hora de ingreso estable y repartida a lo largo del dia laboral. */
function horaIngreso(id: string): [number, number] {
  const n = Number(id.replace(/\D/g, "")) || 1;
  return [8 + (n % 12), (n * 7) % 60];
}

export function crear(e: Entrada): LeadCrudo {
  const [hora, minuto] = horaIngreso(e.id);
  return {
    id: e.id,
    nombre: e.nombre,
    telefono: enmascarar(e.tel),
    origen: e.origen,
    canal: e.canal ?? "whatsapp",
    proyectoInteres: e.proyecto,
    presupuestoMin: e.pres[0],
    presupuestoMax: e.pres[1],
    formaPago: e.pago,
    dormitorios: e.dorm,
    zonaSolicitada: e.zona,
    plazoMudanza: e.plazo,
    estado: e.estado,
    objecion: e.objecion ?? null,
    asesorAsignado: e.asesor ?? null,
    primeraRespuestaSeg: e.resp,
    creadoEn: desdeHoy(-e.dias, hora, minuto),
    ultimoContacto: haceMinutos(e.contacto),
    resumenIA: e.resumen,
    conversacion: CONVERSACIONES[e.id] ?? [],
  };
}
