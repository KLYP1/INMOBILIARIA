"use client";

import { useState } from "react";
import { FileSpreadsheet, Upload, X } from "lucide-react";
import { Boton } from "@/components/ui/campo";
import { useCapa } from "@/components/ui/use-capa";

const COLUMNAS = [
  ["Tipología", "Dormitorios"],
  ["Área techada", "Metraje"],
  ["Precio de lista", "Precio"],
  ["Stock", "Disponibles"],
];

const MUESTRA = [
  ["2 dorm.", "68 m²", "S/ 512,000", "7"],
  ["2 dorm.", "76 m²", "S/ 565,000", "3"],
  ["3 dorm.", "92 m²", "S/ 689,000", "2"],
];

export function ModalImportar({ onCerrar }: { onCerrar: () => void }) {
  const [archivo, setArchivo] = useState<string | null>(null);
  useCapa(true, onCerrar);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6">
      <button
        type="button"
        aria-label="Cerrar"
        onClick={onCerrar}
        className="absolute inset-0 bg-tinta/25"
      />
      <div
        role="dialog"
        aria-label="Importar inventario desde Excel"
        className="relative w-full max-w-[560px] rounded-[16px] bg-superficie p-6 animate-[deslizar_200ms_ease-out]"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-[15px]">Importar inventario desde Excel</h2>
            <p className="mt-1 text-[12px] text-tenue">
              El asistente usará estos precios y stock en sus respuestas.
            </p>
          </div>
          <button
            type="button"
            onClick={onCerrar}
            aria-label="Cerrar"
            className="rounded-full border border-borde p-2 text-suave transition-colors duration-200 hover:bg-elevado"
          >
            <X className="size-4" strokeWidth={1.5} />
          </button>
        </div>

        {!archivo ? (
          <button
            type="button"
            onClick={() => setArchivo("inventario-altavista.xlsx")}
            className="mt-5 flex w-full flex-col items-center gap-3 rounded-[10px] border border-dashed border-borde bg-elevado px-6 py-10 transition-colors duration-200 hover:border-tenue"
          >
            <Upload className="size-5 text-tenue" strokeWidth={1.5} />
            <span className="text-[13px]">Arrastra el archivo o búscalo</span>
            <span className="text-[11px] text-tenue">
              Formatos .xlsx y .csv, hasta 5 MB
            </span>
          </button>
        ) : (
          <div className="mt-5 space-y-5">
            <div className="flex items-center gap-3 rounded-[10px] bg-elevado px-4 py-3">
              <FileSpreadsheet className="size-4 text-suave" strokeWidth={1.5} />
              <span className="flex-1 text-[13px]">{archivo}</span>
              <span className="text-[11px] text-tenue">18 filas</span>
            </div>

            <div>
              <p className="mb-2 text-[11px] text-tenue">Columnas reconocidas</p>
              <ul className="grid grid-cols-2 gap-x-6 gap-y-2 text-[12px]">
                {COLUMNAS.map(([origen, destino]) => (
                  <li key={origen} className="flex items-center gap-2">
                    <span className="text-suave">{origen}</span>
                    <span className="text-tenue">→</span>
                    <span>{destino}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="mb-2 text-[11px] text-tenue">
                Vista previa de las primeras filas
              </p>
              <table className="w-full text-left text-[12px]">
                <tbody>
                  {MUESTRA.map((fila) => (
                    <tr key={fila[1]} className="border-b border-borde/60">
                      {fila.map((celda, i) => (
                        <td key={i} className="py-2 text-suave tabular-nums">
                          {celda}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <Boton onClick={onCerrar}>Cancelar</Boton>
          <Boton variante="ambar" onClick={onCerrar} disabled={!archivo}>
            {archivo ? "Importar 18 unidades" : "Importar"}
          </Boton>
        </div>
      </div>
    </div>
  );
}
