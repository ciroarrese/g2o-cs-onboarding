// Tema de la marca, armado desde los tokens de video/src/brand/theme.ts con el adaptador del toolkit.
// Los tokens van como texto CSS (alias que reconoce el adaptador); las fuentes se declaran aparte en `font.files`.
import { themeFromTokensWithReport } from "video-estudio/themes";
import type { Theme } from "video-estudio/themes";
// `?url` hace que vite copie el archivo al bundle y devuelva su URL: así lo ven render, qa, sheet y privacy sin `--assets`.
import geistRegular from "../assets/fonts/Geist-Regular.otf?url";
import geistMedium from "../assets/fonts/Geist-Medium.otf?url";
import geistSemiBold from "../assets/fonts/Geist-SemiBold.otf?url";
import geistBold from "../assets/fonts/Geist-Bold.otf?url";

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
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-panel: 12px;
  --radius-lg: 16px;
  --radius-pill: 999px;
  --shadow-sm: 0 1px 2px rgba(26,26,28,.06);
  --shadow-md: 0 4px 12px rgba(26,26,28,.1);
  --shadow-lg: 0 12px 32px rgba(26,26,28,.14);
}`;

const r = themeFromTokensWithReport(TOKENS);

// Las tipografías son archivos locales de la carpeta externa (assets/fonts), importados con `?url`.
const fontFile = (weight: number, src: string) => ({ weight, src });
export const theme: Theme = {
  ...r.theme,
  // El adaptador deriva las nubes del acento; las de la marca son rosa, naranja y violeta (no hay token para eso).
  cloud: { colors: ["#e7007e", "#f56406", "#770ce9"], opacity: 0.22 },
  font: { ...r.theme.font, files: [fontFile(400, geistRegular), fontFile(500, geistMedium), fontFile(600, geistSemiBold), fontFile(700, geistBold)] },
};
export const report = r.report;

// ---------- tema oscuro de la herramienta recreada (tablero de monitoreo) ----------
const GRAFANA = `:root {
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
}`;
const g = themeFromTokensWithReport(GRAFANA, theme);
export const tableroTheme: Theme = g.theme;
export const tableroReport = g.report;

/**
 * Colores de datos del tablero que no tienen rol en `Theme` (fichas de estado, severidades, verde de frescura...).
 * El toolkit no tiene un lugar en el tema para esto: viven acá y las escenas los leen de este módulo.
 */
export const tablero = {
  strong: "#ffffff",
  estados: { inactivo: "#a8243a", crecimiento: "#2e8b4a", maduro: "#73bf69", activacion: "#3d7fe0", caida: "#f2495c", estancado: "#e0b400", detenida: "#a352cc" },
  fichas: { inactivos: "#8a1c2c", detenida: "#8e3fb5", caida: "#d6283c", maduros: "#4a9a3f", crecimiento: "#1f6b36", fresco: "#1a7f37" },
  severidad: ["#e0b400", "#ff9830", "#f2495c", "#c4162a"],
  naranja: "#ff9830",
  riel: "#2a2d33",
  fila: "#22252b",
  azulBoton: "#3d71d9",
  logo: "linear-gradient(135deg,#f05a28,#fbca0a)",
} as const;
