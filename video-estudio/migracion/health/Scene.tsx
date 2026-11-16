// Health Score, migrada desde video/src/scenes/HealthScore.tsx (Remotion).
// 300 canales caen en siete columnas de estado, se vuelven la dona del tablero, el tablero se arma por capas, cuatro preguntas
// iluminan su respuesta, la cola de atención se ordena por severidad y las transiciones de 30 días muestran canales que salen de
// "en activación". Cifras emuladas, clientes ficticios. 1080 cuadros a 30 fps.
//
// La escena no decide estética: la cámara (inclinación y desenfoque), los garabatos, la viñeta, el titular, el velo, las superficies, los
// radios, los pesos de letra, las entradas y los pasos entre elementos salen del design system (`theme.style`, ver ../theme.ts) por las
// ayudas del toolkit. El tablero es un design system propio (`tableroTheme`, plano y con radios de herramienta) dentro de un `ThemeScope`.
// Los paneles entran en profundidad (`entrance` con `motion.entrance: depth` del tablero, como el translateZ del original); los colores de la interfaz recreada son `theme.data`
// y su letra, `type.ui`. Distinto del original: el mundo no usa `preserve-3d` (el plano se inclina entero).
import React from "react";
import { Easing, random, useFormat, useFrame } from "video-estudio/engine";
import { CountUp, DoodleArrow, DoodleCircle, Eyebrow, Stage, ThemeScope, Vignette, Wash, World, hideFromScale, kf, useCameraAt, zoomThrough } from "video-estudio/kit";
import type { CameraKey } from "video-estudio/kit";
import { fade as op } from "video-estudio/fx/core"; // opacidad solo mientras cambia (en reposo no se emite: residuos que rompen --check)
import { TopicHeadline, useTopic } from "video-estudio/stories";
import { ThemeProvider, contrastRatio, cornerRadius, entrance, parseColor, staggerFrames, surfaceStyle, textStyle, useTheme, withAlpha } from "video-estudio/themes";
import type { Theme } from "video-estudio/themes";
import { tableroTheme, theme as brand } from "../theme";

export const DURACION = 1080;

/** Tablero de vertical y cuadrado: la letra de la interfaz recreada sube de 15/17/22 a 20/22/26 para que, con la cámara a 1,1, se lea a 22 px o más en pantalla. Horizontal usa `tableroTheme` tal cual. */
const tableroAngosto: Theme = { ...tableroTheme, type: { ...tableroTheme.type, ui: { ...tableroTheme.type.ui, xs: 20, sm: 22, md: 26 } } };
const useTablero = (): Theme => (useFormat().format === "horizontal" ? tableroTheme : tableroAngosto);

const OUT = Easing.out;
const bez = (a: number, b: number, c: number, d: number) => Easing.bezier(a, b, c, d);

/** Texto sobre un relleno de datos: el blanco del tablero y, si no llega a 3:1 (amarillo, naranja, verde claro), el fondo oscuro del tema. */
const onFill = (t: ReturnType<typeof useTheme>, bg: string) => (contrastRatio(t.data.strong, bg) >= 3 ? t.data.strong : t.color.bg);

/** Opacidad mínima (desde `from`) con la que `fg` atenuado sobre `bg` sigue llegando a `min`:1. Un texto "apagado" con una opacidad fija (0,40) solo se lee con la paleta para la que se eligió. */
const dimOpacity = (fg: string, bg: string, min = 4.55, from = 0.4) => {
  const f = parseColor(fg), b = parseColor(bg);
  if (!f || !b) return from;
  for (let a = from; a < 1; a += 0.01) {
    const mix = `rgb(${[f.r, f.g, f.b].map((c, i) => Math.round(c * a + [b.r, b.g, b.b][i]! * (1 - a))).join(",")})`;
    if (contrastRatio(mix, bg) >= min) return +a.toFixed(2);
  }
  return 1;
};

// Tamaños de letra de la interfaz recreada: `type.ui` del tema (xs 15, sm 17, md 22) y los escalones de `type`; el número grande de las fichas es del mundo recreado.
const STAT = 58;

// ---------- datos (emulados) ----------
// Colores de los estados: `theme.data.estado*` (declarados en ../theme).
const COLOR_KEY = ["estadoInactivo", "estadoCrecimiento", "estadoMaduro", "estadoActivacion", "estadoCaida", "estadoEstancado", "estadoDetenida"] as const;
const STATES = [
  { key: "inactivo", l: "Inactivo", n: 96 },
  { key: "crec", l: "En crecimiento", n: 64 },
  { key: "maduro", l: "Maduro", n: 52 },
  { key: "activ", l: "En activación", n: 48 },
  { key: "caida", l: "En caída", n: 22 },
  { key: "estanc", l: "Estancado", n: 14 },
  { key: "detenida", l: "Operación detenida", n: 4 },
] as const;
const TOTAL = STATES.reduce((a, s) => a + s.n, 0); // 300
const COL_ORDER = [3, 1, 2, 5, 4, 0, 6]; // activación → crecimiento → maduro → estancado → caída → inactivo → detenida

// ---------- tiempos ----------
const T = {
  rain: [6, 120] as const,
  morph: [148, 200] as const,
  build: 206,
  q: [340, 392, 444, 496] as const,
  qEnd: 556,
  sort: [640, 672] as const,
  trans: [800, 900] as const,
  through: [1044, 1080] as [number, number],
};

