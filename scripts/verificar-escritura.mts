import { createServer } from "vite";
import { fileURLToPath } from "node:url";

/**
 * Prueba el camino de escritura contra la base real y limpia lo que crea.
 *
 *   npm run base:escritura
 *
 * Lo mas importante que verifica es que el mismo telefono, en dos formatos
 * distintos, no cree dos leads: WhatsApp entrega "51987..." y la semilla
 * guardaba "+51987...", y sin normalizar cada mensaje abriria un lead nuevo.
 */

const TELEFONO_CRUDO = "+51 999 888 777";
const MISMO_OTRO_FORMATO = "51999888777";

const vite = await createServer({
  server: { middlewareMode: true },
  appType: "custom",
  logLevel: "error",
  resolve: {
    alias: [
      {
        find: /^server-only$/,
        replacement: fileURLToPath(new URL("./vacio/server-only.js", import.meta.url)),
      },
    ],
  },
});

const fallos: string[] = [];
const revisar = (bien: boolean, queja: string) => {
  if (!bien) fallos.push(queja);
  console.log(`  ${bien ? "ok  " : "FALLA"} ${queja}`);
};

try {
  const { obtenerInmobiliariaPrincipal, obtenerLeadConHistorial } =
    await vite.ssrLoadModule("/lib/base/lectura-ligera.ts");
  const { obtenerOCrearLead, registrarMensaje, actualizarCalificacion } =
    await vite.ssrLoadModule("/lib/base/escribir.ts");
  const { crearClienteServicio } = await vite.ssrLoadModule("/lib/base/cliente-supabase.ts");
  const { calcularScore } = await vite.ssrLoadModule("/lib/scoring.ts");
  const { cargarContextoAsistente } = await vite.ssrLoadModule("/lib/base/lectura-ligera.ts");

  const inmobiliaria = await obtenerInmobiliariaPrincipal();
  const base = crearClienteServicio();
  // Por si una corrida anterior se corto a la mitad.
  await base.from("leads").delete().eq("telefono", MISMO_OTRO_FORMATO);

  const lead = await obtenerOCrearLead(inmobiliaria.id, TELEFONO_CRUDO, {
    origen: "web",
    canal: "whatsapp",
  });
  revisar(!!lead.id, "crea el lead desde un telefono con espacios y +");
  revisar(lead.telefono === MISMO_OTRO_FORMATO,
    `lo guarda en forma canonica (quedo "${lead.telefono}")`);
  revisar(lead.botPausado === false, "nace con el bot activo");

  const otraVez = await obtenerOCrearLead(inmobiliaria.id, MISMO_OTRO_FORMATO, {
    origen: "web", canal: "whatsapp",
  });
  revisar(otraVez.id === lead.id,
    "el mismo numero en otro formato NO crea un segundo lead");

  await registrarMensaje(lead.id, "lead", "Hola, busco depa de 2 dormitorios");
  await registrarMensaje(lead.id, "asistente", "Hola, con gusto. ¿En que distrito?");

  await actualizarCalificacion(lead.id, {
    nombre: "Prueba Escritura",
    presupuestoMin: 400000,
    presupuestoMax: 500000,
    zonaSolicitada: "Santiago de Surco",
    dormitorios: 2,
    formaPago: "credito_hipotecario",
    plazoMudanza: "inmediato",
  }, { estado: "calificado" });

  const leido = await obtenerLeadConHistorial(inmobiliaria.id, MISMO_OTRO_FORMATO);
  revisar(leido?.mensajes.length === 2, `guarda los dos mensajes (leyo ${leido?.mensajes.length})`);
  revisar(leido?.lead.nombre === "Prueba Escritura", "guarda el nombre extraido");
  revisar(leido?.lead.presupuestoMax === 500000, "guarda el presupuesto");
  revisar(leido?.lead.estado === "calificado", "guarda el estado");
  revisar(leido?.mensajes[0]?.autor === "lead", "conserva el orden y el autor");

  const { proyectos } = await cargarContextoAsistente();
  const score = calcularScore(leido!.lead, proyectos);
  revisar(score >= 70,
    `el score se calcula al leer y da para calificado (dio ${score})`);

  await base.from("leads").delete().eq("id", lead.id);
  const limpio = await obtenerLeadConHistorial(inmobiliaria.id, MISMO_OTRO_FORMATO);
  revisar(limpio === null, "la prueba se limpia sola");

  console.log(fallos.length === 0 ? "\n  Camino de escritura completo.\n" : "");
  if (fallos.length) process.exit(1);
} finally {
  await vite.close();
}
