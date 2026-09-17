"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PanelLateral } from "@/components/ui/panel-lateral";
import { useDemo } from "@/features/estado/proveedor-demo";
import { Pildora } from "@/components/ui/pildora";
import { EstadoLeadPildora } from "@/components/ui/estado-lead";
import { RegistroResultado } from "./registro-resultado";
import { BloqueSeguimiento } from "@/features/seguimiento/bloque-seguimiento";
import { dormitorios, etiqueta, rangoMiles } from "@/lib/formato";
import { fechaLarga, hora } from "@/lib/fechas";
import type { VisitaVista } from "@/lib/vistas";

function Dato({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <div>
      <p className="text-[11px] text-tenue">{rotulo}</p>
      <p className="mt-0.5 text-[13px]">{valor}</p>
    </div>
  );
}

export function FichaVisita({
  visita,
  onCerrar,
}: {
  visita: VisitaVista | null;
  onCerrar: () => void;
}) {
  // El hook va antes de la salida temprana, que es donde ESLint lo exige.
  const { resultados } = useDemo();

  if (!visita) return null;
  const lead = visita.lead;
  const resultado = resultados[visita.id];

  return (
    <PanelLateral
      abierto
      etiqueta={`Visita de ${visita.leadNombre}`}
      onCerrar={onCerrar}
      cabecera={
        <>
          <h2 className="truncate text-[17px] font-normal">
            {visita.leadNombre}
          </h2>
          <p className="mt-1 text-[12px] text-tenue">
            {fechaLarga(visita.fechaHora)} a las {hora(visita.fechaHora)} ·{" "}
            {visita.proyectoNombre}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {lead && <EstadoLeadPildora estado={lead.estado} />}
            <Pildora tono="borde">{etiqueta(visita.estado)}</Pildora>
            <span className="text-[12px] text-tenue">
              Atiende {visita.asesorNombre}
            </span>
          </div>
        </>
      }
    >
      {lead && (
        <>
          <div className="rounded-[10px] bg-elevado px-4 py-4">
            <p className="text-[11px] text-tenue">Qué busca</p>
            <p className="mt-2 text-[14px] leading-relaxed">{lead.resumenIA}</p>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            <Dato
              rotulo="Presupuesto"
              valor={rangoMiles(lead.presupuestoMin, lead.presupuestoMax)}
            />
            <Dato rotulo="Dormitorios" valor={dormitorios(lead.dormitorios)} />
            <Dato rotulo="Forma de pago" valor={etiqueta(lead.formaPago)} />
            <Dato rotulo="Plazo" valor={etiqueta(lead.plazoMudanza)} />
            <Dato rotulo="Zona pedida" valor={lead.zonaSolicitada} />
            <Dato rotulo="Score" valor={`${lead.score} de 100`} />
          </div>
        </>
      )}

      <div>
        <p className="mb-2 text-[11px] text-tenue">
          Lo que le llega al asesor 30 minutos antes
        </p>
        <div className="max-w-[92%] rounded-[14px] bg-tinta px-4 py-3.5 text-tinta-texto">
          {visita.briefing.map((linea, i) => (
            <p key={i} className="text-[13px] leading-relaxed">
              {linea}
            </p>
          ))}
        </div>
      </div>

      <div className="border-t border-borde pt-5">
        <p className="mb-3 text-[11px] text-tenue">Resultado de la visita</p>
        <RegistroResultado visitaId={visita.id} />
      </div>

      {/* Si salio interesado hay algo que recuperar; si salio frio, no. */}
      {lead && resultado && resultado.interes !== "bajo" && (
        <div className="border-t border-borde pt-5">
          <BloqueSeguimiento lead={lead} />
        </div>
      )}

      <div className="flex flex-wrap gap-4 border-t border-borde pt-5">
        <Link
          href={`/leads?lead=${visita.leadId}`}
          className="inline-flex items-center gap-2 text-[12px] text-suave transition-colors duration-200 hover:text-texto"
        >
          Ver ficha completa
          <ArrowRight className="size-3.5" strokeWidth={1.5} />
        </Link>
        <Link
          href={`/conversaciones?chat=${visita.leadId}`}
          className="inline-flex items-center gap-2 text-[12px] text-suave transition-colors duration-200 hover:text-texto"
        >
          Ver conversación
          <ArrowRight className="size-3.5" strokeWidth={1.5} />
        </Link>
      </div>
    </PanelLateral>
  );
}