// ---------- mundo ----------
// Horizontal: el tablero es ancho (1880 de contenido) y la ventana de transiciones queda a su derecha. Vertical y cuadrado comparten otro mundo:
// el tablero es una columna de 960 de contenido (los paneles se apilan, las fichas pasan de cuatro a cuatro por fila, las siete columnas de la lluvia
// se angostan a cinco puntos de ancho) y la ventana de transiciones, también apilada, queda a su derecha, centrada en la altura del tablero.
// Lo que cambia entre formatos es solo la maquetación y la cámara: los cuadros en que pasa cada cosa son los mismos.
type Lay = {
  v: boolean;
  COLS: { cx: number; base: number; colW: number; gap: number; dot: number; step: number; per: number };
  DONUT: { cx: number; cy: number; r: number; w: number };
  TR: { x: number; y: number; w: number; h: number };
  W: number; // ancho del contenido del tablero
  shell: { w: number; h: number };
  dp: { x: number; y: number; w: number; h: number }; // panel de la dona
  legLeft: number; // izquierda de la leyenda dentro del panel de la dona
  est: { x: number; y: number; w: number; h: number }; // estado consolidado por cliente
  fresc: { x: number; y: number; w: number; h: number };
  cambio: { x: number; y: number; w: number; h: number };
  yCola: number; yFichas: number; fichaW: number; fichaX: (i: number) => number;
  q: { x: number; y: number; w: number; h: number; cols: string };
  yCartera: number; yCart: number; cartW: number; cartX: (i: number) => number;
  srcX0: number; srcY0: number; // grilla de origen de las transiciones, relativa a la ventana
  box: (i: number) => { x: number; y: number }; // caja de destino i, relativa a la ventana
  hoy: { x: number; y: number }; src: { x: number; y: number }; // rótulos "Hoy" y "Hace 30 días"
  arrow: [number, number, number, number]; // flecha de la ventana (relativa a ella)
  // medidas de las transiciones: columnas, paso y mitad de paso de la grilla de origen; tamaño de los puntos de origen y de destino; paso, mitad de paso y tamaño de la grilla de cada caja; rótulo de la caja (desvío y ancho); letra de los rótulos de la ventana
  tr: { srcCols: number; srcPitch: number; srcHalf: number; srcDot: number; dstDot: number; dstPitch: number; dstHalf: number; lblDx: number; lblW: number; font: number };
};
const LAY_H: Lay = {
  v: false,
  COLS: { cx: 960, base: -560, colW: 240, gap: 34, dot: 20, step: 24, per: 10 },
  DONUT: { cx: 230, cy: 420, r: 150, w: 34 },
  TR: { x: 2100, y: 200, w: 1420, h: 880 },
  W: 1880, shell: { w: 1960, h: 1640 },
  dp: { x: 20, y: 180, w: 640, h: 460 }, legLeft: 410,
  est: { x: 680, y: 180, w: 760, h: 460 }, fresc: { x: 1460, y: 180, w: 440, h: 140 }, cambio: { x: 1460, y: 340, w: 440, h: 300 },
  yCola: 672, yFichas: 710, fichaW: 455, fichaX: (i) => 20 + 475 * i,
  q: { x: 20, y: 860, w: 1880, h: 420, cols: "200px 200px 160px 220px 140px 1fr" },
  yCartera: 1300, yCart: 1340, cartW: 930, cartX: (i) => 20 + 950 * i,
  srcX0: 50, srcY0: 160,
  box: (i) => ({ x: 640 + (i % 3) * 250, y: 170 + Math.floor(i / 3) * 330 }),
  hoy: { x: 640, y: 92 }, src: { x: 40, y: 92 }, arrow: [520, 120, 640, 120],
  tr: { srcCols: 12, srcPitch: 40, srcHalf: 20, srcDot: 30, dstDot: 16, dstPitch: 19, dstHalf: 9, lblDx: 0, lblW: 230, font: 22 },
};
const LAY_V: Lay = {
  v: true,
  COLS: { cx: 500, base: -560, colW: 120, gap: 24, dot: 20, step: 24, per: 5 },
  DONUT: { cx: 220, cy: 420, r: 150, w: 34 },
  TR: { x: 1100, y: 680, w: 960, h: 1330 },
  W: 960, shell: { w: 1040, h: 2440 },
  dp: { x: 20, y: 180, w: 960, h: 460 }, legLeft: 520,
  est: { x: 20, y: 660, w: 960, h: 460 }, fresc: { x: 20, y: 1140, w: 470, h: 300 }, cambio: { x: 510, y: 1140, w: 470, h: 300 },
  yCola: 1460, yFichas: 1498, fichaW: 228, fichaX: (i) => 20 + 244 * i,
  q: { x: 20, y: 1658, w: 960, h: 420, cols: "170px 150px 200px 140px 1fr" },
  yCartera: 2098, yCart: 2138, cartW: 472, cartX: (i) => 20 + 488 * i,
  srcX0: 90, srcY0: 110,
  box: (i) => ({ x: 40 + (i % 3) * 300, y: 560 + Math.floor(i / 3) * 400 }),
  hoy: { x: 440, y: 540 }, src: { x: 240, y: 66 }, arrow: [480, 484, 480, 534],
  tr: { srcCols: 15, srcPitch: 52, srcHalf: 26, srcDot: 34, dstDot: 24, dstPitch: 28, dstHalf: 14, lblDx: 20, lblW: 280, font: 26 },
};
const layFor = (format: string): Lay => (format === "horizontal" ? LAY_H : LAY_V);
const useLay = (): Lay => layFor(useFormat().format);
const colX = (L: Lay, i: number) => L.COLS.cx - (7 * L.COLS.colW + 6 * L.COLS.gap) / 2 + i * (L.COLS.colW + L.COLS.gap);

