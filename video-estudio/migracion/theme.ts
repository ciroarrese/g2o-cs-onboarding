// Tema de la marca, armado desde los tokens de video/src/brand/theme.ts con el adaptador del toolkit.
// Todo sale de los tokens: colores de datos (`data`), tamaños de la interfaz recreada (`type.ui`), nubes (`cloud`) y fuentes
// (archivos de la carpeta `assets/` externa, que el render sirve sola).
import { asset } from "video-estudio/engine";
import { themeFromTokensWithReport } from "video-estudio/themes";
import type { DataRoleInput, Theme } from "video-estudio/themes";

const TOKENS = `:root {
  --name: marca-cs;
  --color-background: #f7f7f8;
  --color-surface: #ffffff;
  --color-surface-alt: #eeedef;
  --color-text: #1a1a1c;
  --color-text-muted: #5c5b5f;
  --color-border: #dcdadd;
  --color-primary: #e7007e;
  --color-secondary: #f56406;
  --color-on-primary: #ffffff;
  --color-success: #1fa25a;
  --color-warning: #f5a623;
  --color-error: #d7016b;
  --chart-1: #e7007e;
  --chart-2: #f56406;
  --chart-3: #770ce9;
  --chart-4: #1fa25a;
  --chart-5: #f5a623;
  --chart-6: #5c5b5f;
  --gradient-brand: linear-gradient(90deg, #e7007e 0%, #f56406 100%);
  --font-family: "Geist", sans-serif;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-stat: 700;
  --type-hero: 120px;
  --type-h1: 96px;
  --type-h2: 72px;
  --type-body: 44px;
  --type-caption: 32px;
  --type-eyebrow: 26px;
  --type-stat: 180px;
  --type-ui-xs: 15px;
  --type-ui-sm: 17px;
  --type-ui-md: 22px;
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-panel: 12px;
  --radius-lg: 16px;
  --radius-pill: 999px;
  --shadow-sm: 0 1px 2px rgba(26,26,28,.06);
  --shadow-md: 0 4px 12px rgba(26,26,28,.1);
  --shadow-lg: 0 12px 32px rgba(26,26,28,.14);
  /* nubes del original (CloudBackground): rosa, naranja y violeta; "x y diámetro" con x e y como fracción del cuadro */
  --cloud-colors: #e7007e, #f56406, #770ce9;
  --cloud-opacity: 0.22;
  --cloud-blur: 56;
  --cloud-blob-1: 0.248 0.487 1060;
  --cloud-blob-2: 0.752 0.569 876;
  --cloud-blob-3: 0.608 0.983 783;
  /* movimiento de la marca (brand/motion.tsx y primitives.tsx): OUT, IN_OUT y la curva estándar; 15 cuadros de Reveal y 40 de CountUp */
  --ease-standard: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
  --duration-base: 15;
  --duration-slow: 40;
  /* colores de datos de la interfaz recreada (estados de Health Score) */
  --data-estado-inactivo: #a8243a;
  --data-estado-crecimiento: #2e8b4a;
  --data-estado-maduro: #73bf69;
  --data-estado-activacion: #3d7fe0;
  --data-estado-caida: #f2495c;
  --data-estado-estancado: #e0b400;
  --data-estado-detenida: #a352cc;
  /* ---- estilo del design system (aesthetic): lo que el video ya no decide ---- */
  /* forma: chips y píldoras redondeados del todo, borde de 1 px, tarjetas con radio lg */
  --style-shape-corners: pill;
  --style-shape-border: 1;
  --style-shape-outlined: true;
  /* el cartel del título del original: radio de 40 px = 2,5 x radius.lg (16) */
  --style-shape-hero-scale: 2.5;
  /* superficie: blanca con sombra de marca; el vidrio del cartel del título (0,82 del original) */
  --style-surface-kind: solid;
  --style-surface-elevation: shadow;
  --style-surface-opacity: 0.82;
  /* texto: Geist semibold en los títulos, medium en los rótulos, degradado de marca en números y en la palabra resaltada */
  --style-type-title-weight: semibold;
  --style-type-label-weight: medium;
  --style-type-title-tracking: 0;
  --style-type-eyebrow-case: as-is;
  --style-type-eyebrow-tracking: 0;
  --style-type-numerals: gradient;
  --style-type-highlight: gradient;
  /* subtítulos y línea de la lista del original: caja normal, sin interletrado, peso regular */
  --style-type-caption-case: as-is;
  --style-type-caption-tracking: 0;
  --style-type-caption-weight: regular;
  /* fondo: las nubes de marca */
  --style-background-kind: clouds;
  --style-background-intensity: 1;
  /* movimiento: cada pieza entra a su manera, sin rebote; la cámara inclina un 10 % más que la base (0,055) y desenfoca al viajar */
  --style-motion-entrance: auto;
  --style-motion-overshoot: 0;
  --style-motion-stagger: 4;
  /* pasos del original por contexto: filas de la lista de la apertura 22, filas de la agenda 3, paneles del cierre 8, piezas del muro 0,6 */
  --style-motion-stagger-list: 22;
  --style-motion-stagger-rows: 3;
  --style-motion-stagger-items: 8;
  --style-motion-stagger-chips: 0.6;
  --style-motion-camera-blur: true;
  --style-motion-camera-tilt: 1.1;
  --style-motion-transition: wash;
  /* decoración: garabatos a mano, viñeta de tinta (0,28 del original = 1,27 de la base) y degradado que respira cada 3,5 s (105 cuadros) */
  --style-decor-doodles: true;
  --style-decor-doodle-stroke: hand;
  --style-decor-vignette: 1.27;
  --style-decor-vignette-color: text;
  --style-decor-accent: bar;
  --style-decor-accent-thickness: 0.625;
  --style-decor-gradient-loop: 105;
  /* historias: cartel de vidrio, lista en un renglón con el subrayado bajo el nombre, se atraviesa el titular, muro de 5 x 6 sin desenfoque
     de distancia en la apertura (con desenfoque en el cierre), cierre sobre blanco y firma sin barra */
  --style-story-title-card: glass;
  --style-story-list-layout: inline;
  --style-story-list-underline: name;
  --style-story-handoff: through;
  --style-story-headline-size: md;
  --style-story-closing-bg: surface;
  --style-story-signoff-bar: false;
  --style-story-wall-columns: 5;
  --style-story-wall-rows: 6;
  --style-story-wall-chip-scale: 1;
  --style-story-wall-dolly: 20;
  --style-story-wall-depth: 0.82;
  /* muro del original: columnas cada 410 px (480 de la base), filas cada 160 (168), ladrillo de 150 (200) y temblor igual */
  --style-story-wall-gap-x: 0.854;
  --style-story-wall-gap-y: 0.952;
  --style-story-wall-brick: 0.75;
  --style-story-wall-jitter: 1;
  --style-story-wall-blur-opening: false;
  --style-story-wall-blur-closing: true;
  /* gráficos, trazos y texto de efectos: los del original (trazo de 5 px, barras con radio md, llegada de las letras subiendo 24 px) */
  --style-chart-bar-radius: md;
  --style-chart-line-width: 5;
  --style-chart-grid: auto;
  --style-chart-fill: solid;
  --style-line-weight: regular;
  --style-line-cap: round;
  --style-text-arrival: rise;
}`;

