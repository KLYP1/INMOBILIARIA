import { conectar } from "./_conexion.mts";
const sql = conectar();
try {
  const tablas = await sql<{ tabla: string; rls: boolean; filas: number }[]>`
    select c.relname as tabla, c.relrowsecurity as rls,
           (select count(*) from pg_policy p where p.polrelid = c.oid)::int as filas
    from pg_class c join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public' and c.relkind = 'r'
    order by c.relname`;
  console.log("TABLA                  RLS   POLITICAS");
  for (const t of tablas) {
    console.log(`  ${t.tabla.padEnd(20)} ${t.rls ? "si " : "NO "}   ${t.filas}`);
  }
  const [{ count: enums }] = await sql<{ count: number }[]>`
    select count(*)::int from pg_type t join pg_namespace n on n.oid = t.typnamespace
    where n.nspname = 'public' and t.typtype = 'e'`;
  const [{ count: indices }] = await sql<{ count: number }[]>`
    select count(*)::int from pg_indexes where schemaname = 'public'`;
  console.log(`\ntablas: ${tablas.length} | tipos enum: ${enums} | indices: ${indices}`);
  console.log(`sin RLS: ${tablas.filter(t => !t.rls).map(t => t.tabla).join(", ") || "ninguna"}`);
} finally { await sql.end(); }
