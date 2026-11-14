// Tiempos, medidas del mundo y textos de la escena "Asistente IA" (840 cuadros a 30 fps). Todo lo que se ve es ficticio.

// ---------- tiempos (cuadros de la escena) ----------
export const C = {
  lift: [110, 190] as const,
  dictar: 232,
  dictStop: 342,
  formato: 384,
  formatoDone: 412,
  cw: 520,
  buscar: 556,
  cards: 576,
  cwClose: 620,
  reportar: 646,
  crear: 708,
  creado: 730,
  fly: [736, 776] as [number, number],
  through: [806, 840] as [number, number],
};
export const DURACION = 840;

// ---------- medidas (coordenadas del mundo, 1 unidad = 1 px a escala 1) ----------
export const W = { x: 60, y: 110, w: 1240, h: 900, top: 56, rail: 56 }; // ventana de la mesa de ayuda
export const MAIN = { x: 156, w: 720 }; // columna principal
export const SIDE = { x: 916, w: 344 }; // columna derecha
export const P = { x: 1330, y: 170, w: 540 }; // panel IA abierto
export const PMIN = { x: W.x + W.w - 20 - 480, y: W.y + W.h - 20 - 44, w: 480 }; // panel IA minimizado
export const CW_H = 352; // alto de la sección CloudWatch abierta (el original: 312; con las interlíneas explícitas de este panel el contenido mide 349)
export const RP_H = 262;
export const EDITOR = { y: 598, h: 220 };
export const COMMENT_Y = 890;
export const BTN_H = 40; // alto de los botones del panel
export const BTN_GAP = 8;

// ---------- textos (ficticios) ----------
export const TICKET = "48190";
export const NEW_TICKET = "48231";
export const DICTATED =
  "hola cómo estás revisamos los pedidos de la tienda tres pedidos quedaron trabados por un artículo sin stock en el ERP ya ajustamos el stock y los reenviamos hoy cualquier cosa quedamos atentos";
export const FORMATTED: { bullet?: boolean; seg: [string, boolean][] }[] = [
  { seg: [["Hola, ¿cómo estás?", true]] },
  { seg: [["Revisamos los pedidos de la tienda:", false]] },
  { bullet: true, seg: [["3 pedidos", true], [" quedaron trabados por un artículo sin stock en el ERP.", false]] },
  { bullet: true, seg: [["Ya ajustamos el stock y los ", false], ["reenviamos hoy", true], [".", false]] },
  { seg: [["Cualquier cosa, quedamos atentos.", false]] },
];
/** Grupos de errores de CloudWatch; `c` es el nombre del color en `theme.data` del panel. */
export const GROUPS = [
  { fam: "Producto / item pedido", c: "grupoProducto", n: 14, msg: "El artículo 10-2231 no existe en el ERP" },
  { fam: "Parametros Flexxus / cliente", c: "grupoParametros", n: 9, msg: "Lista de precios sin configurar para el cliente" },
  { fam: "Cliente / alta cliente", c: "grupoCliente", n: 6, msg: "No se pudo dar de alta el cliente: CUIT duplicado" },
  { fam: "Origen marketplace / payload", c: "grupoOrigen", n: 3, msg: "Pedido sin dirección de envío" },
] as const;
export const REPORT_TITLE = "Tienda 18 | Pedidos que no bajan al ERP";
export const TOPIC = { name: "Asistente IA", line: "responde, dicta y escala sin salir del ticket" };

// ---------- cámara (foco x, y y escala; la misma tabla del original) ----------
export const CAM_T = [0, 100, 190, 218, 240, 262, 338, 360, 392, 414, 496, 516, 612, 640, 700, 730, 760, 798];
const FX = [980, 960, 965, 1600, 1600, 560, 560, 1600, 1600, 560, 560, 1560, 1560, 1560, 1580, 1580, 960, 960];
const FY = [560, 560, 545, 330, 330, 640, 640, 300, 300, 640, 640, 470, 520, 500, 520, 520, 560, 600];
const S = [0.86, 0.9, 0.88, 1.45, 1.45, 1.4, 1.4, 1.45, 1.45, 1.4, 1.4, 1.2, 1.2, 1.2, 1.2, 1.2, 0.9, 0.95];
export const KEYS = CAM_T.map((f, i) => ({ f, x: FX[i]!, y: FY[i]!, scale: S[i]! }));
// inclinación de base del original (grados), por cuadro
export const TILT_T = [0, 110, 190, 300, 500, 640, 760, 840];
export const TILT_RX = [8, 4, 2, 0, 0, 0, 4, 0];
export const TILT_RY = [-12, -6, -4, 0, 0, 0, -4, 0];
