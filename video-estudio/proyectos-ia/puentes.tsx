// Empalmes con un elemento que se transforma, para el video "proyectos-ia". Son dos capas de la raíz del video (cuadro absoluto) que se montan ENCIMA de
// la historia y de la intro y el cierre de Grow2on, sin tocar el toolkit:
//
//  1. `PuenteIntroApertura`: el título "Proyectos / con IA" de la intro (dos renglones a la izquierda) viaja, se reacomoda en un renglón y se vuelve el título
//     de la tarjeta central de la apertura, mientras la tarjeta blanca crece detrás; la píldora "Novedades" se tiñe de blanco con borde rosa (como una pieza del
//     muro) y se queda sobre la tarjeta hasta que esta se va; el logo, el aro y las motas salen (propios de la intro) y el fondo pasa de blanco a las nubes
//     (un velo del color del fondo que se levanta).
//  2. `PuenteRecapCierre`: las cinco píldoras de tema del muro de la recapitulación se juntan en el centro, se funden en UNA píldora rosa que viaja hasta su
//     lugar de la pantalla de cierre y ahí se vuelve la píldora "grow2on.com", mientras el muro se lava a blanco y entran el logo, la frase y el aro.
//
// El traspaso es de píxeles idénticos: en el cuadro de arranque la capa dibuja las mismas piezas, con las mismas funciones y el mismo tema que la intro, la
// apertura y la recapitulación (`rigTransform`, `Pill`, `surfaceStyle`, `textStyle`), exactamente donde están; después las mueve. Todo sale del cuadro.
// Funcionan en los tres formatos (1920x1080, 1080x1920 y 1080x1080): las posiciones salen de la disposición de cada formato (`g2o/formato.ts` para la intro y
// el cierre; la apertura y la recapitulación, de `stories/layout`), no de números fijos. En horizontal las constantes son las de siempre.
import React from "react";
import { Easing, FrameProvider, useFrame, useVideoConfig } from "video-estudio/engine";
import { VeilContent, kf } from "video-estudio/kit";
import { bezier } from "video-estudio/engine";
import { fade } from "video-estudio/fx/core";
import { GradientText } from "video-estudio/kit";
import { StoryBackdropProvider } from "video-estudio/stories";
import { Chip, Opening, Pill, closingFrames, fitText, openingFrames, useStorySpec, withoutLate } from "video-estudio/stories";
import { wallOptions } from "video-estudio/stories/types";
import { closingWall, fitTitleNarrow, openingWall, pillFit, rigProject, rigTransform, titleCardMax } from "video-estudio/stories/layout";
import { textWidth } from "video-estudio/kit";
import { surfaceStyle, textStyle, useTheme } from "video-estudio/themes";
import { spec } from "./historia/spec";
import { Particulas } from "../g2o/Particulas";
import { cierreGeom, formatoDe, introGeom } from "../g2o/formato";

const mix = (a: number, b: number, p: number) => a + (b - a) * p;
const hexRgb = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
/** Mezcla de dos colores `#rrggbb` (los del tema). */
const mezcla = (a: string, b: string, p: number) => {
  const A = hexRgb(a), B = hexRgb(b);
  return `rgb(${A.map((v, k) => Math.round(v + (B[k]! - v) * p)).join(",")})`;
};
/** Tipografía y color de texto que la `Stage` da a la historia: las capas de empalme viven fuera de ella y los ponen por su cuenta. */
const baseTexto = (t: ReturnType<typeof useTheme>): React.CSSProperties => ({ fontFamily: t.font.family, fontWeight: t.font.weights.regular, color: t.color.text });
const Z_VELO = 4000;
const Z_PUENTE = 6000;

/** Píldora de marca (la de `g2o/movimiento`) con el fondo, el texto y el borde interior elegibles, para que se pueda teñir de blanco sin cambiar su caja. */
function PildoraTinte({ children, fondo, texto, borde, size, padding, calla, textoOp }: { children: React.ReactNode; fondo: string; texto: string; borde?: string; /** opacidad del texto (0 a 1) */ textoOp?: number; /** callar el contraste mientras fondo y texto se funden a la vez (como `Pildora` al entrar o salir) */ calla?: boolean; size: number; padding: string }) {
  const t = useTheme();
  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <div style={{ position: "absolute", inset: 0, background: fondo, borderRadius: t.radius.pill, ...(borde ? { boxShadow: `inset 0 0 0 2px ${borde}` } : {}) }} />
      <div data-qa-ignore={calla ? "contrast" : undefined} style={{ position: "relative", ...(textoOp !== undefined && textoOp < 1 ? { opacity: +textoOp.toFixed(3) } : {}), color: texto, fontSize: size, lineHeight: 1.2, fontWeight: t.font.weights.semibold, letterSpacing: "0.01em", padding, whiteSpace: "nowrap" }}>{children}</div>
    </div>
  );
}

