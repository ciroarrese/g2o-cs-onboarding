// Sincro Monitor en vertical y cuadrado: el mundo "angosto". Las tres herramientas son ventanas altas (800 de ancho) y no se ponen una al lado de la otra:
// el panel queda a la izquierda, centrado en altura, y a su derecha, una sobre otra, el chat (arriba) y la mesa de ayuda (abajo). El ticket vuela del panel
// a la mesa (abajo a la derecha) y la campanita, al chat (arriba a la derecha); la cámara va con cada vuelo y vuelve por el mismo camino.
// Horizontal no usa nada de este archivo: sus medidas siguen en `mundo.ts`. Los cuadros en que pasa cada cosa (`T`) son los mismos en los tres formatos.
import type { CameraKey } from "video-estudio/kit";

export type Rect = { x: number; y: number; w: number; h: number };
export const AW = 800; // ancho de cada ventana

// ---------- el panel (origen en su esquina; en el mundo está en `PV`) ----------
export const PAN = {
  w: AW, h: 1794, pad: 32,
  chip: { y: 112, h: 52, gap: 14, w: 361 },
  countY: 246,
  kpi: { y: 290, h: 136, gap: 18 },
  donut: { y: 760, h: 390, cx: AW / 2, cy: 760 + 222, r: 128, w: 28 },
  table: { x: 32, y: 1170, w: 736, h: 600, head: 52, row: 58 },
  detail: 480,
  alert: { w: 600, h: 124 },
};
/** Posición del panel en el mundo. */
export const PV = { x: 0, y: 340 };
/** Chat (arriba a la derecha) y mesa de ayuda (abajo a la derecha), con su tamaño. */
export const CHV: Rect = { x: 1000, y: 0, w: AW, h: 1200 };
export const MEV: Rect = { x: 1000, y: 1460, w: AW, h: 1000 };
export const PANEL_RECT: Rect = { x: PV.x, y: PV.y, w: PAN.w, h: PAN.h };

/** Coordenadas del mundo de un punto del panel. */
export const enPanel = (x: number, y: number) => ({ x: PV.x + x, y: PV.y + y });
export const chipPos = (i: number) => ({ x: PAN.pad + (i % 2) * (PAN.chip.w + PAN.chip.gap), y: PAN.chip.y + Math.floor(i / 2) * (PAN.chip.h + PAN.chip.gap) });
export const kpiPos = (i: number) => (i === 0 ? { x: PAN.pad, y: PAN.kpi.y, w: PAN.w - 2 * PAN.pad } : { x: PAN.pad + ((i - 1) % 2) * ((PAN.w - 2 * PAN.pad - PAN.kpi.gap) / 2 + PAN.kpi.gap), y: PAN.kpi.y + (1 + Math.floor((i - 1) / 2)) * (PAN.kpi.h + PAN.kpi.gap), w: (PAN.w - 2 * PAN.pad - PAN.kpi.gap) / 2 });
export const kpiW2 = (PAN.w - 2 * PAN.pad - PAN.kpi.gap) / 2;
/** Primera fila que queda con el filtro puesto: arriba de todo en la tabla. */
export const firstRowV = enPanel(PAN.table.x + 420, PAN.table.y + PAN.table.head + PAN.table.row / 2);
export const chipV = (i: number) => { const p = chipPos(i); return enPanel(p.x + PAN.chip.w / 2, p.y + PAN.chip.h / 2); };
/** Botón "Crear ticket" del detalle (centro). */
export const BTNV = enPanel(PAN.table.x + PAN.table.w - 20 - 18 - 110, PAN.table.y + PAN.table.head + PAN.table.row + PAN.detail - 16 - 18 - 25);
/** El aviso, sobre la última fila de cifras; y dónde cae la campanita en el chat. */
export const ALERTV = { x: PV.x + (PAN.w - PAN.alert.w) / 2, y: PV.y + PAN.kpi.y + 2 * (PAN.kpi.h + PAN.kpi.gap) + (PAN.kpi.h - PAN.alert.h) / 2, w: PAN.alert.w, h: PAN.alert.h };
export const BELL_LAND_V = { x: CHV.x + 48, y: CHV.y + 38 };

// ---------- la mesa ----------
export const MES = { top: 64, rail: 56, pad: 28, head: 246, card: 138, pitch: 150 };
export const CARD_WV = AW - MES.rail - MES.pad * 2; // 688
export const MESA_SLOT_V = { x: MEV.x + MES.rail + MES.pad, y: MEV.y + MES.head };
export const TVXV = MEV.x + MES.rail + MES.pad;
/** El editor de la respuesta, en el ticket abierto (coordenadas del mundo). */
export const EDV = { x: TVXV, y: MEV.y + 450, w: CARD_WV, h: 290 };
/** Botón "Responder" del ticket abierto y la tarjeta nueva de la lista (donde se hace clic para abrirla). */
export const RESPONDER_V = { x: TVXV + CARD_WV - 60, y: MEV.y + 412 };
export const NEWCARD_V = { x: MESA_SLOT_V.x + 220, y: MESA_SLOT_V.y + 36 };
export const ENVIAR_V = { x: EDV.x + EDV.w - 70, y: EDV.y + EDV.h - 26 };

