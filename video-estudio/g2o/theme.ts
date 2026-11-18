// Tema de video de Grow2on, compartido por todos los videos de esta carpeta.
// Sale de los tokens de "G2O Mkt Design System" (tokens/colors.css, typography.css, spacing.css, glass.css, motion.css).
// Cada video lo reexporta desde su `theme.ts`:  export { theme, report } from "../g2o/theme";
import { asset } from "video-estudio/engine";
import { neutral, themeFromTokensWithReport } from "video-estudio/themes";
import type { Theme, ThemeStyleInput } from "video-estudio/themes";

// Tokens del design system, copiados tal cual (los nombres `--g2o-*` y `--color-*` son los del sistema).
// Solo se agregan al final los alias que el adaptador entiende y que el sistema nombra distinto.
const TOKENS = `:root{
--g2o-pink:#e7007e;
--g2o-pink-dark:#b8005f;
--g2o-pink-light:#fce4f0;
--g2o-orange:#f56406;
--g2o-purple:#770ce9;
--g2o-orange-dark:#c94f03;
--g2o-orange-light:#fee6d3;
--g2o-gray-text:#5c5b5f;
--g2o-black:#1a1a1c;
--g2o-white:#ffffff;
--g2o-gray-50:#f7f7f8;
--g2o-gray-100:#eeedef;
--g2o-gray-200:#dcdadd;
--g2o-gray-300:#b8b6ba;
--g2o-gray-600:#5c5b5f;
--g2o-gray-800:#332f33;
--g2o-success:#1fa25a;
--g2o-warning:#f5a623;
--g2o-error:#d7016b;

--bg:var(--g2o-white);
--surface:var(--g2o-white);
--surface-alt:var(--g2o-gray-50);
--text:var(--g2o-gray-text);
--text-muted:__TEXT_MUTED__;
--border:var(--g2o-gray-200);
--accent:var(--g2o-pink);
--accent2:var(--g2o-orange);
--on-accent:var(--g2o-white);
--success:__SUCCESS__;
--warning:__WARNING__;
--danger:var(--g2o-error);
--chart-1:var(--g2o-pink);
--chart-2:var(--g2o-orange);
--chart-3:var(--g2o-purple);
--chart-4:var(--g2o-pink-dark);
--chart-5:var(--g2o-orange-dark);
--chart-6:var(--g2o-gray-text);
--gradient-brand:linear-gradient(90deg,#e7007e 0%,#f56406 100%);

--font-family:"Geist",-apple-system,sans-serif;

--radius-sm:6px;
--radius-md:10px;
--radius-lg:22px;
--shadow-sm:0 1px 2px rgba(26,26,28,0.06);
--shadow-md:0 4px 12px rgba(26,26,28,0.10);
--shadow-lg:0 12px 32px rgba(26,26,28,0.14);

--ease-standard:cubic-bezier(0.4,0,0.2,1);

--cloud-color-1:#e7007e;
--cloud-color-2:#f56406;
--cloud-color-3:#770ce9;
--cloud-opacity:0.10;
}`
  // Ajustes de contraste para video (el valor del sistema no llega al mínimo sobre blanco; ver el informe del tema):
  .replace("__TEXT_MUTED__", "#77757a") // gris 300 (#b8b6ba) da 2:1; este es el tono más cercano que llega a 4,5:1
  .replace("__SUCCESS__", "#16793f") // #1fa25a da 3,3:1
  .replace("__WARNING__", "#8f5d00"); // #f5a623 da 2:1

// Estilo: cómo se ve y se mueve Grow2on (readme del design system y plantillas de intro y cierre de YouTube).
const ESTILO: ThemeStyleInput = {
  // Píldoras para rótulos y URL, tarjetas de 16 a 22 px de radio.
  shape: { corners: "pill", border: 1, outlined: true },
  // Superficies blancas con sombra suave.
  surface: { kind: "solid", elevation: "shadow" },
  // Geist SemiBold en títulos con interletrado apretado (-0,03 em en las plantillas); Medium en rótulos. Cifras y palabra resaltada en el degradado de marca.
  type: { titleWeight: "semibold", labelWeight: "medium", titleTracking: -0.03, eyebrowCase: "as-is", numerals: "gradient", highlight: "gradient" },
  // Fondo blanco con nubes muy tenues de rosa, naranja y violeta que derivan (g2o-cloud-a / g2o-cloud-b del sitio).
  background: { kind: "clouds", intensity: 1, drift: 2 },
  // Las cosas suben al entrar (g2o-rise) y las píldoras llegan con un rebote corto (easeOutBack de las plantillas).
  motion: { entrance: "rise", overshoot: 0.08, stagger: 4, cameraBlur: true, cameraTilt: 0.6, transition: "wash", exit: "settle" },
  // Señal: anillo rosa (el foco del sistema es un halo rosa). Sin flechas ni garabatos.
  annotation: { mark: "ring", dim: 0.55 },
  // Sin garabatos ni viñeta (fondo blanco); barra de acento en degradado; el degradado del texto va y vuelve cada 3,5 s (--loop-gradient).
  decor: { doodles: false, doodleStroke: "geometric", vignette: 0, accent: "bar", gradientLoop: 105 },
  chart: { barRadius: "md", lineWidth: 5, grid: "auto", fill: "gradient" },
};

const r = themeFromTokensWithReport(TOKENS, neutral, {
  style: ESTILO,
  // Pares de marca aprobados tal cual (16/11/2026): el rosa da 4,47:1 y el naranja 3,13:1 sobre blanco.
  acknowledge: ["onAccent/accent", "accent/bg", "accent/surface", "accent2/bg", "accent2/surface"],
  // Colores de marca que no tienen rol propio en el tema: se leen con `useTheme().data.<nombre>`.
  data: {
    violeta: { token: "g2o-purple", on: ["bg", "surface"], min: 3 }, // solo toques: partículas, barras, medidor
    rosaClaro: { token: "g2o-pink-light", on: ["bg"], min: 1 },
    naranjaClaro: { token: "g2o-orange-light", on: ["bg"], min: 1 },
    tinta: { token: "g2o-black", on: ["bg", "surface"], min: 4.5 }, // texto fuerte y velo oscuro sobre fotos
  },
});

export const theme: Theme = {
  ...r.theme,
  name: "g2o",
  font: {
    ...r.theme.font,
    weights: { regular: 400, medium: 500, semibold: 600, stat: 600 }, // la marca no usa pesos por encima de SemiBold
    files: [
      { weight: 300, src: asset("g2o/fonts/Geist-Light.otf") },
      { weight: 400, src: asset("g2o/fonts/Geist-Regular.otf") },
      { weight: 500, src: asset("g2o/fonts/Geist-Medium.otf") },
      { weight: 600, src: asset("g2o/fonts/Geist-SemiBold.otf") },
    ],
  },
};
export const report = r.report;
