"use client";

import { Search } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { CanalIcono } from "@/components/ui/canal";
import { contiene, plural } from "@/lib/texto";
import type { ChatVista } from "./pantalla-conversaciones";

export type Filtro = "todas" | "esperando" | "asesor";

const FILTROS: { clave: Filtro; texto: string }[] = [
  { clave: "todas", texto: "Todas" },
  { clave: "esperando", texto: "Esperando" },
  { clave: "asesor", texto: "Con asesor" },
];

export function ListaChats({
  chats,
  abierto,
  filtro,
  busqueda,
  onFiltro,
  onBusqueda,
  onAbrir,
}: {
  chats: ChatVista[];
  abierto: string | null;
  filtro: Filtro;
  busqueda: string;
  onFiltro: (f: Filtro) => void;
  onBusqueda: (b: string) => void;
  onAbrir: (id: string) => void;
}) {
  const visibles = chats.filter(
    (c) => !busqueda.trim() || contiene(c.nombre, busqueda),
  );

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 rounded-[10px] border border-borde bg-elevado px-3 py-2">
        <Search className="size-3.5 text-tenue" strokeWidth={1.5} />
        <input
          value={busqueda}
          onChange={(e) => onBusqueda(e.target.value)}
          placeholder="Buscar"
          aria-label="Buscar conversaciones"
          className="w-full bg-transparent text-[12px] outline-none placeholder:text-tenue"
        />
      </div>

      <div className="mt-3 flex flex-wrap gap-1">
        {FILTROS.map((f) => (
          <button
            key={f.clave}
            type="button"
            onClick={() => onFiltro(f.clave)}
            aria-pressed={filtro === f.clave}
            className={`rounded-full px-3 py-1.5 text-[11px] transition-colors duration-200 ${
              filtro === f.clave
                ? "bg-tinta text-tinta-texto"
                : "text-suave hover:bg-elevado"
            }`}
          >
            {f.texto}
          </button>
        ))}
      </div>

      <p className="mt-3 text-[11px] text-tenue">
        {plural(visibles.length, "conversación", "conversaciones")}
      </p>

      {visibles.length === 0 ? (
        <p className="mt-6 text-[13px] text-suave">
          Ninguna conversación coincide.
        </p>
      ) : (
        <ul className="scroll-fino mt-2 min-h-0 flex-1 overflow-y-auto">
          {visibles.map((chat) => (
            <li key={chat.id}>
              <button
                type="button"
                onClick={() => onAbrir(chat.id)}
                className={`flex w-full items-start gap-2.5 rounded-[10px] px-2 py-2.5 text-left transition-colors duration-200 ${
                  abierto === chat.id ? "bg-elevado" : "hover:bg-elevado"
                }`}
              >
                <Avatar nombre={chat.nombre} />
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-2">
                    <span className="truncate text-[13px]">{chat.nombre}</span>
                    <span className="shrink-0 text-[10px] text-tenue">
                      {chat.contactoRelativo}
                    </span>
                  </span>
                  <span className="mt-0.5 flex items-center gap-1.5">
                    <CanalIcono canal={chat.canal} className="size-3" />
                    <span className="min-w-0 flex-1 truncate text-[11px] text-tenue">
                      {chat.ultimoTexto}
                    </span>
                    {chat.esperando && (
                      <span className="size-1.5 shrink-0 rounded-full bg-ambar" />
                    )}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
