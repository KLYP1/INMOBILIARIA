"use client";

import { Check, X } from "lucide-react";
import { Tarjeta } from "@/components/ui/tarjeta";
import { Pildora } from "@/components/ui/pildora";
import { useDemo } from "@/features/estado/proveedor-demo";
import { hora } from "@/lib/fechas";
import { plural } from "@/lib/texto";
import type { VisitaVista } from "@/lib/vistas";

const GRUPOS = [
  { clave: "proxima", texto: "Ahora" },
  { clave: "despues", texto: "Después" },
  { clave: "pasada", texto: "Ya pasaron" },
] as const;

/**
 * La vista del vendedor en obra: una cola, no una rejilla. Una caseta de
 * ventas funciona como sala de espera, no como horario de trenes.
 */
export function ColaHoy({
  visitas,
  onAbrir,
}: {
  visitas: VisitaVista[];
  onAbrir: (id: string) => void;
}) {
  const { llegadas, marcarLlegada } = useDemo();
  const todasPasaron = visitas.every((v) => v.momento === "pasada");

  return (
    <Tarjeta className="p-5">
      <p className="text-[14px] font-medium">Hoy</p>
      <p className="mt-1 text-[12px] text-tenue">
        {plural(visitas.length, "visita agendada", "visitas agendadas")}.
      </p>

      {visitas.length === 0 ? (
        <p className="mt-6 text-[13px] text-suave">
          Hoy no hay visitas agendadas.
        </p>
      ) : (
        <div className="mt-5 space-y-6">
          {GRUPOS.map((grupo) => {
            const delGrupo = visitas.filter((v) => v.momento === grupo.clave);
            if (delGrupo.length === 0) return null;

            return (
              <section key={grupo.clave}>
                <p className="mb-2.5 text-[11px] text-tenue">{grupo.texto}</p>
                <ul className="space-y-2.5">
                  {delGrupo.map((visita) => {
                    const llego = llegadas[visita.id];
                    return (
                      <li
                        key={visita.id}
                        className={`rounded-[10px] px-4 py-3.5 ${
                          grupo.clave === "proxima"
                            ? "bg-ambar text-tinta"
                            : "bg-elevado"
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => onAbrir(visita.id)}
                          className="block w-full text-left"
                        >
                          <span className="flex items-baseline gap-2.5">
                            <span className="text-[15px] tabular-nums">
                              {hora(visita.fechaHora)}
                            </span>
                            <span className="min-w-0 flex-1 truncate text-[14px]">
                              {visita.leadNombre}
                            </span>
                          </span>
                          <span className="mt-0.5 block truncate text-[12px] opacity-70">
                            {visita.proyectoNombre} · {visita.asesorNombre}
                          </span>
                        </button>

                        {llego === undefined ? (
                          <div className="mt-3 flex gap-2">
                            <button
                              type="button"
                              onClick={() => marcarLlegada(visita.id, true)}
                              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-tinta px-3 py-2 text-[12px] text-tinta-texto transition-colors duration-200 hover:bg-texto/85"
                            >
                              <Check className="size-3.5" strokeWidth={1.5} />
                              Llegó
                            </button>
                            <button
                              type="button"
                              onClick={() => marcarLlegada(visita.id, false)}
                              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border border-borde px-3 py-2 text-[12px] transition-colors duration-200 hover:bg-crema"
                            >
                              <X className="size-3.5" strokeWidth={1.5} />
                              No vino
                            </button>
                          </div>
                        ) : (
                          <div className="mt-3">
                            <Pildora tono={llego ? "exito" : "peligro"}>
                              {llego ? "Llegó" : "No vino"}
                            </Pildora>
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </section>
            );
          })}
        </div>
      )}

      {visitas.length > 0 && todasPasaron && (
        <p className="mt-5 border-t border-borde pt-4 text-[12px] text-suave">
          Ya pasaron todas las de hoy. Registra las que falten para que el
          asistente retome el seguimiento.
        </p>
      )}
    </Tarjeta>
  );
}
