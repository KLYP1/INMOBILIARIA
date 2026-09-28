import { createServer } from "vite";
import { conectar } from "./_conexion.mts";

/**
 * Carga los datos de demostracion de lib/data/** en la base como una
 * inmobiliaria mas. Es idempotente: borra la inmobiliaria de demostracion y la
 * vuelve a crear entera, asi que se puede correr las veces que haga falta.
 *
 *   npm run sembrar
 *
 * Los modulos de lib/ se cargan con Vite porque usan imports sin extension y
 * alias del proyecto, que Node por si solo no resuelve.
 */

const OFFSET_LIMA = -5 * 60 * 60 * 1000;

/** Los tres digitos que el enmascarado de la demo destruyo, reconstruidos. */
function telefonoCompleto(mascarado: string, semilla: string): string {
  const visibles = mascarado.replace(/\D/g, ""); // "51987550"
  if (visibles.length !== 8) return mascarado;
  const n = [...semilla].reduce((t, c) => t + c.charCodeAt(0), 0);
  const medio = String(100 + (n % 900));
  // Sin "+": es la forma canonica, la misma que entrega WhatsApp.
  return `${visibles.slice(0, 5)}${medio}${visibles.slice(5)}`;
}

/** Fecha en Lima de un instante, mas una hora "09:19" de ese mismo dia. */
function instanteEnLima(anclaIso: string, hhmm: string): string {
  const lima = new Date(new Date(anclaIso).getTime() + OFFSET_LIMA);
  const [h, m] = hhmm.split(":").map(Number);
  const dia = Date.UTC(lima.getUTCFullYear(), lima.getUTCMonth(), lima.getUTCDate());
  return new Date(dia + h * 3600000 + m * 60000 - OFFSET_LIMA).toISOString();
}

const vite = await createServer({
  server: { middlewareMode: true },
  appType: "custom",
  logLevel: "error",
});

const cargar = (ruta: string) => vite.ssrLoadModule(ruta);

const [{ EMPRESA, ASESORES }, { PROYECTOS }, { LEADS }, { VISITAS }, { CONVERSACIONES }, { CONFIG_INICIAL }] =
  await Promise.all([
    cargar("/lib/data/empresa.ts"),
    cargar("/lib/data/proyectos.ts"),
    cargar("/lib/data/leads/index.ts"),
    cargar("/lib/data/visitas.ts"),
    cargar("/lib/data/conversaciones/index.ts"),
    cargar("/lib/data/asistente.ts"),
  ]);

const sql = conectar();

try {
  await sql.begin(async (tx) => {
    // Todo cuelga de la inmobiliaria: borrarla vacia el resto en cascada.
    await tx`delete from inmobiliarias where nombre = ${EMPRESA.nombre}`;

    const [inmobiliaria] = await tx<{ id: string }[]>`
      insert into inmobiliarias (nombre) values (${EMPRESA.nombre}) returning id`;
    const tenant = inmobiliaria.id;

    const idAsesor = new Map<string, string>();
    for (const a of ASESORES) {
      const [fila] = await tx<{ id: string }[]>`
        insert into asesores (inmobiliaria_id, nombre, telefono)
        values (${tenant}, ${a.nombre}, ${a.telefono}) returning id`;
      idAsesor.set(a.id, fila.id);
    }

    const idProyecto = new Map<string, string>();
    for (const p of PROYECTOS) {
      const [fila] = await tx<{ id: string }[]>`
        insert into proyectos (inmobiliaria_id, slug, nombre, distrito, lat, lng, etapa)
        values (${tenant}, ${p.id}, ${p.nombre}, ${p.distrito}, ${p.lat}, ${p.lng}, ${p.etapa})
        returning id`;
      idProyecto.set(p.id, fila.id);

      for (const u of p.unidades) {
        await tx`
          insert into unidades (proyecto_id, dormitorios, metraje, precio, disponibles)
          values (${fila.id}, ${u.dormitorios}, ${u.metraje}, ${u.precio}, ${u.disponibles})`;
      }
    }

    for (const a of ASESORES) {
      for (const slug of a.proyectos) {
        const proyecto = idProyecto.get(slug);
        if (!proyecto) continue;
        await tx`
          insert into asesores_proyectos (asesor_id, proyecto_id)
          values (${idAsesor.get(a.id)!}, ${proyecto})`;
      }
    }

    const idLead = new Map<string, string>();
    let mensajes = 0;
    for (const l of LEADS) {
      const [fila] = await tx<{ id: string }[]>`
        insert into leads (
          inmobiliaria_id, nombre, telefono, origen, canal, proyecto_id,
          presupuesto_min, presupuesto_max, forma_pago, dormitorios,
          zona_solicitada, plazo_mudanza, estado, objecion, asesor_id,
          primera_respuesta_seg, resumen_ia, creado_en, ultimo_contacto
        ) values (
          ${tenant}, ${l.nombre}, ${telefonoCompleto(l.telefono, l.id)},
          ${l.origen}, ${l.canal}, ${idProyecto.get(l.proyectoInteres) ?? null},
          ${l.presupuestoMin}, ${l.presupuestoMax}, ${l.formaPago}, ${l.dormitorios},
          ${l.zonaSolicitada}, ${l.plazoMudanza}, ${l.estado}, ${l.objecion},
          ${l.asesorAsignado ? (idAsesor.get(l.asesorAsignado) ?? null) : null},
          ${l.primeraRespuestaSeg}, ${l.resumenIA}, ${l.creadoEn}, ${l.ultimoContacto}
        ) returning id`;
      idLead.set(l.id, fila.id);

      // El orden importa mas que la hora exacta: si una transcripcion repite
      // hora, se empuja un minuto para que la conversacion no se lea al reves.
      let previo = 0;
      for (const m of CONVERSACIONES[l.id] ?? []) {
        let cuando = new Date(instanteEnLima(l.ultimoContacto, m.hora)).getTime();
        if (cuando <= previo) cuando = previo + 60000;
        previo = cuando;
        await tx`
          insert into mensajes (lead_id, autor, texto, propio, enviado_en)
          values (${fila.id}, ${m.autor}, ${m.texto}, ${m.propio ?? false},
                  ${new Date(cuando).toISOString()})`;
        mensajes++;
      }
    }

    for (const v of VISITAS) {
      await tx`
        insert into visitas (inmobiliaria_id, lead_id, proyecto_id, asesor_id, fecha_hora, estado)
        values (${tenant}, ${idLead.get(v.leadId)!}, ${idProyecto.get(v.proyectoId)!},
                ${idAsesor.get(v.asesor) ?? null}, ${v.fechaHora}, ${v.estado})`;
    }

    await tx`
      insert into config_asistente (inmobiliaria_id, config)
      values (${tenant}, ${sql.json(CONFIG_INICIAL)})`;

    console.log(`\n  ${EMPRESA.nombre}`);
    console.log(`  ${ASESORES.length} asesores`);
    console.log(`  ${PROYECTOS.length} proyectos`);
    console.log(`  ${LEADS.length} leads`);
    console.log(`  ${mensajes} mensajes`);
    console.log(`  ${VISITAS.length} visitas\n`);
  });
} finally {
  await sql.end();
  await vite.close();
}