// ---------- cámara (foco x, y y escala; misma tabla que el original) ----------
// Vista general del tablero entero: el foco está más arriba que en el original (780) para que la barra superior y los filtros del tablero (mundo y 0 a 140)
// queden por debajo de la franja del titular (hasta y = 170, docs/guia-escenas.md §13a): el cartel del titular cambia de ancho y de alto con el design system.
const VISTA_Y = 640;
const mk = (k: [number, number, number, number][]): CameraKey[] => k.map(([f, x, y, scale]) => ({ f, x, y, scale }));
const KEYS_H: CameraKey[] = mk([
  [0, 960, -800, 0.95], [140, 960, -800, 0.95],
  [196, LAY_H.DONUT.cx + 100, LAY_H.DONUT.cy, 1.2], [232, 960, VISTA_Y, 0.6], [330, 960, VISTA_Y, 0.6],
  [346, 380, 420, 1.45], [556, 380, 420, 1.45], // las cuatro preguntas
  [584, 960, 1060, 0.95], [632, 960, 1060, 0.95], [652, 620, 1000, 1.45], [720, 620, 1000, 1.45], // cola de atención
  [760, 960, 1060, 0.95], [782, 1900, 700, 0.5], [804, LAY_H.TR.x + LAY_H.TR.w / 2, LAY_H.TR.y + LAY_H.TR.h / 2, 0.98],
  [912, LAY_H.TR.x + LAY_H.TR.w / 2, LAY_H.TR.y + LAY_H.TR.h / 2, 0.98], [930, LAY_H.TR.x + 1040, LAY_H.TR.y + 470, 1.35], [990, LAY_H.TR.x + 1040, LAY_H.TR.y + 470, 1.35],
  [1020, 1760, 780, 0.42], [1044, 1760, 780, 0.42],
]);
// Vertical y cuadrado: el tablero es una columna (x de 0 a 1000); la cámara recorre sus zonas de arriba abajo con la misma tabla de cuadros que el horizontal.
// Con escala mayor que 1,08 el titular se aparta (`hideFromScale`): las vistas acercadas lo ocultan y las generales dejan libre su franja (el tablero empieza bajo ella).
// En el cuadro 1032 la cámara está quieta (claves 1020 a 1044) en la vista general: el tablero entero y la ventana de transiciones, bajo el titular.
const TRV = LAY_V.TR, TRC = { x: TRV.x + TRV.w / 2, y: TRV.y + TRV.h / 2 };
const KEYS_VERT: CameraKey[] = mk([
  [0, 500, -800, 1.0], [140, 500, -800, 1.0],
  [196, 500, 900, 1.1], [232, 500, 760, 1.0], [330, 500, 760, 1.0],
  [346, 500, 900, 1.1], [556, 500, 900, 1.1], // las cuatro preguntas: la dona y su leyenda, de borde a borde
  [584, 500, 1580, 1.1], [632, 500, 1580, 1.1], [652, 500, 1720, 1.1], [720, 500, 1720, 1.1], // cola de atención
  [760, 500, 1580, 1.1], [782, 1040, 1400, 0.55], [804, TRC.x, TRC.y, 1.1],
  [912, TRC.x, TRC.y, 1.1], [930, TRC.x, TRV.y + 800, 1.15], [990, TRC.x, TRV.y + 800, 1.15],
  [1020, 1020, 1020, 0.5], [1044, 1020, 1020, 0.5],
]);
const KEYS_CUAD: CameraKey[] = mk([
  [0, 500, -800, 1.0], [140, 500, -800, 1.0],
  [196, 500, 520, 1.1], [232, 500, 325, 1.0], [330, 500, 325, 1.0],
  [346, 500, 520, 1.1], [556, 500, 520, 1.1],
  [584, 500, 1780, 1.1], [632, 500, 1780, 1.1], [652, 500, 1868, 1.1], [720, 500, 1868, 1.1],
  [760, 500, 1780, 1.1], [782, 1040, 1300, 0.5], [804, TRC.x, TRV.y + 350, 1.0],
  [912, TRC.x, TRV.y + 350, 1.0], [930, TRC.x, TRV.y + 810, 1.0], [990, TRC.x, TRV.y + 810, 1.0],
  [1020, 1020, 941, 0.34], [1044, 1020, 941, 0.34],
]);
const keysFor = (format: string): CameraKey[] => (format === "horizontal" ? KEYS_H : format === "vertical" ? KEYS_VERT : KEYS_CUAD);

/** Cámara: la inclinación por velocidad y el desenfoque del viaje salen del design system (`useCameraAt`); acá solo la composición. */
const useCamera = (f: number) => {
  const L = useLay();
  const c = useCameraAt(f, keysFor(useFormat().format), {
    baseTilt: { rx: 4, ry: -4 }, maxTilt: 9,
    map: (fr, cam) => zoomThrough(fr, T.through, cam, { x: L.DONUT.cx, y: L.DONUT.cy }, 70),
    noBlurFrom: T.through[0],
  });
  // el original sumaba un vaivén lento a la inclinación
  return { ...c, rx: c.rx + Math.sin(f / 50) * 1.2, ry: c.ry + Math.sin(f / 37) * 1.5 };
};

// ---------- puntos: llueven a las columnas y después a la dona ----------
type DotInfo = { st: number; col: number; row: number; slot: number; prow: number; pslot: number; ring: number; land: number };
/** Los 300 puntos y el cuadro en que cae cada uno: el paso entre columnas (8) y entre filas (6) lo escala el design system (`staggerFrames`). */
const dotsFor = (theme: Theme, L: Lay): DotInfo[] => {
  const out: DotInfo[] = [];
  let ring = 0;
  STATES.forEach((s, si) => {
    const col = COL_ORDER.indexOf(si);
    for (let j = 0; j < s.n; j++) {
      const row = Math.floor(j / 10);
      // `row` y `slot` (de a diez) fijan CUÁNDO cae cada punto, igual en los tres formatos; `prow` y `pslot` (de a `per`) fijan DÓNDE cae
      out.push({ st: si, col, row, slot: j % 10, prow: Math.floor(j / L.COLS.per), pslot: j % L.COLS.per, ring: ring++, land: T.rain[0] + staggerFrames(theme, col, { base: 8 }) + staggerFrames(theme, row, { base: 6 }) + random(`l${si}-${j}`) * 14 });
    }
  });
  return out;
};
/** Color de un estado: son datos de la herramienta recreada, no de la marca (con otro design system de fondo siguen siendo los mismos). */
const estado = (i: number) => tableroTheme.data![COLOR_KEY[i]!]!;

const Dots: React.FC<{ f: number }> = ({ f }) => {
  const t = useTheme();
  const L = useLay();
  const { COLS, DONUT } = L;
  if (f > T.morph[1] + 14) return null;
  const DOTS = dotsFor(t, L);
  const fade = kf(f, [T.morph[1] - 4, T.morph[1] + 14], [1, 0]);
  return (
    <>
      {DOTS.map((d, i) => {
        const tx = colX(L, d.col) + d.pslot * COLS.step + COLS.dot / 2;
        const ty = COLS.base - d.prow * COLS.step - COLS.dot / 2;
        const fall = kf(f, [d.land - 18, d.land], [0, 1], bez(0.5, 0, 0.75, 1));
        const bounce = kf(f, [d.land, d.land + 4, d.land + 9], [0, -5, 0]);
        let x = tx, y = ty - (1 - fall) * 700 + bounce;
        const m = kf(f, [T.morph[0] + d.ring * 0.08, T.morph[0] + 28 + d.ring * 0.08], [0, 1], bez(0.45, 0, 0.2, 1));
        if (m > 0) {
          const a = -Math.PI / 2 + ((d.ring + 0.5) / TOTAL) * Math.PI * 2;
          const ex = DONUT.cx + Math.cos(a) * DONUT.r, ey = DONUT.cy + Math.sin(a) * DONUT.r;
          x = x + (ex - x) * m;
          y = y + (ey - y) * m - Math.sin(m * Math.PI) * 220;
        }
        if (fall <= 0) return null;
        // posición dentro del transform (left/top enteros), como pide docs/reglas.md
        return <div key={i} style={{ position: "absolute", left: 0, top: 0, width: COLS.dot, height: COLS.dot, borderRadius: COLS.dot / 2, background: estado(d.st), opacity: op(fade), transform: `translate(${(x - COLS.dot / 2).toFixed(2)}px, ${(y - COLS.dot / 2).toFixed(2)}px)` }} />;
      })}
    </>
  );
};

