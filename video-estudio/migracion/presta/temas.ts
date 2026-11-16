// Design systems anidados de las herramientas que recrea la escena de Sincro Presta. Cada una conserva su propia paleta y su propia letra
// (la de su interfaz real) y se usa dentro de un `ThemeScope`; el resto de la escena sigue con el design system del video.
//  - tienda: tienda PrestaShop con el tema "Classic" (blanca, acento celeste, esquinas rectas) y su pantalla de configuración de módulos.
//  - erp: el ERP "Flexxus" (grilla de artículos, acento rojo, cinta de opciones, riel gris).
//  - camara: el visor de la cámara del teléfono (oscuro).
//  - arca: la página móvil de consulta de comprobantes (clara, encabezado azul).
// Todos salen de tokens (`themeFromTokensWithReport`) sobre el tema de la marca (hereda la tipografía Geist y los archivos de fuente); los colores
// propios de cada interfaz son `theme.data` y su letra, `type.ui` (más `eyebrow`, `caption` y `body` con el escalón real de la herramienta).
import { themeFromTokensWithReport } from "video-estudio/themes";
import type { DataRoleInput, Theme } from "video-estudio/themes";
import { theme as marca } from "../theme";

/** Relleno que lleva texto encima o que solo tiene que distinguirse de su fondo: 1,1 es "se ve", el texto lo juzga `qa` sobre lo que se ve. */
const RELLENO: DataRoleInput = { on: ["surface"], min: 1.05 };

// ---------- tienda (PrestaShop "Classic") ----------
const TIENDA = `:root {
  --name: tienda-classic;
  --color-background: #ffffff;
  --color-surface: #ffffff;
  --color-surface-alt: #f6f6f6;
  --color-text: #232323;
  --color-text-muted: #767676;
  --color-border: #e5e5e5;
  --color-primary: #24b9d7;
  --color-on-primary: #232323;
  /* letra de la tienda: 13 (marcas y chicos), 15, 18 (precios), 21 (nombres de funciones), 24 (logo), 26 (cifras de la cuenta) */
  --type-ui-xs: 13px;
  --type-ui-sm: 15px;
  --type-ui-md: 18px;
  --type-eyebrow: 21px;
  --type-caption: 24px;
  --type-body: 26px;
  --radius-sm: 2px;
  --radius-md: 4px;
  --radius-panel: 4px;
  --radius-lg: 4px;
  --shadow-sm: 0 2px 6px rgba(0,0,0,.08);
  /* la tienda real es plana y de esquinas rectas: botones, filtros y fichas no llevan radio */
  --style-shape-corners: sharp;
  --style-shape-border: 1;
  --style-shape-outlined: true;
  --style-surface-kind: solid;
  --style-surface-elevation: shadow;
  --style-decor-doodles: false;
  --style-decor-vignette: 0;
  --style-background-kind: plain;
  --data-fondo-navegador: #eceef1;
  --data-semaforo-rojo: #ff5f57;
  --data-semaforo-amarillo: #febc2e;
  --data-semaforo-verde: #28c840;
  --data-stock-ok: #1a8447;
  --data-stock-no: #d93a3a;
  --data-boton-apagado: #cfd6d9;
  --data-bo-cabecera: #363a41;
  --data-bo-texto: #bbcdd2;
  --data-no-rojo: #e04f5f;
  --data-tile1: #fde7f1;
  --data-tile2: #fff0e2;
  --data-tile3: #ece6ff;
  --data-tile4: #e3f4ff;
  --data-tile5: #fff6d9;
  --data-tile6: #e6f7ee;
}`;
const t = (on: string[] = ["surface"], min = 3): DataRoleInput => ({ on, min });
const tienda = themeFromTokensWithReport(TIENDA, marca, {
  acknowledge: ["accent/bg", "accent/surface", "accent/surfaceAlt", "onAccent/accent"],
  data: {
    fondoNavegador: RELLENO, semaforoRojo: RELLENO, semaforoAmarillo: RELLENO, semaforoVerde: RELLENO,
    stockOk: t(["surface"], 4.5), stockNo: t(["surface"], 4.5), botonApagado: RELLENO, boCabecera: RELLENO,
    boTexto: { on: ["data.boCabecera"], min: 4.5 }, noRojo: RELLENO,
    tile1: RELLENO, tile2: RELLENO, tile3: RELLENO, tile4: RELLENO, tile5: RELLENO, tile6: RELLENO,
  },
});
export const tiendaTheme: Theme = tienda.theme;
export const tiendaReport = tienda.report;

