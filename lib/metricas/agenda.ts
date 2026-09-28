import { porcentaje } from "../formato";
import type { Datos } from "../base/datos";
import type { Visita } from "../types";
import { diasAtras } from "./_comun";

/** Las que todavia no ocurrieron: son las que cuentan como agenda por delante. */
const PENDIENTES: Visita["estado"][] = ["confirmada", "pendiente_confirmacion"];

export function visitasPorVenir(datos: Datos): Visita[] {
  return datos.visitas.filter((v) => PENDIENTES.includes(v.estado));
}

export function visitasDeHoy(datos: Datos): Visita[] {
  return datos.visitas.filter((v) => diasAtras(v.fechaHora) === 0);
}

export function agendaSemana(datos: Datos) {
  const visitas = datos.visitas;
  const cuantas = (estado: Visita["estado"]) =>
    visitas.filter((v) => v.estado === estado).length;

  const confirmadas = cuantas("confirmada");
  const porConfirmar = cuantas("pendiente_confirmacion");
  const asistio = cuantas("asistio");
  const noAsistio = cuantas("no_asistio");

  return {
    total: visitas.length,
    confirmadas,
    tasaConfirmacion: porcentaje(confirmadas, confirmadas + porConfirmar),
    tasaAsistencia: porcentaje(asistio, asistio + noAsistio),
  };
}