const ColumnLabels: React.FC<{ f: number }> = ({ f }) => {
  const t = useTheme();
  const L = useLay();
  const { COLS } = L;
  // los rótulos se van antes de que la cámara arranque el viaje a la dona (a 8 cuadros del inicio el último, a la derecha, ya sobresalía del cuadro con tipografías anchas)
  const out = kf(f, [T.morph[0] - 14, T.morph[0] - 2], [1, 0]);
  if (out <= 0) return null;
  const DOTS = dotsFor(t, L);
  return (
    <>
      {COL_ORDER.map((si, ci) => {
        const s = STATES[si]!;
        const rows = Math.ceil(s.n / COLS.per);
        const shown = DOTS.filter((d) => d.st === si && f >= d.land).length;
        const at = T.rain[0] + staggerFrames(t, ci, { base: 8 });
        const a = kf(f, [at, at + 14], [0, 1], OUT) * out;
        return (
          <React.Fragment key={s.key}>
            <div style={{ position: "absolute", left: colX(L, ci), top: COLS.base - rows * COLS.step - 84, width: COLS.colW, textAlign: "center", fontSize: t.type.display.md, fontWeight: t.font.weights.stat, color: estado(si), opacity: op(a) }} data-qa-ignore="contrast">{shown}</div>
            {/* en vertical las siete columnas comparten 1000 de ancho: el rótulo lleva la letra más chica y se parte en dos renglones */}
            <div style={{ position: "absolute", left: L.v ? colX(L, ci) - COLS.gap / 2 : colX(L, ci) - 20, top: COLS.base + 18, width: L.v ? COLS.colW + COLS.gap : COLS.colW + 40, textAlign: "center", lineHeight: L.v ? 1.15 : undefined, opacity: op(a) }}><Eyebrow color={t.color.text} size={L.v ? 22 : undefined}>{s.l}</Eyebrow></div>
          </React.Fragment>
        );
      })}
      <div style={{ position: "absolute", left: COLS.cx - 400, top: COLS.base + (L.v ? 120 : 80), width: 800, textAlign: "center", opacity: op(kf(f, [T.rain[1] - 20, T.rain[1]], [0, 1]) * out) }}>
        <Eyebrow size={28} weight="regular">{TOTAL} canales · un punto por canal</Eyebrow>
      </div>
    </>
  );
};

// ---------- el tablero ----------
const Panel: React.FC<{ x: number; y: number; w: number; h: number; title?: string; titleOpacity?: number; titleSize?: number; f: number; at: number; qa?: string; children?: React.ReactNode; style?: React.CSSProperties }> = ({ x, y, w, h, title, titleOpacity = 1, titleSize, f, at, qa, children, style }) => {
  const t = useTheme();
  const { v } = useLay();
  const a = kf(f, [at, at + 18], [0, 1], OUT);
  return (
    <div data-qa-ignore={qa} style={{ position: "absolute", left: x, top: y, width: w, height: h, ...surfaceStyle(t, "panel"), overflow: "hidden", ...entrance(t, a, 0, { depth: 160 }), ...style }}>
      {title && <div style={{ padding: "12px 16px 0", fontSize: titleSize ?? (v ? t.type.ui.xs : t.type.ui.sm), lineHeight: v ? 1.2 : undefined, ...textStyle(t, "title"), color: t.color.text, opacity: op(titleOpacity) }}>{title}</div>}
      {children}
    </div>
  );
};

const Stat: React.FC<{ x: number; y: number; w: number; label: string; n: number; bg: string; f: number; at: number; numColor?: string; glow?: number; qa?: string }> = ({ x, y, w, label, n, bg, f, at, numColor, glow = 0, qa }) => {
  const t = useTheme();
  const { v } = useLay(); // angosto: el título puede ocupar dos renglones, el número baja
  return (
    <Panel x={x} y={y} w={w} h={140} f={f} at={at} qa={qa} title={label} style={{ boxShadow: glow ? `0 0 0 ${glow * 5}px ${withAlpha(t.data.foco!, 0.67)}` : undefined }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: v ? 62 : 46, bottom: 0, background: bg, display: "flex", alignItems: "center", justifyContent: "center", lineHeight: v ? 1 : undefined, fontSize: STAT, fontWeight: t.font.weights.stat, color: numColor ?? t.data.strong }}>
        <CountUp to={n} start={at + 6} duration={28} />
      </div>
    </Panel>
  );
};

const arc = (cx: number, cy: number, r: number, a0: number, a1: number) => {
  const p = (a: number) => `${cx + Math.cos(a) * r},${cy + Math.sin(a) * r}`;
  return `M${p(a0)} A${r},${r} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${p(a1)}`;
};

const QUESTIONS = [
  { q: "¿Quién está creciendo?", a: "Oportunidad comercial", sts: [1] },
  { q: "¿Quién está maduro?", a: "Base a proteger", sts: [2] },
  { q: "¿Quién está estancado?", a: "Entender el techo", sts: [5] },
  { q: "¿Quién está en caída o inactivo?", a: "Contacto prioritario", sts: [4, 0] },
];
const activeQ = (f: number) => {
  for (let i = QUESTIONS.length - 1; i >= 0; i--) if (f >= T.q[i]! && f < (i === QUESTIONS.length - 1 ? T.qEnd : T.q[i + 1]!)) return i;
  return -1;
};

/** Opacidad de la píldora de pregunta y avance de la de respuesta en el cuadro `f` (las usan las píldoras y el texto que dejan debajo). */
const qState = (f: number) => {
  const qi = activeQ(f);
  if (qi < 0) return { qi, a: 0, ans: 0 };
  const start = T.q[qi]!;
  const end = qi === QUESTIONS.length - 1 ? T.qEnd : T.q[qi + 1]!;
  return { qi, a: kf(f, [start, start + 10, end - 6, end], [0, 1, 1, 0]), ans: kf(f, [start + 14, start + 26], [0, 1], OUT) };
};

