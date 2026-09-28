import { META_LEADS_MES } from "../data/empresa";
import { porcentaje } from "../formato";
import type { Datos } from "../base/datos";
import type { Canal } from "../types";
import { agendaSemana, visitasPorVenir } from "./agenda";
import { demandaNoAtendida } from "./distritos";
import {
  calificadosEnEspera,
  leadsCalientes,
  leadsDelMes,
  leadsPorSemana,
  leadsRescatados,
  respuestaPromedioSeg,
  valorEnRiesgo,
} from "./leads";

export function resumenCabecera(datos: Datos) {
  const delMes = leadsDelMes(datos);
  const agendadas = visitasPorVenir(datos).length;
  const calificados = calificadosEnEspera(datos).length;
  return {
    leadsMes: delMes.length,
    calificados,
    agendadas,
    metaLeads: META_LEADS_MES,
    avanceMeta: porcentaje(delMes.length, META_LEADS_MES),
    tasaCalificados: porcentaje(calificados, delMes.length),
    tasaAgendadas: porcentaje(agendadas, delMes.length),
  };
}

export function conversacionesPorCanal(datos: Datos): Record<Canal, number> {
  const conteo: Record<Canal, number> = {
    whatsapp: 0,
    instagram: 0,
    messenger: 0,
  };
  for (const lead of datos.leads) conteo[lead.canal] += 1;
  return conteo;
}

/** El informe del lunes. No calcula nada nuevo: compone lo que ya existe. */
export function informeSemanal(datos: Datos) {
  const semanas = leadsPorSemana(datos);
  const agenda = agendaSemana(datos);
  return {
    leadsSemana: semanas.at(-1)?.actual ?? 0,
    leadsSemanaPrevia: semanas.at(-2)?.actual ?? 0,
    enEspera: calificadosEnEspera(datos).length,
    calientes: leadsCalientes(datos).length,
    valorEnRiesgo: valorEnRiesgo(datos),
    respuestaSeg: respuestaPromedioSeg(datos),
    visitas: agenda.total,
    tasaConfirmacion: agenda.tasaConfirmacion,
    tasaAsistencia: agenda.tasaAsistencia,
    sinOferta: demandaNoAtendida(datos).slice(0, 3),
    rescatados: leadsRescatados(datos).length,
  };
}
