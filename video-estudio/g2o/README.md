# Base de video de Grow2on

Lo que se tomó de `G2O Mkt Design System` para hacer videos con Video Studio (skill `video-estudio`).
Cómo está instalada en este repo y cómo usarla con la skill está en `LEEME.md` (en esta misma carpeta).

## Qué hay

| Archivo | Qué es |
|---|---|
| `theme.ts` | Tema del video: colores, Geist, radios, sombras y estilo (píldoras, degradado rosa a naranja, anillo rosa como señal, entradas que suben). Sale de los tokens del design system. |
| `assets.ts` | Catálogo `G2O`: logos, aros 3D, zócalo, 30 íconos 3D, 19 plataformas, mockups de laptop, fotos del blog y la cortina sonora. |
| `Imagen.tsx` | `<Imagen src=... />`: imagen que espera a cargar antes de capturar el cuadro. |
| `Motas.tsx` | `<Motas />`: las motas rosa, naranja y violeta contra el borde derecho (`borde="abajo"`: contra el de abajo, lo que usa el vertical). |
| `formato.ts` | Disposición de la intro y del cierre según el formato (`introGeom`, `cierreGeom`, `formatoDe`): posiciones del logo, el aro, la píldora y el título. Lo leen `Intro`, `Cierre` y los empalmes de un video. Ver "Intro y cierre en vertical y cuadrado". |
| `Particulas.tsx` | `<Particulas />`: partículas de colores (rosa, naranja, violeta) a la deriva lenta para todo un video; se reparten en todo el cuadro y su cantidad por defecto sigue el área (64 por cada 1920 x 1080 px). Ver "Partículas flotantes" abajo. |
| `movimiento.tsx` | Curvas (`entra`, `sale`, `salta`), `sube` (sube y aparece) y `<Pildora>` (píldora rosa con rebote). |
| `Intro.tsx` | `<Intro eyebrow titulo1 titulo2 />`, 7 s (210 cuadros), en horizontal, vertical y cuadrado (ver "Intro y cierre en vertical y cuadrado"). Portada de `templates/youtube-intro`. Props opcionales (sin ellas, igual que siempre): `salida` (segundo en que salen aro, logo y motas; 5,5) `traspaso` (cuadro local desde el que deja de dibujar la píldora y el título porque otra capa los transforma), `aroSalida` (`{ dx?, escala? }`: la salida del aro con movimiento, `dx` px extra hacia la derecha y `escala` final, 1 = sin achicar; sin ella el aro sale como siempre: 160 px a la derecha y sin achicar) y `capa` (nodo que se dibuja sobre el fondo blanco y bajo las motas, el aro y los textos; ver "Partículas flotantes"). |
| `Cierre.tsx` | `<Cierre titulo url sonido />`, 7 s (210 cuadros), en los tres formatos. La cortina sonora trae una voz y suena solo si el mp3 está copiado (no se versiona; abajo); `sonido={false}` lo deja mudo. Portado de `templates/youtube-cierre`. Props opcionales (sin ellas, igual que siempre): `mensaje` (segundo en que entra la frase; 2, y la píldora entra 0,6 s después) y `pildoraDesde` (cuadro local desde el que la píldora de la URL está puesta y quieta, sin entrada, porque otra capa la trajo hasta su lugar; antes ocupa su lugar pero no se ve) y `capa` (nodo que se dibuja sobre el fondo blanco y bajo las motas, el aro y los textos; ver "Partículas flotantes"). |
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

## Intro y cierre en vertical y cuadrado

`Intro` y `Cierre` leen el tamaño del video (`useVideoConfig()`) y eligen la disposición en `formato.ts`; en horizontal (1920x1080) el resultado es el de siempre, cuadro por cuadro. Son las mismas piezas con la misma jerarquía (logo, píldora de categoría, título en dos líneas con la segunda en degradado, aro 3D con burbujas, motas; en el cierre, logo, frase en degradado, píldora con la dirección y aro), recompuestas:

| | Intro | Cierre |
|---|---|---|
| Horizontal 1920x1080 | Texto a la izquierda, aro a la derecha (como la plantilla). | Columna de texto centrada en el alto a la izquierda, aro que sangra por la derecha y abajo. |
| Vertical 1080x1920 | Apilada a la izquierda con margen de 80 px: logo arriba (alto 84 px), píldora y título (letra 112 px, baja sola si un renglón no entra) a media altura, aro de 1120 px centrado en el tercio de abajo; las motas se juntan contra el borde de abajo y el aro sale hacia abajo. | Texto arriba a la izquierda (logo 110 px, frase de 84 px, píldora) y el aro entero (1250 px de imagen, ~970 px visibles) debajo, centrado, sin cortarse gire como gire. |
| Cuadrado 1080x1080 | Compacta: logo, píldora y título arriba a la izquierda (letra 96 px o menos, margen de 70 px) y el aro de 760 px abajo a la derecha. | Texto arriba a la izquierda (logo 88 px, frase de 84 px, píldora) y aro de 800 px entero abajo a la derecha. |

- La píldora de la dirección queda siempre alineada a la izquierda de la columna de texto: su esquina sale de `cierreGeom(...).pildora` y no depende del ancho del texto, así que un empalme puede traer una píldora hasta ahí y que caiga exacta (ver `proyectos-ia/puentes.tsx`).
- Los márgenes (70 a 80 px a los lados, 170 px arriba en vertical) son más que el 3 % del control de calidad: en un teléfono la interfaz tapa los bordes.
- La intro del vertical y del cuadrado baja la letra del título lo necesario para que el renglón más ancho entre (medido con la tipografía del tema); en horizontal no, es `type.hero * 0,93 * escala` como siempre.
- Con `aroSalida`, `dx` es el desplazamiento extra a lo largo del eje de salida del formato: a la derecha en horizontal y hacia abajo en vertical y cuadrado.
- Los videos sueltos `g2o-base-intro` y `g2o-base-cierre` habilitan los tres formatos (`--format vertical|cuadrado`).

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
- Intro y cierre tienen disposición propia para horizontal, vertical y cuadrado (ver arriba). Los empalmes que las conectan con otras escenas tienen que usar `formato.ts` y no coordenadas fijas.
- `Pildora` calla el contraste del control de calidad solo mientras entra o sale (fondo y texto en fundido a la vez); en reposo se juzga estricto.