// Estados: se dibujan como puntos sobre el fondo claro de la marca y como anillo sobre el tablero oscuro; 3 sobre `bg` de cada tema.
const ESTADO: DataRoleInput = { on: ["bg"], min: 3, scope: "puntos de la lluvia sobre el fondo de cada sistema; paleta aprobada de la herramienta recreada (maduro y estancado no llegan a 3:1 sobre blanco)" };
// Pares de la paleta de marca aprobada que no llegan a 4,5:1 (naranja y verde claros, el rosa sobre fondo claro...): se dan por conocidos en el
// informe del tema. `qa` sigue juzgando el texto real en pantalla; acá el degradado de marca solo se usa como texto de números grandes
// (qa no lo juzga) y los estados salen de `data`. No se reconocen los pares de `data.*`: esos sí se ven en pantalla con poco contraste.
const MARCA_APROBADA = [
  "accent/bg", "accent/surface", "accent2/bg", "accent2/surface", "onAccent/accent",
  "success/bg", "success/surface", "success/surfaceAlt", "warning/bg", "warning/surface", "warning/surfaceAlt", "danger/surfaceAlt", "chart[4]/surface",
];
const r = themeFromTokensWithReport(TOKENS, undefined, {
  acknowledge: MARCA_APROBADA,
  data: {
    estadoInactivo: ESTADO, estadoCrecimiento: ESTADO, estadoMaduro: ESTADO, estadoActivacion: ESTADO,
    estadoCaida: ESTADO, estadoEstancado: ESTADO, estadoDetenida: ESTADO,
  },
});

