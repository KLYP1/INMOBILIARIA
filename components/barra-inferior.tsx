"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ENLACES } from "./enlaces";

/**
 * Navegacion del celular. Las pildoras de la cabecera no entran en 375px, asi
 * que abajo van los mismos seis destinos con icono y rotulo corto.
 */
export function BarraInferior() {
  const ruta = usePathname();

  return (
    <nav
      aria-label="Secciones"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-borde bg-elevado pb-[env(safe-area-inset-bottom)] lg:hidden"
    >
      <ul className="flex items-stretch">
        {ENLACES.map((enlace) => {
          const activo = ruta.startsWith(enlace.href);
          const Icono = enlace.icono;
          return (
            <li key={enlace.href} className="flex-1">
              <Link
                href={enlace.href}
                aria-current={activo ? "page" : undefined}
                className={`flex flex-col items-center gap-1 px-0.5 pt-2 pb-2.5 transition-colors duration-200 ${
                  activo ? "text-texto" : "text-tenue"
                }`}
              >
                <span
                  className={`flex size-7 items-center justify-center rounded-full transition-colors duration-200 ${
                    activo ? "bg-tinta text-tinta-texto" : ""
                  }`}
                >
                  <Icono className="size-4" strokeWidth={1.5} />
                </span>
                <span className="text-[10px] leading-none">{enlace.corto}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
