import { crear } from "./_crear";

/** Leads con visita en la agenda de esta semana. Todos tienen asesor. */
export const AGENDADOS = [
  crear({ id: "l-22", nombre: "Ariana Céspedes", tel: "986330271", origen: "meta_ads", proyecto: "altavista", pres: [500000, 550000], pago: "credito_hipotecario", dorm: 2, zona: "Santiago de Surco", plazo: "inmediato", estado: "visita_agendada", asesor: "rocio", resp: 34, dias: 5, contacto: 120,
    resumen: "Confirmó visita para hoy a las diez. Viene con su esposo y quiere ver el departamento piloto de 68 m² y la zona de parrillas." }),
  crear({ id: "l-23", nombre: "Bruno Delgado", tel: "951702684", origen: "portal", proyecto: "nova48", pres: [420000, 460000], pago: "contado", dorm: 2, zona: "Pueblo Libre", plazo: "inmediato", estado: "visita_agendada", asesor: "diego", resp: 39, dias: 6, contacto: 200,
    resumen: "Paga al contado y quiere entrar antes de fin de año. Agendó para hoy al mediodía y pidió que le tengan lista la cotización del piso 7." }),
  crear({ id: "l-24", nombre: "Ximena Araujo", tel: "973845120", origen: "web", proyecto: "mirador", pres: [450000, 500000], pago: "credito_hipotecario", dorm: 2, zona: "Magdalena del Mar", plazo: "inmediato", estado: "visita_agendada", asesor: "rocio", resp: 45, dias: 8, contacto: 340,
    resumen: "Visita hoy a las cuatro. Trabaja cerca de la obra y quiere ver el avance real antes de firmar la separación." }),
  crear({ id: "l-25", nombre: "Joaquín Rebaza", tel: "940217635", origen: "referido", proyecto: "alba", pres: [460000, 510000], pago: "mivivienda", dorm: 3, zona: "San Miguel", plazo: "inmediato", estado: "visita_agendada", asesor: "diego", resp: 26, dias: 9, contacto: 480,
    resumen: "Lo refirió un vecino de Alba. Tiene la carta preaprobada del banco y viene el miércoles a ver el tres dormitorios de 80 m²." }),
  crear({ id: "l-26", nombre: "Nicole Aranda", tel: "918663042", origen: "meta_ads", canal: "instagram", proyecto: "terrazas", pres: [290000, 330000], pago: "mivivienda", dorm: 2, zona: "Chorrillos", plazo: "inmediato", estado: "visita_agendada", asesor: "sandra", resp: 51, dias: 10, contacto: 600,
    resumen: "Primera vivienda. Viene el miércoles por la tarde a la sala de ventas y pidió que le expliquen el cronograma de pagos en planos." }),
  crear({ id: "l-27", nombre: "Rodrigo Vilcapoma", tel: "962470158", origen: "portal", proyecto: "altavista", pres: [660000, 720000], pago: "contado", dorm: 3, zona: "Santiago de Surco", plazo: "3_6_meses", estado: "visita_agendada", asesor: "oscar", resp: 32, dias: 11, contacto: 760,
    resumen: "Compra al contado el tres dormitorios de 92 m². Viene el jueves temprano con su arquitecto para revisar posibles cambios de distribución." }),
  crear({ id: "l-28", nombre: "Milagros Tapia", tel: "907338926", origen: "web", proyecto: "nova48", pres: [380000, 420000], pago: "credito_hipotecario", dorm: 1, zona: "Pueblo Libre", plazo: "inmediato", estado: "visita_agendada", asesor: "diego", resp: 43, dias: 12, contacto: 900,
    resumen: "Busca un dormitorio para independizarse. Visita el jueves por la tarde y preguntó si el edificio acepta mascotas." }),
  crear({ id: "l-29", nombre: "Enrique Salcedo", tel: "929015473", origen: "meta_ads", proyecto: "mirador", pres: [540000, 600000], pago: "credito_hipotecario", dorm: 3, zona: "Miraflores", plazo: "3_6_meses", estado: "visita_agendada", asesor: "rocio", objecion: "ubicacion", resp: 57, dias: 13, contacto: 1050,
    resumen: "Pidió Miraflores y terminó agendando en Magdalena. Reprogramó una vez; la nueva cita quedó para el sábado por la mañana." }),
];
