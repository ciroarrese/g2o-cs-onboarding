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
| `movimiento.tsx` | Curvas (`entra`, `sale`, `salta`), `sube` (sube y aparece) y `<Pildora>` (píldora rosa con rebote). |
| `Intro.tsx` | `<Intro eyebrow titulo1 titulo2 />`, 7 s (210 cuadros). Portada de `templates/youtube-intro`. |
| `Cierre.tsx` | `<Cierre titulo url sonido />`, 7 s (210 cuadros). La cortina sonora trae una voz y suena solo si el mp3 está copiado (no se versiona; abajo); `sonido={false}` lo deja mudo. Portado de `templates/youtube-cierre`. |
| `vite-glob.d.ts` | Tipo de `import.meta.glob`, que `Cierre` usa para saber si el mp3 está. |

Los archivos (fuentes, imágenes, audio) están en `../assets/g2o/`, que el motor sirve solo. **El audio no:** `assets/g2o/audio/cierre-musica.mp3` no se versiona (regla del repo: ningún mp3, wav ni mp4). Sin ese archivo el cierre queda mudo y no da error; copiándolo a esa ruta suena, sin tocar código (`Cierre` lo detecta al compilar).

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
