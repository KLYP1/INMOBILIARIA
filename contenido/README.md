# Contenido de redes — KLYP y @wida_ia

Proyecto de video (Remotion) y piezas para redes. Aquí queda todo lo necesario para seguir produciendo con el mismo estilo en cualquier sesión.

## Estructura

- `remotion/`: proyecto de Remotion. Las composiciones están registradas en `src/Root.tsx`.
  - `src/reel5/`: reel «3 preguntas», estilo editorial (`Gala.tsx`: letras condensadas y finas, números gigantes, texto detrás de la persona).
  - `src/promo/`: video animado de la plataforma (`ui.tsx` = colores, vidrio, iconos y fuentes de la demo; `Promo.tsx` = escenas, sincronizadas con la voz mediante `WARP`).
  - `src/posts/`: carruseles e imagen de marca 1080×1350.
  - `src/reel*/`, `src/v2/`: reels de anuncio y VSL anteriores.
- `scripts/limpiar_voz.sh`: limpieza de voz (eco, ruido, EQ, compresión).
- `scripts/alpha_matte*.py` + `post.py`: recorte de la persona (RobustVideoMatting) para poner texto detrás de la cabeza.

La media pesada (videos crudos, renders, voces, mattes) **no** se sube al repositorio. Ver `.gitignore`.

## Reglas de estilo (acordadas con Wida)

- **Sin filtro de cara:** nada de suavizado ni belleza. Solo corrección de color leve y pareja (exposición y balance de blancos, sin amarillo).
- **Nada tapa la cara:** los gráficos van arriba de la cabeza (en la pared), detrás de la cabeza (con matte) o en el pecho bajo el mentón. Siempre fuera de los botones de Instagram.
- **Logo oficial siempre:** `public/klyp_logo*.png`. Nunca redibujarlo.
- **No inventar frases ni pausas** que ella no dijo. Los subtítulos siguen exactamente lo que dice (español de Perú).
- **Subtítulos:** 1 a 4 palabras, palabra clave en letra condensada o en rojo.
- **Encuadre:** que no quede muy cerrado. Dejar pared atrás y arriba; centrar la cara.
- **Cierres:**
  - Contenido personal: @wida_ia + «Fundadora de [logo KLYP]».
  - Anuncios de KLYP: logo + «Comenta DEMO».
- **Audio:**
  - Voz limpia con `limpiar_voz.sh`.
  - Música propia (`public/music.wav`) entre -21 y -27 dB, con ducking (sidechaincompress).
  - Volumen final -13/-14 LUFS, pico máximo -1,5 dBTP.
- **Entrega:**
  - MP4 H.264 1080×1920 30 fps, menos de 30 MB (dos pasadas o CRF 14).
  - Portadas con la boca cerrada o sonrisa natural, y el texto dentro del recorte 3:4.
- **Estilo editorial** (referencia: @gala.emprendeia, adaptado a KLYP):
  - Letras: League Gothic (condensada) + Inter Tight 300 (fina) + Oswald 200 (números).
  - Colores: rojo `#E10600` / `#f23a3f`, guinda `#2B0202`, crema `#ECEAE0`.
  - Recursos: imágenes de apoyo en blanco y negro, destellos de blanco y negro y cambios de encuadre con corte seco.
- **Público objetivo de KLYP:** constructoras e inmobiliarias (no compradores).

## Uso

```bash
cd contenido/remotion && npm install
npx remotion studio                       # vista previa
npx remotion still src/index.ts PostMarca out/marca.png
npx remotion render src/index.ts Promo out/promo.mov --codec=prores --prores-profile=hq
```

## Herramientas que no están en el repositorio (se instalan en cada entorno)

- `audio-separator` (pip) + modelo `UVR-DeEcho-DeReverb.pth`
- DeepFilterNet (`deep-filter`)
- `openai-whisper` modelo `medium` (palabras con tiempos)
- RobustVideoMatting (`rvm_resnet50.pth`)
- `ffmpeg`, Chromium (Playwright)

## Skills y MCP del proyecto

- Skills en `/.claude/skills`: Remotion, HyperFrames, find-skills y Apify.
- Apify como MCP en `/.mcp.json`. Necesita la variable de entorno `APIFY_TOKEN`, configurada en el entorno y nunca en el repositorio.