export const theme: Theme = {
  ...r.theme,
  font: { ...r.theme.font, files: [400, 500, 600, 700].map((weight, i) => ({ weight, src: asset(`fonts/Geist-${["Regular", "Medium", "SemiBold", "Bold"][i]}.otf`) })) },
};
export const report = r.report;

// ---------- tema oscuro de la herramienta recreada (tablero de monitoreo) ----------
const TABLERO = `:root {
  --name: tablero-oscuro;
  --color-background: #111217;
  --color-surface: #181b1f;
  --color-surface-alt: #22252b;
  --color-text: #ccccdc;
  --color-text-muted: #8e8e9a;
  --color-border: #2c2f36;
  --color-primary: #3d71d9;
  --color-secondary: #3d7fe0;
  --color-on-primary: #ffffff;
  --color-success: #73bf69;
  --color-warning: #e0b400;
  --color-error: #f2495c;
  --chart-1: #a8243a;
  --chart-2: #2e8b4a;
  --chart-3: #73bf69;
  --chart-4: #3d7fe0;
  --chart-5: #f2495c;
  --chart-6: #e0b400;
  --chart-7: #a352cc;
  --font-family: "Geist", sans-serif;
  /* colores propios del tablero: texto fuerte, fondos de ficha, severidades, riel y botón */
  --data-strong: #ffffff;
  --data-ficha-inactivos: #8a1c2c;
  --data-ficha-detenida: #8e3fb5;
  --data-ficha-caida: #d6283c;
  --data-ficha-maduros: #4a9a3f;
  --data-ficha-crecimiento: #1f6b36;
  --data-ficha-fresco: #1a7f37;
  --data-sev0: #e0b400;
  --data-sev1: #ff9830;
  --data-sev2: #f2495c;
  --data-sev3: #c4162a;
  --data-naranja: #ff9830;
  --data-riel: #2a2d33;
  --data-azul-boton: #3d71d9;
  --data-logo-a: #f05a28;
  --data-logo-b: #fbca0a;
  /* aro de foco que el video pone sobre una ficha cuando la pregunta la señala (es de la marca, no de la herramienta) */
  --data-foco: #e7007e;
  /* herramienta recreada: paneles de 6 px, controles de 4, ventana de 20; la sombra grande es el halo oscuro bajo el tablero */
  --radius-sm: 3px;
  --radius-md: 4px;
  --radius-panel: 6px;
  --radius-lg: 20px;
  --shadow-lg: 0 50px 100px -30px rgba(17,18,23,.9);
  /* su propio estilo: planos y de contorno fino, títulos medium, sin garabatos ni viñeta, sin nubes */
  --style-shape-corners: pill;
  --style-shape-border: 1;
  --style-shape-outlined: true;
  --style-surface-kind: solid;
  --style-surface-elevation: flat;
  /* los paneles del tablero llegan desde 160 px de profundidad (translateZ del original) */
  --style-motion-entrance: depth;
  --style-type-title-weight: medium;
  --style-type-label-weight: medium;
  --style-type-eyebrow-case: as-is;
  --style-background-kind: plain;
  --style-decor-doodles: false;
  --style-decor-vignette: 0;
  --style-decor-gradient-loop: 0;
}`;
// `strong` es texto sobre las fichas y el fondo oscuro (4,5); las fichas, severidades, riel y botón son rellenos que llevan texto blanco encima:
// se les pide solo que se distingan del panel (1,1), el contraste del texto lo juzga `qa` sobre lo que se ve.
const FILL: DataRoleInput = { on: ["surface"], min: 1.1 };
const g = themeFromTokensWithReport(TABLERO, theme, {
  data: {
    strong: { on: ["bg", "surface"], min: 4.5 },
    fichaInactivos: FILL, fichaDetenida: FILL, fichaCaida: FILL, fichaMaduros: FILL, fichaCrecimiento: FILL, fichaFresco: FILL,
    sev0: FILL, sev1: FILL, sev2: FILL, sev3: FILL, naranja: FILL, riel: FILL, azulBoton: FILL, logoA: FILL, logoB: FILL, foco: FILL,
  },
});
export const tableroTheme: Theme = g.theme;
export const tableroReport = g.report;
