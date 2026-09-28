import postgres from "postgres";

/**
 * Conexion a Postgres para los scripts de mantenimiento. Acepta la cadena
 * entera si alguien la pego, y si no la arma a partir de la contraseña: los
 * demas datos se derivan de la URL del proyecto, que ya esta en .env.local.
 */

/** aws-0-sa-east-1 es São Paulo, la region mas cercana a Lima. */
const HOST_POR_DEFECTO = "aws-0-sa-east-1.pooler.supabase.com";

export function salir(mensaje: string): never {
  console.error(`\n  ${mensaje}\n`);
  process.exit(1);
}

const FALTA =
  "Falta la contraseña de la base de datos.\n" +
  "  Abre .env.local y pegala despues de SUPABASE_DB_PASSWORD=\n" +
  "  Si no la recuerdas, en Supabase → Connect → Session pooler hay un boton\n" +
  "  'Reset database password' que genera una nueva.";

function cadena(): string {
  const directa = process.env.DATABASE_URL?.trim();
  if (directa) {
    if (directa.includes("[")) {
      salir(
        "DATABASE_URL todavia tiene el hueco [YOUR-PASSWORD] sin reemplazar.\n" +
          "  Cambialo por la contraseña real, sin dejar los corchetes.",
      );
    }
    return directa;
  }

  const clave = process.env.SUPABASE_DB_PASSWORD?.trim();
  if (!clave) salir(FALTA);

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  if (!url) salir("Falta NEXT_PUBLIC_SUPABASE_URL en .env.local.");

  // https://dscbegifyoiqhgsseqgv.supabase.co  ->  dscbegifyoiqhgsseqgv
  const ref = new URL(url).hostname.split(".")[0];
  const host = process.env.SUPABASE_POOLER_HOST?.trim() || HOST_POR_DEFECTO;

  // encodeURIComponent para que una contraseña con @ o / no parta la cadena.
  return `postgresql://postgres.${ref}:${encodeURIComponent(clave)}@${host}:5432/postgres`;
}

/** prepare:false porque el pooler no sostiene sentencias preparadas. */
export function conectar() {
  return postgres(cadena(), { prepare: false, onnotice: () => {} });
}
