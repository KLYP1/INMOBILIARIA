import type { Lead, LeadCrudo, Proyecto, Unidad } from "./types";

/**
 * Constructores para las pruebas. Cada uno devuelve algo valido y minimo, y se
 * sobrescribe solo el campo que la prueba quiere ejercer: asi cada caso dice en
 * dos lineas de que trata, en vez de esconderlo en veinte de relleno.
 */

export const COORD = {
  surco: { lat: -12.135, lng: -76.9917 },
  miraflores: { lat: -12.1211, lng: -77.0297 },
  barranco: { lat: -12.1489, lng: -77.0211 },
  magdalena: { lat: -12.0917, lng: -77.0717 },
};

export function unaUnidad(parcial: Partial<Unidad> = {}): Unidad {
  return {
    id: "u",
    dormitorios: 2,
    metraje: 68,
    precio: 450000,
    disponibles: 3,
    ...parcial,
  };
}

export function unProyecto(parcial: Partial<Proyecto> = {}): Proyecto {
  return {
    id: "altavista",
    nombre: "Altavista",
    distrito: "Santiago de Surco",
    lat: COORD.surco.lat,
    lng: COORD.surco.lng,
    etapa: "en_construccion",
    unidades: [unaUnidad()],
    ...parcial,
  };
}

/** Un proyecto en unas coordenadas dadas, para las pruebas de cercania. */
export function proyectoEn(
  id: string,
  donde: { lat: number; lng: number },
  unidades: Unidad[] = [unaUnidad()],
): Proyecto {
  return unProyecto({ id, nombre: id, distrito: id, ...donde, unidades });
}

/** Sin declarar nada: presupuesto en cero, sin zona y solo explorando. */
export function unLeadCrudo(parcial: Partial<LeadCrudo> = {}): LeadCrudo {
  return {
    id: "l",
    nombre: "Prueba Apellido",
    telefono: "+51 987 ••• 550",
    origen: "web",
    canal: "whatsapp",
    proyectoInteres: "altavista",
    presupuestoMin: 0,
    presupuestoMax: 0,
    formaPago: "no_definido",
    dormitorios: null,
    zonaSolicitada: "",
    plazoMudanza: "solo_explorando",
    estado: "nuevo",
    objecion: null,
    asesorAsignado: null,
    primeraRespuestaSeg: 30,
    creadoEn: "2026-09-01T13:00:00.000Z",
    ultimoContacto: "2026-09-01T13:00:00.000Z",
    resumenIA: "",
    botPausado: false,
    conversacion: [],
    ...parcial,
  };
}

export function unLead(parcial: Partial<Lead> = {}): Lead {
  return { ...unLeadCrudo(), score: 0, ...parcial };
}
