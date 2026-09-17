import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Tarjeta } from "@/components/ui/tarjeta";
import { dormitorios, etiqueta, rangoMiles } from "@/lib/formato";
import type { LeadVista } from "@/lib/vistas";

function Dato({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <div>
      <p className="text-[11px] text-tenue">{rotulo}</p>
      <p className="mt-0.5 text-[12px]">{valor}</p>
    </div>
  );
}

/** Lo que el asesor necesita tener a la vista mientras escribe. */
export function ContextoLead({ lead }: { lead: LeadVista }) {
  return (
    <Tarjeta className="scroll-fino h-full overflow-y-auto p-5">
      <p className="text-[11px] text-tenue">Qué busca</p>
      <p className="mt-2 text-[13px] leading-relaxed">{lead.resumenIA}</p>

      <div className="mt-5 space-y-3.5 border-t border-borde pt-4">
        <Dato
          rotulo="Presupuesto"
          valor={rangoMiles(lead.presupuestoMin, lead.presupuestoMax)}
        />
        <Dato rotulo="Dormitorios" valor={dormitorios(lead.dormitorios)} />
        <Dato rotulo="Zona pedida" valor={lead.zonaSolicitada} />
        <Dato rotulo="Forma de pago" valor={etiqueta(lead.formaPago)} />
        <Dato rotulo="Plazo" valor={etiqueta(lead.plazoMudanza)} />
        <Dato rotulo="Objeción" valor={etiqueta(lead.objecion)} />
        <Dato rotulo="Score" valor={`${lead.score} de 100`} />
        <Dato rotulo="Asesor" valor={lead.asesorNombre} />
      </div>

      {lead.alternativas.length > 0 && (
        <div className="mt-5 rounded-[10px] bg-elevado px-3.5 py-3">
          <p className="text-[11px] text-tenue">
            Pidió {lead.zonaSolicitada}, donde no hay proyecto
          </p>
          <p className="mt-1.5 text-[12px]">
            Lo más cerca: {lead.alternativas[0].nombre} en{" "}
            {lead.alternativas[0].distrito}
          </p>
        </div>
      )}

      <Link
        href={`/leads?lead=${lead.id}`}
        className="mt-5 inline-flex items-center gap-2 text-[12px] text-suave transition-colors duration-200 hover:text-texto"
      >
        Ver ficha completa
        <ArrowRight className="size-3.5" strokeWidth={1.5} />
      </Link>
    </Tarjeta>
  );
}
