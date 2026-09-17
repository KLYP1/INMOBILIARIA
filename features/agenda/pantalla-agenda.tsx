"use client";

import { useState } from "react";
import { Tarjeta } from "@/components/ui/tarjeta";
import { useCelular } from "@/components/ui/use-celular";
import { Metrica } from "@/components/ui/metrica";
import { CalendarioSemanal, type Dia } from "./calendario-semanal";
import { PanelDia } from "./panel-dia";
import { ColaHoy } from "./cola-hoy";
import { FichaVisita } from "./ficha-visita";
import { claveDia } from "@/lib/fechas";
import type { VisitaVista } from "@/lib/vistas";

type Vista = "semana" | "hoy";

const VISTAS: { clave: Vista; texto: string }[] = [
  { clave: "semana", texto: "Semana" },
  { clave: "hoy", texto: "Hoy" },
];

export function PantallaAgenda({
  dias,
  visitas,
  resumen,
}: {
  dias: Dia[];
  visitas: VisitaVista[];
  resumen: { total: number; tasaConfirmacion: number; tasaAsistencia: number };
}) {
  const hoy = dias.find((d) => d.esHoy) ?? dias[0];
  // Nula hasta que alguien toca una pildora: asi el celular puede abrir en
  // la cola del dia, que es lo que el vendedor en obra necesita, sin quitarle
  // al escritorio su rejilla semanal.
  const [elegida, setElegida] = useState<Vista | null>(null);
  const [seleccionado, setSeleccionado] = useState(hoy.clave);
  const [ficha, setFicha] = useState<string | null>(null);
  const celular = useCelular();
  const vista: Vista = elegida ?? (celular ? "hoy" : "semana");

  const dia = dias.find((d) => d.clave === seleccionado) ?? hoy;
  const visita = visitas.find((v) => v.id === ficha) ?? null;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-5 pt-2">
        <div>
          <h1 className="text-[27px] leading-tight font-normal">Agenda</h1>
          <p className="mt-1.5 text-[13px] text-tenue">
            Las visitas que el asistente cerró por WhatsApp.
          </p>
        </div>

        <div className="flex items-center gap-5 sm:gap-8">
          <Metrica
            valor={`${resumen.tasaConfirmacion}%`}
            etiqueta="Confirmación"
          />
          <Metrica valor={`${resumen.tasaAsistencia}%`} etiqueta="Asistencia" />
          <Tarjeta oscura className="px-5 py-4">
            <p className="text-[30px] leading-none font-normal tabular-nums">
              {resumen.total}
            </p>
            <p className="mt-2 text-[11px] text-tinta-tenue">
              visitas esta semana
            </p>
          </Tarjeta>
        </div>
      </div>

      <div className="flex gap-1">
        {VISTAS.map((v) => (
          <button
            key={v.clave}
            type="button"
            onClick={() => setElegida(v.clave)}
            aria-pressed={vista === v.clave}
            className={`rounded-full px-4 py-2 text-[13px] transition-colors duration-200 ${
              vista === v.clave
                ? "bg-tinta text-tinta-texto"
                : "text-suave hover:bg-elevado"
            }`}
          >
            {v.texto}
          </button>
        ))}
      </div>

      {vista === "semana" ? (
        <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
          <Tarjeta className="p-5">
            <CalendarioSemanal
              dias={dias}
              visitas={visitas}
              seleccionado={seleccionado}
              onSeleccionar={setSeleccionado}
              onAbrir={setFicha}
            />
          </Tarjeta>

          <PanelDia
            iso={dia.iso}
            visitas={visitas.filter((v) => claveDia(v.fechaHora) === dia.clave)}
            onAbrir={setFicha}
          />
        </div>
      ) : (
        <div className="max-w-[560px]">
          <ColaHoy
            visitas={visitas.filter(
              (v) => claveDia(v.fechaHora) === hoy.clave,
            )}
            onAbrir={setFicha}
          />
        </div>
      )}

      <FichaVisita visita={visita} onCerrar={() => setFicha(null)} />
    </div>
  );
}
