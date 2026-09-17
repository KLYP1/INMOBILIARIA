"use client";

import { ArrowDown, ArrowUp } from "lucide-react";
import { Semaforo, EstadoLeadPildora } from "@/components/ui/estado-lead";
import { rangoMiles } from "@/lib/formato";
import type { LeadVista } from "@/lib/vistas";
import type { Orden } from "./tabla-leads";

const CRITERIOS = [
  { campo: "ultimoContacto", texto: "Último contacto" },
  { campo: "score", texto: "Score" },
] as const;

/**
 * La tabla de nueve columnas no entra en un celular. Misma informacion, en
 * fichas apiladas, con el orden como par de pildoras en vez de cabeceras.
 */
export function ListaLeads({
  leads,
  orden,
  seleccionado,
  onOrdenar,
  onAbrir,
}: {
  leads: LeadVista[];
  orden: Orden;
  seleccionado: string | null;
  onOrdenar: (campo: Orden["campo"]) => void;
  onAbrir: (id: string) => void;
}) {
  if (leads.length === 0) {
    return (
      <p className="px-4 py-14 text-center text-[13px] text-suave">
        Ningún lead coincide con estos filtros. Quita alguno para ver más.
      </p>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-2 border-b border-borde px-4 py-3">
        <span className="text-[11px] text-tenue">Ordenar por</span>
        {CRITERIOS.map((c) => {
          const activo = orden.campo === c.campo;
          return (
            <button
              key={c.campo}
              type="button"
              onClick={() => onOrdenar(c.campo)}
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] transition-colors duration-200 ${
                activo ? "bg-tinta text-tinta-texto" : "text-suave"
              }`}
            >
              {c.texto}
              {activo &&
                (orden.descendente ? (
                  <ArrowDown className="size-3" strokeWidth={1.5} />
                ) : (
                  <ArrowUp className="size-3" strokeWidth={1.5} />
                ))}
            </button>
          );
        })}
      </div>

      <ul>
        {leads.map((lead) => (
          <li key={lead.id}>
            <button
              type="button"
              onClick={() => onAbrir(lead.id)}
              aria-label={`Abrir la ficha de ${lead.nombre}`}
              className={`w-full border-b border-borde/60 px-4 py-3.5 text-left transition-colors duration-200 ${
                seleccionado === lead.id ? "bg-elevado" : ""
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Semaforo nivel={lead.nivel} />
                <span className="min-w-0 flex-1 truncate text-[14px]">
                  {lead.nombre}
                </span>
                <span className="text-[13px] tabular-nums text-suave">
                  {lead.score}
                </span>
              </div>

              <p className="mt-1.5 pl-[18px] text-[12px] tabular-nums text-suave">
                {rangoMiles(lead.presupuestoMin, lead.presupuestoMax)}
              </p>

              <p className="mt-0.5 pl-[18px] text-[12px] text-tenue">
                {lead.zonaSolicitada}
                {lead.sinOferta && <span className="ml-1 text-ambar">•</span>}
                {" · "}
                {lead.proyectoNombre}
              </p>

              <div className="mt-2.5 flex items-center justify-between gap-3 pl-[18px]">
                <EstadoLeadPildora estado={lead.estado} />
                <span className="text-[11px] text-tenue">
                  {lead.contactoRelativo}
                </span>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
