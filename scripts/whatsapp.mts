import { rm } from "node:fs/promises";
import { join } from "node:path";
import {
  DisconnectReason,
  makeWASocket,
  useMultiFileAuthState,
} from "@whiskeysockets/baileys";
import qr from "qrcode-terminal";
import { createServer } from "vite";

/**
 * Prueba aislada de WhatsApp por Baileys.
 *
 *   npm run whatsapp
 *
 * Vincula un numero por QR, como WhatsApp Web, y contesta a quien le escriba
 * con el saludo que tiene configurado el asistente. NO toca la base de datos y
 * NO califica a nadie: eso son las fases 1 a 3. Esto solo responde si el canal
 * funciona de punta a punta.
 *
 * Baileys es ingenieria inversa no oficial y viola los terminos de WhatsApp.
 * Sirve para probar; nunca para el numero de un cliente.
 */

const SESION = join(process.cwd(), ".whatsapp-sesion");
/** Contestar al instante delata a un bot. Los modelos de Meta pesan el ritmo. */
const ESPERA_MS = 2500;

const vite = await createServer({
  server: { middlewareMode: true },
  appType: "custom",
  logLevel: "error",
});
const { CONFIG_INICIAL, SALUDOS } = await vite.ssrLoadModule(
  "/lib/data/asistente.ts",
);
await vite.close();

const saludo: string = SALUDOS[CONFIG_INICIAL.tono](CONFIG_INICIAL.nombre);

/** Baileys habla pino; sin esto escupe su registro entero por la consola. */
const callado = {
  level: "silent",
  fatal() {}, error() {}, warn() {}, info() {}, debug() {}, trace() {},
  child() { return callado; },
};

function aviso() {
  console.log(`
  ─────────────────────────────────────────────────────────────
   Vas a vincular un numero de WhatsApp escaneando este codigo.

   USA EL CHIP DEDICADO, no tu numero personal.

   Baileys no es oficial. Si WhatsApp lo detecta bloquea el
   numero de forma permanente y se lleva sus conversaciones.
   La investigacion reporta entre 2 y 8 semanas hasta la
   deteccion cuando se usa para responder a desconocidos.
  ─────────────────────────────────────────────────────────────
`);
}

let avisado = false;
/** Para saludar una sola vez por contacto y no repetirse como un loro. */
const saludados = new Set<string>();

async function arrancar(): Promise<void> {
  const { state, saveCreds } = await useMultiFileAuthState(SESION);

  const sock = makeWASocket({
    auth: state,
    logger: callado,
    browser: ["KLYP Inmobiliario", "Chrome", "1.0.0"],
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", async (u) => {
    if (u.qr) {
      if (!avisado) {
        aviso();
        avisado = true;
      }
      console.log("  Escanea desde WhatsApp → Dispositivos vinculados\n");
      qr.generate(u.qr, { small: true });
    }

    if (u.connection === "open") {
      const numero = sock.user?.id?.split(":")[0] ?? "desconocido";
      console.log(`\n  Conectado como +${numero}`);
      console.log(`  Responde: "${CONFIG_INICIAL.nombre}", tono ${CONFIG_INICIAL.tono}`);
      console.log(`  Escribele desde otro telefono. Ctrl+C para cortar.\n`);
    }

    if (u.connection === "close") {
      const causa = (u.lastDisconnect?.error as { output?: { statusCode?: number } })
        ?.output?.statusCode;

      if (causa === DisconnectReason.loggedOut) {
        console.log("\n  Sesion cerrada desde el telefono. Borro la sesion local.");
        await rm(SESION, { recursive: true, force: true });
        console.log("  Corre npm run whatsapp de nuevo para vincular otro numero.\n");
        process.exit(0);
      }

      console.log("  Conexion caida, reconectando...");
      void arrancar();
    }
  });

  sock.ev.on("messages.upsert", async ({ messages, type }) => {
    if (type !== "notify") return;

    for (const m of messages) {
      const jid = m.key.remoteJid ?? "";

      // Solo chats de una persona: nada de grupos ni de estados.
      if (m.key.fromMe) continue;
      if (jid.endsWith("@g.us") || jid === "status@broadcast") continue;

      const texto =
        m.message?.conversation ??
        m.message?.extendedTextMessage?.text ??
        "";
      const de = jid.split("@")[0];
      const quien = m.pushName ? `${m.pushName} (+${de})` : `+${de}`;

      console.log(`  ← ${quien}: ${texto || "[no es texto]"}`);

      if (!texto.trim()) continue;

      // El saludo va una vez; despues se confirma lo recibido, que es lo que
      // esta prueba tiene que demostrar: que el texto llega intacto.
      const respuesta = saludados.has(jid)
        ? `Te llego: "${texto}"`
        : saludo;
      saludados.add(jid);

      await new Promise((r) => setTimeout(r, ESPERA_MS));
      await sock.sendMessage(jid, { text: respuesta });
      console.log(`  → ${respuesta}\n`);
    }
  });
}

await arrancar();
