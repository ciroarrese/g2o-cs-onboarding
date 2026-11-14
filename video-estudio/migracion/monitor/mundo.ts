// Sincro Monitor: geometría del mundo, datos emulados y línea de tiempo (cuadros a 30 fps). Un solo lugar para que el guion y el código se lean juntos.
// Los datos son inventados: dominios de ejemplo, tickets del rango emulado 48190 a 48213, "Tienda NN" y equipo "Soporte sincro".
import type { CameraKey } from "video-estudio/kit";

export const DURACION = 1440;

// ---------- datos ----------
/** Estados del monitor; `rol` es el nombre del color en `theme.data` del tema del panel. */
export const STATUS = [
  { key: "ok", label: "OK", kpi: "Sin problemas", n: 128, rol: "estadoOk" },
  { key: "infra", label: "Error en servidor", kpi: "Error en servidor", n: 61, rol: "estadoInfra" },
  { key: "sync", label: "Error sincro", kpi: "Error sincro", n: 23, rol: "estadoSincro" },
  { key: "warn", label: "Advertencia sincro", kpi: "Advertencia sincro", n: 14, rol: "estadoAdv" },
  { key: "none", label: "Sin datos", kpi: "Sin datos", n: 54, rol: "estadoSin" },
] as const;
export const TOTAL = 280;
export const FOCUS_STATUS = 1; // el filtro que clickea el cursor: error en servidor
export const TICKET = "#48213";
export const STORE = "tienda-07.ejemplo.com.ar";

// ---------- el panel (mundo: x 0 a 1640, y 0 a 920) ----------
export const CW = 1640;
export const CH = 920;
export const DONUT = { cx: 300, cy: 668, r: 160, w: 30 };
export const CHIP = { x: 40, y: 112, h: 52, gap: 14, w: [96, 220, 170, 220] };
export const TABLE = { x: 590, y: 380, w: 1010, h: 500, head: 56, row: 54 };
export const ROWS = [
  { st: 0, d: "tienda-01.ejemplo.com.ar", s: "sincro.php", t: "22:40", dur: "26.5 s" },
  { st: 1, d: STORE, s: "sincro.php", t: "22:45", dur: "2 m 0 s" },
  { st: 0, d: "tienda-12.ejemplo.com.ar", s: "sincro-pedidos.php", t: "22:48", dur: "15.9 s" },
  { st: 2, d: "tienda-23.ejemplo.com.ar", s: "sincro.php", t: "22:50", dur: "55.2 s" },
  { st: 1, d: "tienda-31.ejemplo.com.ar", s: "sincro-pedidos.php", t: "22:52", dur: "0.4 s" },
  { st: 0, d: "tienda-34.ejemplo.com.ar", s: "sincro.php", t: "22:55", dur: "4.8 s" },
  { st: 3, d: "tienda-40.ejemplo.com.ar", s: "sincro.php", t: "23:00", dur: "7.9 s" },
  { st: 0, d: "tienda-44.ejemplo.com.ar", s: "sincro-pedidos.php", t: "23:00", dur: "6.5 s" },
  { st: 1, d: "tienda-52.ejemplo.com.ar", s: "sincro.php", t: "23:05", dur: "1.1 s" },
  { st: 0, d: "tienda-58.ejemplo.com.ar", s: "sincro.php", t: "23:10", dur: "5.2 s" },
  { st: 1, d: "tienda-63.ejemplo.com.ar", s: "sincro.php", t: "23:11", dur: "0.9 s" },
  { st: 0, d: "tienda-70.ejemplo.com.ar", s: "sincro-pedidos.php", t: "23:15", dur: "2.5 s" },
];
export const DETAIL_H = 360;
export const LOG = "Timeout: la tienda no respondió en 120 s";
export const STEPS = [
  "Obteniendo clientes",
  "Sincronizando clientes",
  "Obteniendo estados de pedido",
  "Sincronizando estados de pedido",
  "Sincronizando productos",
];

// ---------- la mesa de ayuda (a la derecha del panel) ----------
export const MESA = { x: 1800, y: 70, w: 1320, h: 780, top: 64, rail: 64, pad: 40, head: 272, row: 90, card: 78 };
export type Sla = { v: string; tone: "ok" | "warn" | "bad"; done?: boolean };
export type Fila = { id: string; a: string; e: string; date: string; sla: [Sla, Sla]; pr: string; inc?: boolean; off?: boolean };
export const MESA_ROWS: Fila[] = [
  { id: "# 48209", a: "Consulta de facturación", e: "Tienda 14", date: "10/11/26", sla: [{ v: "2%", tone: "ok" }, { v: "1%", tone: "ok" }], pr: "Media" },
  { id: "# 48204", a: "Artículo sin stock", e: "Tienda 22", date: "10/11/26", sla: [{ v: "3%", tone: "ok" }, { v: "1%", tone: "ok" }], pr: "Media", inc: true },
  { id: "# 48198", a: "Stock de combo", e: "Tienda 31", date: "09/11/26", sla: [{ v: "12%", tone: "ok" }, { v: "6%", tone: "ok" }], pr: "Media", inc: true },
  { id: "# 48190", a: "Publicaciones pausadas", e: "Tienda 45", date: "05/11/26", sla: [{ v: "0%", tone: "ok", done: true }, { v: "51%", tone: "warn" }], pr: "Media", off: true },
];
export const MESA_NEW: Fila = {
  id: "# 48213", a: "Error en servidor", e: "Tienda 07", date: "10/11/26",
  sla: [{ v: "0%", tone: "ok" }, { v: "0%", tone: "ok" }], pr: "Alta", inc: true,
};
export const CARD_W = MESA.w - MESA.rail - MESA.pad * 2;
export const MESA_SLOT = { x: MESA.x + MESA.rail + MESA.pad, y: MESA.y + MESA.head };

