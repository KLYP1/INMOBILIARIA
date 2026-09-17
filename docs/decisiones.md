# KLYP Inmobiliario — decisiones de implementación

Complementa el brief original. Solo registra lo que el brief dejaba abierto
o lo que hubo que resolver para que los números cierren entre sí.

## Datos

- **60 leads**, de los cuales **50 fueron creados este mes**. La métrica grande
  "Leads del mes" cuenta el mes calendario; la tabla de Leads muestra los 60.
- **19 calificados sin asesor asignado**. La banda ámbar los cuenta desde los
  datos: `estado === "calificado" && !asesorAsignado`.
- **Valor en riesgo** = 19 × S/ 455,909 = S/ 8,662,271. Se muestra truncado a un
  decimal (`S/ 8.6 millones`), no redondeado: el dinero en riesgo no se exagera.
- **Tiempo de respuesta promedio: 42 s**, calculado sobre los 60 leads. No está
  escrito a mano en ningún lado.
- **20 leads (33%)** piden distritos sin proyecto: Miraflores 9, San Isidro 5,
  Barranco 4, Jesús María 2.
- **12 visitas** en la semana: 4 ya ocurridas y 8 por venir. La métrica
  "Visitas" de la portada cuenta las 8 por venir.
- **11 conversaciones completas** de WhatsApp, de 11 a 14 mensajes. La de Karen
  Bustamante (`l-14`) muestra la derivación a un asesor humano.

## Coherencia entre estado y score

El `estado` viene en los datos; el `score` se calcula siempre con
`lib/scoring.ts`. Los atributos de cada lead están elegidos para que el semáforo
derivado nunca contradiga su estado: los `calificado` y `visita_agendada` dan 70
o más, los `en_conversacion` caen entre 40 y 69, y los `frio` y `descartado`
quedan por debajo de 40.

## Fechas

Todo se deriva de dos anclas de módulo en `lib/fechas.ts`:

- `HOY`: medianoche de hoy en Lima.
- `AHORA`: el instante actual truncado al minuto.

Los datos se generan como desplazamientos sobre esas anclas, y el formateo usa
un desplazamiento fijo de −5 h en vez de `Intl`. Así el servidor y el navegador
producen la misma cadena y la hidratación nunca discrepa. Por eso "hace 20 min"
siempre dice 20: el dato y la etiqueta salen de la misma referencia.

Los números se formatean a mano (`lib/formato.ts`), sin `Intl.NumberFormat`, por
la misma razón.

## Gráfico "Leads por semana"

El brief pedía "este mes" contra "mes pasado". Medido en semanas del mes
calendario, la semana en curso queda a medio llenar y la línea aparenta una
caída que no existe. Se usa en cambio una ventana móvil: **últimas 4 semanas**
contra las **4 semanas previas**, ambas completas y comparables. Las dos series
salen de los leads reales.

## Alcance

La pantalla de Leads lee sus filtros de la URL (`?estado=…&sinAsesor=1`), de
modo que la banda ámbar de la portada navega directo a la lista ya filtrada.

## Renderizado dinámico

Las rutas del panel declaran `dynamic = "force-dynamic"` en
`app/(panel)/layout.tsx`. Sin eso Next las prerenderiza en el build y las
fechas quedan congeladas en ese instante: al día siguiente la demostración se
vería vieja. Solo el login se sirve estático, porque no muestra fechas.

## El servidor es dueño del "ahora"

`AHORA` se evalúa una vez por proceso. Cuando un componente de cliente recibía
un `ultimoContacto` generado en el servidor y volvía a calcular la etiqueta con
su propio reloj, las dos cadenas diferían y React fallaba al hidratar
("hace 4 min" contra "hace 5 min").

La regla es: las etiquetas relativas se resuelven en el servidor y viajan ya
escritas. `LeadVista.contactoRelativo` existe por eso. El formateo que solo
depende de la marca de tiempo —hora, día, fecha larga— sí puede correr en el
cliente, porque es determinista.

## Una tarjeta negra por pantalla

- Inicio: tiempo de respuesta.
- Leads: los calificados que esperan contacto.
- Proyectos: unidades disponibles, tanto en la lista como en el detalle.
- Agenda: visitas de la semana.
- Asistente: la vista previa de WhatsApp.

Dos elementos oscuros más no cuentan como tarjeta y siguen la misma lógica que
la píldora activa de la navegación: el día seleccionado en el calendario y las
burbujas del asistente en las transcripciones, que son su voz dentro del
diálogo.

## Casos límite cubiertos

Auditoría sobre la demo buscando lo que la rompe delante de un cliente. Todo
lo de abajo está verificado en el navegador.

**Entradas vacías.** Ningún campo vacío produce una frase rota. Sin nombre, el
asistente se presenta como «el asistente» y el formulario lo avisa. Sin hora,
la vista previa dice «Sin definir» en vez de «Atiende a 21:00».

**Configuraciones absurdas.** Apagar las ocho preguntas de calificación es
posible, pero la pantalla advierte que así no puede calificar a nadie y que
todos los leads llegarán con score cero.

**Plurales.** `plural()` en `lib/texto.ts`. Antes se leía «1 preguntas»,
«1 datos», «1 leads interesados».

**Búsqueda sin tildes.** `normalizar()` quita diacríticos antes de comparar.
Veintinueve de los sesenta nombres llevan tilde o eñe, y nadie las escribe al
buscar: «alvaro» encuentra a Álvaro Chirinos, «OSCAR» a Óscar Villanueva.