// ======================================================================================================================================
// 1. Intro -> apertura
// ======================================================================================================================================

export const PUENTE1 = {
  /** cuadro desde el que la capa toma píldora y título (la intro los deja de dibujar: `Intro traspaso`); es el cuadro absoluto = local de la intro */
  toma: 140,
  /** viaje del título; el golpe de sonido de la apertura cae en el 213 */
  viaje: [156, 210] as [number, number],
  /** cuadro absoluto en que empieza la apertura */
  apertura: 210,
  /** el velo del color del fondo se levanta (entran las nubes y el muro) */
  velo: [174, 216] as [number, number],
};
/**
 * Tiempos del primer empalme por formato. En vertical y cuadrado el título tiene que recorrer más camino (hasta el centro de un cuadro alto) y el cartel de la apertura,
 * quieto debajo del velo, se asoma a medida que este se levanta: el título llega antes (cuadro 176) y el velo se levanta recién cuando ya está encima, así el cartel de debajo
 * nunca se ve desfasado. La píldora sigue con el tiempo de siempre (llega al muro cuando entra la apertura).
 */
export const tiempos1 = (width: number, height: number) => (width / height < 1.3
  // `muro`: cuándo empieza a levantarse el velo que deja ver las nubes y el muro (en angosto antes que el velo que tapa el cartel: ver `parche` en `PuenteIntroApertura`)
  ? { viaje: [146, 176] as [number, number], velo: [176, 216] as [number, number], muro: [165, 216] as [number, number] }
  : { viaje: PUENTE1.viaje, velo: PUENTE1.velo, muro: PUENTE1.velo });
/** Textos de la intro: los usa `historia/index.tsx` en `Intro` y esta capa para saber qué dibuja. */
export const INTRO_TEXTOS = { eyebrow: "Novedades", titulo1: "Proyectos", titulo2: "con IA" };
/** Ancho (px) del texto "Proyectos con IA" y de "Proyectos " (con su espacio) con la letra del cartel de la apertura en horizontal (1920 x 1080); se verifican contra el cuadro real. */
const TXT = { total: 852, hasta2: 536 };
const PILDORA_W = 227;
/** Lugar de "Novedades" en el muro de la apertura en horizontal (coordenadas del muro, como las de `openingWall`): un hueco entre piezas, a la izquierda; arriba a 190, 385 al empezar. En los otros formatos el hueco se busca (`huecoMuro`). */
const CHIP_MURO = { x: -935, y: -212, z: -50 };

type Rig = { dz: number; rx: number; ry: number };
/** Cámara del muro de la apertura en el cuadro local `fl` (la misma cuenta que stories/Opening.tsx). */
function rigApertura(fl: number, dur: number, dolly: number): Rig {
  const u = (n: number) => (n * dur) / 300;
  return {
    dz: kf(fl, [0, u(130)], [0, 240 + dolly], Easing.linear) + kf(fl, [u(94), u(126) + u(20)], [0, -900]),
    rx: kf(fl, [0, u(130)], [7, -3], Easing.linear),
    ry: kf(fl, [0, u(130)], [-11, 6], Easing.linear),
  };
}

/** Cartel de la apertura (el que ve la persona cuando llega el título): letra, renglones y caja, según el formato (mismo cálculo que stories/Opening.tsx). */
function cartelApertura(t: ReturnType<typeof useTheme>, width: number, height: number) {
  const narrow = width / height < 1.3;
  const titleW = Math.min(1560, width - 2 * t.safe.x);
  const tf = narrow ? fitTitleNarrow(t, spec.title.text, width) : fitText(spec.title.text, titleW, t.type.hero, { min: t.type.hero * 0.5, lines: 2, avg: 0.55 });
  const S2 = tf.size;
  const padX = Math.round(S2 * 0.55), padY = Math.round(S2 * 0.3);
  if (!narrow) {
    return { narrow, S2, padX, padY, filas: 1, anchos: [TXT.total], hasta2: TXT.hasta2, cardW: TXT.total + 2 * padX, cardH: Math.round(S2 * 1.08) + 2 * padY };
  }
  // Angosto: el cartel parte el título en renglones solo (con el espacio duro entre "con" e "IA": "Proyectos" / "con IA"); si entero no entra en el ancho del cartel van
  // dos renglones centrados, si entra, uno solo. (No se usan los renglones de `fitTitleNarrow`: tratan el espacio duro como un espacio y partirían "con" de "IA".)
  // el cartel pide un interletrado propio (`tracking` -0,03 em sobre el del tema) y `textWidth` con el rol `title` trae solo el del tema: se suma la diferencia por cada letra
  const ls = parseFloat(String(textStyle(t, "title", { tracking: -0.03 }).letterSpacing ?? "0")) - parseFloat(String(textStyle(t, "title").letterSpacing ?? "0"));
  const m = (txt: string) => textWidth(t, txt, { size: S2, role: "title" }) + ls * S2 * Array.from(txt).length;
  const entero = m(`${INTRO_TEXTOS.titulo1} ${INTRO_TEXTOS.titulo2}`);
  const maxCard = titleCardMax(t, width);
  const dos = entero > maxCard - 2 * padX - 40; // 40 px de margen: el límite lo decide el navegador con el ancho real (con 8 px de margen este título cae justo en el borde)
  return {
    narrow, S2, padX, padY, filas: dos ? 2 : 1, anchos: dos ? [m(INTRO_TEXTOS.titulo1), m(INTRO_TEXTOS.titulo2)] : [entero], hasta2: m(`${INTRO_TEXTOS.titulo1} `),
    cardW: dos ? maxCard : Math.round(entero) + 2 * padX, // partido en renglones, el cartel ocupa el ancho máximo (el texto fluye en él)
    cardH: Math.round(S2 * 1.08 * (dos ? 2 : 1)) + 2 * padY,
  };
}

