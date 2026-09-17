import { crear } from "./_crear";

/** Conversaciones que se apagaron. Entran a la secuencia de reactivacion. */
export const FRIOS = [
  crear({ id: "l-55", nombre: "Jorge Palomino", tel: "971204863", origen: "portal", proyecto: "altavista", pres: [0, 0], pago: "no_definido", dorm: null, zona: "Santiago de Surco", plazo: "solo_explorando", estado: "frio", resp: 68, dias: 16, contacto: 23000,
    resumen: "Preguntó precios y dejó de responder. No declaró presupuesto ni fecha; solo estaba mirando qué hay en Surco." }),
  crear({ id: "l-56", nombre: "Úrsula Tinoco", tel: "946280713", origen: "meta_ads", canal: "messenger", proyecto: "mirador", pres: [180000, 220000], pago: "no_definido", dorm: null, zona: "Miraflores", plazo: "solo_explorando", estado: "frio", objecion: "precio", resp: 54, dias: 20, contacto: 28000,
    resumen: "Buscaba Miraflores con 220 mil de tope. Al ver los precios reales dejó la conversación." }),
  crear({ id: "l-57", nombre: "Raúl Chacaltana", tel: "915863072", origen: "web", proyecto: "nova48", pres: [0, 0], pago: "no_definido", dorm: 2, zona: "San Isidro", plazo: "6_12_meses", estado: "frio", resp: 71, dias: 24, contacto: 33000,
    resumen: "Consultó por San Isidro para el próximo año. No volvió a escribir después de la segunda pregunta." }),
  crear({ id: "l-58", nombre: "Melanie Quiroz", tel: "968430215", origen: "portal", proyecto: "terrazas", pres: [0, 0], pago: "mivivienda", dorm: 2, zona: "Barranco", plazo: "solo_explorando", estado: "frio", resp: 45, dias: 30, contacto: 40000,
    resumen: "Agendó una visita en Terrazas del Sur y no asistió. Desde entonces no contesta los mensajes de seguimiento." }),
  crear({ id: "l-59", nombre: "Iván Salazar", tel: "929075614", origen: "meta_ads", canal: "instagram", proyecto: "alba", pres: [0, 0], pago: "no_definido", dorm: 1, zona: "Jesús María", plazo: "solo_explorando", estado: "frio", objecion: "ubicacion", resp: 62, dias: 45, contacto: 58000,
    resumen: "Pidió Jesús María, donde no hay proyecto. No aceptó ver alternativas y la conversación se cortó ahí." }),
  crear({ id: "l-60", nombre: "Noelia Bazán", tel: "934610827", origen: "web", proyecto: "altavista", pres: [0, 0], pago: "no_definido", dorm: null, zona: "Jesús María", plazo: "solo_explorando", estado: "descartado", objecion: "ubicacion", resp: 58, dias: 52, contacto: 70000,
    resumen: "Escribió por error buscando alquiler, no compra. Se marcó como descartada tras confirmarlo." }),
];
