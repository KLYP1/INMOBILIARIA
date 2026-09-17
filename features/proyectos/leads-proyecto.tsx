import Link from "next/link";
import { Tarjeta, TituloTarjeta } from "@/components/ui/tarjeta";
import { Avatar } from "@/components/ui/avatar";
import { EstadoLeadPildora } from "@/components/ui/estado-lead";
import { rangoMiles } from "@/lib/formato";
import { relativo } from "@/lib/fechas";
import type { Lead } from "@/lib/types";

export function LeadsProyecto({ leads }: { leads: Lead[] }) {
  return (
    <Tarjeta className="flex flex-col p-5">
      <TituloTarjeta
        accion={<span className="text-[11px] text-tenue">{leads.length} en total</span>}
      >
        Leads interesados
      </TituloTarjeta>

      {leads.length === 0 ? (
        <p className="mt-6 text-[13px] text-suave">
          Todavía nadie ha preguntado por este proyecto.
        </p>
      ) : (
        <ul className="scroll-fino mt-3 min-h-0 flex-1 overflow-y-auto">
          {leads.map((lead) => (
            <li key={lead.id}>
              <Link
                href={`/leads?lead=${lead.id}`}
                className="flex items-center gap-3 rounded-[10px] px-1 py-2.5 transition-colors duration-200 hover:bg-elevado"
              >
                <Avatar nombre={lead.nombre} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13px]">{lead.nombre}</span>
                  <span className="block text-[11px] text-tenue tabular-nums">
                    {rangoMiles(lead.presupuestoMin, lead.presupuestoMax)} ·{" "}
                    {relativo(lead.ultimoContacto)}
                  </span>
                </span>
                <EstadoLeadPildora estado={lead.estado} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Tarjeta>
  );
}