const huecos = new Map<string, { x: number; y: number; z: number }>();
/**
 * Hueco del muro de la apertura para la pieza "Novedades" en los formatos angostos: se prueban posiciones del muro (a la profundidad de la pieza) y se elige la que,
 * en todos los cuadros en que el muro se ve (con su cámara), queda dentro del cuadro, sin pisar ninguna otra pieza del muro ni el cartel del título (mientras está) y
 * lo más cerca posible de donde empieza la píldora; si no hay un hueco limpio, el que menos se pisa. Función pura de la geometría (sin azar): da lo mismo en cada cuadro.
 */
function huecoMuro(t: ReturnType<typeof useTheme>, rs: ReturnType<typeof useStorySpec>, width: number, height: number, dur: number, inicio: { x: number; y: number }, cartel: { w: number; h: number }) {
  const clave = `${width}x${height}`;
  const hit = huecos.get(clave);
  if (hit) return hit;
  const u = (n: number) => (n * dur) / 300;
  const wo = wallOptions(rs.design);
  const cx = width / 2, cy = height / 2;
  const wall = openingWall(rs, height, width);
  const size = t.type.caption * 0.94;
  const medida = (txt: string, k: number) => ({ w: (textWidth(t, txt, { size, weight: t.font.weights.medium }) + 1.8 * size + 8) * k, h: size * 2.3 * k });
  const propia = medida(INTRO_TEXTOS.eyebrow, 1);
  const frames: number[] = [];
  for (let fl = 0; fl <= u(94); fl += 4) frames.push(fl);
  const rigs = frames.map((fl) => rigApertura(fl, dur, wo.dolly));
  const otras = wall.map((c) => ({ c, m: medida(c.text, c.k) }));
  const aire = 14;
  const solape = (a: { x: number; y: number; w: number; h: number }, b: { x: number; y: number; w: number; h: number }) => {
    const ox = Math.min(a.x + a.w / 2, b.x + b.w / 2) - Math.max(a.x - a.w / 2, b.x - b.w / 2) + aire;
    const oy = Math.min(a.y + a.h / 2, b.y + b.h / 2) - Math.max(a.y - a.h / 2, b.y - b.h / 2) + aire;
    return ox > 0 && oy > 0 ? ox * oy : 0;
  };
  // rectángulos de las demás piezas en cada cuadro (centro en pantalla y tamaño proyectado)
  const rects = rigs.map((rig) => otras.flatMap(({ c, m }) => { const q = rigProject(c.x, c.y, c.z, rig, 1400); return q ? [{ x: cx + q.x, y: cy + q.y, w: m.w * q.s, h: m.h * q.s }] : []; }));
  let mejor = { x: 0, y: 0, z: -50 }, mejorCosto = Infinity;
  const z = -50;
  for (let x = -700; x <= 700; x += 20) {
    for (let y = -height * 0.62; y <= height * 0.62; y += 20) {
      let costo = 0, fuera = false;
      for (let i = 0; i < frames.length && !fuera; i++) {
        const q = rigProject(x, y, z, rigs[i]!, 1400);
        if (!q) { fuera = true; break; }
        const r = { x: cx + q.x, y: cy + q.y, w: propia.w * q.s, h: propia.h * q.s };
        if (r.x - r.w / 2 < 36 || r.x + r.w / 2 > width - 36 || r.y - r.h / 2 < 36 || r.y + r.h / 2 > height - 36) { fuera = true; break; }
        for (const o of rects[i]!) costo += solape(r, o);
        if (frames[i]! < u(100)) costo += solape(r, { x: cx, y: cy, w: cartel.w, h: cartel.h });
      }
      if (fuera) continue;
      const q0 = rigProject(x, y, z, rigs[0]!, 1400)!;
      const dist = Math.hypot(cx + q0.x - inicio.x, cy + q0.y - inicio.y);
      const total = costo * 1000 + dist;
      if (total < mejorCosto) { mejorCosto = total; mejor = { x, y, z }; }
    }
  }
  huecos.set(clave, mejor);
  return mejor;
}

