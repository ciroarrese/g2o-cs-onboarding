// Design systems anidados de las herramientas recreadas de la escena Sincro Monitor. Todas se ven con la marca (el original las rehizo en su
// estilo: Geist, rosa de acento, riel negro), pero cada una declara lo suyo: tamaños de letra (`type.ui`), colores con nombre (`data`),
// sombras de ventana, rótulos en mayúsculas del tablero. Se aplican con `ThemeScope`; las escenas no escriben ningún color ni tamaño suelto.
import { themeFromTokensWithReport } from "video-estudio/themes";
import type { DataRoleInput, Theme } from "video-estudio/themes";
import { theme as marcaConDatos } from "../theme";

// La marca sin los colores de datos de Health Score: cada herramienta declara los suyos.
const marca: Theme = { ...marcaConDatos, data: undefined };

/** Sombras de las ventanas y de las tarjetas de la herramienta (las del original: sombra de ventana larga y `cardSoft`). */
const SOMBRAS = `
  --shadow-sm: 0 1px 2px rgba(26,26,28,.06);
  --shadow-md: 0 8px 20px -8px rgba(0,0,0,.12);
  --shadow-lg: 0 40px 90px -30px rgba(26,26,28,.35);
  /* ventana de 28 px: el cartel (rol hero) con radius.lg x 1,75 */
  --style-shape-hero-scale: 1.75;`;

// ---------- el panel de monitoreo (Sincro Monitor) ----------
const MONITOR = `:root {
  --name: sincro-monitor;
  --color-background: #f7f7f8;
  --color-text-muted: #5c5b5f;
  /* letra de la herramienta: 17 (rótulos, pastillas; el original usaba 15: a 17 llegan a 18 px con el acercamiento de 1,12), 19 (filas, chips, botones: con la inclinación del viaje de 190 a 225 a 18 se bajaba de 18 px en pantalla), 20 (botón de ticket, subtítulo de la dona) */
  --type-ui-xs: 17px;
  --type-ui-sm: 19px;
  --type-ui-md: 20px;
  ${SOMBRAS}
  /* los rótulos del panel van en mayúsculas con interletrado, como en la herramienta */
  --style-type-eyebrow-case: upper;
  --style-type-eyebrow-tracking: 0.06;
  /* colores de estado de la herramienta (la marca no los tiene como rol) */
  --data-estado-ok: #1fa25a;
  --data-estado-infra: #d7016b;
  --data-estado-sincro: #f56406;
  --data-estado-adv: #f5a623;
  --data-estado-sin: #b8b6ba;
  --data-pulso: #1fa25a;
  --data-gris-medio: #b8b6ba;
}`;
const TEXTO: DataRoleInput = { on: ["surface"], min: 3, scope: "cifras grandes y puntos sobre las tarjetas blancas del panel" };
const RELLENO: DataRoleInput = { on: ["surface"], min: 1.1 };
const m = themeFromTokensWithReport(MONITOR, marca, {
  data: {
    estadoOk: TEXTO, estadoInfra: TEXTO, estadoSincro: TEXTO, estadoAdv: RELLENO, estadoSin: RELLENO,
    pulso: RELLENO, grisMedio: RELLENO,
  } as Record<string, DataRoleInput>,
});
export const monitorTheme: Theme = m.theme;
export const monitorReport = m.report;

// ---------- la terminal del detalle del log (monoespaciada, oscura) ----------
const TERMINAL = `:root {
  --name: terminal-log;
  --font-family: ui-monospace, Menlo, monospace;
  --color-background: #1a1a1c;
  --color-surface: #1a1a1c;
  --color-text: #b8b6ba;
  --color-text-muted: #b8b6ba;
  --type-ui-xs: 18px;
  --type-ui-sm: 18px;
  --type-ui-md: 18px;
  /* el renglón de error del log va en rosa claro sobre el fondo oscuro */
  --data-error-log: #ff5ca8;
}`;
const t = themeFromTokensWithReport(TERMINAL, { ...monitorTheme, data: undefined }, { data: { errorLog: { on: ["bg"], min: 4.5 } } as Record<string, DataRoleInput> });
// la fuente es del sistema: los archivos Geist de la marca no se declaran bajo el nombre de la monoespaciada
export const terminalTheme: Theme = { ...t.theme, font: { ...t.theme.font, files: undefined } };
export const terminalReport = t.report;

// ---------- la mesa de ayuda ----------
const MESA = `:root {
  --name: mesa-de-ayuda;
  --color-background: #f7f7f8;
  /* mesa: 15 (rótulos chicos; el original usaba 13 a 15), 18 (cuerpo: la lista y el ticket abierto se ven a escala 1), 20 (título del ticket y editor) */
  --type-ui-xs: 15px;
  --type-ui-sm: 18px;
  --type-ui-md: 20px;
  ${SOMBRAS}
  --data-riel: #1a1a1c;
  --data-gris-medio: #b8b6ba;
  --data-gris-claro: #eeedef;
}`;
const w = themeFromTokensWithReport(MESA, marca, {
  data: { riel: RELLENO, grisMedio: RELLENO, grisClaro: RELLENO } as Record<string, DataRoleInput>,
});
export const mesaTheme: Theme = w.theme;
export const mesaReport = w.report;

// ---------- el chat del equipo ----------
const CHAT = `:root {
  --name: chat-del-equipo;
  --color-background: #f7f7f8;
  /* chat: la ventana se ve entera a 0,98 y ahí la letra del original (14 a 17) queda bajo los 18 px: sube a 18,5 y 22 */
  --type-ui-xs: 18.5px;
  --type-ui-sm: 18.5px;
  --type-ui-md: 22px;
  ${SOMBRAS}
  --data-gris-medio: #b8b6ba;
}`;
const c = themeFromTokensWithReport(CHAT, marca, { data: { grisMedio: RELLENO } as Record<string, DataRoleInput> });
export const chatTheme: Theme = c.theme;
export const chatReport = c.report;
