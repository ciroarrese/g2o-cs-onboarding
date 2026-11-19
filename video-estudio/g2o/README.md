# Base de video de Grow2on

Lo que se tomó de `G2O Mkt Design System` para hacer videos con Video Studio (skill `video-estudio`).
Cómo está instalada en este repo y cómo usarla con la skill está en `LEEME.md` (en esta misma carpeta).

## Qué hay

| Archivo | Qué es |
|---|---|
| `theme.ts` | Tema del video: colores, Geist, radios, sombras y estilo (píldoras, degradado rosa a naranja, anillo rosa como señal, entradas que suben). Sale de los tokens del design system. |
| `assets.ts` | Catálogo `G2O`: logos, aros 3D, zócalo, 30 íconos 3D, 19 plataformas, mockups de laptop, fotos del blog y la cortina sonora. |
| `Imagen.tsx` | `<Imagen src=... />`: imagen que espera a cargar antes de capturar el cuadro. |
| `Motas.tsx` | `<Motas />`: las motas rosa, naranja y violeta contra el borde derecho. |
| `Particulas.tsx` | `<Particulas />`: partículas de colores (rosa, naranja, violeta) a la deriva lenta para todo un video. Ver "Partículas flotantes" abajo. |
| `movimiento.tsx` | Curvas (`entra`, `sale`, `salta`), `sube` (sube y aparece) y `<Pildora>` (píldora rosa con rebote). |
| `Intro.tsx` | `<Intro eyebrow titulo1 titulo2 />`, 7 s (210 cuadros). Portada de `templates/youtube-intro`. Props opcionales (sin ellas, igual que siempre): `salida` (segundo en que salen aro, logo y motas; 5,5) `traspaso` (cuadro local desde el que deja de dibujar la píldora y el título porque otra capa los transforma), `aroSalida` (`{ dx?, escala? }`: la salida del aro con movimiento, `dx` px extra hacia la derecha y `escala` final, 1 = sin achicar; sin ella el aro sale como siempre: 160 px a la derecha y sin achicar) y `capa` (nodo que se dibuja sobre el fondo blanco y bajo las motas, el aro y los textos; ver "Partículas flotantes"). |
| `Cierre.tsx` | `<Cierre titulo url sonido />`, 7 s (210 cuadros). La cortina sonora trae una voz y suena solo si el mp3 está copiado (no se versiona; abajo); `sonido={false}` lo deja mudo. Portado de `templates/youtube-cierre`. Props opcionales (sin ellas, igual que siempre): `mensaje` (segundo en que entra la frase; 2, y la píldora entra 0,6 s después) y `pildoraDesde` (cuadro local desde el que la píldora de la URL está puesta y quieta, sin entrada, porque otra capa la trajo hasta su lugar; antes ocupa su lugar pero no se ve) y `capa` (nodo que se dibuja sobre el fondo blanco y bajo las motas, el aro y los textos; ver "Partículas flotantes"). |
| `vite-glob.d.ts` | Tipo de `import.meta.glob`, que `Cierre` usa para saber si el mp3 está. |

Los archivos (fuentes, imágenes, audio) están en `../assets/g2o/`, que el motor sirve solo. **El audio no:** `assets/g2o/audio/cierre-musica.mp3` no se versiona (regla del repo: ningún mp3, wav ni mp4). Sin ese archivo el cierre queda mudo y no da error; copiándolo a esa ruta suena, sin tocar código (`Cierre` lo detecta al compilar).

## Partículas flotantes

`<Particulas />` dibuja unas 64 partículas rosa, naranja y violeta (colores del tema) que suben despacio y se mecen de lado. Props opcionales: `cantidad` (64), `opacidad` (0,5 por defecto, sin mezcla: pensada para ir sobre el fondo), `semilla` (11) y `frame`.

- **Capa de fondo global** (lo recomendado): va en la ranura `backdrop` de la historia (`spec.backdrop = Particulas`, ver `stories/README.md`, "Capa de fondo global"). Se dibuja sobre el color y las nubes y bajo todo el contenido (interfaces recreadas, píldoras, tarjetas, titulares); las ventanas y los paneles la tapan, y es lo esperado. Los velos (`Wash`) la llevan adentro.
- **Continuas entre escenas:** dentro de la capa `useFrame()` es el cuadro absoluto del video, así que la posición de cada partícula (función del cuadro y de su índice, pseudoazar sembrado) es la misma antes y después de un corte. `Particulas` no suma ningún desplazamiento propio: no le pases `frame` si la montás en la capa.
- **Intro y cierre de marca:** tienen fondo blanco propio, así que la capa no se ve si la monta otro. Se la pasan por la prop `capa`: `<Intro capa={<BackdropLayer>{Particulas}</BackdropLayer>} />` (igual en `Cierre`); queda sobre el blanco y bajo las motas del sistema (que siguen siendo las de siempre). Sin `capa`, intro y cierre son idénticos a antes. Para que los velos propios de un empalme (un `div` con el color del fondo que se levanta) también la lleven, envolvé el video con `<StoryBackdropProvider backdrop={Particulas}>` y poné `<VeilContent />` (de `kit`) dentro del velo.
- **Una sola población:** hay que montar la capa en bloques que no se vean a la vez a través de una capa translúcida; con un velo del color del fondo, la capa dentro del velo coincide con la de abajo y no se duplica.
- **Control de calidad:** `BackdropLayer` marca la capa con `data-qa-decor` y `data-qa-ignore="covered vacio"`; los puntos son tenues y de colores del tema para que el contraste del texto encima se mantenga.
- Con otra duración o formato: usa `useVideoConfig()` para el tamaño del cuadro; las partículas se reparten en él.

## Cómo lo usa un video nuevo

`<slug>/theme.ts`:

```ts
export { theme, report } from "../g2o/theme";
```

En una escena:

```tsx
import { G2O } from "../../g2o/assets";
import { Imagen } from "../../g2o/Imagen";
import { Pildora, salta } from "../../g2o/movimiento";
```

## Probar

Desde `video-studio/` (no hace falta `VE_VIDEOS_DIR`: lo toma de `.video-studio.local.json`):

```
npm run render -- g2o-base-intro --props '{"titulo2":"Sincronización de stock"}'
npm run render -- g2o-base-cierre
npm run sheet -- g2o-base-muestra --count 12
```

Las salidas quedan en `../out/` (`video-estudio/out/`).

## Pendiente de decidir

- Contraste de marca: el rosa `#e7007e` sobre blanco da 4,47:1 (se piden 4,5) y el naranja `#f56406` da 3,13:1. Aprobados tal cual el 16/11/2026 (`acknowledge` en `theme.ts`); el control de calidad sigue midiendo el texto real de cada escena.
- Ajustes hechos para video: texto atenuado `#77757a` (el gris 300 del sistema da 2:1), éxito `#16793f` y alerta `#8f5d00`.
- Intro y cierre están diseñados solo en horizontal (1920x1080).
- `Pildora` calla el contraste del control de calidad solo mientras entra o sale (fondo y texto en fundido a la vez); en reposo se juzga estricto.