/**
 * La apertura quieta en su cuadro 0, montada antes de que empiece (desde que se levanta el velo): así el muro y las nubes empiezan a aparecer mientras el título
 * todavía viaja. En el cuadro en que empieza la apertura de verdad (cuadro local 0) la copia se va y el cuadro es el mismo.
 */
export function AperturaTemprana() {
  const f = useFrame();
  const config = useVideoConfig();
  const rs = useStorySpec(spec);
  if (f < tiempos1(config.width, config.height).muro[0] || f >= PUENTE1.apertura) return null;
  return (
    <FrameProvider frame={0} config={config}>
      {/* La apertura va con el cuadro 0 congelado, pero las partículas de fondo siguen el cuadro absoluto del video: se las pasa explícito (`frame`), no el del reloj de acá. */}
      <StoryBackdropProvider backdrop={<Particulas frame={f} />}>
        <Opening spec={spec} first={0} dock={rs.design?.handoff === "dock"} through={rs.design?.handoff === "through"} />
      </StoryBackdropProvider>
    </FrameProvider>
  );
}

export function PuenteIntroApertura() {
  const f = useFrame();
  const { width, height } = useVideoConfig();
  const t = useTheme();
  const rs = useStorySpec(withoutLate(spec));
  const { toma, apertura } = PUENTE1;
  const { viaje, velo, muro } = tiempos1(width, height);
  if (f < toma || f > apertura + 78) return null;

  // --- inicio: lo que dibuja la intro (la misma disposición que g2o/Intro.tsx, de g2o/formato.ts) ---
  const G = introGeom(t, width, height, { titulo1: INTRO_TEXTOS.titulo1, titulo2: INTRO_TEXTOS.titulo2 });
  const S1 = G.titulo;
  const pildoraAlto = G.pildoraAlto;
  const l1Top = G.l1Top;
  const l2Top = G.l2Top;
  const x0 = G.texto.x, pildoraY = G.texto.y;
  // --- fin: el cartel de la apertura (mismo cálculo que stories/Opening.tsx) ---
  const C = cartelApertura(t, width, height);
  const S2 = C.S2;
  const tt = textStyle(t, "title", { tracking: -0.03 });
  const padX = C.padX, padY = C.padY;
  const cardW = C.cardW, cardH = C.cardH;
  const surf = surfaceStyle(t, "title", { titleCard: "solid" });
  const cartel: React.CSSProperties = {
    maxWidth: titleCardMax(t, width), boxSizing: "border-box", padding: `${padY}px ${padX}px`, ...surf, textAlign: "center",
    fontSize: S2, fontFamily: tt.fontFamily, fontWeight: tt.fontWeight, color: t.color.text, letterSpacing: tt.letterSpacing, lineHeight: 1.08,
  };
  const cx = width / 2, cy = height / 2;
  const e = kf(f, viaje, [0, 1], Easing.inOut);
  const ep = kf(f, PUENTE1.viaje, [0, 1], Easing.inOut); // la píldora viaja con el tiempo de siempre
  const llego = f >= viaje[1];
  const veloO = kf(f, velo, [1, 0], Easing.linear);
  // Velo que deja ver el muro y las nubes. En horizontal es el mismo de siempre (`muro` = `velo`). En angosto se levanta antes y el cartel real de la apertura (quieto debajo, en su
  // cuadro 0) se tapa con un parche del color del fondo con borde difuso hasta que llega el título; entonces el parche se va (el cartel de esta capa lo cubre) y la sombra se reparte.
  const angosto = C.narrow;
  const veloM = angosto ? kf(f, muro, [0.88, 0], Easing.out ?? Easing.inOut) : veloO; // en angosto arranca cuando el aro y el logo ya casi salieron (165), con el muro asomando desde el primer cuadro (0,88 de velo) y cae rápido al principio
  const parche = angosto ? (llego ? kf(f, [viaje[1], viaje[1] + 6], [1, 0], Easing.linear) : 1) : 0;
  const sombra = angosto ? 1 - (1 - parche) * (1 - veloM) : veloO; // opacidad de la sombra complementaria del cartel
  // piezas del título: de dos renglones a la izquierda al cartel. Horizontal: a un renglón centrado; formatos angostos: a los renglones del cartel, centrados.
  const lsFin = parseFloat(String(tt.letterSpacing ?? "0")); // em (el cartel de la apertura suma el tracking del tema)
  const lineaFin = S2 * 1.08;
  const bloqueTop = cy - lineaFin * C.filas / 2;
  const dosRenglones = C.filas === 2;
  const xFin1 = cx - C.anchos[0]! / 2;
  const xFin2 = dosRenglones ? cx - C.anchos[1]! / 2 : xFin1 + C.hasta2;
  const yFin1 = bloqueTop, yFin2 = dosRenglones ? bloqueTop + lineaFin : bloqueTop;
  // El recorrido (horizontal): primero cada palabra se corre hacia su lugar en horizontal (la segunda por debajo de la primera, sin pisarla) y recién después la
  // segunda sube a la línea de la primera; así nunca se encima un texto con otro. En angosto los dos renglones siguen apilados: se mueven juntos.
  const ex = dosRenglones ? e : kf(f, [viaje[0], viaje[0] + (viaje[1] - viaje[0]) * 0.65], [0, 1], Easing.inOut);
  const ey1 = e;
  const ey2 = dosRenglones ? e : kf(f, [viaje[0] + (viaje[1] - viaje[0]) * 0.35, viaje[1]], [0, 1], Easing.inOut);
  const pieza = (xa: number, ya: number, xf: number, yf: number, ey: number): React.CSSProperties => ({
    position: "absolute", left: 0, top: 0, whiteSpace: "nowrap", fontSize: mix(S1, S2, e), lineHeight: mix(1.04, 1.08, e),
    fontWeight: t.font.weights.semibold, letterSpacing: `${mix(-0.03, lsFin, e).toFixed(4)}em`, transform: `translate(${Math.round(mix(xa, xf, ex))}px, ${Math.round(mix(ya, yf, ey))}px)`,
  });

  // tarjeta: crece detrás del título desde su caja inicial hasta la del cartel (acompaña a las palabras: llega a su tamaño cuando ellas llegan a su lugar en horizontal)
  const c0w = C.narrow ? Math.round(Math.max(textWidth(t, INTRO_TEXTOS.titulo1, { size: S1, role: "title" }), textWidth(t, INTRO_TEXTOS.titulo2, { size: S1, role: "title" })) + 80) : 540;
  const c0 = { x: x0 - 40, y: l1Top - 30, w: c0w, h: Math.round(S1 * 1.04 * 2 + 4 + 76) };
  const cardP = kf(f, [viaje[0], viaje[0] + (viaje[1] - viaje[0]) * 0.65], [0, 1], Easing.inOut);
  const cardOp = kf(f, [viaje[0], viaje[0] + 14], [0, 1]);
  const card: React.CSSProperties = {
    position: "absolute", left: 0, top: 0, boxSizing: "border-box", ...surf, opacity: fade(cardOp), zIndex: 1,
    width: Math.round(mix(c0.w, cardW, cardP)), height: Math.round(mix(c0.h, cardH, e)),
    transform: `translate(${Math.round(mix(c0.x, cx - cardW / 2, cardP))}px, ${Math.round(mix(c0.y, cy - cardH / 2, e))}px)`,
  };

  // píldora "Novedades" -> pieza del muro: viaja hasta un hueco del muro y se vuelve una pieza más (`Chip`), que desde ahí va con el muro (la misma cámara que la apertura)
  const dur = openingFrames(spec);
  const u = (n: number) => (n * dur) / 300;
  const fl = Math.max(0, f - apertura);
  const wo = wallOptions(rs.design);
  const rig = rigApertura(fl, dur, wo.dolly);
  const hueco = C.narrow ? huecoMuro(t, rs, width, height, dur, { x: x0 + PILDORA_W / 2, y: pildoraY + pildoraAlto / 2 }, { w: cardW, h: cardH }) : CHIP_MURO;
  const pj = rigProject(hueco.x, hueco.y, hueco.z, rig, 1400);
  const murO = kf(fl, [u(94), u(126)], [1, 0.05]);
  const centro = { x: mix(x0 + PILDORA_W / 2, cx + (pj?.x ?? 0), ep), y: mix(pildoraY + pildoraAlto / 2, cy + (pj?.y ?? 0), ep) - 50 * Math.sin(ep * Math.PI) };
  const pEsc = mix(1, pj?.s ?? 1, ep);
  const pX = Math.round(centro.x - PILDORA_W / 2), pY = Math.round(centro.y - pildoraAlto / 2);
  const pilOp = kf(f, [apertura - 6, apertura], [1, 0], Easing.linear);
  const chipOp = kf(f, [apertura - 6, apertura], [0, 1], Easing.linear) * (fade(murO) ?? 1);
  const chipFondo = mezcla(t.color.accent, t.color.surface, ep);
  const chipTexto = mezcla(t.color.onAccent, t.color.text, ep);

  return (
    <>
      {f >= muro[0] && veloM > 0 && <div data-qa-veil={veloM.toFixed(3)} data-qa-ignore="covered" style={{ position: "absolute", inset: 0, background: t.color.bg, opacity: fade(veloM), zIndex: Z_VELO, pointerEvents: "none" }}><VeilContent /></div>}
      <div style={{ position: "absolute", inset: 0, zIndex: Z_PUENTE, pointerEvents: "none", ...baseTexto(t) }}>
        {/* `covered` callado: el parche tapa a propósito el cartel de la apertura (quieto debajo del velo, desfasado del título que viaja); desaparece al llegar el título */}
        {angosto && f >= muro[0] && parche > 0 && f < velo[1] && <div data-qa-ignore="covered" style={{ position: "absolute", left: Math.round(cx - cardW / 2), top: Math.round(cy - cardH / 2), width: cardW, height: cardH, background: t.color.bg, borderRadius: surf.borderRadius, boxShadow: `0 0 70px 40px ${t.color.bg}`, opacity: fade(parche) ?? undefined, zIndex: 0 }} />}
        {/* `covered` callado: la tarjeta tapa el cartel de la apertura (quieta en su cuadro 0, debajo del velo) a propósito */}
        {f < velo[1] && !llego && <div data-qa-ignore="covered" style={card} />}
        {f < velo[1] && !llego && (
          <div style={{ position: "absolute", inset: 0, zIndex: 2 }}>
            {/* `overlap` callado: las dos palabras viajan por carriles propios (la segunda por debajo de la primera y sube recién al pasarla) con coordenadas medidas
                con la tipografía de marca; con una tipografía de reserva más ancha (estrés de `qa`) la primera puede rozar a la segunda en el último cuadro del viaje.
                A las 210 la capa pasa al cartel armado por el navegador (arriba), que sí ajusta el ancho real. Cada marca va en el contenedor de su palabra. */}
            <div data-qa-ignore="overlap" style={pieza(x0, l1Top, xFin1, yFin1, ey1)}>{INTRO_TEXTOS.titulo1}</div>
            <div data-qa-ignore="overlap" style={pieza(x0, l2Top, xFin2, yFin2, ey2)}><GradientText>{INTRO_TEXTOS.titulo2}</GradientText></div>
          </div>
        )}
        {f < velo[1] && llego && (
          // el cartel entero, igual que lo arma la apertura (mismo tema, mismas medidas): desde acá el traspaso a la apertura es de píxeles idénticos
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {/* la sombra del cartel que está debajo (la de la apertura) se ve a medida que se levanta el velo: la de esta capa es el complemento, así la suma no se oscurece ni salta al irse */}
            <div style={{ position: "relative" }}>
              <div style={{ position: "absolute", inset: 0, borderRadius: surf.borderRadius, boxShadow: surf.boxShadow, opacity: fade(sombra) }} />
              {/* `overlap` y `covered` callados: este cartel es una copia del de la apertura, que está debajo del velo (se lee uno solo: el de esta capa tapa al otro y este es el que se juzga) */}
              <div data-qa-ignore="overlap covered" style={{ ...cartel, boxShadow: undefined, position: "relative" }}>{INTRO_TEXTOS.titulo1} <GradientText>{INTRO_TEXTOS.titulo2.replace(" ", "\u00a0")}</GradientText></div>
            </div>
          </div>
        )}
        {pilOp > 0 && (
          <div style={{ position: "absolute", left: 0, top: 0, zIndex: 3, transform: `translate(${pX}px, ${pY}px)${Math.abs(pEsc - 1) > 1e-3 ? ` scale(${pEsc.toFixed(4)})` : ""}`, ...(pilOp < 1 ? { opacity: +pilOp.toFixed(3) } : {}) }}>
            <PildoraTinte fondo={chipFondo} texto={chipTexto} borde={ep > 0.02 ? t.color.accent : undefined} size={t.type.caption * 0.94} padding="14px 32px" calla={ep < 1 || pilOp < 1}>{INTRO_TEXTOS.eyebrow}</PildoraTinte>
          </div>
        )}
        {chipOp > 0 && f >= apertura - 6 && pj && (
          // ya es una pieza del muro (adorno, como las demás: mismas marcas que en la apertura), con la cámara y el apagado del muro de la apertura
          <div data-qa-decor="" data-qa-ignore="covered overlap safe-area" style={{ position: "absolute", left: 0, top: 0, transformOrigin: "0 0", zIndex: 3, transform: rigTransform(hueco.x, hueco.y, hueco.z, rig, 1400, cx, cy, " translate(-50%, -50%)"), ...(chipOp < 1 ? { opacity: +chipOp.toFixed(3) } : {}) }}>
            <Chip text={INTRO_TEXTOS.eyebrow} lit={1} pop={0} />
          </div>
        )}
      </div>
    </>
  );
}

