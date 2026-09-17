"use client";

import { Bloque } from "./bloque";
import { Interruptor } from "@/components/ui/interruptor";
import { Selector, claseCampo } from "@/components/ui/campo";
import type { ConfigAsistente, Tono } from "@/lib/data/asistente";
import { plural } from "@/lib/texto";

type Props = {
  config: ConfigAsistente;
  onCambio: (parcial: Partial<ConfigAsistente>) => void;
};

export function BloqueIdentidad({ config, onCambio }: Props) {
  return (
    <Bloque
      titulo="Nombre y tono"
      descripcion="Con qué nombre se presenta y cómo suena al escribir."
    >
      <div className="grid grid-cols-2 gap-4">
        <label className="block">
          <span className="mb-1.5 block text-[11px] text-tenue">Nombre</span>
          <input
            value={config.nombre}
            onChange={(e) => onCambio({ nombre: e.target.value })}
            className={claseCampo}
          />
          {!config.nombre.trim() && (
            <span className="mt-1.5 block text-[11px] text-aviso">
              Ponle un nombre o se presentará como «el asistente».
            </span>
          )}
        </label>

        <Selector
          etiqueta="Tono"
          value={config.tono}
          onChange={(e) => onCambio({ tono: e.target.value as Tono })}
        >
          <option value="cercano">Cercano</option>
          <option value="formal">Formal</option>
          <option value="directo">Directo</option>
        </Selector>
      </div>
    </Bloque>
  );
}

export function BloqueHorario({ config, onCambio }: Props) {
  return (
    <Bloque
      titulo="Horario de atención"
      descripcion="Fuera de este rango responde el mensaje de abajo y guarda el lead igual."
    >
      <div className="grid grid-cols-2 gap-4">
        <label className="block">
          <span className="mb-1.5 block text-[11px] text-tenue">Desde</span>
          <input
            type="time"
            value={config.horaInicio}
            onChange={(e) => onCambio({ horaInicio: e.target.value })}
            className={`${claseCampo} tabular-nums`}
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[11px] text-tenue">Hasta</span>
          <input
            type="time"
            value={config.horaFin}
            onChange={(e) => onCambio({ horaFin: e.target.value })}
            className={`${claseCampo} tabular-nums`}
          />
        </label>
      </div>

      <label className="mt-4 block">
        <span className="mb-1.5 block text-[11px] text-tenue">
          Mensaje fuera de horario
        </span>
        <textarea
          value={config.fueraHorario}
          onChange={(e) => onCambio({ fueraHorario: e.target.value })}
          rows={3}
          className={`${claseCampo} resize-none leading-relaxed`}
        />
      </label>
    </Bloque>
  );
}

export function BloquePreguntas({ config, onCambio }: Props) {
  const activas = config.preguntas.filter((p) => p.activa).length;

  return (
    <Bloque
      titulo="Preguntas de calificación"
      descripcion={
        activas === 0
          ? "El asistente no está preguntando nada."
          : `El asistente hace ${plural(activas, "pregunta", "preguntas")} antes de proponer una visita.`
      }
    >
      {activas === 0 && (
        <p className="mb-4 rounded-[10px] bg-aviso-fondo px-3.5 py-3 text-[12px] text-aviso">
          Sin ninguna pregunta activa no puede calificar a nadie, y todos los
          leads llegarán con score cero.
        </p>
      )}

      <ul className="divide-y divide-borde/60">
        {config.preguntas.map((pregunta) => (
          <li
            key={pregunta.id}
            className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
          >
            <span
              className={`text-[13px] ${pregunta.activa ? "text-texto" : "text-tenue"}`}
            >
              {pregunta.texto}
            </span>
            <Interruptor
              activo={pregunta.activa}
              etiqueta={pregunta.texto}
              onCambio={(valor) =>
                onCambio({
                  preguntas: config.preguntas.map((p) =>
                    p.id === pregunta.id ? { ...p, activa: valor } : p,
                  ),
                })
              }
            />
          </li>
        ))}
      </ul>
    </Bloque>
  );
}
