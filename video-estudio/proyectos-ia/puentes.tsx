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
// Solo horizontal (1920 x 1080), como la intro y el cierre de Grow2on.
import React from "react";
import { Easing, FrameProvider, useFrame, useVideoConfig } from "video-estudio/engine";
import { VeilContent, kf } from "video-estudio/kit";
import { bezier } from "video-estudio/engine";
import { fade } from "video-estudio/fx/core";
import { GradientText } from "video-estudio/kit";
import { StoryBackdropProvider } from "video-estudio/stories";
import { Chip, Opening, Pill, closingFrames, fitText, openingFrames, useStorySpec, withoutLate } from "video-estudio/stories";
import { wallOptions } from "video-estudio/stories/types";
import { closingWall, rigProject, rigTransform } from "video-estudio/stories/layout";
import { surfaceStyle, textStyle, useTheme } from "video-estudio/themes";
import { spec } from "./historia/spec";
import { Particulas } from "../g2o/Particulas";

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
/** Ancho (px) del texto "Proyectos con IA" y de "Proyectos " (con su espacio) con la letra del cartel de la apertura (1920 x 1080); se verifican contra el cuadro real. */
const TXT = { total: 852, hasta2: 536 };
const PILDORA_W = 227;
/** Lugar de "Novedades" en el muro de la apertura (coordenadas del muro, como las de `openingWall`): un hueco entre piezas, a la izquierda; arriba a 190, 385 al empezar. */
const CHIP_MURO = { x: -935, y: -212, z: -50 };

/**
 * La apertura quieta en su cuadro 0, montada antes de que empiece (desde que se levanta el velo): así el muro y las nubes empiezan a aparecer mientras el título
 * todavía viaja. En el cuadro en que empieza la apertura de verdad (cuadro local 0) la copia se va y el cuadro es el mismo.
 */
