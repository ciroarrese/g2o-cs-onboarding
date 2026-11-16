// Geometría del mundo de la escena de Sincro Presta por formato. En horizontal son exactamente las medidas de siempre (datos.ts);
// en vertical y cuadrado ("apilada") cada zona se reordena para entrar en un cuadro angosto: la tienda y el ERP quedan uno sobre otro,
// las cajas de la zona C también, las tarjetas de funciones van encima de la pantalla de configuración y la cuenta corriente, la factura y el
// teléfono forman una columna. Las cinco zonas siguen en otro lugar del mundo cada una (la cámara vuela entre ellas).
import { useFormat } from "video-estudio/engine";
import { CFG, EW, HUB, PDF, PHONE, QR, SE, SW, ZB, ZC, ZD } from "./datos";

export type Formato = "horizontal" | "vertical" | "cuadrado";
type Rect = { x: number; y: number; w: number; h: number };

export type Geo = {
  formato: Formato;
  /** Disposición angosta (vertical y cuadrado): todo apilado. */
  apilada: boolean;
  ZB: { x: number; y: number };
  ZC: { x: number; y: number };
  ZD: { x: number; y: number };
  SW: Rect;
  EW: Rect;
  HUB: { x: number; y: number };
  /** Cajas de la zona C (antes / ahora). `v`: disposición angosta del contenido de cada caja. */
  cajaC: { x: number; w: number; h: number; top: number; bot: number; trackX: number; trackW: number; limite: number; v: boolean; tall: boolean };
  CFG: Rect & { rowY: number; rowH: number };
  /** Esquina superior izquierda de la tarjeta de función `i` (ancho `cw`) antes de fundirse en la pantalla de configuración. */
  tarjeta: (i: number, cw: number) => { x: number; y: number };
  SE: Rect;
  /** Detalle del movimiento de la cuenta: a la derecha (horizontal) o como hoja que sube desde abajo (apilada). `top` es su borde de arriba dentro de la ventana. */
  detalle: { lateral: boolean; top: number; w: number; descTop: number };
  /** Centro de la fila `i` del historial. */
  filaMov: (i: number) => number;
  PDF: Rect;
  QR: { x: number; y: number; size: number };
  PHONE: Rect;
  /** Desvío de partida de la factura y del teléfono al entrar volando. */
  vueloPdf: [number, number];
  vueloTel: [number, number];
  /** Cuántas columnas de semanas tiene la zona B. */
  colsB: number;
};

const HORIZONTAL: Geo = {
  formato: "horizontal",
  apilada: false,
  ZB, ZC, ZD, SW, EW, HUB,
  cajaC: { x: ZC.x - 760, w: 1520, h: 330, top: ZC.y - 420, bot: ZC.y + 40, trackX: 330, trackW: 1080, limite: 0.42, v: false, tall: false },
  CFG,
  tarjeta: (i, cw) => ({ x: ZD.x - 820 + (i % 2) * (cw + 40), y: ZD.y - 330 + Math.floor(i / 2) * 230 }),
  SE,
  detalle: { lateral: true, top: 266, w: 440, descTop: 330 },
  filaMov: (i) => SE.y + 266 + 18 + 44 + i * 47 + 22,
  PDF, QR, PHONE,
  vueloPdf: [-300, 220],
  vueloTel: [260, 120],
  colsB: 5,
};

const apilada = (formato: "vertical" | "cuadrado"): Geo => {
  const zB = { x: 3200, y: 540 };
  const zC = { x: 3200, y: 3300 };
  const zD = { x: 1000, y: 3300 };
  const se: Rect = { x: 60, y: 5000, w: 960, h: 1020 };
  const pdf: Rect = { x: 40, y: se.y + 1060, w: 560, h: 840 };
  const tall = formato === "vertical"; // en vertical (1920 de alto) las dos cajas se agrandan para llenar el cuadro
  const cajaH = tall ? 700 : 520;
  const cajaGap = tall ? 100 : 240;
  return {
    formato,
    apilada: true,
    ZB: zB, ZC: zC, ZD: zD,
    EW: { x: 110, y: 200, w: 860, h: 580 },
    SW: { x: 110, y: 930, w: 860, h: 800 },
    HUB: { x: 540, y: 865 },
    cajaC: { x: zC.x - 480, w: 960, h: cajaH, top: zC.y - cajaGap / 2 - cajaH, bot: zC.y + cajaGap / 2, trackX: 50, trackW: 860, limite: 0.42, v: true, tall },
    CFG: { x: zD.x - 410, y: zD.y - 80, w: 820, h: tall ? 1090 : 800, rowY: 150, rowH: tall ? 150 : 96 },
    tarjeta: (i, cw) => ({ x: zD.x - cw - 20 + (i % 2) * (cw + 40), y: zD.y - 800 + Math.floor(i / 2) * 230 }),
    SE: se,
    detalle: { lateral: false, top: 580, w: se.w, descTop: 352 },
    filaMov: (i) => se.y + 266 + 18 + 44 + i * 47 + 22,
    PDF: pdf,
    QR: { x: pdf.x + pdf.w - 176, y: pdf.y + pdf.h - 196, size: 136 },
    PHONE: { x: 660, y: pdf.y + 30, w: 380, h: 780 },
    vueloPdf: [0, 300],
    vueloTel: [140, 160],
    colsB: formato === "vertical" ? 2 : 3,
  };
};

const GEOS: Record<Formato, Geo> = { horizontal: HORIZONTAL, vertical: apilada("vertical"), cuadrado: apilada("cuadrado") };

export const geoDe = (formato: Formato): Geo => GEOS[formato];

/** Geometría del formato en que se dibuja. */
export const useGeo = (): Geo => geoDe(useFormat().format);

/**
 * Encuadre (foco y escala) que muestra una caja del mundo entera en un cuadro `W x H`, dejando `top` px libres arriba (el titular),
 * `bottom` abajo y `side` a cada lado. `max` pone un techo a la escala. La caja queda centrada en el espacio libre.
 */
export const encuadre = (caja: { x: number; y: number; w: number; h: number }, W: number, H: number, o: { top: number; bottom?: number; side?: number; max?: number }) => {
  const bottom = o.bottom ?? 40;
  const side = o.side ?? 70;
  const s = Math.min((W - 2 * side) / caja.w, (H - o.top - bottom) / caja.h, o.max ?? 99);
  const cx = caja.x + caja.w / 2;
  const cy = caja.y + caja.h / 2;
  // el centro del espacio libre queda (o.top - bottom) / 2 px más abajo que el centro del cuadro
  const y = cy - (o.top - bottom) / 2 / s;
  return { x: Math.round(cx), y: Math.round(y), s: +s.toFixed(3) };
};
