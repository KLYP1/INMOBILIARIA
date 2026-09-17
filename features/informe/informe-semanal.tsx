"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { PanelLateral } from "@/components/ui/panel-lateral";
import { Tarjeta } from "@/components/ui/tarjeta";
import { duracion, solesMillonesPiso } from "@/lib/formato";
import { plural } from "@/lib/texto";
import type { informeSemanal } from "@/lib/metricas";

type Informe = ReturnType<typeof informeSemanal>;

function Cifra({
  valor,
  rotulo,
  nota,
}: {
  valor: string;
  rotulo: string;
  nota?: string;
}) {
  return (
    <div className="rounded-[10px] bg-elevado px-4 py-4">
      <p className="text-[26px] leading-none font-normal tabular-nums">{valor}</p>
      <p className="mt-2 text-[12px] text-texto">{rotulo}</p>
      {nota && <p className="mt-1 text-[11px] text-tenue">{nota}</p>}
    </div>
  );
}

export function InformeSemanal({ informe }: { informe: Informe }) {
  const [abierto, setAbierto] = useState(false);
  const diferencia = informe.leadsSemana - informe.leadsSemanaPrevia;

  return (
    <>
      <Tarjeta className="flex flex-wrap items-center justify-between gap-4 px-6 py-5">
        <p className="text-[13px] text-suave">
          Tu informe del lunes está listo.
        </p>
        <button
          type="button"
          onClick={() => setAbierto(true)}
          className="inline-flex items-center gap-2 rounded-full border border-borde px-4 py-2 text-[13px] transition-colors duration-200 hover:bg-elevado"
        >
          Leer el informe
          <ArrowRight className="size-3.5" strokeWidth={1.5} />
        </button>
      </Tarjeta>

      <PanelLateral
        abierto={abierto}
        etiqueta="Informe semanal"
        onCerrar={() => setAbierto(false)}
        cabecera={
          <>
            <h2 className="text-[17px] font-normal">Informe semanal</h2>
            <p className="mt-1 text-[12px] text-tenue">
              Lo que hizo el asistente en los últimos siete días.
            </p>
          </>
        }
      >
        <div className="grid grid-cols-2 gap-3">
          <Cifra
            valor={`${informe.leadsSemana}`}
            rotulo="Leads captados"
            nota={
              diferencia === 0
                ? "Igual que la semana previa"
                : `${diferencia > 0 ? "+" : ""}${diferencia} contra la semana previa`
            }
          />
          <Cifra
            valor={duracion(informe.respuestaSeg)}
            rotulo="Respuesta promedio"
            nota="Antes eran 4 h 10 min"
          />
          <Cifra
            valor={`${informe.visitas}`}
            rotulo="Visitas agendadas"
            nota={`${informe.tasaConfirmacion}% confirmadas · ${informe.tasaAsistencia}% asistió`}
          />
          <Cifra
            valor={`${informe.rescatados}`}
            rotulo="Rescatados entre proyectos"
            nota="Pidieron un distrito sin stock"
          />
        </div>

        <div className="rounded-[10px] bg-aviso-fondo px-4 py-4">
          <p className="text-[13px] text-aviso">
            {informe.enEspera} calificados siguen sin asesor, y{" "}
            {informe.calientes} de ellos quieren mudarse ya.
          </p>
          <p className="mt-1.5 text-[13px] text-aviso">
            Son {solesMillonesPiso(informe.valorEnRiesgo)} esperando que alguien
            escriba.
          </p>
        </div>

        <div>
          <p className="mb-3 text-[11px] text-tenue">
            Distritos que te piden y no tienes
          </p>
          <ul className="space-y-2">
            {informe.sinOferta.map((d) => (
              <li
                key={d.nombre}
                className="flex items-center justify-between gap-3 rounded-[10px] bg-elevado px-3.5 py-3"
              >
                <span className="text-[13px]">{d.nombre}</span>
                <span className="text-[12px] text-suave tabular-nums">
                  {plural(d.leads, "lead", "leads")} · {d.porcentaje}%
                </span>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-[12px] text-suave">
          Las cifras salen de las mismas funciones que la portada, así que
          siempre coinciden.
        </p>
      </PanelLateral>
    </>
  );
}