// ---------- erp (Flexxus) ----------
const ERP = `:root {
  --name: erp-flexxus;
  --color-background: #fafafa;
  --color-surface: #ffffff;
  --color-surface-alt: #f3f3f3;
  --color-text: #333333;
  --color-text-muted: #767676;
  --color-border: #dcdcdc;
  --color-primary: #e5313d;
  --color-on-primary: #ffffff;
  /* letra del ERP: 12 (cinta y botones), 13 (grilla y solapas), 15 (avisos y título de ventana), 18 (título de la grilla) */
  --type-ui-xs: 12px;
  --type-ui-sm: 13px;
  --type-ui-md: 15px;
  --type-eyebrow: 18px;
  --radius-sm: 4px;
  --radius-md: 4px;
  --radius-panel: 6px;
  --radius-lg: 6px;
  --shadow-md: 0 10px 26px -10px rgba(0,0,0,.3);
  --style-shape-corners: rounded;
  --style-shape-border: 1;
  --style-shape-outlined: true;
  --style-surface-kind: solid;
  --style-surface-elevation: shadow;
  --style-decor-doodles: false;
  --style-decor-vignette: 0;
  --style-background-kind: plain;
  --data-riel: #3a3a3d;
  --data-icono-cinta: #555555;
  --data-resaltado: #ffd666;
  --data-cinta-activa: #fde8e9;
}`;
const erp = themeFromTokensWithReport(ERP, marca, {
  acknowledge: ["accent/bg", "accent/surface", "accent/surfaceAlt", "onAccent/accent"],
  data: {
    riel: RELLENO, iconoCinta: { on: ["surface", "data.cintaActiva"], min: 3 },
    resaltado: { on: ["surface"], min: 1.1 }, cintaActiva: RELLENO,
  },
});
export const erpTheme: Theme = erp.theme;
export const erpReport = erp.report;

// ---------- teléfono: visor de la cámara y página móvil de ARCA ----------
const CAMARA = `:root {
  --name: telefono-camara;
  --color-background: #1d1d1f;
  --color-surface: #1d1d1f;
  --color-surface-alt: #2a2a2d;
  --color-text: #ffffff;
  --color-text-muted: #b8b6ba;
  --color-border: #3a3a3d;
  --color-primary: #e7007e;
  --color-on-primary: #ffffff;
  --type-ui-xs: 13px;
  --type-ui-sm: 15px;
  --type-ui-md: 17px;
  --type-eyebrow: 20px;
  --style-surface-kind: solid;
  --style-surface-elevation: flat;
  --style-decor-doodles: false;
  --style-decor-vignette: 0;
  --style-background-kind: plain;
  --data-papel: #f2f2f2;
  --data-tinta: #1a1a1c;
  --data-aviso: #ffffff;
  --data-aviso-mudo: #5c5b5f;
}`;
const camara = themeFromTokensWithReport(CAMARA, marca, {
  acknowledge: ["accent/bg", "accent/surface", "accent/surfaceAlt", "onAccent/accent"],
  data: { papel: { on: ["bg"], min: 3 }, tinta: { on: ["data.papel"], min: 7 }, aviso: { on: ["bg"], min: 4.5 }, avisoMudo: { on: ["data.aviso"], min: 4.5 } },
});
export const camaraTheme: Theme = camara.theme;
export const camaraReport = camara.report;

const ARCA = `:root {
  --name: telefono-arca;
  --color-background: #ffffff;
  --color-surface: #ffffff;
  --color-surface-alt: #eeedef;
  --color-text: #1a1a1c;
  --color-text-muted: #5c5b5f;
  --color-border: #eeedef;
  /* la página móvil: 14 (rótulos), 16 (valores), 17 (sello), 19 (nombre del organismo), 22 (título) */
  --type-ui-xs: 14px;
  --type-ui-sm: 16px;
  --type-ui-md: 17px;
  --type-eyebrow: 19px;
  --type-caption: 22px;
  --style-surface-kind: solid;
  --style-surface-elevation: flat;
  --style-decor-doodles: false;
  --style-decor-vignette: 0;
  --style-background-kind: plain;
  --data-azul-organismo: #0d3a6b;
}`;
const arca = themeFromTokensWithReport(ARCA, marca, {
  acknowledge: ["accent/bg", "accent/surface", "accent/surfaceAlt", "onAccent/accent"],
  data: { azulOrganismo: { on: ["surface"], min: 7 } },
});
export const arcaTheme: Theme = arca.theme;
export const arcaReport = arca.report;
