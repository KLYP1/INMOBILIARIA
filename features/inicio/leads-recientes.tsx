"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { Tarjeta, TituloTarjeta } from "@/components/ui/tarjeta";
import { Avatar } from "@/components/ui/avatar";
import { EstadoLeadPildora } from "@/components/ui/estado-lead";
import { rangoMiles } from "@/lib/formato";
import { contiene } from "@/lib/texto";
import type { EstadoLead } from "@/lib/types";

export type FilaLead = {
  id: string;
  nombre: string;
  presupuestoMin: number;
  presupuestoMax: number;
  estado: EstadoLead;
  proyecto: string;
};

export function LeadsRecientes({ leads }: { leads: FilaLead[] }) {
  const [busqueda, setBusqueda] = useState("");

  const visibles = useMemo(() => {
    const texto = busqueda.trim();
    const filtrados = texto
      ? leads.filter((l) => contiene(l.nombre, texto))
      : leads;
    return filtrados.slice(0, 5);
  }, [busqueda, leads]);

  return (
    <Tarjeta className="p-5">
      <TituloTarjeta
        accion={
          <div className="flex items-center gap-2 rounded-full border border-borde px-3 py-1.5">
            <Search className="size-3.5 text-tenue" strokeWidth={1.5} />
            <input
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar"
              aria-label="Buscar entre los leads recientes"
              className="w-24 bg-transparent text-[12px] outline-none placeholder:text-tenue"
            />
          </div>
        }
      >
        Leads recientes
      </TituloTarjeta>

      <div className="mt-4 grid grid-cols-[1fr_auto_auto] items-center gap-x-4 text-[11px] text-tenue">
        <span>Contacto</span>
        <span className="justify-self-end">Presupuesto</span>
        <span className="w-[132px] justify-self-end pr-1">Estado</span>
      </div>

      {visibles.length === 0 ? (
        <p className="mt-6 text-[13px] text-suave">
          Ningún lead coincide con «{busqueda}».
        </p>
      ) : (
        <ul className="mt-1">
          {visibles.map((lead) => (
            <li key={lead.id}>
              <Link
                href={`/leads?lead=${lead.id}`}
                className="grid grid-cols-[1fr_auto_auto] items-center gap-x-4 rounded-[10px] px-1 py-2.5 transition-colors duration-200 hover:bg-elevado"
              >
                <span className="flex min-w-0 items-center gap-2.5">
                  <Avatar nombre={lead.nombre} />
                  <span className="min-w-0">
                    <span className="block truncate text-[13px]">
                      {lead.nombre}
                    </span>
                    <span className="block truncate text-[11px] text-tenue">
                      {lead.proyecto}
                    </span>
                  </span>
                </span>
                <span className="justify-self-end text-[12px] text-suave tabular-nums">
                  {rangoMiles(lead.presupuestoMin, lead.presupuestoMax)}
                </span>
                <span className="w-[132px] justify-self-end text-right">
                  <EstadoLeadPildora estado={lead.estado} />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Tarjeta>
  );
}
