# Design system de Grow2on para Video Studio

Esta carpeta tiene todo lo que la skill `video-estudio` necesita para hacer videos con el estilo de Grow2on: tema, piezas de marca, intro, cierre, tipografías, imágenes y un video de ejemplo. Con esto la etapa 2 de la skill (el design system) ya está resuelta y no hay que rehacerla en cada video.

## Qué hay

| Carpeta | Contenido |
|---|---|
| `g2o/` | El código del design system: tema (`theme.ts`), catálogo de recursos (`assets.ts`), `Intro`, `Cierre`, `Motas`, `Pildora`, `Imagen` y las curvas de movimiento. El detalle de cada pieza está en `g2o/README.md`. |
| `assets/g2o/` | Los archivos: tipografía Geist (4 pesos), logos y aros 3D, 30 íconos 3D, logos de 19 plataformas, mockups de laptop, fotos del blog y la cortina sonora del cierre (solo si copiaste el mp3). Pesa unos 97 MB (con el mp3 del cierre, que no se versiona). |
| `g2o-base/` | Video de ejemplo con tres escenas (`intro`, `cierre` y `muestra`), para comprobar que todo quedó bien instalado y ver las piezas en uso. |

## Requisitos

- Haber clonado este repo y corrido `npm install` dentro de `video-studio/` (la herramienta).
- Nada más: la skill `video-estudio` está en `.claude/skills/` del repo y el enlace con esta carpeta ya está hecho.

## Cómo está instalado

Este repo trae la herramienta y los videos juntos:

```
<repo>/
  video-studio/              la herramienta (copia del repo público; ahí se corren los comandos)
    .video-studio.local.json   {"videosDir": "../video-estudio"}: enlaza la herramienta con los videos
  video-estudio/             los videos y el design system de Grow2on (esta carpeta)
    g2o/                       código del design system (este archivo está ahí)
    assets/g2o/                tipografía, imágenes y audio
    g2o-base/                  video de ejemplo (intro, cierre y muestra)
    tsconfig.json, env.d.ts    rutas relativas a ../video-studio (sirven en cualquier máquina)
```

No hace falta definir `VE_VIDEOS_DIR` ni copiar nada: `.video-studio.local.json` es relativo a `video-studio/`, así que funciona en cualquier máquina (también en Windows).

Comprobá la instalación, desde `video-studio/`:

```
npm run doctor                       # tiene que mostrar la carpeta de videos "desde .video-studio.local.json"
npm run typecheck                    # herramienta y videos
npm run render -- --list             # tienen que aparecer g2o-base-intro, g2o-base-cierre y g2o-base-muestra
npm run sheet -- g2o-base-muestra --count 12
```

La hoja de cuadros queda en `video-estudio/out/g2o-base-muestra-sheet.png`.

## Sonido del cierre (el mp3 no se versiona)

La cortina sonora del cierre es `assets/g2o/audio/cierre-musica.mp3`. Por regla de este repo no se sube ningún mp3, wav ni mp4 (el `.gitignore` de esta carpeta lo ignora), así que **un clon recién hecho no lo trae y el cierre sale mudo**: no da error ni en el render ni en `--check`. Para que suene, copiá el archivo (te lo pasa quien mantiene el design system) a `video-estudio/assets/g2o/audio/cierre-musica.mp3` (creá la carpeta `audio` si no existe) y volvé a renderizar; no hay nada más que tocar (`Cierre` detecta el archivo al compilar). `<Cierre sonido={false} />` lo deja mudo aunque el archivo esté, por ejemplo cuando el video lleva su propia música.

## Cómo usarlo en un video nuevo

El tema del video reexporta el de Grow2on. En `<slug>/theme.ts`:

```ts
export { theme, report } from "../g2o/theme";
```

En una escena (`<slug>/<escena>/Scene.tsx`):

```tsx
import { G2O } from "../../g2o/assets";
import { Imagen } from "../../g2o/Imagen";
import { Pildora, salta, sube } from "../../g2o/movimiento";
```

Intro y cierre, dentro de la historia del video:

```tsx
import { INTRO_DURACION, Intro } from "../../g2o/Intro";
import { CIERRE_DURACION, Cierre } from "../../g2o/Cierre";

<Intro eyebrow="Tutorial" titulo1="Primera línea" titulo2="segunda línea" />
<Cierre />
```

## Qué decirle al agente

Al pedir un video, alcanza con aclarar esto en el primer mensaje:

> Usá el design system de Grow2on que está en `video-estudio/g2o/` (leé `video-estudio/g2o/README.md`). No armes un tema nuevo: el `theme.ts` del video reexporta `../g2o/theme`, y la intro y el cierre son los de `g2o/`.

## Reglas de marca

- **Nombre:** se escribe "Grow2on", nunca "Grow2On".
- **Colores de marca:** el rosa `#e7007e` y el naranja `#f56406` se usan tal cual, aunque sobre blanco no lleguen al contraste que pide el control de calidad. Ya están declarados como aceptados en el tema.
- **Colores ajustados para video:** texto atenuado `#77757a`, éxito `#16793f` y alerta `#8f5d00`. Los originales del sistema no se leían sobre blanco.
- **Énfasis:** degradado de rosa a naranja, solo en títulos de intro, cierre y números destacados.
- **Piezas para redes:** sin logo en el pie y sin flechas.
- **Intro y cierre:** duran 7 segundos cada uno (210 cuadros a 30 fps) y tienen disposición propia en horizontal (1920x1080), vertical (1080x1920) y cuadrado (1080x1080): `Intro` y `Cierre` eligen sola la del formato del video (`g2o/formato.ts`, detalle en `g2o/README.md`).
- **Sonido del cierre:** el cierre trae una cortina sonora con una voz, siempre que el mp3 esté copiado (no se versiona; ver arriba). Con `<Cierre sonido={false} />` queda mudo, por ejemplo cuando el video lleva su propia música.

## Qué no incluye

- **El motor y la skill:** en este repo ya están (`video-studio/` y `.claude/skills/video-estudio/`).
- **El mp3 del cierre:** ver "Sonido del cierre".
- **Piezas de tutoriales de interfaz:** la barra de progreso, las etiquetas junto al foco y la cámara guiada viven en cada video, no en el design system.
- **El design system de marketing de origen:** de ahí salieron los colores y los recursos, pero la skill no lo necesita para trabajar.

## Para actualizarlo

Si cambia un color, una tipografía o un recurso, el cambio se hace en `g2o/theme.ts`, en `g2o/assets.ts` o en `assets/g2o/`, y se sube al repo. Los videos que reexportan el tema toman el cambio en el siguiente render.
