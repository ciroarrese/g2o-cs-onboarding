// Tiempos, geometría del mundo y datos emulados de la escena de Sincro Presta (tienda "hogarnova", clientes y facturas ficticios).

export const NAME = "Módulo Sincro Presta";
export const DURACION = 1200;

// ---------- zonas (centros en el mundo) ----------
export const ZB = { x: 3200, y: 540 };
export const ZC = { x: 3200, y: 1900 };
export const ZD = { x: 960, y: 1900 };

// ---------- tiempos ----------
export const T = {
  // A
  erpPrice: 34, chipPrice: [46, 86] as const,
  erpStock: 72, chipStock: [86, 126] as const,
  erpNew: 104, chipCat: [118, 158] as const,
  cart: 146, chipOrder: [152, 188] as const,
  // B
  weeks: 268,
  // C
  web: [482, 546] as const, fail: 546, move: [574, 604] as const, srv: [606, 690] as const,
  // D
  cards: 748, merge: 782, click1: 872, click2: 896, save: 918,
  // E
  rows: 960, detail: 1004, pdfClick: 1046, pdfFly: [1050, 1078] as const, scan: [1098, 1114] as const, arca: 1116,
  through: [1166, 1200] as [number, number],
};

// ---------- zona A: tienda y ERP ----------
export const SW = { x: 60, y: 130, w: 860, h: 800 };
export const EW = { x: 1000, y: 170, w: 860, h: 700 };
export const HUB = { x: 960, y: 90 };

export type Producto = { id: string; n: string; code: string; rubro: string; p: [number, number]; s: [number, number] };
export const PRODUCTS: Producto[] = [
  { id: "ollas", n: "Set de ollas 5 piezas", code: "HG-1021", rubro: "Cocina", p: [48900, 51200], s: [12, 12] },
  { id: "cafetera", n: "Cafetera de filtro", code: "HG-1034", rubro: "Cocina", p: [36500, 36500], s: [4, 4] },
  { id: "sabanas", n: "Juego de sábanas 2 plazas", code: "HG-2010", rubro: "Dormitorio", p: [29800, 29800], s: [20, 20] },
  { id: "toallon", n: "Toallón de algodón", code: "HG-3005", rubro: "Baño", p: [12700, 12700], s: [0, 6] },
  { id: "almohadon", n: "Almohadón decorativo", code: "HG-4120", rubro: "Decoración", p: [9800, 9800], s: [30, 30] },
  { id: "lampara", n: "Lámpara de pie nórdica", code: "HG-5002", rubro: "Iluminación", p: [64500, 64500], s: [8, 8] },
];

// Dibujos de línea de los productos (iconos simples sobre baldosas pastel).
export const ART: Record<string, string> = {
  ollas: "M4 10h16v6a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4zM2 10h2M20 10h2M9 6h6M12 6V4",
  cafetera: "M7 4h10l-1 5H8zM8 9h8v9a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2zM16 12h2a2 2 0 0 1 0 4h-2",
  sabanas: "M3 8h18v10H3zM3 12h18M7 8V6h10v2",
  toallon: "M6 3h12v14H6zM6 17l2 4M18 17l-2 4M6 7h12",
  lampara: "M8 3h8l3 8H5zM12 11v9M8 20h8",
  almohadon: "M4 6c3 1 13 1 16 0-1 4-1 8 0 12-3-1-13-1-16 0 1-4 1-8 0-12z",
};
export const TILE = ["tile1", "tile2", "tile3", "tile4", "tile5", "tile6"] as const;

// ---------- zona B: versiones semanales ----------
export type Item = ["Mejora" | "Fix", string];
export const WEEKS: Item[][] = [
  [["Mejora", "Compatible con PrestaShop 9"], ["Fix", "Packs sin productos"], ["Mejora", "Soporte PHP 8"]],
  [["Mejora", "Precios incrementales"], ["Fix", "Pedidos perdidos"], ["Mejora", "Logs de cada sincro"]],
  [["Mejora", "Control de crédito"], ["Fix", "Catálogo apagado"], ["Mejora", "Pre-venta por OC"], ["Fix", "Descuentos duplicados"]],
  [["Mejora", "Cuenta corriente"], ["Mejora", "Productos sustitutos"], ["Fix", "Stock negativo"], ["Mejora", "Familias ocultas"], ["Fix", "Corte en Hostinger"]],
  [["Mejora", "Sincro interna en servidor"], ["Fix", "Imágenes repetidas"], ["Mejora", "PDF con CAE y QR"]],
];
export const VERS = ["v2.1", "v2.3", "v2.5", "v2.7", "v2.9"];

// ---------- zona D: funciones del módulo ----------
export const FEATURES: [string, string, boolean][] = [
  ["Control de crédito", "Valida el crédito del cliente en el checkout", true],
  ["Pre-venta por orden de compra", "Toma pedidos de productos sin stock", false],
  ["Productos sustitutos", "Ofrece un reemplazo cuando no hay stock", true],
  ["Familias y artículos ocultos", "Oculta líneas enteras de la tienda", false],
  ["Precios incrementales", "Actualiza solo los precios que cambiaron", true],
  ["Cuenta corriente", "Saldos, vencimientos y facturas en la tienda", true],
];
export const CFG = { x: ZD.x + 40, y: ZD.y - 400, w: 820, h: 800, rowY: 150, rowH: 96 };

// ---------- zona E: cuenta corriente, PDF, teléfono ----------
export const SE = { x: 60, y: 2760, w: 1140, h: 880 };
export const PDF = { x: 1290, y: 2780, w: 560, h: 840 };
export const QR = { x: PDF.x + PDF.w - 176, y: PDF.y + PDF.h - 196, size: 136 };
export const PHONE = { x: 1980, y: 2840, w: 380, h: 780 };
export const MOVES = [
  ["05/11/26", "Factura A 0004-00012873", 184500, 0],
  ["12/11/26", "Factura A 0004-00012911", 96200, 0],
  ["14/11/26", "Recibo 0002-00004410", 0, 150000],
  ["19/11/26", "Factura A 0004-00012960", 251900, 0],
  ["21/11/26", "Nota de crédito A 0004-00000318", 0, 12800],
] as const;
export const LINEAS_FACTURA = [["Cafetera de filtro", 2, 36500], ["Toallón de algodón", 1, 12700], ["Almohadón decorativo", 1, 9800]] as const;
export const DATOS_ARCA = [
  ["CUIT emisor", "30-71234567-8"],
  ["Tipo de comprobante", "Factura A"],
  ["Punto de venta", "0004"],
  ["Número", "00012911"],
  ["Fecha de emisión", "12/11/2026"],
  ["Importe total", "$ 96.200"],
  ["CAE", "76451238904512"],
] as const;

/** Cuadros en que cada zona se monta (con margen alrededor de su recorrido de cámara): fuera de ese rango no se dibuja, así no queda texto del otro lado del mundo. */
export const VIS = { A: [0, 262], B: [236, 492], C: [452, 762], D: [722, 972], E: [930, 1200] } as const;
export const enVentana = (f: number, r: readonly [number, number]) => f >= r[0] && f <= r[1];
