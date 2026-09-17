"use client";

import { useEffect } from "react";

/**
 * Comportamiento comun de las capas que tapan la pantalla: cierran con Escape
 * y congelan el fondo, para que un roce de trackpad no mueva la pagina por
 * debajo del panel. Compensa el ancho de la barra de desplazamiento para que
 * el contenido no salte al abrir.
 */
/** El prefijo `use` es exigido por React, no es texto de interfaz. */
export function useCapa(activa: boolean, alCerrar: () => void) {
  useEffect(() => {
    if (!activa) return;

    const alPulsar = (e: KeyboardEvent) => {
      if (e.key === "Escape") alCerrar();
    };
    document.addEventListener("keydown", alPulsar);

    // El elemento que desplaza es <html>, no <body>: bloquear body no basta.
    const raiz = document.documentElement;
    const { overflow, paddingRight } = raiz.style;
    const barra = window.innerWidth - raiz.clientWidth;
    raiz.style.overflow = "hidden";
    if (barra > 0) raiz.style.paddingRight = `${barra}px`;

    return () => {
      document.removeEventListener("keydown", alPulsar);
      raiz.style.overflow = overflow;
      raiz.style.paddingRight = paddingRight;
    };
  }, [activa, alCerrar]);
}
