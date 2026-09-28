/**
 * Todas las metricas del panel. Cada una recibe la foto de datos que devuelve
 * obtenerDatos(), en vez de leer una constante de modulo: por eso son puras y
 * se pueden probar sin base ni servidor.
 *
 * El archivo existe para que el resto del proyecto siga importando de
 * "@/lib/metricas" sin enterarse de que por dentro son cuatro modulos.
 */
export type { Distrito } from "./_comun";
export type { PuntoSemana } from "./leads";

export {
  calificadosEnEspera,
  leadsCalientes,
  leadsDelMes,
  leadsPorSemana,
  leadsRescatados,
  puntosRespuesta,
  respuestaPromedioSeg,
  valorEnRiesgo,
} from "./leads";

export {
  demandaNoAtendida,
  distritosPedidos,
  leadsSinOferta,
} from "./distritos";

export { agendaSemana, visitasDeHoy, visitasPorVenir } from "./agenda";

export {
  conversacionesPorCanal,
  informeSemanal,
  resumenCabecera,
} from "./resumen";
