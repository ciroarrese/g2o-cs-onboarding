// Geometría del mundo de la escena por formato. En horizontal son exactamente las medidas de siempre (datos.ts: la mesa de ayuda a la izquierda y el
// panel IA a la derecha). En vertical y cuadrado ("angosta") la ventana de la mesa de ayuda es más alta que ancha (encabezado, mensaje, una tira
// plegada con los datos del ticket, editor y comentarios, de arriba abajo) y el panel IA queda debajo de ella, centrado: así el editor, el panel y el
// comentario donde aterriza el ticket entran juntos en un cuadro angosto y los acercamientos necesitan menos zoom.
import { useFormat } from "video-estudio/engine";
import { COMMENT_Y, EDITOR, MAIN, P, PMIN, W } from "./datos";

export type Formato = "horizontal" | "vertical" | "cuadrado";

export type Geo = {
  formato: Formato;
  /** Disposición angosta (vertical y cuadrado). */
  angosta: boolean;
  W: { x: number; y: number; w: number; h: number; top: number; rail: number };
  MAIN: { x: number; w: number };
  EDITOR: { y: number; h: number };
  COMMENT_Y: number;
  /** Panel IA abierto y minimizado (esquina superior izquierda y ancho). */
  P: { x: number; y: number; w: number };
  PMIN: { x: number; y: number; w: number };
  /** Y (mundo) de la línea bajo el encabezado, del mensaje inicial (con su alto), de la fila de acciones y del rótulo "Comentarios". */
  divY: number;
  msgY: number;
  msgH: number;
  actY: number;
  comHdrY: number;
  /** Y (mundo) de la tira de datos del ticket (solo angosta) y de la fila de Reasignar / Prioridad. */
  stripY: number;
  btnsY: number;
  /** Lleva un punto de coordenadas del panel horizontal (las de datos.ts) a donde está el panel en este formato. */
  pc: (x: number, y: number) => { x: number; y: number };
};

const HORIZONTAL: Geo = {
  formato: "horizontal",
  angosta: false,
  W, MAIN, EDITOR, COMMENT_Y, P, PMIN,
  divY: 290, msgY: 312, msgH: 210, actY: 540, comHdrY: 838, stripY: 0, btnsY: 0,
  pc: (x, y) => ({ x, y }),
};

const angosta = (formato: "vertical" | "cuadrado"): Geo => {
  const w = { x: 60, y: 110, w: 760, h: 1070, top: 56, rail: 56 };
  const main = { x: 156, w: 624 };
  const editor = { y: 768, h: 220 };
  // el panel va debajo de la ventana, centrado en ella; el rincón donde espera minimizado queda sobre el lugar del comentario nuevo, que todavía no existe
  const p = { x: w.x + (w.w - P.w) / 2, y: w.y + w.h + 40, w: P.w };
  return {
    formato,
    angosta: true,
    W: w, MAIN: main, EDITOR: editor, COMMENT_Y: editor.y + 292,
    P: p,
    PMIN: { x: w.x + w.w - 20 - 480, y: w.y + w.h - 20 - 44, w: 480 },
    divY: 336, msgY: 354, msgH: 180, actY: 710, comHdrY: editor.y + 240, stripY: 552, btnsY: 276,
    pc: (x, y) => ({ x: p.x + (x - P.x), y: p.y + (y - P.y) }),
  };
};

const GEOS: Record<Formato, Geo> = { horizontal: HORIZONTAL, vertical: angosta("vertical"), cuadrado: angosta("cuadrado") };
export const geoDe = (formato: Formato): Geo => GEOS[formato];
/** Geometría del formato en que se dibuja. */
export const useGeo = (): Geo => geoDe(useFormat().format);

// ---------- cámara en vertical y cuadrado (mismos cuadros clave que la horizontal, otro encuadre) ----------
// Vista general (0 a 100): la ventana angosta llena el cuadro bajo el titular. Trabajo: en vertical el editor, el panel y el comentario entran juntos
// (una sola vista que apenas se desplaza); en cuadrado igual, un poco más lejos (1,3), para que entren juntos el editor y el panel.
const camTabla = (x: number[], y: number[], s: number[]) => [0, 100, 190, 218, 240, 262, 338, 360, 392, 414, 496, 516, 612, 640, 700, 730, 760, 798].map((f, i) => ({ f, x: x[i]!, y: y[i]!, scale: s[i]! }));
export const KEYS_VERTICAL = camTabla(
  [440, 440, 450, 450, 450, 450, 450, 450, 450, 450, 450, 450, 450, 450, 450, 450, 450, 450],
  [706, 715, 1160, 1160, 1160, 1100, 1100, 1160, 1160, 1100, 1100, 1469, 1469, 1379, 1379, 1379, 1400, 1190],
  [1.36, 1.37, 1.5, 1.55, 1.55, 1.55, 1.55, 1.55, 1.55, 1.55, 1.55, 1.55, 1.55, 1.55, 1.55, 1.55, 1.45, 1.45],
);
export const KEYS_CUADRADO = camTabla(
  [440, 440, 440, 440, 440, 440, 440, 440, 440, 440, 440, 440, 440, 440, 440, 440, 440, 440],
  [429, 450, 1180, 1155, 1155, 1155, 1155, 1155, 1155, 1155, 1155, 1555, 1555, 1480, 1480, 1480, 1405, 1120],
  [1.22, 1.24, 1.4, 1.3, 1.3, 1.3, 1.3, 1.3, 1.3, 1.3, 1.3, 1.3, 1.3, 1.3, 1.3, 1.3, 1.15, 1.3],
);
