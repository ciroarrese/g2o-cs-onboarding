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
  --cloud-blob-1: 0.248 0.487 1060;
  --cloud-blob-2: 0.752 0.569 876;
  --cloud-blob-3: 0.608 0.983 783;
  /* colores de datos de la interfaz recreada (estados de Health Score) */
  --data-estado-inactivo: #a8243a;
  --data-estado-crecimiento: #2e8b4a;
  --data-estado-maduro: #73bf69;
  --data-estado-activacion: #3d7fe0;
  --data-estado-caida: #f2495c;
  --data-estado-estancado: #e0b400;
  --data-estado-detenida: #a352cc;
}`;

// Estados: se dibujan como puntos sobre el fondo claro de la marca y como anillo sobre el tablero oscuro; 3 sobre `bg` de cada tema.
const ESTADO: DataRoleInput = { on: ["bg"], min: 3 };
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
}`;
// `strong` es texto sobre las fichas y el fondo oscuro (4,5); las fichas, severidades, riel y botón son rellenos que llevan texto blanco encima:
// se les pide solo que se distingan del panel (1,1), el contraste del texto lo juzga `qa` sobre lo que se ve.
const FILL: DataRoleInput = { on: ["surface"], min: 1.1 };
const g = themeFromTokensWithReport(TABLERO, theme, {
  data: {
    strong: { on: ["bg", "surface"], min: 4.5 },
    fichaInactivos: FILL, fichaDetenida: FILL, fichaCaida: FILL, fichaMaduros: FILL, fichaCrecimiento: FILL, fichaFresco: FILL,
    sev0: FILL, sev1: FILL, sev2: FILL, sev3: FILL, naranja: FILL, riel: FILL, azulBoton: FILL, logoA: FILL, logoB: FILL,
  },
});
export const tableroTheme: Theme = g.theme;
export const tableroReport = g.report;
