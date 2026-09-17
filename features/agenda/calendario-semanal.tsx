"use client";

import { COLOR_VISITA, ALTO_HORA, HORA_FIN, HORA_INICIO } from "./estados-visita";
import { DIAS_CORTOS, claveDia, hora, partes } from "@/lib/fechas";
import type { VisitaVista } from "@/lib/vistas";

export type Dia = { clave: string; iso: string; esHoy: boolean };

export function CalendarioSemanal({
  dias,
  visitas,
  seleccionado,
  onSeleccionar,
  onAbrir,
}: {
  dias: Dia[];
  visitas: VisitaVista[];
  seleccionado: string;
  onSeleccionar: (clave: string) => void;
  onAbrir: (id: string) => void;
}) {
  const horas = Array.from(
    { length: HORA_FIN - HORA_INICIO },
    (_, i) => HORA_INICIO + i,
  );

  return (
    // Siete dias no caben en 375px: en celular la semana se arrastra.
    <div className="scroll-fino -mx-1 overflow-x-auto px-1">
    <div className="grid min-w-[620px] grid-cols-[44px_repeat(7,minmax(0,1fr))] lg:min-w-0 lg:grid-cols-[52px_repeat(7,minmax(0,1fr))]">
      <div />
      {dias.map((dia) => {
        const p = partes(dia.iso);
        const activo = dia.clave === seleccionado;
        return (
          <button
            key={dia.clave}
            type="button"
            onClick={() => onSeleccionar(dia.clave)}
            aria-pressed={activo}
            className={`mb-3 rounded-[10px] px-2 py-2 text-center transition-colors duration-200 ${
              activo ? "bg-tinta text-tinta-texto" : "hover:bg-elevado"
            }`}
          >
            <span className="block text-[11px] opacity-70">
              {DIAS_CORTOS[p.diaSemana]}
            </span>
            <span className="mt-0.5 block text-[15px] tabular-nums">{p.dia}</span>
            {dia.esHoy && !activo && (
              <span className="mx-auto mt-1 block size-1 rounded-full bg-ambar" />
            )}
          </button>
        );
      })}

      <div className="col-span-8 grid grid-cols-subgrid">
        <div className="relative">
          {horas.map((h, i) => (
            <span
              key={h}
              className="absolute right-3 -translate-y-1/2 text-[11px] text-tenue tabular-nums"
              style={{ top: i * ALTO_HORA }}
            >
              {h}:00
            </span>
          ))}
        </div>

        {dias.map((dia) => (
          <div
            key={dia.clave}
            className="relative border-l border-borde"
            style={{ height: horas.length * ALTO_HORA }}
          >
            {horas.map((h, i) => (
              <div
                key={h}
                className="absolute inset-x-0 border-t border-borde/60"
                style={{ top: i * ALTO_HORA }}
              />
            ))}

            {visitas
              .filter((v) => claveDia(v.fechaHora) === dia.clave)
              .map((visita) => {
                const p = partes(visita.fechaHora);
                const top =
                  (p.hora - HORA_INICIO) * ALTO_HORA + (p.minuto / 60) * ALTO_HORA;
                return (
                  <button
                    key={visita.id}
                    type="button"
                    onClick={() => onAbrir(visita.id)}
                    aria-label={`Ver la visita de ${visita.leadNombre}`}
                    className={`absolute inset-x-1 overflow-hidden rounded-[10px] px-2 py-1.5 text-left transition-opacity duration-200 hover:opacity-85 ${COLOR_VISITA[visita.estado]}`}
                    style={{ top, height: ALTO_HORA - 6 }}
                  >
                    <p className="text-[11px] tabular-nums opacity-80">
                      {hora(visita.fechaHora)}
                    </p>
                    <p className="truncate text-[12px]">{visita.leadNombre}</p>
                    <p className="truncate text-[11px] opacity-75">
                      {visita.proyectoNombre}
                    </p>
                    <p className="truncate text-[10px] opacity-60">
                      {visita.asesorNombre.split(" ")[0]}
                    </p>
                  </button>
                );
              })}
          </div>
        ))}
      </div>
    </div>
    </div>
  );
}