export function AperturaTemprana() {
  const f = useFrame();
  const config = useVideoConfig();
  const rs = useStorySpec(spec);
  if (f < PUENTE1.velo[0] || f >= PUENTE1.apertura) return null;
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
  const { toma, viaje, apertura, velo } = PUENTE1;
  if (f < toma || f > apertura + 78) return null;

  // --- inicio: lo que dibuja la intro (mismo cálculo que g2o/Intro.tsx) ---
  const S1 = Math.round(t.type.hero * 0.93);
  const pildoraAlto = t.type.caption * 0.94 * 1.2 + 28;
  const l1Top = 360 + pildoraAlto + 36;
  const l2Top = l1Top + S1 * 1.04 + 4;
  // --- fin: el cartel de la apertura (mismo cálculo que stories/Opening.tsx) ---
  const titleW = Math.min(1560, width - 2 * t.safe.x);
  const tf = fitText(spec.title.text, titleW, t.type.hero, { min: t.type.hero * 0.5, lines: 2, avg: 0.55 });
  const S2 = tf.size;
  const tt = textStyle(t, "title", { tracking: -0.03 });
  const padX = Math.round(S2 * 0.55), padY = Math.round(S2 * 0.3);
  const cardW = TXT.total + 2 * padX, cardH = Math.round(S2 * 1.08) + 2 * padY;
  const surf = surfaceStyle(t, "title", { titleCard: "solid" });
  const cartel: React.CSSProperties = {
    maxWidth: Math.min(1700, width - t.safe.x), boxSizing: "border-box", padding: `${padY}px ${padX}px`, ...surf, textAlign: "center",
    fontSize: S2, fontFamily: tt.fontFamily, fontWeight: tt.fontWeight, color: t.color.text, letterSpacing: tt.letterSpacing, lineHeight: 1.08,
  };
  const cx = width / 2, cy = height / 2;
  const e = kf(f, viaje, [0, 1], Easing.inOut);
  const llego = f >= viaje[1];
  const veloO = kf(f, velo, [1, 0], Easing.linear);
  // piezas del título: de dos renglones a la izquierda a un renglón centrado
  const xFin1 = cx - TXT.total / 2, xFin2 = xFin1 + TXT.hasta2;
  const yFin = cy - (S2 * 1.08) / 2;
  const lsFin = parseFloat(String(tt.letterSpacing ?? "0")); // em (el cartel de la apertura suma el tracking del tema)
  // El recorrido: primero cada palabra se corre hacia su lugar en horizontal (la segunda por debajo de la primera, sin pisarla) y recién después la
  // segunda sube a la línea de la primera; así nunca se encima un texto con otro.
  const ex = kf(f, [viaje[0], viaje[0] + (viaje[1] - viaje[0]) * 0.65], [0, 1], Easing.inOut);
  const ey1 = e;
  const ey2 = kf(f, [viaje[0] + (viaje[1] - viaje[0]) * 0.35, viaje[1]], [0, 1], Easing.inOut);
  const pieza = (x0: number, y0: number, xf: number, ey: number): React.CSSProperties => ({
    position: "absolute", left: 0, top: 0, whiteSpace: "nowrap", fontSize: mix(S1, S2, e), lineHeight: mix(1.04, 1.08, e),
    fontWeight: t.font.weights.semibold, letterSpacing: `${mix(-0.03, lsFin, e).toFixed(4)}em`, transform: `translate(${Math.round(mix(x0, xf, ex))}px, ${Math.round(mix(y0, yFin, ey))}px)`,
  });

  // tarjeta: crece detrás del título desde su caja inicial hasta la del cartel (acompaña a las palabras: llega a su tamaño cuando ellas llegan a su lugar en horizontal)
  const c0 = { x: 140 - 40, y: l1Top - 30, w: 540, h: Math.round(S1 * 1.04 * 2 + 4 + 76) };
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
  const rig = {
    dz: kf(fl, [0, u(130)], [0, 240 + wo.dolly], Easing.linear) + kf(fl, [u(94), u(126) + u(20)], [0, -900]),
    rx: kf(fl, [0, u(130)], [7, -3], Easing.linear),
    ry: kf(fl, [0, u(130)], [-11, 6], Easing.linear),
  };
  const pj = rigProject(CHIP_MURO.x, CHIP_MURO.y, CHIP_MURO.z, rig, 1400);
  const murO = kf(fl, [u(94), u(126)], [1, 0.05]);
  const centro = { x: mix(140 + PILDORA_W / 2, cx + (pj?.x ?? 0), e), y: mix(360 + pildoraAlto / 2, cy + (pj?.y ?? 0), e) - 50 * Math.sin(e * Math.PI) };
  const pEsc = mix(1, pj?.s ?? 1, e);
  const pX = Math.round(centro.x - PILDORA_W / 2), pY = Math.round(centro.y - pildoraAlto / 2);
  const pilOp = kf(f, [apertura - 6, apertura], [1, 0], Easing.linear);
  const chipOp = kf(f, [apertura - 6, apertura], [0, 1], Easing.linear) * (fade(murO) ?? 1);
  const chipFondo = mezcla(t.color.accent, t.color.surface, e);
  const chipTexto = mezcla(t.color.onAccent, t.color.text, e);

  return (
    <>
      {f >= velo[0] && veloO > 0 && <div data-qa-veil={veloO.toFixed(3)} data-qa-ignore="covered" style={{ position: "absolute", inset: 0, background: t.color.bg, opacity: fade(veloO), zIndex: Z_VELO, pointerEvents: "none" }}><VeilContent /></div>}
      <div style={{ position: "absolute", inset: 0, zIndex: Z_PUENTE, pointerEvents: "none", ...baseTexto(t) }}>
        {/* `covered` callado: la tarjeta tapa el cartel de la apertura (quieta en su cuadro 0, debajo del velo) a propósito */}
        {f < velo[1] && !llego && <div data-qa-ignore="covered" style={card} />}
        {f < velo[1] && !llego && (
          <div style={{ position: "absolute", inset: 0, zIndex: 2 }}>
            {/* `overlap` callado: las dos palabras viajan por carriles propios (la segunda por debajo de la primera y sube recién al pasarla) con coordenadas medidas
                con la tipografía de marca; con una tipografía de reserva más ancha (estrés de `qa`) la primera puede rozar a la segunda en el último cuadro del viaje.
                A las 210 la capa pasa al cartel armado por el navegador (arriba), que sí ajusta el ancho real. Cada marca va en el contenedor de su palabra. */}
            <div data-qa-ignore="overlap" style={pieza(140, l1Top, xFin1, ey1)}>Proyectos</div>
            <div data-qa-ignore="overlap" style={pieza(140, l2Top, xFin2, ey2)}><GradientText>con IA</GradientText></div>
          </div>
        )}
        {f < velo[1] && llego && (
          // el cartel entero, igual que lo arma la apertura (mismo tema, mismas medidas): desde acá el traspaso a la apertura es de píxeles idénticos
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {/* la sombra del cartel que está debajo (la de la apertura) se ve a medida que se levanta el velo: la de esta capa es el complemento, así la suma no se oscurece ni salta al irse */}
            <div style={{ position: "relative" }}>
              <div style={{ position: "absolute", inset: 0, borderRadius: surf.borderRadius, boxShadow: surf.boxShadow, opacity: fade(veloO) }} />
              {/* `overlap` y `covered` callados: este cartel es una copia del de la apertura, que está debajo del velo (se lee uno solo: el de esta capa tapa al otro y este es el que se juzga) */}
              <div data-qa-ignore="overlap covered" style={{ ...cartel, boxShadow: undefined, position: "relative" }}>Proyectos <GradientText>con IA</GradientText></div>
            </div>
          </div>
        )}
        {pilOp > 0 && (
          <div style={{ position: "absolute", left: 0, top: 0, zIndex: 3, transform: `translate(${pX}px, ${pY}px)${Math.abs(pEsc - 1) > 1e-3 ? ` scale(${pEsc.toFixed(4)})` : ""}`, ...(pilOp < 1 ? { opacity: +pilOp.toFixed(3) } : {}) }}>
            <PildoraTinte fondo={chipFondo} texto={chipTexto} borde={e > 0.02 ? t.color.accent : undefined} size={t.type.caption * 0.94} padding="14px 32px" calla={e < 1 || pilOp < 1}>Novedades</PildoraTinte>
          </div>
        )}
        {chipOp > 0 && f >= apertura - 6 && pj && (
          // ya es una pieza del muro (adorno, como las demás: mismas marcas que en la apertura), con la cámara y el apagado del muro de la apertura
          <div data-qa-decor="" data-qa-ignore="covered overlap safe-area" style={{ position: "absolute", left: 0, top: 0, transformOrigin: "0 0", zIndex: 3, transform: rigTransform(CHIP_MURO.x, CHIP_MURO.y, CHIP_MURO.z, rig, 1400, cx, cy, " translate(-50%, -50%)"), ...(chipOp < 1 ? { opacity: +chipOp.toFixed(3) } : {}) }}>
            <Chip text="Novedades" lit={1} pop={0} />
          </div>
        )}
      </div>
    </>
  );
}

