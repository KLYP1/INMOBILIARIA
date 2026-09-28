import "server-only";
import { cache } from "react";
import { cargarDatos } from "./cargar";

/**
 * El punto por el que el panel entero lee.
 *
 * Va envuelto en cache() de React porque una pantalla como Inicio la consultan
 * media docena de componentes de servidor distintos: sin esto serian seis
 * viajes a Supabase para pintar una sola pagina. Con esto, el primero la trae y
 * el resto recibe la misma foto, y la cache muere al terminar la peticion, asi
 * que dos visitantes nunca comparten datos.
 *
 * Existe aparte de cargar.ts porque aquel responde "como se lee" y este "como
 * se reusa", y porque cargar.ts ya esta cerca del limite de tamaño del proyecto.
 */
export const obtenerDatos = cache(cargarDatos);

export type { Datos } from "./cargar";
