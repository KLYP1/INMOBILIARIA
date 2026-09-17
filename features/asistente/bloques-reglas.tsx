"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Bloque } from "./bloque";
import { Pildora } from "@/components/ui/pildora";
import { Selector, claseCampo } from "@/components/ui/campo";
import { ASESORES } from "@/lib/data/empresa";
import { nombreProyecto } from "@/lib/data/proyectos";
import type { ConfigAsistente } from "@/lib/data/asistente";

type Props = {
  config: ConfigAsistente;
  onCambio: (parcial: Partial<ConfigAsistente>) => void;
};

export function BloqueDerivacion({ config, onCambio }: Props) {
  const [nueva, setNueva] = useState("");

  const agregar = () => {
    const palabra = nueva.trim().toLowerCase();
    if (!palabra || config.palabras.includes(palabra)) return;
    onCambio({ palabras: [...config.palabras, palabra] });
    setNueva("");
  };

  return (
    <Bloque
      titulo="Cuándo pasar a un asesor"
      descripcion="El asistente entrega la conversación cuando el lead llega al puntaje o dice una de estas palabras."
    >
      <div className="w-48">
        <Selector
          etiqueta="Puntaje mínimo"
          value={config.umbral}
          onChange={(e) => onCambio({ umbral: Number(e.target.value) })}
        >
          {[50, 60, 70, 80, 90].map((v) => (
            <option key={v} value={v}>
              {v} puntos o más
            </option>
          ))}
        </Selector>
      </div>

      <div className="mt-5">
        <p className="mb-2 text-[11px] text-tenue">
          Palabras que fuerzan el pase
        </p>
        <div className="flex flex-wrap items-center gap-2">
          {config.palabras.map((palabra) => (
            <button
              key={palabra}
              type="button"
              onClick={() =>
                onCambio({
                  palabras: config.palabras.filter((p) => p !== palabra),
                })
              }
              aria-label={`Quitar ${palabra}`}
              className="transition-opacity duration-200 hover:opacity-70"
            >
              <Pildora tono="borde" className="gap-1.5">
                {palabra}
                <X className="size-3" strokeWidth={2} />
              </Pildora>
            </button>
          ))}
          <input
            value={nueva}
            onChange={(e) => setNueva(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                agregar();
              }
            }}
            onBlur={agregar}
            placeholder="Agregar palabra"
            aria-label="Agregar palabra clave"
            className={`${claseCampo} w-40 py-1.5`}
          />
        </div>
      </div>
    </Bloque>
  );
}

export function BloqueAsesores() {
  return (
    <Bloque
      titulo="Asesores"
      descripcion="A quién le llega la conversación según el proyecto."
    >
      <ul className="divide-y divide-borde/60">
        {ASESORES.map((asesor) => (
          <li key={asesor.id} className="py-3 first:pt-0 last:pb-0">
            <div className="flex items-center justify-between gap-4">
              <span className="text-[13px]">{asesor.nombre}</span>
              <span className="text-[12px] text-suave tabular-nums">
                {asesor.telefono}
              </span>
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {asesor.proyectos.map((id) => (
                <Pildora key={id} tono="borde">
                  {nombreProyecto(id)}
                </Pildora>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </Bloque>
  );
}

export function BloqueReactivacion({ config, onCambio }: Props) {
  return (
    <Bloque
      titulo="Reactivación de leads fríos"
      descripcion="Tres intentos si el lead deja de responder. Después no se le escribe más."
    >
      <p className="mb-4 text-[12px] text-suave">
        Los tres caen fuera de la ventana de 24 horas, así que salen como
        plantilla aprobada por Meta y se cobran por envío.
      </p>

      <div className="space-y-4">
        {config.reactivacion.map((mensaje) => (
          <label key={mensaje.id} className="block">
            <span className="mb-1.5 flex items-center justify-between gap-2">
              <span className="text-[11px] text-tenue">
                A las {mensaje.cuando}
              </span>
              <Pildora tono={mensaje.categoria === "utilidad" ? "exito" : "aviso"}>
                Plantilla de {mensaje.categoria}
              </Pildora>
            </span>
            <textarea
              value={mensaje.texto}
              onChange={(e) =>
                onCambio({
                  reactivacion: config.reactivacion.map((m) =>
                    m.id === mensaje.id ? { ...m, texto: e.target.value } : m,
                  ),
                })
              }
              rows={2}
              className={`${claseCampo} resize-none leading-relaxed`}
            />
          </label>
        ))}
      </div>
    </Bloque>
  );
}
