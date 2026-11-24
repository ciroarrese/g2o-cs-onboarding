// Disposición de la intro y del cierre de Grow2on según el formato del video (horizontal 1920x1080, vertical 1080x1920, cuadrado 1080x1080).
// Una sola fuente de coordenadas: la leen `Intro`, `Cierre` y los empalmes de un video (p. ej. `proyectos-ia/puentes.tsx`) para que lo que viaja
// de una pieza a otra caiga exactamente donde la pieza lo dibuja. En horizontal los valores son los de siempre (las plantillas del sistema).
import { textWidth } from "video-estudio/kit";
import type { Theme } from "video-estudio/themes";

export type FormatoMarca = "horizontal" | "vertical" | "cuadrado";

/** Formato según la proporción del cuadro (no hace falta `useFormat`: sirve también fuera de React). */
export const formatoDe = (width: number, height: number): FormatoMarca => (width / height > 1.3 ? "horizontal" : height / width > 1.3 ? "vertical" : "cuadrado");

/** Aro de la intro (`aroFuncionalidades`, 1536 x 1536): parte visible respecto de la imagen, medida sobre el archivo. */
const ARO_INTRO = { x0: 123 / 1536, y0: 235 / 1536, x1: 1419 / 1536, y1: 1306 / 1536 };

export type IntroGeom = {
  formato: FormatoMarca;
  /** logo: esquina y alto */ logo: { x: number; y: number; h: number };
  /** imagen del aro (cuadrada): esquina y lado */ aro: { x: number; y: number; w: number };
  /** columna de la píldora y el título */ texto: { x: number; y: number; w: number };
  /** letra del título (px) y alto de la píldora */ titulo: number; pildoraAlto: number;
  /** arriba de cada renglón del título (px del cuadro) */ l1Top: number; l2Top: number;
  /** hacia dónde se va el aro al salir (vector unitario) */ salida: { x: number; y: number };
  /** de qué borde se juntan las motas */ motas: "derecha" | "abajo";
};

/** Alto de la píldora de categoría de la intro (letra `caption * 0,94`, interlínea 1,2 y 14 px de relleno arriba y abajo). */
export const pildoraIntroAlto = (t: Theme) => t.type.caption * 0.94 * 1.2 + 28;

/**
 * Disposición de la intro. `escala` es la de `Intro` (1 = tamaño de la plantilla); en vertical y cuadrado, además, la letra baja sola lo necesario para
 * que el renglón más ancho entre en el ancho seguro (en horizontal no: es la de siempre).
 */
export function introGeom(t: Theme, width: number, height: number, o: { escala?: number; titulo1?: string; titulo2?: string } = {}): IntroGeom {
  const formato = formatoDe(width, height);
  const escala = o.escala ?? 1;
  const alto = pildoraIntroAlto(t);
  const base = Math.round(t.type.hero * 0.93 * escala);
  const gapPT = 36;
  if (formato === "horizontal") {
    const l1Top = 360 + alto + gapPT;
    return {
      formato, logo: { x: 140, y: 100, h: 92 }, aro: { x: 1010, y: 100, w: 880 }, texto: { x: 140, y: 360, w: 900 }, titulo: base, pildoraAlto: alto,
      l1Top, l2Top: l1Top + base * 1.04 + 4, salida: { x: 1, y: 0 }, motas: "derecha",
    };
  }
  const vertical = formato === "vertical";
  const m = vertical ? 80 : 70; // margen lateral (más que el 3 % del control de calidad: el teléfono tapa los bordes con su interfaz)
  const room = width - 2 * m;
  // la letra baja hasta que el renglón más ancho entre (medido con la tipografía del tema)
  const anchos = [o.titulo1, o.titulo2].filter((s): s is string => !!s);
  const ancho = (s: number) => Math.max(0, ...anchos.map((r) => textWidth(t, r, { size: s, weight: "semibold" }) * 0.97));
  let size = vertical ? base : Math.round(base * 0.86);
  while (size > 40 && ancho(size) > room) size -= 2;
  const lineH = size * 1.04;
  let logoY: number, textoY: number, aroW: number, aroX: number, aroY: number, logoH: number;
  if (vertical) {
    logoH = 84; logoY = 170; textoY = 440;
    aroW = 1120; aroX = Math.round((width - aroW) / 2);
    aroY = Math.round(960 - ARO_INTRO.y0 * aroW); // la parte visible del aro empieza en y = 960
  } else {
    logoH = 68; logoY = 70; textoY = 190;
    aroW = 760; aroX = Math.round(width - m - ARO_INTRO.x1 * aroW);
    aroY = Math.round(height - 40 - ARO_INTRO.y1 * aroW); // la parte visible del aro termina a 40 px del borde de abajo
  }
  const l1Top = textoY + alto + gapPT;
  return {
    formato, logo: { x: m, y: logoY, h: logoH }, aro: { x: aroX, y: aroY, w: aroW }, texto: { x: m, y: textoY, w: room }, titulo: size, pildoraAlto: alto,
    l1Top, l2Top: l1Top + lineH + 4, salida: { x: 0, y: 1 }, motas: vertical ? "abajo" : "derecha",
  };
}