// Geometría fija de la tabla "Estado consolidado" (encabezado y filas de alto fijo): la respuesta tapa filas según su altura, y esas filas se apagan debajo de ella.
const TABLA = { top: 180 + 52, headH: 27, rowH: 47 }; // alto total con el borde de 1 px (encabezado: 18 + 8 de relleno + 1; fila: 46 + 1)
const PILL_H = 56; // cota del alto de la píldora de respuesta (relleno 10 + 10 y una línea de 22 px)
/** Cuánto se apaga el texto de la primera columna de la fila `i` (-1 = encabezado) bajo la píldora de respuesta. */
const underAnswer = (f: number, i: number, v = false) => {
  const { qi, a, ans } = qState(f);
  if (qi < 0 || v) return 1; // en vertical la respuesta queda sobre el panel de la dona, no sobre la tabla
  const firstRow = STATES.findIndex((_, k) => QUESTIONS[qi]!.sts.includes(k));
  const pillTop = 180 + 70 + firstRow * 36 + 18 - 24;
  const top = i < 0 ? TABLA.top : TABLA.top + TABLA.headH + i * TABLA.rowH;
  const h = i < 0 ? TABLA.headH : TABLA.rowH;
  const hit = top < pillTop + PILL_H + 4 && top + h > pillTop - 4;
  return hit ? 1 - Math.min(1, ans * a * 2) : 1;
};

const DonutPanel: React.FC<{ f: number }> = ({ f }) => {
  const t = useTheme();
  const L = useLay();
  const { DONUT, dp } = L;
  const draw = kf(f, [T.morph[1] - 10, T.morph[1] + 16], [0, 1], OUT);
  const qi = activeQ(f);
  const focus = qi >= 0 ? QUESTIONS[qi]!.sts : [];
  let acc = 0;
  const dim = dimOpacity(t.color.text, t.color.surface); // las filas que no son la pregunta se apagan sin bajar de 4,5:1 (texto)
  return (
    <Panel x={dp.x} y={dp.y} w={dp.w} h={dp.h} f={f} at={T.build - 30} title="Distribución de estados (por canal)" titleOpacity={1 - Math.min(1, qState(f).a * 2)}>
      <svg style={{ position: "absolute", left: 0, top: 0 }} width={dp.w} height={dp.h}>
        {STATES.map((s, si) => {
          const a0 = -Math.PI / 2 + (acc / TOTAL) * Math.PI * 2;
          acc += s.n;
          const a1 = -Math.PI / 2 + (acc / TOTAL) * Math.PI * 2;
          const hot = focus.includes(si);
          const pop = hot ? kf(f, [T.q[qi]!, T.q[qi]! + 10], [0, 1], OUT) : 0;
          const mid = (a0 + a1) / 2;
          const dx = Math.cos(mid) * 14 * pop, dy = Math.sin(mid) * 14 * pop;
          const end = a0 + (a1 - a0) * draw;
          if (end - a0 < 0.001) return null;
          return <path key={s.key} d={arc(DONUT.cx - 20 + dx, DONUT.cy - 180 + dy, DONUT.r, a0 + 0.01, end - 0.01)} fill="none" stroke={t.data[COLOR_KEY[si]!]} strokeWidth={DONUT.w + pop * 10} opacity={focus.length && !hot ? 0.25 : undefined} />;
        })}
        <text x={DONUT.cx - 20} y={DONUT.cy - 180 + 14} textAnchor="middle" fontSize={t.type.display.sm} fontWeight={t.font.weights.stat} fill={t.data.strong} style={{ color: t.data.strong }} fontFamily={t.font.family}>
          {Math.round(kf(f, [T.morph[1], T.morph[1] + 24], [0, TOTAL]))}
        </text>
        <text x={DONUT.cx - 20} y={DONUT.cy - 180 + 42} textAnchor="middle" fontSize={t.type.ui.sm} fill={t.color.textMuted} style={{ color: t.color.textMuted }} fontFamily={t.font.family}>canales</text>
      </svg>
      <div style={{ position: "absolute", left: L.legLeft, top: 70, width: L.v ? 400 : 216, fontSize: L.v ? t.type.ui.sm : t.type.ui.xs }}>
        {STATES.map((s, si) => {
          const hot = focus.includes(si);
          return (
            <div key={s.key} style={{ display: "flex", alignItems: "center", gap: 8, height: 36, padding: "0 8px", borderRadius: cornerRadius(t, "control"), color: t.color.text, background: hot ? withAlpha(t.data[COLOR_KEY[si]!], 0.2) : undefined, opacity: focus.length && !hot ? dim : undefined }}>
              <span style={{ width: 14, height: 4, borderRadius: cornerRadius(t, "bar"), background: t.data[COLOR_KEY[si]!] }} />
              <span style={{ flex: 1 }}>{s.l}</span>
              <span style={{ color: t.data.strong, ...textStyle(t, "label", { strong: true }) }}>{s.n}</span>
            </div>
          );
        })}
      </div>
    </Panel>
  );
};

/** Preguntas y respuestas: píldoras de la marca sobre el tablero oscuro (fuera del ThemeScope oscuro). */
const Questions: React.FC<{ f: number }> = ({ f }) => {
  const t = useTheme();
  const L = useLay();
  const qi = activeQ(f);
  if (qi < 0) return null;
  const Q = QUESTIONS[qi]!;
  const start = T.q[qi]!;
  const end = qi === QUESTIONS.length - 1 ? T.qEnd : T.q[qi + 1]!;
  const { a, ans } = qState(f);
  const firstRow = STATES.findIndex((_, i) => Q.sts.includes(i));
  const rowY = 180 + 70 + firstRow * 36 + 18;
  // la pregunta y la respuesta son píldoras de la marca (superficie y radio de chip del design system) que entran por `entrance`
  return (
    <>
      <div style={{ position: "absolute", left: 60, top: 196, padding: "10px 20px", ...surfaceStyle(t, "card", { corner: "chip", level: "lg" }), color: t.color.text, fontSize: t.type.ui.md, ...textStyle(t, "label", { strong: true }), ...entrance(t, a, 0, { native: "rise", distance: -16 }), whiteSpace: "nowrap", lineHeight: 1.2 }}>
        {Q.q}
      </div>
      {/* horizontal: la respuesta queda a la derecha del panel de la dona; vertical: a la izquierda de la leyenda, pegada a ella (contenedor de ancho fijo que la alinea a la derecha) */}
      {(() => {
        const pill: React.CSSProperties = { padding: "10px 22px", ...surfaceStyle(t, "chip", { on: false, level: "sm" }), border: "none", background: t.gradient.brand, color: t.color.onAccent, fontSize: t.type.ui.md, ...textStyle(t, "label", { strong: true }), ...entrance(t, ans * a, 0, { native: "scale", from: 0.8 }), whiteSpace: "nowrap", lineHeight: 1.2 };
        return L.v ? (
          // vertical: la respuesta va en la misma fila que la pregunta, pegada al borde derecho del panel de la dona (la leyenda es ancha y la dona ocupa la izquierda)
          <div style={{ position: "absolute", left: L.dp.x, top: 196, width: L.dp.w - 24, display: "flex", justifyContent: "flex-end" }}>
            <div style={pill}>{Q.a}</div>
          </div>
        ) : (
          <div style={{ position: "absolute", left: 680, top: rowY - 24, ...pill }}>{Q.a}</div>
        );
      })()}
      {Q.sts.map((si) => (
        <DoodleCircle key={si} start={start + 8} end={end - 6} cx={L.dp.x + L.legLeft + (L.v ? 200 : 108)} cy={180 + 70 + si * 36 + 18} rx={L.v ? 214 : 128} ry={28} id={`dq${qi}-${si}`} />
      ))}
    </>
  );
};

