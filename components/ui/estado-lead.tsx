import type { EstadoLead } from "@/lib/types";
import { etiqueta } from "@/lib/formato";
import { Pildora } from "./pildora";

const TONO = {
  nuevo: "borde",
  en_conversacion: "aviso",
  calificado: "exito",
  visita_agendada: "ambar",
  frio: "neutro",
  descartado: "peligro",
} as const;

export function EstadoLeadPildora({ estado }: { estado: EstadoLead }) {
  return <Pildora tono={TONO[estado]}>{etiqueta(estado)}</Pildora>;
}

const COLOR_PUNTO: Record<string, string> = {
  calificado: "bg-exito",
  en_conversacion: "bg-ambar",
  frio: "bg-tenue",
};

/** Semaforo de calificacion: verde, ambar o gris segun el score. */
export function Semaforo({ nivel }: { nivel: string }) {
  return (
    <span
      className={`inline-block size-2 shrink-0 rounded-full ${COLOR_PUNTO[nivel] ?? "bg-tenue"}`}
      aria-hidden
    />
  );
}
