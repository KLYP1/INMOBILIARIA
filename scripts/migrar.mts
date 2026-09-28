import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { conectar, salir } from "./_conexion.mts";

/**
 * Aplica las migraciones de supabase/migrations en orden alfabetico y anota
 * cual ya corrio, para poder ejecutarlo mil veces sin romper nada.
 *
 *   npm run migrar
 */

const CARPETA = join(process.cwd(), "supabase", "migrations");
const sql = conectar();

try {
  await sql`
    create table if not exists migraciones (
      nombre text primary key,
      aplicada_en timestamptz not null default now()
    )
  `;
  // Vive en public como las demas: sin RLS la podria leer cualquier anon key.
  await sql`alter table migraciones enable row level security`;

  const aplicadas = new Set(
    (await sql<{ nombre: string }[]>`select nombre from migraciones`).map(
      (f) => f.nombre,
    ),
  );

  const archivos = (await readdir(CARPETA))
    .filter((n) => n.endsWith(".sql"))
    .sort();

  if (archivos.length === 0) salir(`No hay ningun .sql en ${CARPETA}`);

  let nuevas = 0;
  for (const archivo of archivos) {
    if (aplicadas.has(archivo)) {
      console.log(`  ·  ${archivo} (ya estaba)`);
      continue;
    }

    const contenido = await readFile(join(CARPETA, archivo), "utf8");
    // En una transaccion: si algo falla a la mitad, no queda medio esquema.
    await sql.begin(async (tx) => {
      await tx.unsafe(contenido);
      await tx`insert into migraciones (nombre) values (${archivo})`;
    });

    console.log(`  ✓  ${archivo}`);
    nuevas++;
  }

  console.log(
    nuevas === 0
      ? "\n  La base ya estaba al dia.\n"
      : `\n  ${nuevas} ${nuevas === 1 ? "migracion aplicada" : "migraciones aplicadas"}.\n`,
  );
} catch (error) {
  const mensaje = error instanceof Error ? error.message : String(error);
  salir(`La migracion fallo y se revirtio entera:\n  ${mensaje}`);
} finally {
  await sql.end();
}
