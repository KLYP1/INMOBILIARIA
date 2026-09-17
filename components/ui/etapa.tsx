import type { Etapa } from "@/lib/types";
import { etiqueta } from "@/lib/formato";
import { Pildora } from "./pildora";

const TONO = {
  en_planos: "borde",
  en_construccion: "aviso",
  entrega_inmediata: "exito",
} as const;

export function EtapaPildora({ etapa }: { etapa: Etapa }) {
  return <Pildora tono={TONO[etapa]}>{etiqueta(etapa)}</Pildora>;
}
