"use client";

import { Selector, claseCampo } from "@/components/ui/campo";
import { useDemo } from "@/features/estado/proveedor-demo";
import type { ResultadoVisita } from "@/lib/types";

const INTERES = [
  { clave: "alto", texto: "Alto" },
  { clave: "medio", texto: "Medio" },
  { clave: "bajo", texto: "Bajo" },
] as const;

const PASOS = [
  { clave: "cotizacion", texto: "Enviarle la cotización" },
  { clave: "segunda_visita", texto: "Segunda visita" },
  { clave: "separacion", texto: "Va a separar" },
  { clave: "seguimiento", texto: "Seguimiento del asistente" },
  { clave: "descartar", texto: "Descartar" },
] as const;

const VACIO: ResultadoVisita = {
  interes: "medio",
  siguientePaso: "seguimiento",
  nota: "",
};

/** Tres toques al salir de la visita. Sin esto el ciclo queda abierto. */
export function RegistroResultado({ visitaId }: { visitaId: string }) {
  const { resultados, registrarResultado } = useDemo();
  const guardado = resultados[visitaId];
  const valor = guardado ?? VACIO;

  const actualizar = (parcial: Partial<ResultadoVisita>) =>
    registrarResultado(visitaId, { ...valor, ...parcial });

  return (
    <div className="space-y-4">
      <div>
        <p className="mb-2 text-[11px] text-tenue">Qué tan interesado salió</p>
        <div className="flex gap-1.5">
          {INTERES.map((opcion) => (
            <button
              key={opcion.clave}
              type="button"
              onClick={() => actualizar({ interes: opcion.clave })}
              aria-pressed={guardado ? valor.interes === opcion.clave : false}
              className={`flex-1 rounded-full px-3 py-2 text-[12px] transition-colors duration-200 ${
                guardado && valor.interes === opcion.clave
                  ? "bg-tinta text-tinta-texto"
                  : "border border-borde text-suave hover:bg-elevado"
              }`}
            >
              {opcion.texto}
            </button>
          ))}
        </div>
      </div>

      <Selector
        etiqueta="Siguiente paso"
        value={valor.siguientePaso}
        onChange={(e) =>
          actualizar({
            siguientePaso: e.target.value as ResultadoVisita["siguientePaso"],
          })
        }
      >
        {PASOS.map((paso) => (
          <option key={paso.clave} value={paso.clave}>
            {paso.texto}
          </option>
        ))}
      </Selector>

      <label className="block">
        <span className="mb-1.5 block text-[11px] text-tenue">
          Qué pasó en la visita
        </span>
        <textarea
          value={valor.nota}
          onChange={(e) => actualizar({ nota: e.target.value })}
          rows={2}
          placeholder="Le gustó el piso alto, va a consultarlo con su esposo"
          className={`${claseCampo} resize-none leading-relaxed placeholder:text-tenue`}
        />
      </label>

      {guardado && (
        <p className="text-[12px] text-suave">
          Registrado. El asistente retoma desde aquí el seguimiento.
        </p>
      )}
    </div>
  );
}