// ======================================================================================================================================
// 2. Recapitulación -> cierre
// ======================================================================================================================================

/** Lugar de la píldora "grow2on.com" en el cierre de Grow2on: sale de la disposición del formato (`cierreGeom`; en horizontal { x: 140, y: 668, w: 327, h: 75 }). */
export const PUENTE2 = {
  /** cuadros después del arranque de la recapitulación en que la capa toma las cinco píldoras (ya quietas en el muro) */
  toma: 204,
  /** las cinco viajan al centro: duración y desfase entre una y otra */
  junta: 34,
  desfase: 2,
  /** la píldora rosa viaja a su lugar: cuadros después de la toma (sale rápido y llega suave) */
  viaje: [40, 78] as [number, number],
};
/** Cuadros que el `Cierre` de Grow2on arranca ANTES de su lugar en la línea de tiempo (la recapitulación y el cierre se solapan): el logo, la frase y el aro entran mientras viaja la píldora; la duración total no cambia. */
export const CIERRE_ADELANTO = 44;
/** En vertical y cuadrado el cierre arranca antes (64 cuadros): el velo de la recapitulación se cierra y se levanta antes (`veloRecap`) y el aro, el logo y la frase entran mientras las píldoras todavía se juntan, sin cuadros con solo la píldora. */
export const cierreAdelanto = (width: number, height: number) => (width / height < 1.3 ? 64 : CIERRE_ADELANTO);
/** Velo que lava el muro de la recapitulación: cuadros (después de la toma) en que llega a 1, y en que se va (en horizontal se queda en 1 y se corta en 34). */
const veloRecap = (angosto: boolean) => (angosto ? { llega: 16, sale: 30 } : { llega: 22, sale: 34 });
/** Cuadro local del cierre desde el que la píldora de la URL ya está en su lugar (lo pasa el video al `Cierre`): el cuadro en que termina el viaje. */
export const cierrePildoraDesde = (recapDesde: number, cierreInicio: number) => recapDesde + PUENTE2.toma + PUENTE2.viaje[1] - cierreInicio;