export type CierreGeom = {
  formato: FormatoMarca;
  /** imagen del aro (cuadrada): esquina y lado */ aro: { x: number; y: number; w: number };
  /** columna de texto: esquina izquierda, ancho y, en vertical y cuadrado, dónde empieza (en horizontal va centrada en el alto) */ texto: { x: number; y: number | null; w: number };
  logoH: number; fraseSize: number; gap: number;
  /** píldora de la dirección: esquina (px del cuadro), ancho medido con la tipografía de marca y alto */ pildora: { x: number; y: number; w: number; h: number };
};

/** Alto de la píldora de la URL del cierre (letra `caption * 1,125`, interlínea 1,2 y 16 px de relleno arriba y abajo). */
export const pildoraCierreAlto = (t: Theme) => t.type.caption * 1.125 * 1.2 + 32;

/** Disposición del cierre. La píldora de la URL queda siempre alineada a la izquierda de la columna de texto: su `x` no depende del texto. */
export function cierreGeom(t: Theme, width: number, height: number): CierreGeom {
  const formato = formatoDe(width, height);
  const fraseSize = t.type.h1 * 0.875;
  const fraseH = fraseSize * 1.1 + 6;
  const ph = pildoraCierreAlto(t);
  const PW = 327; // ancho de la píldora "grow2on.com" (se verifica contra el cuadro real)
  if (formato === "horizontal") {
    const logoH = 120, gap = 56;
    const total = logoH + gap + fraseH + gap + ph;
    const top = (height - total) / 2;
    return { formato, aro: { x: 1160, y: -60, w: 1200 }, texto: { x: 140, y: null, w: 860 }, logoH, fraseSize, gap, pildora: { x: 140, y: Math.round(top + total - ph), w: PW, h: Math.round(ph) } };
  }
  const vertical = formato === "vertical";
  const m = vertical ? 80 : 70;
  const logoH = vertical ? 110 : 88, gap = vertical ? 56 : 44;
  const y0 = vertical ? 280 : 80;
  const y = Math.round(y0 + logoH + gap + fraseH + gap);
  // El aro gira sobre su centro: con el centro a la vista y un radio que entra en el cuadro nunca se corta, gire como gire (su parte visible mide ~0,78 del lado de la imagen).
  const aroW = vertical ? 1250 : 800;
  const c = vertical ? { x: width / 2, y: 1280 } : { x: 690, y: 725 };
  const aroX = Math.round(c.x - aroW / 2), aroY = Math.round(c.y - aroW / 2);
  return { formato, aro: { x: aroX, y: aroY, w: aroW }, texto: { x: m, y: y0, w: width - 2 * m }, logoH, fraseSize, gap, pildora: { x: m, y, w: PW, h: Math.round(ph) } };
}
