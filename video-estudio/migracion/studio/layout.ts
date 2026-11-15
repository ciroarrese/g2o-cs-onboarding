// Disposición del estudio por formato. El horizontal conserva las medidas de siempre; vertical y cuadrado reordenan el mundo
// (apilan en vez de poner al lado) y encuadran más cerca. Los tiempos son los mismos en los tres: solo cambian posiciones y tamaños.
import { useFormat } from "video-estudio/engine";
import type { FormatName } from "video-estudio/engine";
import { PREVIEW, WALL_X, WIN } from "./datos";

/** Cuadros clave de la caja de la vista previa (entra la tercera parte y cambia de formato). */
export const BK = [446, 466, 690, 702, 735, 747];

type Pt = { x: number; y: number; w: number };
export type Lay = {
  fmt: FormatName;
  W: number;
  H: number;
  win: { x: number; y: number; w: number; h: number; bar: number };
  /** Caja de la vista previa en el cuadro 0: tiene la forma exacta del formato (escala 1/k) para que la cámara la llene sin deformar. */
  pv: { cx: number; top: number; w: number; h: number };
  /** Caja de la vista previa en los cuadros `BK`: centro, ancho, alto y borde de arriba. */
  box: { cx: number[]; w: number[]; h: number[]; top: number[] };
  banda: { x: number; y: number; w: number; size: "sm" | "md" | "lg"; wrap: boolean; minH: number };
  tl: { x: number; y: number; blockY: number; blockH: number; ws: number[]; gap: number; cabUp: number; cabExt: number; label: { x: number; y: number } | null };
  card: { w: number; h: number; capW: number; chip: number; pos: (i: number) => { x: number; y: number } };
  etapas: { x: number; y: number; w: number; row: number };
  conv: { x: number; y: number; w: number; pitch: number; slots: number };
  /** Rieles de la tercera parte: `juntos` pone Sistema y Formato en la misma columna (si no, cada uno tiene su lugar). */
  rl: { juntos: boolean; sis: Pt; fmt: Pt; ej: Pt; ejWrap: boolean; name: "xs" | "sm" | "md" | "lg"; pill: { min: number; size: "eyebrow" | "caption" } };
  mu: {
    wx: number; cols: number; tw: number; th: number; gap: number; x: number; y: number; fx: number;
    stat: { mode: "col" | "row"; x: number; y: number; w: number; dw: number; dfmax: number; labelSize: "caption" | "body"; labelW: number; labelMinH: number };
    ctl: { x: number; y: number; w: number; gap: number; rowH: number; size: "eyebrow" | "caption" };
    music: { x: number; y: number; w: number; h: number; labW: number; labY: number; labSize: "caption" | "eyebrow"; sx: number; sy: number; waveW: number; waveH: number; stack: boolean };
  };
};

const HORIZONTAL: Lay = {
  fmt: "horizontal", W: 1920, H: 1080,
  win: WIN,
  pv: { cx: PREVIEW.cx, top: PREVIEW.top, w: PREVIEW.w, h: PREVIEW.h },
  box: { cx: [960, 960, 960, 960, 960, 960], w: [1008, 1120, 1120, 394, 394, 700], h: [567, 630, 630, 700, 700, 700], top: [330, 330, 330, 330, 330, 330] },
  banda: { x: 0, y: 186, w: 1920, size: "md", wrap: false, minH: 72 },
  tl: { x: 105, y: 914, blockY: 950, blockH: 80, ws: [150, 280, 400, 480, 360], gap: 10, cabUp: 16, cabExt: 24, label: { x: 105, y: 908 } },
  card: { w: 340, h: 176, capW: 90, chip: 34, pos: (i) => ({ x: 84, y: PREVIEW.top + i * 196 }) },
  etapas: { x: 1496, y: PREVIEW.top, w: 340, row: 52 },
  conv: { x: 1496, y: PREVIEW.top + 52 * 4 + 18, w: 340, pitch: 72, slots: 4 },
  rl: { juntos: true, sis: { x: 84, y: 330, w: 296 }, fmt: { x: 0, y: 0, w: 0 }, ej: { x: 1540, y: 330, w: 296 }, ejWrap: false, name: "md", pill: { min: 190, size: "caption" } },
  mu: {
    wx: WALL_X, cols: 4, tw: 330, th: 210, gap: 18, x: 60, y: 190, fx: 156,
    stat: { mode: "col", x: 1476, y: 230, w: 360, dw: 360, dfmax: 180, labelSize: "caption", labelW: 360, labelMinH: 80 },
    ctl: { x: 1476, y: 570, w: 360, gap: 14, rowH: 72, size: "eyebrow" },
    music: { x: 60, y: 874, w: 1800, h: 144, labW: 360, labY: 36, labSize: "caption", sx: 380, sy: 0, waveW: 1420, waveH: 120, stack: false },
  },
};

