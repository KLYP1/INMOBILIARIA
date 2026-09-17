"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { Semaforo } from "@/components/ui/estado-lead";
import { EstadoLeadPildora } from "@/components/ui/estado-lead";
import { etiqueta, rangoMiles } from "@/lib/formato";
import type { LeadVista } from "@/lib/vistas";

export type Orden = { campo: "score" | "ultimoContacto"; descendente: boolean };

const CABECERAS = [
  { clave: "semaforo", texto: "", ordenable: false },
  { clave: "nombre", texto: "Nombre", ordenable: false },
  { clave: "presupuesto", texto: "Presupuesto", ordenable: false },
  { clave: "zona", texto: "Zona pedida", ordenable: false },
  { clave: "proyecto", texto: "Proyecto", ordenable: false },
  { clave: "origen", texto: "Origen", ordenable: false },
  { clave: "score", texto: "Score", ordenable: true },
  { clave: "ultimoContacto", texto: "Último contacto", ordenable: true },
  { clave: "estado", texto: "Estado", ordenable: false },
] as const;

export function TablaLeads({
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
    <table className="w-full border-collapse text-left">
      <thead>
        <tr className="border-b border-borde">
          {CABECERAS.map((c) => (
            <th
              key={c.clave}
              scope="col"
              className="px-3 py-3 text-[11px] font-normal text-tenue first:pl-4 last:pr-4"
            >
              {c.ordenable ? (
                <button
                  type="button"
                  onClick={() => onOrdenar(c.clave as Orden["campo"])}
                  className="inline-flex items-center gap-1 transition-colors duration-200 hover:text-texto"
                >
                  {c.texto}
                  {orden.campo === c.clave &&
                    (orden.descendente ? (
                      <ChevronDown className="size-3" strokeWidth={1.5} />
                    ) : (
                      <ChevronUp className="size-3" strokeWidth={1.5} />
                    ))}
                </button>
              ) : (
                c.texto
              )}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {leads.map((lead) => (
          <tr
            key={lead.id}
            onClick={() => onAbrir(lead.id)}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onAbrir(lead.id);
              }
            }}
            aria-label={`Abrir la ficha de ${lead.nombre}`}
            className={`cursor-pointer border-b border-borde/60 transition-colors duration-200 hover:bg-elevado ${
              seleccionado === lead.id ? "bg-elevado" : ""
            }`}
          >
            <td className="py-3 pl-4">
              <Semaforo nivel={lead.nivel} />
            </td>
            <td className="px-3 py-3 text-[13px]">{lead.nombre}</td>
            <td className="px-3 py-3 text-[12px] text-suave tabular-nums">
              {rangoMiles(lead.presupuestoMin, lead.presupuestoMax)}
            </td>
            <td className="px-3 py-3 text-[12px] text-suave">
              {lead.zonaSolicitada}
              {lead.sinOferta && <span className="ml-1.5 text-ambar">•</span>}
            </td>
            <td className="px-3 py-3 text-[12px] text-suave">{lead.proyectoNombre}</td>
            <td className="px-3 py-3 text-[12px] text-suave">{etiqueta(lead.origen)}</td>
            <td className="px-3 py-3 text-[13px] tabular-nums">{lead.score}</td>
            <td className="px-3 py-3 text-[12px] text-suave">
              {lead.contactoRelativo}
            </td>
            <td className="py-3 pr-4">
              <EstadoLeadPildora estado={lead.estado} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
