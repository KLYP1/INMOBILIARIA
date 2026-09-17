"use client";

import { Bloque } from "./bloque";
import { Interruptor } from "@/components/ui/interruptor";
import { Pildora } from "@/components/ui/pildora";
import { claseCampo } from "@/components/ui/campo";
import type { ConfigAsistente } from "@/lib/data/asistente";

type Props = {
  config: ConfigAsistente;
  onCambio: (parcial: Partial<ConfigAsistente>) => void;
};

/** La función que ataca la tasa de asistencia de frente. */
export function BloqueConfirmacion({ config, onCambio }: Props) {
  const { confirmacion } = config;
  const cambiar = (parcial: Partial<ConfigAsistente["confirmacion"]>) =>
    onCambio({ confirmacion: { ...confirmacion, ...parcial } });

  const interruptores = [
    {
      clave: "nocheAnterior" as const,
      texto: "Confirmar la noche anterior",
      activo: confirmacion.nocheAnterior,
    },
    {
      clave: "dosHorasAntes" as const,
      texto: "Recordar dos horas antes",
      activo: confirmacion.dosHorasAntes,
    },
    {
      clave: "reprogramarSolo" as const,
      texto: "Reprogramar solo si responde que no puede",
      activo: confirmacion.reprogramarSolo,
    },
  ];

  return (
    <Bloque
      titulo="Confirmación de visitas"
      descripcion="Los clientes vienen del trabajo y llegan tarde. Confirmar es lo que hace que aparezcan."
    >
      <ul className="divide-y divide-borde/60">
        {interruptores.map((i) => (
          <li
            key={i.clave}
            className="flex items-center justify-between gap-4 py-3 first:pt-0"
          >
            <span className={`text-[13px] ${i.activo ? "text-texto" : "text-tenue"}`}>
              {i.texto}
            </span>
            <Interruptor
              activo={i.activo}
              etiqueta={i.texto}
              onCambio={(v) => cambiar({ [i.clave]: v })}
            />
          </li>
        ))}
      </ul>

      <p className="mt-4 text-[12px] text-suave">
        Son plantillas de utilidad, la categoría barata, y salen gratis si el
        cliente te escribió en las 24 horas previas.
      </p>

      <div className="mt-4 space-y-4">
        {confirmacion.mensajes.map((mensaje) => (
          <label key={mensaje.id} className="block">
            <span className="mb-1.5 flex items-center justify-between gap-2">
              <span className="text-[11px] text-tenue">{mensaje.cuando}</span>
              <Pildora tono="exito">Plantilla de {mensaje.categoria}</Pildora>
            </span>
            <textarea
              value={mensaje.texto}
              onChange={(e) =>
                cambiar({
                  mensajes: confirmacion.mensajes.map((m) =>
                    m.id === mensaje.id ? { ...m, texto: e.target.value } : m,
                  ),
                })
              }
              rows={2}
              className={`${claseCampo} resize-none leading-relaxed`}
            />
          </label>
        ))}
      </div>
    </Bloque>
  );
}

/** Lo que el asesor recibe en su propio celular, estando en obra. */
export function BloqueAvisos({ config, onCambio }: Props) {
  const { avisos } = config;
  const opciones = [
    {
      clave: "briefing" as const,
      texto: "Briefing 30 minutos antes de cada visita",
      detalle: "Quién llega, qué busca y qué unidad mostrarle.",
      activo: avisos.briefing,
    },
    {
      clave: "leadCaliente" as const,
      texto: "Aviso de lead caliente",
      detalle:
        "Calificado, con mudanza inmediata y presupuesto que alcanza. Llega al toque.",
      activo: avisos.leadCaliente,
    },
  ];

  return (
    <Bloque
      titulo="Aviso al asesor"
      descripcion="Lo que le llega a quien está en obra, sin que tenga que abrir el panel."
    >
      <ul className="divide-y divide-borde/60">
        {opciones.map((o) => (
          <li
            key={o.clave}
            className="flex items-start justify-between gap-4 py-3.5 first:pt-0 last:pb-0"
          >
            <span className="min-w-0">
              <span className={`block text-[13px] ${o.activo ? "text-texto" : "text-tenue"}`}>
                {o.texto}
              </span>
              <span className="mt-0.5 block text-[11px] text-tenue">
                {o.detalle}
              </span>
            </span>
            <Interruptor
              activo={o.activo}
              etiqueta={o.texto}
              onCambio={(v) => onCambio({ avisos: { ...avisos, [o.clave]: v } })}
            />
          </li>
        ))}
      </ul>
    </Bloque>
  );
}
