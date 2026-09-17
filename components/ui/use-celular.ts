"use client";

import { useSyncExternalStore } from "react";

const CONSULTA = "(max-width: 1023px)";

function suscribir(avisar: () => void) {
  const mq = window.matchMedia(CONSULTA);
  mq.addEventListener("change", avisar);
  return () => mq.removeEventListener("change", avisar);
}

/**
 * Para las pocas decisiones que CSS no puede tomar, como cual vista abre por
 * defecto. En el servidor se asume escritorio y React reconcilia al hidratar,
 * que es justo para lo que sirve useSyncExternalStore.
 */
export function useCelular() {
  return useSyncExternalStore(
    suscribir,
    () => window.matchMedia(CONSULTA).matches,
    () => false,
  );
}