// ---------- el chat del equipo (a la IZQUIERDA del panel) ----------
export const TEAMS = { x: -1180, y: -40, w: 940, h: 1040 };
export const TEAMS_CX = TEAMS.x + TEAMS.w / 2;
export const NOVEDADES: { l: string; n?: number; v: string }[] = [
  { l: "Sitios afectados", n: 3, v: "" },
  { l: "Incidentes abiertos", n: 6, v: " (1 nuevo, 1 recurrente)" },
  { l: "Prioridad alta", n: 1, v: "" },
  { l: "Arreglos por aprobar", n: 3, v: "" },
  { l: "Resueltos desde el último aviso", n: 0, v: "" },
  { l: "Más antiguo", v: "tienda-12.ejemplo.com.ar · Errores en el log · 15 h" },
];
export const FIXES = [
  "Reenviar al ERP los 3 pedidos sin nota de pedido",
  "Relanzar la sincro de pedidos de la tienda",
  "Reintentar la sincro con un timeout de 300 s",
];

// ---------- línea de tiempo ----------
export const T = {
  filterClick: 218,
  rowClick: 300,
  ticketClick: 440,
  ticketDone: 466,
  fly: [480, 546] as [number, number],
  land: 546,
  // de vuelta en el panel: el aviso, que se pliega en una campanita que vuela al chat (a la izquierda)
  alert: 642,
  fold: [700, 730] as [number, number],
  // el chat: ventana, señal, escribiendo, tarjeta, filas, incidentes, arreglos y resaltado de cada arreglo
  teams: { win: 744, signal: [732, 790] as [number, number], typing: 796, card: 818, rows: 832, inc: 898, fix: 952, hi: [974, 992, 1010] },
  // de vuelta a la mesa (a la derecha): abrir el ticket, escribir la respuesta y enviarla
  openRow: 1112,
  opened: [1116, 1140] as [number, number],
  responder: 1144,
  typeFrom: 1158,
  send: 1272,
  through: [1404, 1440] as [number, number],
};

export const ALERT = { x: 1080, y: 150, w: 520, h: 124 };
export const BELL_LAND = { x: TEAMS.x + 48, y: TEAMS.y + 38 };
/** El ticket abierto cubre la ventana de la mesa. */
export const TV = { x: 1800, y: 70, w: 1320, h: 780 };
export const TVX = TV.x + 64 + 40;
export const ED = { x: TVX, y: 546, w: 720, h: 220 };
export const REPLY =
  "Hola, ¿cómo están? Detectamos un error de servidor en la sincronización de la tienda. Ya reintentamos la sincro con más tiempo de espera y quedó funcionando. Cualquier cosa, nos avisan.";

// Dónde están las cosas (coordenadas del mundo), para el cursor y los vuelos.
export const firstRowY = TABLE.y + TABLE.head + TABLE.row / 2;
export const BTN = { x: TABLE.x + TABLE.w - 20 - 22 - 110, y: TABLE.y + TABLE.head + TABLE.row + DETAIL_H - 16 - 22 - 25 };
export const chipX = (i: number) => CHIP.x + CHIP.w.slice(0, i).reduce((a, b) => a + b + CHIP.gap, 0);

// ---------- cámara: la misma ruta del original (cuadro, foco x, foco y, escala) ----------
export const KEYS: CameraKey[] = ([
  [0, 300, 668, 2.4], [112, 300, 668, 2.4], [160, 820, 410, 1], [190, 820, 410, 1],
  [225, 760, 400, 1.12], [270, 760, 400, 1.12], [305, 1060, 545, 1.4], [470, 1060, 545, 1.4],
  // sigue al ticket hacia la derecha, hasta la mesa
  [500, 1700, 470, 0.7], [546, 2460, 420, 1.0], [560, 2460, 420, 1.0], [576, 2400, 350, 1.55], [600, 2400, 350, 1.55],
  // vuelta de latigazo al panel: el aviso cae de la campana
  [630, 820, 410, 1.0], [644, 820, 410, 1.0], [658, 1340, 220, 1.7], [700, 1340, 220, 1.7], [730, 1300, 240, 1.35],
  // sigue a la campana hacia la izquierda, hasta el chat
  [762, 300, 260, 0.7], [792, TEAMS_CX, TEAMS.y + 520, 0.98], [998, TEAMS_CX, TEAMS.y + 520, 0.98],
  [1012, TEAMS_CX, TEAMS.y + 690, 1.45], [1042, TEAMS_CX, TEAMS.y + 690, 1.45],
  // vuelo a la mesa (a la derecha) y apertura del ticket
  [1068, 900, 420, 0.4], [1092, 2460, 420, 1.0], [1106, 2400, 381, 1.3], [1118, 2400, 381, 1.3],
  [1140, 2460, 460, 1.0], [1150, 2460, 460, 1.0], [1166, ED.x + 360, 620, 1.6], [1268, ED.x + 360, 620, 1.6],
  [1292, 2460, 460, 1.0], [1320, 2460, 460, 1.0],
  // todo junto, y se sale atravesando la respuesta enviada
  [1352, 970, 440, 0.43], [1396, 970, 440, 0.43], [1404, 970, 440, 0.43],
] as [number, number, number, number][]).map(([f, x, y, scale]) => ({ f, x, y, scale }));
/** Inclinación en reposo del original, por cuadro (`rx`, `ry`): la vista del panel se inclina al llegar de la apertura y al seguir al ticket. */
export const TILT_F = [0, 112, 136, 168, 470, 520];
export const TILT_RX = [0, 0, 12, 0, 0, 4];
export const TILT_RY = [0, 0, -10, 0, 0, -3];
