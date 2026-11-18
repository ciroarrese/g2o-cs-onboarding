// Extensiones locales del video sobre el design system de Grow2on (../g2o/theme.ts, que no se toca).
// Las escenas leían del tema viejo cosas que el sistema no trae: la letra chica de la interfaz recreada (`type.ui`) y los colores de estado de
// Health Score (`data.estado*`). Acá se derivan del tema g2o (rosa, naranja, Geist, nubes y estilo siguen siendo los del sistema) y el tablero oscuro
// de la herramienta recreada se arma sobre ese mismo tema. Las escenas importan `temaVideo` de acá y nunca escriben un color suelto.
import { themeFromTokensWithReport } from "video-estudio/themes";
import type { DataRoleInput, Theme } from "video-estudio/themes";
import { theme as g2o } from "./theme";

const EXTRAS = `:root {
  /* letra de la interfaz recreada (la misma que usaba la versión anterior de este video) */
  --type-ui-xs: 15px;
  --type-ui-sm: 17px;
  --type-ui-md: 22px;
  /* colores de estado de Health Score (paleta de la herramienta recreada, no de la marca) */
  --data-estado-inactivo: #a8243a;
  --data-estado-crecimiento: #2e8b4a;
  --data-estado-maduro: #73bf69;
  --data-estado-activacion: #3d7fe0;
  --data-estado-caida: #f2495c;
  --data-estado-estancado: #e0b400;
  --data-estado-detenida: #a352cc;
}`;
const ESTADO: DataRoleInput = { on: ["bg"], min: 3, scope: "puntos de la lluvia sobre el fondo de cada sistema; paleta aprobada de la herramienta recreada (maduro y estancado no llegan a 3:1 sobre blanco)" };
const e = themeFromTokensWithReport(EXTRAS, g2o, {
  data: { estadoInactivo: ESTADO, estadoCrecimiento: ESTADO, estadoMaduro: ESTADO, estadoActivacion: ESTADO, estadoCaida: ESTADO, estadoEstancado: ESTADO, estadoDetenida: ESTADO },
});

/** El tema g2o más lo que las escenas necesitan (`type.ui`, `data.estado*`). Es el que se pone en el `ThemeProvider` del video. */
export const temaVideo: Theme = { ...e.theme, name: "g2o", font: g2o.font };
export const extensionReport = e.report;

// ---------- tema oscuro de la herramienta recreada (tablero de monitoreo de Health Score) ----------
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
  /* aro de foco: el rosa del sistema */
  --data-foco: #e7007e;
  --radius-sm: 3px;
  --radius-md: 4px;
  --radius-panel: 6px;
  --radius-lg: 20px;
  --shadow-lg: 0 50px 100px -30px rgba(17,18,23,.9);
  --style-shape-corners: pill;
  --style-shape-border: 1;
  --style-shape-outlined: true;
  --style-surface-kind: solid;
  --style-surface-elevation: flat;
  --style-motion-entrance: depth;
  --style-type-title-weight: medium;
  --style-type-label-weight: medium;
  --style-type-eyebrow-case: as-is;
  --style-background-kind: plain;
  --style-decor-doodles: false;
  --style-decor-vignette: 0;
  --style-decor-gradient-loop: 0;
}`;
const FILL: DataRoleInput = { on: ["surface"], min: 1.1 };
const g = themeFromTokensWithReport(TABLERO, temaVideo, {
  data: {
    strong: { on: ["bg", "surface"], min: 4.5 },
    fichaInactivos: FILL, fichaDetenida: FILL, fichaCaida: FILL, fichaMaduros: FILL, fichaCrecimiento: FILL, fichaFresco: FILL,
    sev0: FILL, sev1: FILL, sev2: FILL, sev3: FILL, naranja: FILL, riel: FILL, azulBoton: FILL, logoA: FILL, logoB: FILL, foco: FILL,
  },
});
export const tableroTheme: Theme = g.theme;
export const tableroReport = g.report;
