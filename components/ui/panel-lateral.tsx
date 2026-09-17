"use client";

import type { ReactNode } from "react";
import { X } from "lucide-react";
import { useCapa } from "./use-capa";

/**
 * Cascara comun de los paneles deslizantes: fondo que cierra, Escape, bloqueo
 * del desplazamiento y tres zonas fijas. La usan la ficha de lead, la ficha de
 * visita y el informe semanal.
 */
export function PanelLateral({
  abierto,
  etiqueta,
  cabecera,
  pie,
  children,
  onCerrar,
}: {
  abierto: boolean;
  etiqueta: string;
  cabecera: ReactNode;
  pie?: ReactNode;
  children: ReactNode;
  onCerrar: () => void;
}) {
  useCapa(abierto, onCerrar);

  if (!abierto) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Cerrar"
        onClick={onCerrar}
        className="absolute inset-0 bg-tinta/25"
      />

      <aside
        role="dialog"
        aria-label={etiqueta}
        className="absolute inset-y-0 right-0 flex w-[min(560px,100vw)] flex-col bg-superficie animate-[deslizar_200ms_ease-out]"
      >
        <header className="flex items-start justify-between gap-4 border-b border-borde px-5 py-4 sm:px-6 sm:py-5">
          <div className="min-w-0">{cabecera}</div>
          <button
            type="button"
            onClick={onCerrar}
            aria-label="Cerrar"
            className="rounded-full border border-borde p-2 text-suave transition-colors duration-200 hover:bg-elevado"
          >
            <X className="size-4" strokeWidth={1.5} />
          </button>
        </header>

        <div className="scroll-fino flex-1 space-y-6 overflow-y-auto px-5 py-5 sm:px-6 sm:py-6">
          {children}
        </div>

        {pie && <footer className="border-t border-borde px-5 py-4 sm:px-6 sm:py-5">{pie}</footer>}
      </aside>
    </div>
  );
}