// ======================================================================================================================================
// 2. Recapitulación -> cierre
// ======================================================================================================================================

/** Lugar de la píldora "grow2on.com" en el cierre de Grow2on (1920 x 1080) y su tamaño (se verifica contra el cuadro real). */
const PILDORA_URL = { x: 140, y: 668, w: 327, h: 75 };
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
/** Cuadro local del cierre desde el que la píldora de la URL ya está en su lugar (lo pasa el video al `Cierre`): el cuadro en que termina el viaje. */
export const cierrePildoraDesde = (recapDesde: number, cierreInicio: number) => recapDesde + PUENTE2.toma + PUENTE2.viaje[1] - cierreInicio;

export function PuenteRecapCierre({ recapDesde }: { recapDesde: number }) {
  const fAbs = useFrame();
  const { width, height } = useVideoConfig();
  const t = useTheme();
  const f = fAbs - recapDesde; // cuadro local de la recapitulación
  const { toma, junta, desfase, viaje } = PUENTE2;
  const llegada = toma + viaje[1];
  if (f < toma || f >= llegada) return null;

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
  const veloO = kf(f, [toma, toma + 22], [0, 1], Easing.linear);

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
      {veloO > 0 && f < toma + 34 && <div data-qa-veil={veloO.toFixed(3)} data-qa-ignore="covered" style={{ position: "absolute", inset: 0, background: t.color.bg, opacity: fade(veloO), zIndex: Z_VELO, pointerEvents: "none" }}><VeilContent /></div>}
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
              <Pill index={i} name={spec.topics[i]!.name} glow={0.3} />
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
