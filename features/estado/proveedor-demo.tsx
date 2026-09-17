"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { hora } from "@/lib/fechas";
import { fechaSeguimiento } from "@/lib/seguimiento";
import type {
  Mensaje,
  PlazoSeguimiento,
  ResultadoVisita,
  Seguimiento,
} from "@/lib/types";

/**
 * Todo lo que el usuario cambia durante la demostracion vive aqui, en memoria.
 * Sube al layout del panel porque dos pantallas tocan la misma conversacion:
 * lo que se escribe en la bandeja tiene que verse en la ficha del lead.
 * No persiste al recargar, y esta bien.
 */
type Estado = {
  mensajesEnviados: Record<string, Mensaje[]>;
  botPausado: Record<string, boolean>;
  asignaciones: Record<string, string | null>;
  notas: Record<string, string>;
  agendadas: Record<string, boolean>;
  llegadas: Record<string, boolean>;
  resultados: Record<string, ResultadoVisita>;
  seguimientos: Record<string, Seguimiento>;
};

type Acciones = {
  enviarMensaje: (leadId: string, texto: string) => void;
  reanudarBot: (leadId: string) => void;
  asignar: (leadId: string, asesorId: string | null) => void;
  anotar: (leadId: string, texto: string) => void;
  proponerVisita: (leadId: string) => void;
  marcarLlegada: (visitaId: string, llego: boolean) => void;
  registrarResultado: (visitaId: string, resultado: ResultadoVisita) => void;
  programarSeguimiento: (leadId: string, plazo: PlazoSeguimiento) => void;
  cancelarSeguimiento: (leadId: string) => void;
  /** Mensajes originales mas los que envio el asesor en esta sesion. */
  conversacionDe: (leadId: string, base: Mensaje[]) => Mensaje[];
};

const VACIO: Estado = {
  mensajesEnviados: {},
  botPausado: {},
  asignaciones: {},
  notas: {},
  agendadas: {},
  llegadas: {},
  resultados: {},
  seguimientos: {},
};

const Contexto = createContext<(Estado & Acciones) | null>(null);

export function ProveedorDemo({ children }: { children: ReactNode }) {
  const [estado, setEstado] = useState<Estado>(VACIO);

  const enviarMensaje = useCallback((leadId: string, texto: string) => {
    const limpio = texto.trim();
    if (!limpio) return;
    const mensaje: Mensaje = {
      autor: "asesor",
      texto: limpio,
      hora: hora(new Date().toISOString()),
      propio: true,
    };
    setEstado((e) => ({
      ...e,
      mensajesEnviados: {
        ...e.mensajesEnviados,
        [leadId]: [...(e.mensajesEnviados[leadId] ?? []), mensaje],
      },
      // Quien responde toma la conversacion: el asistente se calla.
      botPausado: { ...e.botPausado, [leadId]: true },
    }));
  }, []);

  const reanudarBot = useCallback((leadId: string) => {
    setEstado((e) => ({
      ...e,
      botPausado: { ...e.botPausado, [leadId]: false },
    }));
  }, []);

  const asignar = useCallback((leadId: string, asesorId: string | null) => {
    setEstado((e) => ({
      ...e,
      asignaciones: { ...e.asignaciones, [leadId]: asesorId },
    }));
  }, []);

  const anotar = useCallback((leadId: string, texto: string) => {
    setEstado((e) => ({ ...e, notas: { ...e.notas, [leadId]: texto } }));
  }, []);

  const proponerVisita = useCallback((leadId: string) => {
    setEstado((e) => ({ ...e, agendadas: { ...e.agendadas, [leadId]: true } }));
  }, []);

  const marcarLlegada = useCallback((visitaId: string, llego: boolean) => {
    setEstado((e) => ({ ...e, llegadas: { ...e.llegadas, [visitaId]: llego } }));
  }, []);

  const registrarResultado = useCallback(
    (visitaId: string, resultado: ResultadoVisita) => {
      setEstado((e) => ({
        ...e,
        resultados: { ...e.resultados, [visitaId]: resultado },
      }));
    },
    [],
  );

  const programarSeguimiento = useCallback(
    (leadId: string, plazo: PlazoSeguimiento) => {
      setEstado((e) => ({
        ...e,
        seguimientos: {
          ...e.seguimientos,
          [leadId]: { plazo, fecha: fechaSeguimiento(plazo) },
        },
        // El asistente vuelve a tomar la conversacion para poder escribirle.
        botPausado: { ...e.botPausado, [leadId]: false },
      }));
    },
    [],
  );

  const cancelarSeguimiento = useCallback((leadId: string) => {
    setEstado((e) => {
      const seguimientos = { ...e.seguimientos };
      delete seguimientos[leadId];
      return { ...e, seguimientos };
    });
  }, []);

  const conversacionDe = useCallback(
    (leadId: string, base: Mensaje[]) => {
      const enviados = estado.mensajesEnviados[leadId];
      return enviados?.length ? [...base, ...enviados] : base;
    },
    [estado.mensajesEnviados],
  );

  const valor = useMemo(
    () => ({
      ...estado,
      enviarMensaje,
      reanudarBot,
      asignar,
      anotar,
      proponerVisita,
      marcarLlegada,
      registrarResultado,
      programarSeguimiento,
      cancelarSeguimiento,
      conversacionDe,
    }),
    [
      estado,
      enviarMensaje,
      reanudarBot,
      asignar,
      anotar,
      proponerVisita,
      marcarLlegada,
      registrarResultado,
      programarSeguimiento,
      cancelarSeguimiento,
      conversacionDe,
    ],
  );

  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}

export function useDemo() {
  const valor = useContext(Contexto);
  if (!valor) throw new Error("useDemo necesita estar dentro de ProveedorDemo");
  return valor;
}
