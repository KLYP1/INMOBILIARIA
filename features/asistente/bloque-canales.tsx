import { Bloque } from "./bloque";
import { CanalIcono, NOMBRE_CANAL } from "@/components/ui/canal";
import { Pildora } from "@/components/ui/pildora";
import { plural } from "@/lib/texto";
import type { Canal } from "@/lib/types";

const CUENTAS: { canal: Canal; cuenta: string }[] = [
  { canal: "whatsapp", cuenta: "+51 1 700 4820" },
  { canal: "instagram", cuenta: "@grupovertiente" },
  { canal: "messenger", cuenta: "Grupo Vertiente" },
];

/** Por dónde entran los mensajes. En el piloto es una representación. */
export function BloqueCanales({ conteo }: { conteo: Record<Canal, number> }) {
  return (
    <Bloque
      titulo="Canales conectados"
      descripcion="Por dónde te escriben. El asistente responde en los tres con el mismo criterio."
    >
      <ul className="divide-y divide-borde/60">
        {CUENTAS.map(({ canal, cuenta }) => (
          <li
            key={canal}
            className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
          >
            <span className="flex min-w-0 items-center gap-2.5">
              <CanalIcono canal={canal} className="size-4" />
              <span className="min-w-0">
                <span className="block text-[13px]">{NOMBRE_CANAL[canal]}</span>
                <span className="block truncate text-[11px] text-tenue">
                  {cuenta}
                </span>
              </span>
            </span>

            <span className="flex items-center gap-3">
              <span className="text-[11px] text-tenue tabular-nums">
                {plural(conteo[canal], "conversación", "conversaciones")}
              </span>
              <Pildora tono="exito">Conectado</Pildora>
            </span>
          </li>
        ))}
      </ul>
    </Bloque>
  );
}