/** Ancho máximo de la píldora del muro de la recapitulación (la misma cuenta que stories/Closing.tsx: ya agrandada por 1,5 ocupa como mucho el 80 % del cuadro). */
const pildoraMuroMax = (t: ReturnType<typeof useTheme>, name: string, width: number): number | undefined => {
  const cap = Math.floor((width * 0.8) / 1.5);
  return pillFit(t, name).w <= cap ? undefined : cap;
};

export function PuenteRecapCierre({ recapDesde }: { recapDesde: number }) {
  const fAbs = useFrame();
  const { width, height } = useVideoConfig();
  const t = useTheme();
  const f = fAbs - recapDesde; // cuadro local de la recapitulación
  const { toma, junta, desfase, viaje } = PUENTE2;
  const llegada = toma + viaje[1];
  if (f < toma || f >= llegada) return null;
  const PILDORA_URL = cierreGeom(t, width, height).pildora;

  const dur = closingFrames(spec);
  const u = (n: number) => (n * dur) / 480;
  const cx = width / 2, cy = height / 2;
  const n = spec.topics.length;
  const { slots } = closingWall(spec, width, height);
  // cámara del muro de la recapitulación (la misma cuenta que stories/Closing.tsx)
  const fly: [number, number] = [u(200), u(254)];
  const pull = u(372);
  const cam = {
    dz: kf(f, [0, fly[0], fly[1] + u(30), pull], [-440, -440, -480, -960], Easing.inOut),
    rx: 0,
    ry: kf(f, [0, pull], [-6, 3]),
  };
  const angosto = width / height < 1.3;
  const vr = veloRecap(angosto);
  const veloO = angosto ? kf(f, [toma, toma + vr.llega], [0, 1], Easing.linear) * kf(f, [toma + vr.llega, toma + vr.sale], [1, 0], Easing.linear) : kf(f, [toma, toma + 22], [0, 1], Easing.linear);

  // el centro donde se juntan y la píldora rosa en que se funden
  const K0 = 1.35; // tamaño de la rosa al fundirse (respecto del final)
  const base = toma + 8; // las cinco se funden sobre las del muro en 8 cuadros (en el mismo lugar) y recién entonces salen
  // la rosa asoma como forma (sin texto) cuando las cinco ya se están apagando, y recién después se lee "grow2on.com": nunca hay texto a medias encimado
  const aparece = base + 4 * desfase + junta * 0.45;
  const rosaOp = kf(f, [aparece, aparece + 10], [0, 1], Easing.linear);
  const rosaTexto = kf(f, [aparece + 10, aparece + 18], [0, 1], Easing.linear);
  const q = kf(f, [toma + viaje[0], toma + viaje[1]], [0, 1], bezier(0.2, 0.75, 0.2, 1)); // salida rápida, llegada suave
  const crece = kf(f, [aparece, aparece + 14], [0.8, 1], Easing.out ?? Easing.inOut);
  const k = mix(K0 * crece, 1, q) + 0.06 * Math.sin(kf(f, [aparece + 6, aparece + 22], [0, 1], Easing.linear) * Math.PI);
  const rw = PILDORA_URL.w * k, rh = PILDORA_URL.h * k;
  const rcx = mix(cx, PILDORA_URL.x + PILDORA_URL.w / 2, q);
  const rcy = mix(cy, PILDORA_URL.y + PILDORA_URL.h / 2, q) - 40 * Math.sin(q * Math.PI);
  // arranca centrada y llega a su lugar exacto (q = 1: k = 1, esquina en el lugar)
  const rosaX = Math.round(q >= 1 ? PILDORA_URL.x : rcx - rw / 2);
  const rosaY = Math.round(q >= 1 ? PILDORA_URL.y : rcy - rh / 2);

  return (
    <>
      {/* el velo lava el muro; se va cuando el muro ya no está (el cierre de Grow2on ya entra debajo y no se tapa) */}
      {veloO > 0 && f < toma + vr.sale && <div data-qa-veil={veloO.toFixed(3)} data-qa-ignore="covered" style={{ position: "absolute", inset: 0, background: t.color.bg, opacity: fade(veloO), zIndex: Z_VELO, pointerEvents: "none" }}><VeilContent /></div>}
      <div style={{ position: "absolute", inset: 0, zIndex: Z_PUENTE, pointerEvents: "none", ...baseTexto(t) }}>
        {slots.slice(0, n).map((s, i) => {
          const e = kf(f, [base + i * desfase, base + i * desfase + junta], [0, 1], Easing.inOut);
          const op = kf(e, [0.1, 0.45], [1, 0], Easing.linear) * kf(f, [toma, base], [0, 1], Easing.linear);
          const w = rigProject(s.x, s.y, 0, cam, 1600)!;
          let transform: string;
          if (e <= 0) {
            // en el muro, exactamente como lo dibuja la recapitulación
            transform = rigTransform(s.x, s.y, 0, cam, 1600, cx, cy, " scale(1.5) translate(-50%, -50%)");
          } else {
            const x = mix(cx + w.x, cx, e), y = mix(cy + w.y, cy, e) - 40 * Math.sin(e * Math.PI);
            const sc = mix(w.s * 1.5, 0.9, e);
            transform = `translate(${Math.round(x)}px, ${Math.round(y)}px) perspective(1600px) rotateY(${mix(cam.ry, 0, e).toFixed(3)}deg) scale(${sc.toFixed(4)}) translate(-50%, -50%)`;
          }
          if (op <= 0) return null;
          // `overlap` y `covered` callados a propósito: las cinco píldoras se juntan en el mismo punto y se funden (el choque ES la transformación); cada marca va en el contenedor de su píldora
          return (
            <div key={i} data-qa-ignore="overlap covered" style={{ position: "absolute", left: 0, top: 0, transformOrigin: "0 0", zIndex: 10 + i, transform, ...(op < 1 ? { opacity: +op.toFixed(3) } : {}) }}>
              <Pill index={i} name={spec.topics[i]!.name} glow={0.3} maxW={pildoraMuroMax(t, spec.topics[i]!.name, width)} />
            </div>
          );
        })}
        {rosaOp > 0 && (
          <div data-qa-ignore="overlap covered" style={{ position: "absolute", left: 0, top: 0, zIndex: 20, transform: `translate(${rosaX}px, ${rosaY}px)`, ...(rosaOp < 1 ? { opacity: +rosaOp.toFixed(3) } : {}) }}>
            <PildoraTinte fondo={t.color.accent} texto={rosaTexto < 1 ? t.color.accent : t.color.onAccent} size={t.type.caption * 1.125 * k} padding={`${16 * k}px ${44 * k}px`} calla={rosaOp < 1 || rosaTexto < 1} textoOp={rosaTexto}>grow2on.com</PildoraTinte>
          </div>
        )}
      </div>
    </>
  );
}