**Parámetros de URL inválidos.** `?estado=inventado` se descarta en lugar de
aplicarse. Antes dejaba la tabla en cero mientras los desplegables seguían
diciendo «Todos», sin forma de recuperarse salvo recargando.

**Rutas inexistentes.** `app/not-found.tsx` y `app/(panel)/not-found.tsx`, en
español y con la paleta. Antes salía el 404 de Next, en inglés y sobre fondo
blanco, con la navegación de KLYP encima.

**Capas.** El panel de lead y el modal de importar comparten `useCapa`: cierran
con Escape y congelan el fondo. El bloqueo va sobre `<html>`, que es el elemento
que desplaza, y compensa el ancho de la barra para que el contenido no salte al
abrir.

**Transcripciones ausentes.** Cuarenta y nueve de los sesenta leads no traen
conversación, y así se queda: es una demo piloto. Lo que cambió es el texto, que
antes afirmaba que el lead «todavía no tiene conversación registrada» y
contradecía a un resumen que sí describía una. Ahora dice que la transcripción
no está incluida en los datos de demostración.

## Intervención humana, agenda de obra y valor de pago

Segunda tanda. El panel dejaba ver lo que el bot conversa pero no participar, y
la Agenda servía al gerente y no al vendedor que está en obra.

**Estado compartido.** `features/estado/proveedor-demo.tsx` sube al layout del
panel lo que antes vivía dentro de la pantalla de Leads. Sin eso, un mensaje
escrito en la bandeja no existiría en la ficha del lead.

**Conversaciones.** Bandeja de tres columnas con el mismo compositor que la
ficha. Al enviar, el bot se pausa y un botón se lo devuelve. No se fabrican
respuestas del cliente: inventar mensajes entrantes hace que la demo se sienta
de juguete.

**Canales.** `origen` es de dónde vino el lead; `canal` es por dónde ocurre la
conversación. Son cosas distintas y faltaba la segunda. 45 WhatsApp, 11
Instagram, 4 Messenger.

**Plantillas.** Desde julio de 2025 WhatsApp cobra por plantilla entregada. La
ventana de 24 horas que abre el cliente al escribir permite responder gratis en
texto libre; fuera de ella hace falta plantilla aprobada. Por eso los tres
mensajes de reactivación van marcados como marketing y los dos de confirmación
como utilidad.

**Agenda.** La rejilla se queda para el gerente y se le suma una vista Hoy en
cola, con botones Llegó y No vino, pensada para el celular. Cualquier visita
abre una ficha con el resumen del lead, el briefing generado en
`lib/briefing.ts` y el registro de resultado.

**Rescate entre proyectos.** Cinco leads pidieron Miraflores, San Isidro o
Barranco y terminaron en otro proyecto: S/ 2.2 millones que se perdían. Es la
prueba en soles de por qué lo multi-distrito se paga, y no vale nada para un
cliente de un solo proyecto.

**Momento de la visita.** `VisitaVista.momento` se resuelve en el servidor por
la misma razón que `contactoRelativo`: comparar contra el reloj dentro de un
componente de cliente rompe la hidratación.

**Celular.** El brief pedía 1440px, pero quien más va a abrir esto es el
vendedor que está en obra con el teléfono en la mano. Medido a 375px, la página
desbordaba 383px: era el doble de ancha que la pantalla. Las seis píldoras de
la cabecera se mudan a una barra inferior fija con icono y rótulo corto
(`components/barra-inferior.tsx`), y `components/enlaces.ts` queda como única
lista de destinos para que las dos navegaciones no se separen nunca.

La tabla de nueve columnas de Leads no se encoge: debajo de `lg` se cambia por
fichas apiladas con las mismas columnas en tres renglones, y el orden pasa de
cabeceras a dos píldoras. Conversaciones se vuelve bandeja de una columna, pero
sin duplicar el árbol: lista, hilo y contexto se alternan con clases sobre una
sola copia de cada uno, porque duplicarlos habría roto el `ref` que lleva el
hilo al último mensaje.

Las tarjetas con gráfico llevaban `min-w-0`: Recharts fija un ancho en píxeles
y un hijo de grid no baja de su contenido, así que la tarjeta empujaba 12px
fuera de la pantalla.

**Cuándo CSS no alcanza.** La Agenda abre en la cola de Hoy si la pantalla es
chica, y esa es una decisión de estado, no de estilo. Va por
`components/ui/use-celular.ts` con `useSyncExternalStore`, que declara el valor
del servidor y deja que React reconcilie al hidratar. Un `setState` dentro de un
efecto haría lo mismo peor, y el lint de React lo rechaza.

**Seguimiento.** Un lead tibio no se pierde por falta de interés sino porque
nadie volvió a escribirle. El bloque devuelve la conversación al asistente con
fecha (mañana, en 3 días, en una semana) y enseña el mensaje que va a salir. El
segundo renglón ataca la objeción que quedó pendiente: un seguimiento que repite
lo que ya no funcionó no recupera a nadie. Aparece siempre en la ficha del lead,
y en la de visita solo cuando el interés registrado fue alto o medio: si salió
frío no hay nada que recuperar. Va marcado como plantilla de marketing porque
sale fuera de la ventana de 24 horas, que es justo lo que cuesta dinero.
