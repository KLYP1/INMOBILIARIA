import { createClient } from "@supabase/supabase-js";

/**
 * Construccion del cliente de Supabase, compartida entre el panel y el
 * trabajador de canales.
 *
 * Este archivo NO lleva `import "server-only"` a proposito, y no es un
 * descuido: ese guard hace `throw` incondicional salvo bajo la condicion de
 * exports `react-server`, que solo activa el bundler de Next. El trabajador de
 * WhatsApp corre como script de Node fuera de Next, asi que si el guard
 * estuviera aca no podria conectarse a la base.
 *
 * El guard vive en servidor.ts, que es la puerta que usa el panel.
 *
 * Va por HTTP y no por conexion directa a Postgres porque en Vercel cada
 * peticion nace y muere sola, y ahi un pool de conexiones se agota o se cuelga.
 *
 * Usa la clave de servicio, que salta la seguridad por fila. Se puede porque
 * todo esto corre en servidor. Cuando lleguen las cuentas, se parte en dos:
 * uno de servicio para el bot y otro con el token de la persona, que si pasa
 * por las politicas.
 */

function requerido(nombre: string): string {
  const valor = process.env[nombre];
  if (!valor) {
    throw new Error(
      `Falta ${nombre} en .env.local. Sin eso no hay acceso a la base.`,
    );
  }
  return valor;
}

export function crearClienteServicio() {
  return createClient(
    requerido("NEXT_PUBLIC_SUPABASE_URL"),
    requerido("SUPABASE_SERVICE_ROLE_KEY"),
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}