const CLIENTS = [
  { c: "Tienda 31", canal: "MercadoLibre", sev: 2, t: "Caída severa", p0: 12, base: 140 },
  { c: "Tienda 08", canal: "TiendaNube", sev: 0, t: "Caída", p0: 48, base: 76 },
  { c: "Tienda 22", canal: "WooCommerce", sev: 3, t: "Caída severa", p0: 3, base: 95 },
  { c: "Tienda 15", canal: "MercadoLibre", sev: 1, t: "Caída", p0: 61, base: 110 },
  { c: "Tienda 44", canal: "Shopify", sev: 2, t: "Caída severa", p0: 9, base: 58 },
  { c: "Tienda 03", canal: "PrestaShop", sev: 0, t: "Caída", p0: 40, base: 62 },
];
const SEV = [
  { l: "Baja", c: "sev0" },
  { l: "Media", c: "sev1" },
  { l: "Alta", c: "sev2" },
  { l: "Crítica", c: "sev3" },
] as const;

const QueueTable: React.FC<{ f: number }> = ({ f }) => {
  const t = useTheme();
  const L = useLay();
  const sorted = [...CLIENTS].sort((a, b) => b.sev - a.sev || a.p0 - b.p0);
  const p = kf(f, [T.sort[0], T.sort[1]], [0, 1], bez(0.5, 0, 0.2, 1));
  const cols = L.q.cols;
  const rowH = 52;
  return (
    <Panel x={L.q.x} y={L.q.y} w={L.q.w} h={L.q.h} f={f} at={T.build + 30} title="En caída — contacto prioritario">
      <div style={{ position: "absolute", left: 16, right: 16, top: 50, display: "grid", gridTemplateColumns: cols, fontSize: t.type.ui.xs, whiteSpace: L.v ? "nowrap" : undefined, color: t.color.textMuted, paddingBottom: 8, borderBottom: `1px solid ${t.color.border}` }}>
        {(L.v ? ["Cliente", "Severidad", "Tendencia", "Pedidos P0", "Base mensual"] : ["Cliente", "Canal", "Severidad", "Tendencia", "Pedidos P0", "Base mensual pedidos"]).map((h) => (
          <span key={h}>{h}</span>
        ))}
      </div>
      {CLIENTS.map((r, i) => {
        const j = sorted.indexOf(r);
        const y = Math.round(90 + (i + (j - i) * p) * rowH);
        const lift = Math.sin(p * Math.PI) * (j < i ? 1 : 0);
        return (
          <div key={r.c} style={{ position: "absolute", left: 16, right: 16, top: y, height: rowH, display: "grid", gridTemplateColumns: cols, alignItems: "center", fontSize: L.v ? t.type.ui.xs : t.type.ui.sm, whiteSpace: L.v ? "nowrap" : undefined, color: t.color.text, borderBottom: `1px solid ${t.color.border}`, background: lift > 0.05 ? t.color.surfaceAlt : undefined, boxShadow: lift > 0.05 ? t.shadow.md : undefined, zIndex: lift > 0.05 ? 2 : 1 }}>
            <span>{r.c}</span>
            {!L.v && <span>{r.canal}</span>}
            <span style={{ height: rowH, display: "flex", alignItems: "center", paddingLeft: 12, background: t.data[SEV[r.sev]!.c], color: onFill(t, t.data[SEV[r.sev]!.c]), ...textStyle(t, "label", { strong: true }) }}>{SEV[r.sev]!.l}</span>
            <span style={{ paddingLeft: 14, color: r.t === "Caída severa" ? t.color.danger : t.data.naranja }}>{r.t}</span>
            <span>{r.p0}</span>
            <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {r.base}
              <span style={{ flex: 1, maxWidth: 260, height: 6, borderRadius: cornerRadius(t, "bar"), background: t.data.riel }}>
                <span style={{ display: "block", height: 6, borderRadius: cornerRadius(t, "bar"), width: `${(r.p0 / r.base) * 100}%`, background: t.color.danger }} />
              </span>
            </span>
          </div>
        );
      })}
    </Panel>
  );
};

const FILAS_CLIENTE: [string, number, number][] = [["Tienda 12", 3, 1], ["Tienda 27", 2, 2], ["Tienda 05", 1, 3], ["Tienda 31", 2, 4], ["Tienda 40", 4, 1], ["Tienda 19", 1, 0], ["Tienda 33", 2, 2]];
const FILTROS = [["Base de datos", "Prod"], ["Cliente", "Todos"], ["Meses de base", "2"], ["Fecha de referencia", "Hoy"]];
/** Vertical y cuadrado: con la letra más grande la fila de filtros no entra en 960; los rótulos se acortan. */
const FILTRO_CORTO: Record<string, string> = { "Base de datos": "Base", "Meses de base": "Meses", "Fecha de referencia": "Fecha" };

