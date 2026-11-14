// Design system anidado de la herramienta recreada: el panel "Sugerencia IA" del userscript, que es oscuro y tiene su propia paleta.
// Se usa con `ThemeScope` sobre el tema de la marca (../theme): ahí adentro `useTheme()` da este tema. Los colores propios del panel (botones,
// grupos de errores, papel y tinta del campo claro) son `theme.data`; su letra chica, `type.ui`.
import { themeFromTokensWithReport } from "video-estudio/themes";
import type { DataRoleInput, Theme } from "video-estudio/themes";
import { theme as brand } from "../theme";

const TOKENS = `:root {
  --name: panel-ia;
  --color-background: #1f1f1f;
  --color-surface: #141414;
  --color-surface-alt: #333333;
  --color-text: #eeeeee;
  --color-text-muted: #b4b4b4;
  --color-border: #333333;
  --color-primary: #1677ff;
  --color-secondary: #8e44ad;
  --color-on-primary: #ffffff;
  --color-success: #2ecc71;
  --color-warning: #f0a500;
  --color-error: #c0392b;
  --chart-1: #3b82f6;
  --chart-2: #a855f7;
  --chart-3: #f59e0b;
  --chart-4: #14b8a6;
  --font-family: "Geist", sans-serif;
  /* letra del panel real: botones 17, títulos y campos 16, notas y tarjetas 15 (el original llevaba 12 a 16; sube para que con el zoom de 1,2 se lea a 18 px) */
  --type-ui-xs: 15px;
  --type-ui-sm: 16px;
  --type-ui-md: 17px;
  /* esquinas del panel: ventana de 14, botones de 8, campos y fichas de 6; sin borde y con una sombra grande y oscura */
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-panel: 8px;
  --radius-lg: 14px;
  --shadow-sm: 0 1px 2px rgba(0,0,0,.3);
  --shadow-md: 0 8px 20px rgba(0,0,0,.35);
  --shadow-lg: 0 40px 90px -20px rgba(0,0,0,.6);
  /* colores propios del panel */
  --data-entrada: #111111;
  --data-papel: #ffffff;
  --data-tinta: #111111;
  --data-pista: #2a2a2a;
  --data-azul: #1677ff;
  --data-violeta: #8e44ad;
  --data-ambar: #f0a500;
  --data-verde: #2ecc71;
  --data-rojo: #c0392b;
  --data-grupo-producto: #3b82f6;
  --data-grupo-parametros: #a855f7;
  --data-grupo-cliente: #f59e0b;
  --data-grupo-origen: #14b8a6;
  /* su propio estilo: plano, esquinas redondeadas (no píldora), títulos semibold, sin garabatos, viñeta ni nubes */
  --style-shape-corners: rounded;
  --style-shape-border: 1;
  --style-shape-outlined: false;
  --style-surface-kind: solid;
  --style-surface-elevation: shadow;
  --style-type-title-weight: semibold;
  --style-type-label-weight: medium;
  --style-type-eyebrow-case: as-is;
  --style-background-kind: plain;
  --style-decor-doodles: false;
  --style-decor-vignette: 0;
  --style-decor-gradient-loop: 0;
}`;

// Rellenos que llevan texto encima: se les pide solo que se distingan del fondo del panel; el contraste del texto lo juzga `qa` sobre lo que se ve.
const FILL: DataRoleInput = { on: ["bg"], min: 1.1 };
// Colores de grupo: se usan como texto chico sobre el fondo del panel (la herramienta real los pinta así).
const GRUPO: DataRoleInput = { on: ["bg"], min: 3, scope: "título de cada grupo de errores sobre el fondo oscuro del panel (paleta de la herramienta)" };
const r = themeFromTokensWithReport(TOKENS, brand, {
  data: {
    entrada: FILL, papel: FILL, tinta: { on: ["data.papel", "data.verde", "data.ambar"], min: 4.5 }, pista: FILL,
    azul: FILL, violeta: FILL, ambar: FILL, verde: FILL, rojo: FILL,
    grupoProducto: GRUPO, grupoParametros: GRUPO, grupoCliente: GRUPO, grupoOrigen: GRUPO,
  },
});
export const panelTheme: Theme = r.theme;
export const panelReport = r.report;
