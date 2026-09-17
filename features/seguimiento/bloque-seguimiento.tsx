"use client";

import { RotateCcw, X } from "lucide-react";
import { Pildora } from "@/components/ui/pildora";
import { useDemo } from "@/features/estado/proveedor-demo";
import { PLAZOS, cuandoSale, mensajeSeguimiento } from "@/lib/seguimiento";
import type { LeadVista } from "@/lib/vistas";

/**
 * Un lead tibio no se pierde por falta de interes, se pierde porque nadie
 * volvio a escribirle. Esto le devuelve la conversacion al asistente con fecha.
 */
export function BloqueSeguimiento({ lead }: { lead: LeadVista }) {
  const { seguimientos, programarSeguimiento, cancelarSeguimiento } = useDemo();
  const programado = seguimientos[lead.id];
  const texto = mensajeSeguimiento(lead);

  return (
    <div>
      <div className="flex items-center gap-2">
        <RotateCcw className="size-3.5 text-tenue" strokeWidth={1.5} />
        <p className="text-[11px] text-tenue">Recuperar al cliente</p>
      </div>

      {programado ? (
        <div className="mt-3">
          <div className="flex flex-wrap items-center gap-2">
            <Pildora tono="exito">
              Le escribe el {cuandoSale(programado.plazo)}
            </Pildora>
            <button
              type="button"
              onClick={() => cancelarSeguimiento(lead.id)}
              className="inline-flex items-center gap-1 text-[11px] text-suave transition-colors duration-200 hover:text-texto"
            >
              <X className="size-3" strokeWidth={1.5} />
              Cancelar
            </button>
          </div>

          <div className="mt-3 max-w-[92%] rounded-[14px] bg-tinta px-4 py-3.5 text-tinta-texto">
            <p className="text-[13px] leading-relaxed">{texto}</p>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Pildora tono="aviso">Plantilla de marketing</Pildora>
            <span className="text-[11px] text-tenue">
              Sale fuera de las 24 horas, así que Meta la cobra por envío.
            </span>
          </div>
        </div>
      ) : (
        <>
          <p className="mt-2 text-[12px] text-suave">
            El asistente le vuelve a escribir solo y te avisa si contesta.
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {PLAZOS.map((plazo) => (
              <button
                key={plazo.clave}
                type="button"
                onClick={() => programarSeguimiento(lead.id, plazo.clave)}
                className="rounded-full border border-borde px-3.5 py-2 text-[12px] text-suave transition-colors duration-200 hover:bg-elevado hover:text-texto"
              >
                {plazo.texto}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