const Dashboard: React.FC<{ f: number }> = ({ f }) => {
  const t = useTheme();
  const L = useLay();
  const shell = kf(f, [T.build - 40, T.build - 10], [0, 1], OUT);
  const b = T.build;
  const qi = activeQ(f);
  const hotStat = (sts: number[]) => (qi >= 0 && QUESTIONS[qi]!.sts.some((s) => sts.includes(s)) ? kf(f, [T.q[qi]! + 6, T.q[qi]! + 14], [0, 1]) : 0);
  return (
    <>
      <div style={{ position: "absolute", left: -20, top: 0, width: L.shell.w, height: L.shell.h, ...surfaceStyle(t, "window"), background: t.color.bg, border: "none", opacity: op(shell), boxShadow: t.shadow.lg }} />
      <div data-qa-ignore="covered contrast min-size" style={{ position: "absolute", left: 20, top: 20, width: L.W, height: 50, display: "flex", alignItems: "center", gap: 16, color: t.color.text, fontSize: t.type.ui.sm, opacity: op(shell) }}>
        <span style={{ width: 26, height: 26, borderRadius: cornerRadius(t, "control"), background: `linear-gradient(135deg, ${t.data.logoA}, ${t.data.logoB})` }} />
        <span style={{ color: t.color.textMuted }}>Paneles de control ›</span> Health Score
        <span style={{ marginLeft: "auto", padding: "6px 14px", border: `1px solid ${t.color.border}`, borderRadius: cornerRadius(t, "control") }}>Exportar</span>
        <span style={{ padding: "6px 14px", borderRadius: cornerRadius(t, "control"), background: t.data.azulBoton, color: t.data.strong }}>Compartir</span>
      </div>
      <div style={{ position: "absolute", left: 20, top: 82, display: "flex", gap: 12, opacity: op(kf(f, [b - 20, b], [0, 1])) }}>
        {FILTROS.map(([l, v]) => (
          <span key={l} style={{ display: "flex", border: `1px solid ${t.color.border}`, borderRadius: cornerRadius(t, "control"), fontSize: L.v ? t.type.ui.sm : t.type.ui.xs, overflow: "hidden", whiteSpace: "nowrap" }}>
            <span style={{ padding: "8px 12px", background: t.color.surfaceAlt, color: t.color.text }}>{L.v ? FILTRO_CORTO[l!] ?? l : l}</span>
            <span style={{ padding: "8px 14px", color: t.data.strong }}>{v} ⌄</span>
          </span>
        ))}
      </div>
      <div style={{ position: "absolute", left: 24, top: 140, whiteSpace: "nowrap", fontSize: t.type.ui.md, color: t.data.strong, ...textStyle(t, "title"), opacity: op(shell) }}>⌄ Vista general</div>
      <DonutPanel f={f} />
      <Panel x={L.est.x} y={L.est.y} w={L.est.w} h={L.est.h} f={f} at={b} qa="min-size" title="Estado consolidado por cliente">
        <div style={{ position: "absolute", left: 16, right: 16, top: 52, fontSize: t.type.ui.xs }}>
          <div style={{ display: "grid", gridTemplateColumns: L.v ? "1fr 110px 250px" : "1fr 90px 150px", height: L.v ? 28 : 18, color: t.color.textMuted, paddingBottom: 8, borderBottom: `1px solid ${t.color.border}` }}>
            <span style={{ opacity: op(underAnswer(f, -1, L.v)) }}>Cliente</span>
            <span>Canales</span>
            <span>Estado consolidado</span>
          </div>
          {FILAS_CLIENTE.map(([c, n, s], i) => (
            <div key={c} style={{ display: "grid", gridTemplateColumns: L.v ? "1fr 110px 250px" : "1fr 90px 150px", alignItems: "center", height: 46, borderBottom: `1px solid ${t.color.border}`, color: t.color.text }}>
              <span style={{ opacity: op(underAnswer(f, i, L.v)) }}>{c}</span>
              <span>{n}</span>
              <span style={{ height: 46, display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 10, background: t.data[COLOR_KEY[s]!], color: onFill(t, t.data[COLOR_KEY[s]!]) }}>{STATES[s]!.l}</span>
            </div>
          ))}
        </div>
      </Panel>
      <Panel x={L.fresc.x} y={L.fresc.y} w={L.fresc.w} h={L.fresc.h} f={f} at={b + 8} qa="min-size" title="Frescura de los datos">
        <div style={{ position: "absolute", left: 0, right: 0, top: 46, bottom: 0, background: t.data.fichaFresco, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, color: t.data.strong, fontSize: t.type.ui.md }}>
          Último pedido: hoy <b style={{ fontSize: t.type.body * 0.9 }}>0</b> días
        </div>
      </Panel>
      <Panel x={L.cambio.x} y={L.cambio.y} w={L.cambio.w} h={L.cambio.h} f={f} at={b + 14} qa="min-size" title="Canales que cambiaron de estado en 30 días">
        <div style={{ position: "absolute", left: 0, right: 0, top: 60, textAlign: "center", fontSize: t.type.h1, fontWeight: t.font.weights.stat, color: t.data.strong }}>
          <CountUp to={86} start={b + 20} duration={30} />
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 200, textAlign: "center", fontSize: t.type.ui.sm, color: t.color.textMuted }}>de {TOTAL} canales</div>
      </Panel>
      <div style={{ position: "absolute", left: 24, top: L.yCola, whiteSpace: "nowrap", fontSize: t.type.ui.md, color: t.data.strong, ...textStyle(t, "title"), opacity: op(kf(f, [b + 10, b + 26], [0, 1])) }}>⌄ Cola de atención</div>
      <Stat x={L.fichaX(0)} y={L.yFichas} w={L.fichaW} label="Inactivos" n={96} bg={t.data.fichaInactivos} f={f} at={b + 18} glow={hotStat([0])} />
      <Stat x={L.fichaX(1)} y={L.yFichas} w={L.fichaW} label="Operación detenida" n={4} bg={t.data.fichaDetenida} f={f} at={b + 22} />
      <Stat x={L.fichaX(2)} y={L.yFichas} w={L.fichaW} label="En caída" n={22} bg={t.data.fichaCaida} f={f} at={b + 26} glow={hotStat([4])} />
      <Stat x={L.fichaX(3)} y={L.yFichas} w={L.fichaW} label="Severidad alta" n={71} bg={t.color.surface} numColor={t.color.danger} f={f} at={b + 30} qa="min-size" />
      <QueueTable f={f} />
      <div style={{ position: "absolute", left: 24, top: L.yCartera, whiteSpace: "nowrap", fontSize: t.type.ui.md, color: t.data.strong, ...textStyle(t, "title"), opacity: op(kf(f, [b + 40, b + 56], [0, 1])) }}>⌄ Cartera sana</div>
      <Stat x={L.cartX(0)} y={L.yCart} w={L.cartW} label="Maduros" n={52} bg={t.data.fichaMaduros} f={f} at={b + 44} glow={hotStat([2])} />
      <Stat x={L.cartX(1)} y={L.yCart} w={L.cartW} label="En crecimiento" n={64} bg={t.data.fichaCrecimiento} f={f} at={b + 48} glow={hotStat([1])} qa="min-size" />
    </>
  );
};

