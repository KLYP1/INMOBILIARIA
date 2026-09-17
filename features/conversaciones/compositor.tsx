"use client";

import { useState } from "react";
import { Send, Undo2 } from "lucide-react";
import { useDemo } from "@/features/estado/proveedor-demo";
import { nombreAsesor } from "@/lib/data/empresa";

/**
 * Caja de respuesta del asesor. Vive en la bandeja y en la ficha del lead:
 * es el mismo componente contra el mismo estado, asi que lo que se escribe en
 * un sitio aparece en el otro.
 */
export function Compositor({
  leadId,
  asesor,
}: {
  leadId: string;
  asesor: string | null;
}) {
  const { enviarMensaje, reanudarBot, botPausado } = useDemo();
  const [texto, setTexto] = useState("");
  const pausado = botPausado[leadId] ?? false;
  const vacio = !texto.trim();

  const enviar = () => {
    if (vacio) return;
    enviarMensaje(leadId, texto);
    setTexto("");
  };

  return (
    <div className="space-y-2.5">
      {pausado && (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-[10px] bg-aviso-fondo px-3.5 py-2.5">
          <span className="text-[12px] text-aviso">
            {asesor
              ? `El asistente está en pausa. La conversación la lleva ${nombreAsesor(asesor)}.`
              : "El asistente está en pausa. La conversación la llevas tú."}
          </span>
          <button
            type="button"
            onClick={() => reanudarBot(leadId)}
            className="inline-flex items-center gap-1.5 rounded-full border border-aviso/30 px-3 py-1 text-[11px] text-aviso transition-colors duration-200 hover:bg-aviso/10"
          >
            <Undo2 className="size-3" strokeWidth={1.5} />
            Devolver al asistente
          </button>
        </div>
      )}

      <div className="flex items-end gap-2 rounded-[10px] border border-borde bg-elevado px-3 py-2.5">
        <textarea
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              enviar();
            }
          }}
          rows={1}
          placeholder="Escribe para responderle tú"
          aria-label="Escribir un mensaje"
          className="scroll-fino max-h-28 flex-1 resize-none bg-transparent text-[13px] leading-relaxed outline-none placeholder:text-tenue"
        />
        <button
          type="button"
          onClick={enviar}
          disabled={vacio}
          aria-label="Enviar mensaje"
          className="rounded-full bg-ambar p-2 text-tinta transition-colors duration-200 hover:bg-tinta hover:text-tinta-texto disabled:bg-borde disabled:text-tenue"
        >
          <Send className="size-4" strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}
