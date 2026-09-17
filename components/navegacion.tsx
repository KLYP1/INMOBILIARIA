"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell } from "lucide-react";
import { EMPRESA } from "@/lib/data/empresa";
import { ENLACES } from "./enlaces";
import { Avatar } from "./ui/avatar";

export function Navegacion({ avisos }: { avisos: number }) {
  const ruta = usePathname();

  return (
    <header className="flex items-center justify-between gap-4 py-4 lg:py-5">
      <Link
        href="/inicio"
        className="rounded-full border border-borde px-4 py-2 text-[13px] tracking-[0.14em] text-texto transition-colors duration-200 hover:bg-elevado"
      >
        KLYP
      </Link>

      {/* En celular los mismos destinos viven en la barra inferior. */}
      <nav className="hidden items-center gap-1 lg:flex">
        {ENLACES.map((enlace) => {
          const activo = ruta.startsWith(enlace.href);
          return (
            <Link
              key={enlace.href}
              href={enlace.href}
              aria-current={activo ? "page" : undefined}
              className={`rounded-full px-4 py-2 text-[13px] transition-colors duration-200 ${
                activo
                  ? "bg-tinta text-tinta-texto"
                  : "text-suave hover:text-texto"
              }`}
            >
              {enlace.texto}
            </Link>
          );
        })}
      </nav>

      <div className="flex items-center gap-3">
        <button
          type="button"
          className="relative rounded-full border border-borde p-2 text-suave transition-colors duration-200 hover:bg-elevado"
          aria-label={`Notificaciones, ${avisos} sin leer`}
        >
          <Bell className="size-4" strokeWidth={1.5} />
          {avisos > 0 && (
            <span className="absolute -top-0.5 -right-0.5 size-2 rounded-full bg-ambar" />
          )}
        </button>
        <Avatar nombre={EMPRESA.usuaria.nombre} className="size-9" />
      </div>
    </header>
  );
}