// ---------- hace 30 días → hoy ----------
const DEST = [
  { l: "En crecimiento", n: 34, c: "estadoCrecimiento" },
  { l: "Maduro", n: 22, c: "estadoMaduro" },
  { l: "Sigue en activación", n: 36, c: "estadoActivacion" },
  { l: "Estancado", n: 6, c: "estadoEstancado" },
  { l: "En caída", n: 14, c: "estadoCaida" },
  { l: "Inactivo", n: 8, c: "estadoInactivo" },
] as const;
const Transitions: React.FC<{ f: number }> = ({ f }) => {
  const t = useTheme();
  const L = useLay();
  const { TR } = L;
  const a = kf(f, [T.trans[0] - 30, T.trans[0] - 6], [0, 1], OUT);
  if (a <= 0) return null;
  const box = (i: number) => ({ x: TR.x + L.box(i).x, y: TR.y + L.box(i).y });
  const dots: { d: number; idx: number }[] = [];
  DEST.forEach((d, di) => {
    for (let j = 0; j < d.n; j++) dots.push({ d: di, idx: j });
  });
  return (
    <>
      <div style={{ position: "absolute", left: TR.x, top: TR.y, width: TR.w, height: TR.h, ...surfaceStyle(t, "window"), opacity: op(a), boxShadow: t.shadow.lg }}>
        <div style={{ padding: "22px 30px 0", fontSize: t.type.ui.md, color: t.color.text, ...textStyle(t, "title") }}>Transiciones de estado: hace 30 días → hoy</div>
        <div style={{ position: "absolute", left: L.src.x, top: L.src.y, fontSize: L.tr.font, color: t.color.textMuted }}>Hace 30 días · En activación</div>
        <div data-qa-ignore={L.v ? "min-size contrast" : undefined /* vertical y cuadrado: en la vista general final (escala 0,4) el rótulo de la ventana es detalle, se lee al acercar */} style={{ position: "absolute", left: L.hoy.x, top: L.hoy.y, fontSize: L.tr.font, color: t.color.textMuted }}>Hoy</div>
      </div>
      {DEST.map((d, i) => {
        const b = box(i);
        const n = dots.filter((q, qi) => q.d === i && f >= T.trans[0] + qi * 0.6 + 26).length;
        return (
          <div key={d.l} style={{ position: "absolute", left: b.x + L.tr.lblDx, top: b.y + 210, width: L.tr.lblW, textAlign: "center", opacity: op(a) }}>
            <div data-qa-ignore="contrast" style={{ fontSize: t.type.body * 0.9, fontWeight: t.font.weights.stat, color: t.data[d.c] }}>{n}</div>
            <div style={{ fontSize: L.v ? t.type.ui.md : 18, color: t.color.text }}>{d.l}</div>
          </div>
        );
      })}
      {dots.map((q, qi) => {
        const sx = TR.x + L.srcX0 + (qi % L.tr.srcCols) * L.tr.srcPitch + L.tr.srcHalf, sy = TR.y + L.srcY0 + Math.floor(qi / L.tr.srcCols) * L.tr.srcPitch + L.tr.srcHalf;
        const b = box(q.d);
        const tx = b.x + 20 + (q.idx % 10) * L.tr.dstPitch + L.tr.dstHalf, ty = b.y + 200 - Math.floor(q.idx / 10) * L.tr.dstPitch - L.tr.dstHalf;
        const p = kf(f, [T.trans[0] + qi * 0.6, T.trans[0] + qi * 0.6 + 26], [0, 1], bez(0.45, 0, 0.2, 1));
        const x = sx + (tx - sx) * p, y = sy + (ty - sy) * p - Math.sin(p * Math.PI) * 120;
        const size = L.tr.srcDot - p * (L.tr.srcDot - L.tr.dstDot);
        const c = p > 0.5 ? t.data[DEST[q.d]!.c] : t.data.estadoActivacion;
        return <div key={qi} style={{ position: "absolute", left: 0, top: 0, width: size, height: size, borderRadius: size, background: c, opacity: op(a), transform: `translate(${(x - size / 2).toFixed(2)}px, ${(y - size / 2).toFixed(2)}px)` }} />;
      })}
    </>
  );
};

export function SceneBody() {
  const f = useFrame();
  const { width, height } = useFormat();
  const L = useLay();
  const { TR } = L;
  const topic = useTopic({ name: "Health Score", line: "a quién contactar primero", index: 3 });
  const cam = useCamera(f);
  const tab = useTablero();
  const zoomIn = Math.max(0, Math.min(1, (cam.scale - 1.05) / 0.4));
  return (
    <>
      <World camera={cam} width={width} height={height} perspective={2400}>
        <ThemeScope theme={tab}>
          {/* el tablero es un mundo más grande que el cuadro y la cámara lo recorre: sus bordes quedan cortados a propósito */}
          <div data-qa-ignore="offscreen">
            <Dashboard f={f} />
          </div>
        </ThemeScope>
        <Questions f={f} />
        <ColumnLabels f={f} />
        <Dots f={f} />
        <ThemeScope theme={tab}>
          <div data-qa-ignore="offscreen">
            <Transitions f={f} />
          </div>
        </ThemeScope>
        <DoodleCircle start={T.sort[1] + 4} end={760} cx={L.q.x + 16 + (L.v ? 160 : 100)} cy={L.q.y + 90 + 26} rx={L.v ? 176 : 120} ry={L.v ? 36 : 32} id="dc-first" />
        <DoodleArrow start={T.trans[0] + 10} end={1000} x1={TR.x + L.arrow[0]} y1={TR.y + L.arrow[1]} x2={TR.x + L.arrow[2]} y2={TR.y + L.arrow[3]} bend={-0.4} id="da-trans" />
      </World>
      {/* la viñeta del original es del color del texto (tinta) y de intensidad 0,28: ambos son del design system (`decor.vignetteColor`, `decor.vignette`) */}
      <Vignette amount={zoomIn * (1 - kf(f, [T.through[0], T.through[0] + 10], [0, 1]))} />
      {/* disposición, tamaño y entrada del titular: los de la historia (o, con la escena sola, los del design system) */}
      <TopicHeadline title={topic.name} number={topic.index + 1} subtitle={topic.line} start={-18} hide={hideFromScale(cam.scale, 1, 0.08)} />
      <Wash range={[T.through[1] - 14, T.through[1]]} />
    </>
  );
}

/** Escena sola (fuera de la historia): tema de marca y las nubes del original (desenfoque 56). */
export const SceneVideo: React.FC = () => (
  <ThemeProvider theme={brand}>
    <Stage>
      <SceneBody />
    </Stage>
  </ThemeProvider>
);