// ---------- cámara ----------
// Cada fila: cuadro, foco (x, y) y escala para vertical; `cuad` da la de cuadrado (escala y, si hace falta, otro foco). Las claves son las mismas que
// las del horizontal (mismos cuadros, mismo ritmo): lo que cambia es adónde mira.
const donutC = enPanel(PAN.donut.cx, PAN.donut.cy);
const mitadPanel = enPanel(PAN.w / 2, 0);
const cx = (r: Rect) => r.x + r.w / 2;
type K = [number, number, number, number, [number, number, number]?]; // f, x, y, escala, cuadrado [x, y, escala]
const chatC = cx(CHV);
const mesaC = cx(MEV);
const pcx = PV.x + PAN.w / 2;
const KV: K[] = [
  [0, donutC.x, donutC.y, 2.0, [donutC.x, donutC.y, 1.55]], [112, donutC.x, donutC.y, 2.0, [donutC.x, donutC.y, 1.55]],
  // vista del panel (con el titular): arriba entero en cuadrado
  [160, pcx, PV.y + 900, 0.96, [pcx, PV.y + 259, 1.1]], [190, pcx, PV.y + 900, 0.96, [pcx, PV.y + 259, 1.1]],
  // el filtro: chips, cifras, dona y el arranque de la tabla
  [225, pcx, PV.y + 850, 1.3, [pcx, PV.y + 350, 1.35]], [270, pcx, PV.y + 850, 1.3, [pcx, PV.y + 350, 1.35]],
  // la fila, el log y el botón
  [305, pcx, PV.y + 1060, 1.3, [pcx, PV.y + 1330, 1.3]], [470, pcx, PV.y + 1060, 1.3, [pcx, PV.y + 1330, 1.3]],
  // sigue al ticket hasta la mesa
  [500, 1000, 1900, 0.8, [1000, 1900, 0.6]], [546, mesaC, MEV.y + 520, 1.25, [mesaC, MEV.y + 420, 1.2]], [560, mesaC, MEV.y + 520, 1.25, [mesaC, MEV.y + 420, 1.2]],
  [576, mesaC, MEV.y + 330, 1.35, [mesaC, MEV.y + 330, 1.35]], [600, mesaC, MEV.y + 330, 1.35, [mesaC, MEV.y + 330, 1.35]],
  // vuelta de latigazo al panel
  [630, pcx, PV.y + 900, 0.96, [pcx, PV.y + 259, 1.1]], [644, pcx, PV.y + 900, 0.96, [pcx, PV.y + 259, 1.1]],
  [658, pcx, PV.y + 740, 1.3, [pcx, PV.y + 400, 1.3]], [700, pcx, PV.y + 740, 1.3, [pcx, PV.y + 400, 1.3]], [730, pcx, PV.y + 740, 1.3, [pcx, PV.y + 400, 1.3]],
  // sigue a la campanita hasta el chat
  [762, 760, 520, 0.8, [760, 520, 0.6]], [792, chatC, 680, 1.2, [chatC, 560, 1.3]], [998, chatC, 680, 1.2, [chatC, 560, 1.3]],
  [1012, chatC, 880, 1.32, [chatC, 880, 1.3]], [1042, chatC, 880, 1.32, [chatC, 880, 1.3]],
  // vuelo a la mesa (abajo) y apertura del ticket
  [1068, 1400, 1500, 0.7, [1400, 1500, 0.55]], [1092, mesaC, MEV.y + 520, 1.25, [mesaC, MEV.y + 420, 1.2]], [1106, mesaC, MEV.y + 330, 1.35, [mesaC, MEV.y + 330, 1.35]], [1118, mesaC, MEV.y + 330, 1.35, [mesaC, MEV.y + 330, 1.35]],
  [1140, mesaC, MEV.y + 520, 1.25, [mesaC, MEV.y + 360, 1.2]], [1150, mesaC, MEV.y + 520, 1.25, [mesaC, MEV.y + 360, 1.2]],
  [1166, mesaC, MEV.y + 560, 1.4, [mesaC, MEV.y + 520, 1.4]], [1268, mesaC, MEV.y + 560, 1.4, [mesaC, MEV.y + 520, 1.4]],
  [1292, mesaC, MEV.y + 520, 1.25, [mesaC, MEV.y + 360, 1.2]], [1320, mesaC, MEV.y + 520, 1.25, [mesaC, MEV.y + 360, 1.2]],
  // todo junto
  [1352, 900, 1270, 0.58, [900, 1270, 0.4]], [1396, 900, 1270, 0.58, [900, 1270, 0.4]], [1404, 900, 1270, 0.58, [900, 1270, 0.4]],
];
export const keysAngostas = (format: string): CameraKey[] =>
  KV.map(([f, x, y, scale, cuad]) => (format === "cuadrado" && cuad ? { f, x: cuad[0], y: cuad[1], scale: cuad[2] } : { f, x, y, scale }));

/** Rectángulo de cada ventana, para decidir cuándo dibujarla. */
export const VENTANAS = { panel: PANEL_RECT, chat: CHV, mesa: MEV };
