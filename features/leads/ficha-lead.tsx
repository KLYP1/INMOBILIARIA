import { MapPin } from "lucide-react";
import { Pildora } from "@/components/ui/pildora";
import { dormitorios, etiqueta, soles, solesMiles, unDecimal } from "@/lib/formato";
import type { LeadVista } from "@/lib/vistas";

function Dato({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <div>
      <p className="text-[11px] text-tenue">{rotulo}</p>
      <p className="mt-0.5 text-[13px]">{valor}</p>
    </div>
  );
}

export function FichaLead({ lead }: { lead: LeadVista }) {
  const presupuesto =
    lead.presupuestoMax > 0
      ? `${soles(lead.presupuestoMin)} a ${soles(lead.presupuestoMax)}`
      : "No declarado";

  return (
    <div className="space-y-6">
      <div className="rounded-[10px] bg-elevado px-4 py-4">
        <p className="text-[11px] text-tenue">Resumen del asistente</p>
        <p className="mt-2 text-[14px] leading-relaxed">{lead.resumenIA}</p>
      </div>

      <div>
        <p className="mb-3 text-[11px] text-tenue">Datos capturados</p>
        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
          <Dato rotulo="Teléfono" valor={lead.telefono} />
          <Dato rotulo="Origen" valor={etiqueta(lead.origen)} />
          <Dato rotulo="Canal" valor={etiqueta(lead.canal)} />
          <Dato rotulo="Presupuesto" valor={presupuesto} />
          <Dato rotulo="Forma de pago" valor={etiqueta(lead.formaPago)} />
          <Dato rotulo="Dormitorios" valor={dormitorios(lead.dormitorios)} />
          <Dato rotulo="Zona pedida" valor={lead.zonaSolicitada} />
          <Dato rotulo="Plazo de mudanza" valor={etiqueta(lead.plazoMudanza)} />
          <Dato rotulo="Proyecto de interés" valor={lead.proyectoNombre} />
          <Dato rotulo="Objeción detectada" valor={etiqueta(lead.objecion)} />
          <Dato rotulo="Último contacto" valor={lead.contactoRelativo} />
        </div>
      </div>

    </div>
  );
}


export function AlternativasLead({ lead }: { lead: LeadVista }) {
  if (lead.alternativas.length === 0) return null;
  return (
      <div>
        <p className="mb-1 text-[11px] text-tenue">Alternativas por cercanía</p>
        <p className="mb-3 text-[13px] text-suave">
          Pidió {lead.zonaSolicitada} y ahí no hay proyecto. Esto es lo más
          cerca que entra en su presupuesto.
        </p>
        <ul className="space-y-2">
          {lead.alternativas.map((alt) => (
            <li
              key={alt.id}
              className="flex items-center justify-between gap-3 rounded-[10px] bg-elevado px-3.5 py-3"
            >
              <span className="min-w-0">
                <span className="block text-[13px]">{alt.nombre}</span>
                <span className="flex items-center gap-1 text-[11px] text-tenue">
                  <MapPin className="size-3" strokeWidth={1.5} />
                  {alt.distrito} · a {unDecimal(alt.distanciaKm)} km
                </span>
              </span>
              <span className="shrink-0 text-right">
                <span className="block text-[12px] tabular-nums">
                  desde {solesMiles(alt.desde)}
                </span>
                <Pildora tono="borde" className="mt-1">
                  {alt.unidades} disponibles
                </Pildora>
              </span>
            </li>
          ))}
        </ul>
      </div>
  );
}