const VERTICAL: Lay = {
  fmt: "vertical", W: 1080, H: 1920,
  win: { x: 30, y: 410, w: 1020, h: 1430, bar: 52 },
  // 432x768 es 1080x1920 a escala 0,4 (la cámara arranca a 2,5 y la reproducción queda 1 a 1 con el cuadro de Health Score)
  pv: { cx: 540, top: 476, w: 432, h: 768 },
  box: { cx: [540, 540, 540, 540, 540, 540], w: [432, 940, 940, 480, 480, 860], h: [768, 529, 529, 853, 853, 860], top: [476, 638, 638, 476, 476, 473] },
  banda: { x: 70, y: 250, w: 940, size: "md", wrap: true, minH: 140 },
  tl: { x: 64, y: 1708, blockY: 1746, blockH: 76, ws: [130, 200, 200, 200, 200], gap: 8, cabUp: 12, cabExt: 16, label: { x: 64, y: 1704 } },
  card: { w: 300, h: 176, capW: 77, chip: 28, pos: (i) => ({ x: 70 + i * 320, y: 1272 }) },
  etapas: { x: 70, y: 1468, w: 440, row: 52 },
  conv: { x: 560, y: 1468, w: 440, pitch: 64, slots: 3 },
  rl: { juntos: false, sis: { x: 70, y: 1370, w: 440 }, fmt: { x: 560, y: 1370, w: 440 }, ej: { x: 70, y: 1610, w: 940 }, ejWrap: true, name: "lg", pill: { min: 190, size: "caption" } },
  mu: {
    wx: 1460, cols: 3, tw: 312, th: 196, gap: 18, x: 54, y: 484, fx: 150,
    stat: { mode: "row", x: 70, y: 252, w: 940, dw: 330, dfmax: 180, labelSize: "body", labelW: 600, labelMinH: 60 },
    ctl: { x: 70, y: 1340, w: 940, gap: 14, rowH: 72, size: "caption" },
    music: { x: 70, y: 1640, w: 940, h: 170, labW: 940, labY: 0, labSize: "caption", sx: 0, sy: 52, waveW: 940, waveH: 100, stack: true },
  },
};

const CUADRADO: Lay = {
  fmt: "cuadrado", W: 1080, H: 1080,
  win: { x: 40, y: 280, w: 1000, h: 745, bar: 48 },
  // 360x360 es 1080x1080 a escala 1/3 (cámara a 3)
  pv: { cx: 270, top: 346, w: 360, h: 360 },
  box: { cx: [270, 540, 540, 540, 540, 540], w: [360, 580, 580, 340, 340, 580], h: [360, 326, 326, 604, 604, 580], top: [346, 510, 510, 371, 371, 383] },
  banda: { x: 70, y: 206, w: 940, size: "sm", wrap: true, minH: 60 },
  tl: { x: 62, y: 912, blockY: 946, blockH: 72, ws: [110, 196, 196, 196, 196], gap: 8, cabUp: 10, cabExt: 14, label: { x: 62, y: 908 } },
  card: { w: 300, h: 176, capW: 77, chip: 28, pos: (i) => ({ x: 70 + i * 320, y: 724 }) },
  etapas: { x: 520, y: 346, w: 500, row: 46 },
  conv: { x: 520, y: 548, w: 500, pitch: 62, slots: 2 },
  rl: { juntos: true, sis: { x: 52, y: 380, w: 190 }, fmt: { x: 0, y: 0, w: 0 }, ej: { x: 838, y: 380, w: 190 }, ejWrap: false, name: "xs", pill: { min: 150, size: "eyebrow" } },
  mu: {
    wx: 1460, cols: 4, tw: 238, th: 158, gap: 12, x: 46, y: 415, fx: 122,
    stat: { mode: "row", x: 60, y: 224, w: 480, dw: 190, dfmax: 120, labelSize: "caption", labelW: 260, labelMinH: 40 },
    ctl: { x: 560, y: 222, w: 480, gap: 8, rowH: 56, size: "eyebrow" },
    music: { x: 46, y: 920, w: 990, h: 108, labW: 300, labY: 0, labSize: "eyebrow", sx: 0, sy: 36, waveW: 990, waveH: 46, stack: true },
  },
};

export const LAYOUTS: Record<FormatName, Lay> = { horizontal: HORIZONTAL, vertical: VERTICAL, cuadrado: CUADRADO };

/** La disposición del formato en curso. */
export function useLay(): Lay {
  return LAYOUTS[useFormat().format];
}
