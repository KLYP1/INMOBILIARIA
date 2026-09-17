"use client";

import { useState } from "react";
import { VistaPrevia } from "./vista-previa";
import { BloqueCanales } from "./bloque-canales";
import {
  BloqueHorario,
  BloqueIdentidad,
  BloquePreguntas,
} from "./bloques-config";
import {
  BloqueAsesores,
  BloqueDerivacion,
  BloqueReactivacion,
} from "./bloques-reglas";
import { BloqueAvisos, BloqueConfirmacion } from "./bloques-visitas";
import { CONFIG_INICIAL, type ConfigAsistente } from "@/lib/data/asistente";
import type { Canal } from "@/lib/types";

export function PantallaAsistente({
  conteoCanales,
}: {
  conteoCanales: Record<Canal, number>;
}) {
  const [config, setConfig] = useState<ConfigAsistente>(CONFIG_INICIAL);
  const cambiar = (parcial: Partial<ConfigAsistente>) =>
    setConfig((c) => ({ ...c, ...parcial }));

  return (
    <div className="space-y-5">
      <div className="pt-2">
        <h1 className="text-[27px] leading-tight font-normal">Asistente</h1>
        <p className="mt-1.5 text-[13px] text-tenue">
          Cómo se presenta, qué pregunta y cuándo te pasa la conversación.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
        <div className="space-y-5">
          <BloqueCanales conteo={conteoCanales} />
          <BloqueIdentidad config={config} onCambio={cambiar} />
          <BloqueHorario config={config} onCambio={cambiar} />
          <BloquePreguntas config={config} onCambio={cambiar} />
          <BloqueDerivacion config={config} onCambio={cambiar} />
          <BloqueConfirmacion config={config} onCambio={cambiar} />
          <BloqueAvisos config={config} onCambio={cambiar} />
          <BloqueAsesores />
          <BloqueReactivacion config={config} onCambio={cambiar} />
        </div>

        <div>
          <VistaPrevia config={config} />
        </div>
      </div>
    </div>
  );
}
