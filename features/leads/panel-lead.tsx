"use client";

import { EstadoLeadPildora, Semaforo } from "@/components/ui/estado-lead";
import { PanelLateral } from "@/components/ui/panel-lateral";
import { useDemo } from "@/features/estado/proveedor-demo";
import { AccionesLead } from "./acciones-lead";
import { AlternativasLead, FichaLead } from "./ficha-lead";
import { Conversacion } from "./conversacion";
import { Compositor } from "@/features/conversaciones/compositor";
import { BloqueSeguimiento } from "@/features/seguimiento/bloque-seguimiento";
import type { LeadVista } from "@/lib/vistas";

export function PanelLead({
  lead,
  asesores,
  onCerrar,
}: {
  lead: LeadVista | null;
  asesores: { id: string; nombre: string }[];
  onCerrar: () => void;
}) {
  const demo = useDemo();

  if (!lead) return null;

  return (
    <PanelLateral
      abierto
      etiqueta={`Ficha de ${lead.nombre}`}
      onCerrar={onCerrar}
      cabecera={
        <>
          <div className="flex items-center gap-2">
            <Semaforo nivel={lead.nivel} />
            <h2 className="truncate text-[17px] font-normal">{lead.nombre}</h2>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <EstadoLeadPildora estado={lead.estado} />
            <span className="text-[12px] text-tenue">
              Score {lead.score} · {lead.asesorNombre}
            </span>
          </div>
        </>
      }
      pie={
        <AccionesLead
          asesor={lead.asesorAsignado}
          asesores={asesores}
          agendada={demo.agendadas[lead.id] ?? false}
          nota={demo.notas[lead.id] ?? ""}
          onAsignar={(id) => demo.asignar(lead.id, id)}
          onAgendar={() => demo.proponerVisita(lead.id)}
          onNota={(texto) => demo.anotar(lead.id, texto)}
        />
      }
    >
      <FichaLead lead={lead} />

      <div>
        <p className="mb-3 text-[11px] text-tenue">Conversación en WhatsApp</p>
        <Conversacion
          mensajes={demo.conversacionDe(lead.id, lead.conversacion)}
          asesorNombre={lead.asesorAsignado ? lead.asesorNombre : null}
        />
        <div className="mt-4">
          <Compositor leadId={lead.id} asesorNombre={lead.asesorAsignado ? lead.asesorNombre : null} />
        </div>
      </div>

      <AlternativasLead lead={lead} />

      <div className="border-t border-borde pt-5">
        <BloqueSeguimiento lead={lead} />
      </div>
    </PanelLateral>
  );
}
