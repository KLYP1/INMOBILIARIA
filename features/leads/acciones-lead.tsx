"use client";

import { CalendarPlus, Check } from "lucide-react";
import { Boton, Selector, claseCampo } from "@/components/ui/campo";

export function AccionesLead({
  asesor,
  asesores,
  agendada,
  nota,
  onAsignar,
  onAgendar,
  onNota,
}: {
  asesor: string | null;
  asesores: { id: string; nombre: string }[];
  agendada: boolean;
  nota: string;
  onAsignar: (id: string | null) => void;
  onAgendar: () => void;
  onNota: (texto: string) => void;
}) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 items-end gap-3">
        <Selector
          etiqueta="Asignar a asesor"
          value={asesor ?? ""}
          onChange={(e) => onAsignar(e.target.value || null)}
        >
          <option value="">Sin asignar</option>
          {asesores.map((a) => (
            <option key={a.id} value={a.id}>
              {a.nombre}
            </option>
          ))}
        </Selector>

        <Boton
          variante={agendada ? "claro" : "ambar"}
          onClick={onAgendar}
          disabled={agendada}
        >
          <span className="inline-flex items-center gap-2">
            {agendada ? (
              <Check className="size-4" strokeWidth={1.5} />
            ) : (
              <CalendarPlus className="size-4" strokeWidth={1.5} />
            )}
            {agendada ? "Visita propuesta" : "Agendar visita"}
          </span>
        </Boton>
      </div>

      {agendada && (
        <p className="text-[12px] text-suave">
          El asistente le escribirá para cerrar el día y la hora, y la visita
          aparecerá en la agenda cuando el lead confirme.
        </p>
      )}

      <label className="block">
        <span className="mb-1.5 block text-[11px] text-tenue">
          Notas internas
        </span>
        <textarea
          value={nota}
          onChange={(e) => onNota(e.target.value)}
          rows={3}
          placeholder="Lo que el equipo debe saber antes de llamar"
          className={`${claseCampo} resize-none leading-relaxed placeholder:text-tenue`}
        />
      </label>
    </div>
  );
}
