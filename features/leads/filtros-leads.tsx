"use client";

import { Search, X } from "lucide-react";
import { Selector } from "@/components/ui/campo";
import { Pildora } from "@/components/ui/pildora";
import { etiqueta } from "@/lib/formato";
import type { EstadoLead, Origen } from "@/lib/types";

export type Filtros = {
  proyecto: string;
  estado: string;
  origen: string;
  busqueda: string;
  sinAsesor: boolean;
};

const ESTADOS: EstadoLead[] = [
  "nuevo",
  "en_conversacion",
  "calificado",
  "visita_agendada",
  "frio",
  "descartado",
];

const ORIGENES: Origen[] = ["meta_ads", "portal", "web", "organico", "referido"];

export function FiltrosLeads({
  filtros,
  proyectos,
  resultados,
  onCambio,
}: {
  filtros: Filtros;
  proyectos: { id: string; nombre: string }[];
  resultados: number;
  onCambio: (parcial: Partial<Filtros>) => void;
}) {
  return (
    <div className="flex flex-wrap items-end gap-3">
      <div className="flex w-full items-center gap-2 rounded-[10px] border border-borde bg-elevado px-3 py-2 sm:w-auto">
        <Search className="size-3.5 text-tenue" strokeWidth={1.5} />
        <input
          value={filtros.busqueda}
          onChange={(e) => onCambio({ busqueda: e.target.value })}
          placeholder="Buscar por nombre o distrito"
          aria-label="Buscar leads"
          className="w-full bg-transparent text-[12px] outline-none placeholder:text-tenue sm:w-56"
        />
      </div>

      <div className="w-full sm:w-44">
        <Selector
          value={filtros.proyecto}
          onChange={(e) => onCambio({ proyecto: e.target.value })}
          aria-label="Filtrar por proyecto"
        >
          <option value="">Todos los proyectos</option>
          {proyectos.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nombre}
            </option>
          ))}
        </Selector>
      </div>

      <div className="w-[calc(50%-6px)] sm:w-44">
        <Selector
          value={filtros.estado}
          onChange={(e) => onCambio({ estado: e.target.value })}
          aria-label="Filtrar por estado"
        >
          <option value="">Todos los estados</option>
          {ESTADOS.map((e) => (
            <option key={e} value={e}>
              {etiqueta(e)}
            </option>
          ))}
        </Selector>
      </div>

      <div className="w-[calc(50%-6px)] sm:w-40">
        <Selector
          value={filtros.origen}
          onChange={(e) => onCambio({ origen: e.target.value })}
          aria-label="Filtrar por origen"
        >
          <option value="">Todos los orígenes</option>
          {ORIGENES.map((o) => (
            <option key={o} value={o}>
              {etiqueta(o)}
            </option>
          ))}
        </Selector>
      </div>

      {filtros.sinAsesor && (
        <button
          type="button"
          onClick={() => onCambio({ sinAsesor: false })}
          className="transition-opacity duration-200 hover:opacity-70"
        >
          <Pildora tono="ambar" className="gap-1.5 py-1.5">
            Sin asesor asignado
            <X className="size-3" strokeWidth={2} />
          </Pildora>
        </button>
      )}

      <span className="ml-auto pb-2 text-[12px] text-tenue tabular-nums">
        {resultados} {resultados === 1 ? "lead" : "leads"}
      </span>
    </div>
  );
}
