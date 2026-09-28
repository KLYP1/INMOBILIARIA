import { createServer } from "vite";
import { fileURLToPath } from "node:url";

/**
 * Compara lo que sale de la base contra los datos en memoria. Es la prueba de
 * que mover los datos no cambio su significado: mismos leads, mismos scores,
 * mismas conversaciones.
 *
 *   npm run base:verificar
 *
 * Queda fuera de la comparacion exacta lo que cambia a proposito:
 *
 *   - los ids, que ahora son UUID;
 *   - los telefonos, reconstruidos porque el enmascarado de la demo era
 *     destructivo;
 *   - creadoEn y ultimoContacto, porque los datos en memoria se calculan
 *     relativos al momento de importar el modulo mientras la base guarda
 *     instantes absolutos. Se desplazan tanto como haya pasado desde la
 *     siembra. De esos dos se comprueba lo que si tiene que conservarse: el
 *     orden de los leads y los intervalos entre ellos.
 */

const vite = await createServer({
  server: { middlewareMode: true },
  appType: "custom",
  logLevel: "error",
  resolve: {
    // "server-only" explota fuera de un componente de servidor. Aca no aplica.
    alias: [
      {
        find: /^server-only$/,
        replacement: fileURLToPath(new URL("./vacio/server-only.js", import.meta.url)),
      },
    ],
  },
});

type Comparable = Record<string, unknown>;

const CAMPOS = [
  "nombre", "origen", "canal", "proyectoInteres", "presupuestoMin",
  "presupuestoMax", "formaPago", "dormitorios", "zonaSolicitada",
  "plazoMudanza", "estado", "objecion", "primeraRespuestaSeg", "resumenIA",
  "score",
] as const;

function comparable(lead: Comparable): string {
  const plano: Comparable = {};
  for (const campo of CAMPOS) plano[campo] = lead[campo];
  plano.conversacion = (lead.conversacion as { autor: string; texto: string }[]).map(
    (m) => `${m.autor}:${m.texto}`,
  );
  return JSON.stringify(plano);
}

try {
  const { LEADS } = await vite.ssrLoadModule("/lib/data/leads/index.ts");
  const { PROYECTOS } = await vite.ssrLoadModule("/lib/data/proyectos.ts");
  const { VISITAS } = await vite.ssrLoadModule("/lib/data/visitas.ts");
  const { cargarDatos } = await vite.ssrLoadModule("/lib/base/cargar.ts");

  const datos = await cargarDatos();

  const fallos: string[] = [];
  const revisar = (bien: boolean, queja: string) => {
    if (!bien) fallos.push(queja);
  };

  revisar(datos.leads.length === LEADS.length, `leads: base ${datos.leads.length} vs memoria ${LEADS.length}`);
  revisar(datos.proyectos.length === PROYECTOS.length, `proyectos: base ${datos.proyectos.length} vs memoria ${PROYECTOS.length}`);
  revisar(datos.visitas.length === VISITAS.length, `visitas: base ${datos.visitas.length} vs memoria ${VISITAS.length}`);

  // Los nombres son unicos en los datos de demostracion, asi que sirven de
  // llave para emparejar sin depender de los ids, que si cambiaron.
  const enMemoria = new Map<string, Comparable>(
    LEADS.map((l: Comparable) => [l.nombre as string, l]),
  );
  revisar(enMemoria.size === LEADS.length, "hay nombres de lead repetidos: no sirven de llave");

  let distintos = 0;
  for (const lead of datos.leads as Comparable[]) {
    const original = enMemoria.get(lead.nombre as string);
    if (!original) {
      fallos.push(`"${lead.nombre}" esta en la base y no en memoria`);
      continue;
    }
    if (comparable(lead) !== comparable(original)) {
      distintos++;
      if (distintos <= 3) {
        for (const campo of CAMPOS) {
          if (JSON.stringify(lead[campo]) !== JSON.stringify(original[campo])) {
            fallos.push(
              `${lead.nombre} · ${campo}: base ${JSON.stringify(lead[campo])} vs memoria ${JSON.stringify(original[campo])}`,
            );
          }
        }
      }
    }
  }
  revisar(distintos === 0, `${distintos} leads con diferencias`);

  // Las fechas absolutas se corren con el tiempo; los intervalos, no. Si la
  // siembra fue fiel, los huecos entre leads consecutivos son identicos.
  const intervalos = (lista: Comparable[]) => {
    const ms = lista
      .map((l) => new Date(l.ultimoContacto as string).getTime())
      .sort((a, b) => b - a);
    return ms.slice(1).map((t, i) => ms[i] - t);
  };
  const huecosBase = intervalos(datos.leads as Comparable[]);
  const huecosMemoria = intervalos(LEADS as Comparable[]);
  revisar(
    JSON.stringify(huecosBase) === JSON.stringify(huecosMemoria),
    "los intervalos entre leads consecutivos no se conservaron",
  );

  const porContacto = (lista: Comparable[]) =>
    [...lista]
      .sort(
        (a, b) =>
          new Date(b.ultimoContacto as string).getTime() -
          new Date(a.ultimoContacto as string).getTime(),
      )
      .map((l) => l.nombre);
  revisar(
    JSON.stringify(porContacto(datos.leads as Comparable[])) ===
      JSON.stringify(porContacto(LEADS as Comparable[])),
    "el orden de los leads por ultimo contacto cambio",
  );

  const sumaBase = (datos.leads as Comparable[]).reduce((t, l) => t + (l.score as number), 0);
  const sumaMemoria = LEADS.reduce((t: number, l: Comparable) => t + (l.score as number), 0);
  revisar(sumaBase === sumaMemoria, `suma de scores: base ${sumaBase} vs memoria ${sumaMemoria}`);

  revisar(!!datos.config?.nombre, "la configuracion del asistente llego vacia");
  revisar(datos.asesores.length > 0, "no llego ningun asesor");
  revisar(
    datos.asesores.every((a: Comparable) => (a.proyectos as string[]).length > 0),
    "algun asesor quedo sin proyectos vinculados",
  );

  if (fallos.length === 0) {
    console.log(
      `\n  Identico.\n` +
        `  ${datos.leads.length} leads · ${datos.proyectos.length} proyectos · ` +
        `${datos.visitas.length} visitas · ${datos.asesores.length} asesores\n` +
        `  suma de scores: ${sumaBase}\n`,
    );
  } else {
    console.error("\n  DIFERENCIAS:\n");
    for (const f of fallos.slice(0, 25)) console.error(`  · ${f}`);
    console.error("");
    process.exit(1);
  }
} finally {
  await vite.close();
}
