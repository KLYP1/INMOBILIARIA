"use client";

import { useMemo, useState } from "react";
import { Tarjeta } from "@/components/ui/tarjeta";
import { FiltrosLeads, type Filtros } from "./filtros-leads";
import { ListaLeads } from "./lista-leads";
import { TablaLeads, type Orden } from "./tabla-leads";
import { PanelLead } from "./panel-lead";
import { useDemo } from "@/features/estado/proveedor-demo";
import { nombreAsesor } from "@/lib/data/empresa";
import { contiene } from "@/lib/texto";
import type { LeadVista } from "@/lib/vistas";

type Props = {
  leads: LeadVista[];
  proyectos: { id: string; nombre: string }[];
  filtrosIniciales: Filtros;
  leadInicial: string | null;
};

export function PantallaLeads({
  leads,
  proyectos,
  filtrosIniciales,
  leadInicial,
}: Props) {
  const [filtros, setFiltros] = useState(filtrosIniciales);
  const [orden, setOrden] = useState<Orden>({
    campo: "ultimoContacto",
    descendente: true,
  });
  const [abierto, setAbierto] = useState<string | null>(leadInicial);

  // Las asignaciones viven en el proveedor porque otras pantallas las leen.
  const { asignaciones } = useDemo();

  const conCambios = useMemo(
    () =>
      leads.map((lead) => {
        if (!(lead.id in asignaciones)) return lead;
        const asesorAsignado = asignaciones[lead.id];
        return { ...lead, asesorAsignado, asesorNombre: nombreAsesor(asesorAsignado) };
      }),
    [leads, asignaciones],
  );

  const visibles = useMemo(() => {
    const texto = filtros.busqueda.trim();
    const filtrados = conCambios.filter((lead) => {
      if (filtros.proyecto && lead.proyectoInteres !== filtros.proyecto) return false;
      if (filtros.estado && lead.estado !== filtros.estado) return false;
      if (filtros.origen && lead.origen !== filtros.origen) return false;
      if (filtros.sinAsesor && lead.asesorAsignado) return false;
      if (
        texto &&
        !contiene(lead.nombre, texto) &&
        !contiene(lead.zonaSolicitada, texto)
      )
        return false;
      return true;
    });

    const signo = orden.descendente ? -1 : 1;
    return [...filtrados].sort((a, b) => {
      if (orden.campo === "score") return (a.score - b.score) * signo;
      return (
        (new Date(a.ultimoContacto).getTime() -
          new Date(b.ultimoContacto).getTime()) *
        signo
      );
    });
  }, [conCambios, filtros, orden]);

  const enEspera = conCambios.filter(
    (l) => l.estado === "calificado" && !l.asesorAsignado,
  ).length;

  const ordenarPor = (campo: Orden["campo"]) =>
    setOrden((o) =>
      o.campo === campo
        ? { campo, descendente: !o.descendente }
        : { campo, descendente: true },
    );

  const lead = conCambios.find((l) => l.id === abierto) ?? null;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-5 pt-2">
        <div>
          <h1 className="text-[27px] leading-tight font-normal">Leads</h1>
          <p className="mt-1.5 text-[13px] text-tenue">
            Todo lo que el asistente capturó y calificó.
          </p>
        </div>

        <Tarjeta oscura className="px-5 py-4">
          <p className="text-[30px] leading-none font-normal tabular-nums">
            {enEspera}
          </p>
          <p className="mt-2 text-[11px] text-tinta-tenue">
            calificados esperan contacto
          </p>
        </Tarjeta>
      </div>

      <FiltrosLeads
        filtros={filtros}
        proyectos={proyectos}
        resultados={visibles.length}
        onCambio={(parcial) => setFiltros((f) => ({ ...f, ...parcial }))}
      />

      <Tarjeta className="overflow-hidden">
        {/* Misma data, dos formas: fichas en celular, tabla desde lg. */}
        <div className="lg:hidden">
          <ListaLeads
            leads={visibles}
            orden={orden}
            seleccionado={abierto}
            onOrdenar={ordenarPor}
            onAbrir={setAbierto}
          />
        </div>
        <div className="hidden lg:block">
          <TablaLeads
            leads={visibles}
            orden={orden}
            seleccionado={abierto}
            onOrdenar={ordenarPor}
            onAbrir={setAbierto}
          />
        </div>
      </Tarjeta>

      <PanelLead lead={lead} onCerrar={() => setAbierto(null)} />
    </div>
  );
}
