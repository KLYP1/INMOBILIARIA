"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Tarjeta } from "@/components/ui/tarjeta";
import { useDemo } from "@/features/estado/proveedor-demo";
import { Conversacion } from "@/features/leads/conversacion";
import { plural } from "@/lib/texto";
import { ListaChats, type Filtro } from "./lista-chats";
import { CabeceraHilo } from "./cabecera-hilo";
import { ContextoLead } from "./contexto-lead";
import { Compositor } from "./compositor";
import type { Canal } from "@/lib/types";
import type { LeadVista } from "@/lib/vistas";


/** El nombre sale de la lista que baja del servidor, no de un modulo estatico:
 *  con Supabase los identificadores son UUID y esa lista cambia sola. */
function resolverNombre(
  asesores: { id: string; nombre: string }[],
  id: string | null,
): string {
  if (!id) return "Sin asignar";
  return asesores.find((a) => a.id === id)?.nombre ?? "Sin asignar";
}

export type ChatVista = {
  id: string;
  nombre: string;
  canal: Canal;
  /** Ya resuelto en el servidor: el cliente no puede recalcularlo. */
  contactoRelativo: string;
  ultimoTexto: string;
  esperando: boolean;
};

export function PantallaConversaciones({
  leads,
  asesores,
  chatInicial,
}: {
  leads: LeadVista[];
  asesores: { id: string; nombre: string }[];
  chatInicial: string | null;
}) {
  const demo = useDemo();
  const [abierto, setAbierto] = useState(chatInicial ?? leads[0]?.id ?? null);
  const [filtro, setFiltro] = useState<Filtro>("todas");
  const [busqueda, setBusqueda] = useState("");
  // Solo manda en celular: desde lg las tres columnas se ven siempre.
  const [enHilo, setEnHilo] = useState(false);

  const conAsesor = useMemo(
    () =>
      leads.map((lead) => {
        if (!(lead.id in demo.asignaciones)) return lead;
        const asesorAsignado = demo.asignaciones[lead.id];
        return {
          ...lead,
          asesorAsignado,
          asesorNombre: resolverNombre(asesores, asesorAsignado),
        };
      }),
    [leads, demo.asignaciones, asesores],
  );

  const chats: ChatVista[] = useMemo(
    () =>
      conAsesor.map((lead) => {
        const mensajes = demo.conversacionDe(lead.id, lead.conversacion);
        const ultimo = mensajes[mensajes.length - 1];
        return {
          id: lead.id,
          nombre: lead.nombre,
          canal: lead.canal,
          contactoRelativo: lead.contactoRelativo,
          ultimoTexto: ultimo?.texto ?? "",
          // Espera respuesta cuando la ultima palabra fue del cliente.
          esperando: ultimo?.autor === "lead",
        };
      }),
    [conAsesor, demo],
  );

  const filtrados = chats.filter((chat) => {
    if (filtro === "esperando") return chat.esperando;
    if (filtro === "asesor") return demo.botPausado[chat.id] ?? false;
    return true;
  });

  const lead = conAsesor.find((l) => l.id === abierto) ?? null;
  const esperando = chats.filter((c) => c.esperando).length;
  const mensajes = lead ? demo.conversacionDe(lead.id, lead.conversacion) : [];

  // Una bandeja abre por el ultimo mensaje, no por el primero.
  const hilo = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (hilo.current) hilo.current.scrollTop = hilo.current.scrollHeight;
  }, [abierto, mensajes.length]);

  return (
    <div className="space-y-5">
      <div className="pt-2">
        <h1 className="text-[27px] leading-tight font-normal">Conversaciones</h1>
        <p className="mt-1.5 text-[13px] text-tenue">
          {plural(esperando, "conversación espera", "conversaciones esperan")}{" "}
          respuesta. Puedes entrar tú cuando quieras.
        </p>
      </div>

      {/*
        Una sola copia de cada pieza para que el ref del hilo siga sirviendo.
        En celular se alternan con clases; desde lg conviven en tres columnas.
      */}
      <div className="space-y-4 lg:grid lg:h-[calc(100vh-230px)] lg:min-h-[540px] lg:grid-cols-[280px_1fr_280px] lg:grid-rows-[minmax(0,1fr)] lg:gap-5 lg:space-y-0">
        <Tarjeta className={`p-4 ${enHilo ? "hidden lg:block" : "block"}`}>
          <ListaChats
            chats={filtrados}
            abierto={abierto}
            filtro={filtro}
            busqueda={busqueda}
            onFiltro={setFiltro}
            onBusqueda={setBusqueda}
            onAbrir={(id) => {
              setAbierto(id);
              setEnHilo(true);
            }}
          />
        </Tarjeta>

        <Tarjeta
          className={`h-[calc(100dvh-280px)] min-h-[380px] flex-col p-4 sm:p-5 lg:h-auto lg:min-h-0 ${
            enHilo ? "flex" : "hidden lg:flex"
          }`}
        >
          {lead ? (
            <>
              <CabeceraHilo lead={lead} onVolver={() => setEnHilo(false)} />
              <div
                ref={hilo}
                className="scroll-fino min-h-0 flex-1 overflow-y-auto py-5"
              >
                <Conversacion mensajes={mensajes} asesorNombre={lead.asesorAsignado ? lead.asesorNombre : null} />
              </div>
              <Compositor leadId={lead.id} asesorNombre={lead.asesorAsignado ? lead.asesorNombre : null} />
            </>
          ) : (
            <p className="m-auto text-[13px] text-suave">
              Elige una conversación de la lista.
            </p>
          )}
        </Tarjeta>

        <div className={`lg:h-full ${enHilo ? "block" : "hidden lg:block"}`}>
          {lead ? (
            <ContextoLead lead={lead} />
          ) : (
            <Tarjeta className="p-5">
              <p className="text-[12px] text-tenue">
                Aquí verás qué busca el cliente mientras le escribes.
              </p>
            </Tarjeta>
          )}
        </div>
      </div>
    </div>
  );
}
