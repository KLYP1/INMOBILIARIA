import { createServer } from "vite";
import { conectar } from "./_conexion.mts";

const vite = await createServer({ server: { middlewareMode: true }, appType: "custom", logLevel: "error" });
const { CONVERSACIONES } = await vite.ssrLoadModule("/lib/data/conversaciones/index.ts");
const { LEADS } = await vite.ssrLoadModule("/lib/data/leads/index.ts");
const sql = conectar();

try {
  let comparados = 0, distintos = 0;
  for (const lead of LEADS) {
    const fuente = CONVERSACIONES[lead.id] ?? [];
    if (fuente.length === 0) continue;

    const enBase = await sql<{ texto: string; autor: string }[]>`
      select m.texto, m.autor::text from mensajes m
      join leads l on l.id = m.lead_id
      where l.nombre = ${lead.nombre} order by m.enviado_en`;

    comparados++;
    const igual =
      enBase.length === fuente.length &&
      enBase.every((m, i) => m.texto === fuente[i].texto && m.autor === fuente[i].autor);
    if (!igual) {
      distintos++;
      console.log(`  DIFIERE ${lead.nombre}: base ${enBase.length} vs fuente ${fuente.length}`);
      if (enBase.length === fuente.length) {
        const i = enBase.findIndex((m, j) => m.texto !== fuente[j].texto);
        console.log(`    primer desvio en posicion ${i}`);
        console.log(`    base:   ${enBase[i]?.texto.slice(0, 60)}`);
        console.log(`    fuente: ${fuente[i]?.texto.slice(0, 60)}`);
      }
    }
  }
  console.log(`\n  conversaciones comparadas: ${comparados}`);
  console.log(`  con diferencias: ${distintos}`);

  const [t] = await sql`
    select count(*)::int empates from (
      select lead_id, enviado_en, count(*) n from mensajes
      group by lead_id, enviado_en having count(*) > 1) x`;
  console.log(`  timestamps repetidos dentro de un chat: ${t.empates}`);
} finally { await sql.end(); await vite.close(); }
