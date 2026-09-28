"use client";

import { Bot, ChevronLeft, Undo2 } from "lucide-react";
import { CanalEtiqueta } from "@/components/ui/canal";
import { Pildora } from "@/components/ui/pildora";
import { telefonoVisible } from "@/lib/formato";
import { EstadoLeadPildora } from "@/components/ui/estado-lead";
import { useDemo } from "@/features/estado/proveedor-demo";
import type { LeadVista } from "@/lib/vistas";

export function CabeceraHilo({
  lead,
  onVolver,
}: {
  lead: LeadVista;
  onVolver?: () => void;
}) {
  const { botPausado, reanudarBot } = useDemo();
  const pausado = botPausado[lead.id] ?? false;

  return (
    <header className="flex flex-wrap items-start justify-between gap-3 border-b border-borde pb-4">
      <div className="flex min-w-0 items-start gap-2">
        {/* En celular la lista y el hilo comparten columna: hay que poder volver. */}
        {onVolver && (
          <button
            type="button"
            onClick={onVolver}
            aria-label="Volver a la lista de conversaciones"
            className="-ml-1 shrink-0 rounded-full p-1 text-suave transition-colors duration-200 hover:bg-elevado lg:hidden"
          >
            <ChevronLeft className="size-4" strokeWidth={1.5} />
          </button>
        )}
        <div className="min-w-0">
        <h2 className="truncate text-[15px]">{lead.nombre}</h2>
        <p className="mt-1 flex flex-wrap items-center gap-x-1.5 text-[11px] text-tenue">
          <CanalEtiqueta canal={lead.canal} />
          <span aria-hidden>·</span>
          {telefonoVisible(lead.telefono)}
          <span aria-hidden>·</span>
          {lead.proyectoNombre}
        </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <EstadoLeadPildora estado={lead.estado} />
        {pausado ? (
          <button
            type="button"
            onClick={() => reanudarBot(lead.id)}
            className="transition-opacity duration-200 hover:opacity-70"
          >
            <Pildora tono="aviso" className="gap-1.5">
              <Undo2 className="size-3" strokeWidth={1.5} />
              Devolver al asistente
            </Pildora>
          </button>
        ) : (
          <Pildora tono="borde" className="gap-1.5">
            <Bot className="size-3" strokeWidth={1.5} />
            Responde el asistente
          </Pildora>
        )}
      </div>
    </header>
  );
}
