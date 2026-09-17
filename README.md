# KLYP Inmobiliario

Panel de demostración de un asistente de WhatsApp para desarrolladoras
inmobiliarias de Lima. Muestra qué pasa cuando un bot atiende, califica y
agenda los leads que hoy se pierden por no contestar a tiempo.

Es una **demostración de piloto**: no hay servidor ni base de datos. Los sesenta
leads, los cinco proyectos y las doce visitas viven en el código, y lo que se
cambia durante la sesión se pierde al recargar. Eso es deliberado.

## Pantallas

| Ruta | Qué muestra |
|---|---|
| `/inicio` | Portada con las cifras del mes, la banda de leads sin atender y el informe semanal |
| `/conversaciones` | Bandeja para leer los chats y entrar a responder tú, pausando al asistente |
| `/leads` | Los sesenta leads con su calificación, filtros y ficha completa |
| `/proyectos` | Stock por tipología y qué leads mira cada proyecto |
| `/agenda` | Rejilla semanal, cola del día y ficha de visita con briefing previo |
| `/asistente` | Configuración del bot: preguntas, reglas, reactivación y canales |

## Cómo correrlo

```bash
npm install
npm run dev        # http://localhost:3000
```

Verificación antes de publicar:

```bash
npm run build
npx eslint app components features lib
```

## Cómo está armado

- **Next.js 16** (App Router, Turbopack), React 19, Tailwind v4, Recharts, lucide.
- `lib/` guarda los datos de demostración y todo lo que se deriva de ellos.
  Ningún número de la interfaz está escrito a mano: los 42 segundos de respuesta,
  los 19 calificados en espera y los S/ 8.6 millones en juego salen de
  `lib/metricas.ts`.
- `lib/vistas.ts` arma los modelos de vista. **Las etiquetas de tiempo relativo
  se resuelven en el servidor y viajan escritas**; un componente de cliente que
  las calcule rompe la hidratación.
- `app/(panel)/layout.tsx` va en `force-dynamic` para que las fechas sigan
  siendo relativas a hoy y no queden congeladas en el momento del build.
- `features/estado/proveedor-demo.tsx` guarda en memoria todo lo que el usuario
  toca durante la demostración, para que la bandeja y la ficha del lead vean lo
  mismo.

Las decisiones de producto y de arquitectura están en
[`docs/decisiones.md`](docs/decisiones.md).

## Lo que no hace

No hay conexión real con WhatsApp, Instagram ni Messenger: los canales se
representan, no se conectan. Conectarlos de verdad exige servidor propio con
webhooks públicos, verificación de empresa con Meta y cada plantilla aprobada,
y se presupuesta aparte.
