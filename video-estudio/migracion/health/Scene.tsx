// Health Score, migrada desde video/src/scenes/HealthScore.tsx (Remotion).
// 300 canales caen en siete columnas de estado, se vuelven la dona del tablero, el tablero se arma por capas, cuatro preguntas
// iluminan su respuesta, la cola de atención se ordena por severidad y las transiciones de 30 días muestran canales que salen de
// "en activación". Cifras emuladas, clientes ficticios. 1080 cuadros a 30 fps.
//
// Con el toolkit nuevo: cámara, garabatos, viñeta, titular, velo y contador salen del kit; los paneles entran en profundidad con `flyInZ`
// (como el translateZ del original); los colores del tablero son `theme.data` y la letra de la interfaz, `type.ui`.
// Distinto del original: el mundo no usa `preserve-3d` (el plano se inclina entero).
import React from "react";
import { Easing, random, useFormat, useFrame } from "video-estudio/engine";
import { CountUp, DoodleArrow, DoodleCircle, DockedHeadline, Stage, ThemeScope, Vignette, Wash, World, cameraAt, flyInZ, hideFromScale, kf, zoomThrough } from "video-estudio/kit";
import type { CameraKey } from "video-estudio/kit";
import { fade as op } from "video-estudio/fx/core"; // opacidad solo mientras cambia (en reposo no se emite: residuos que rompen --check)
import { useTopic } from "video-estudio/stories";
import { ThemeProvider, contrastRatio, useTheme, withAlpha } from "video-estudio/themes";
import { tableroTheme, theme as brand } from "../theme";

export const DURACION = 1080;

const OUT = Easing.out;
const bez = (a: number, b: number, c: number, d: number) => Easing.bezier(a, b, c, d);

/** Texto sobre un relleno de datos: el blanco del tablero y, si no llega a 3:1 (amarillo, naranja, verde claro), el fondo oscuro del tema. */
const onFill = (t: ReturnType<typeof useTheme>, bg: string) => (contrastRatio(t.data.strong, bg) >= 3 ? t.data.strong : t.color.bg);

// Tamaños de letra de la interfaz recreada: `type.ui` del tema (xs 15, sm 17, md 22); el número grande de las fichas es del mundo recreado.
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
const COLS = { cx: 960, base: -560, colW: 240, gap: 34, dot: 20, step: 24 };
const colX = (i: number) => COLS.cx - (7 * COLS.colW + 6 * COLS.gap) / 2 + i * (COLS.colW + COLS.gap);
const DONUT = { cx: 230, cy: 420, r: 150, w: 34 };
const TR = { x: 2100, y: 200, w: 1420, h: 880 };

// ---------- cámara (foco x, y y escala; misma tabla que el original) ----------
const KEYS: CameraKey[] = ([
  [0, 960, -800, 0.95], [140, 960, -800, 0.95],
  [196, DONUT.cx + 100, DONUT.cy, 1.2], [232, 960, 780, 0.6], [330, 960, 780, 0.6],
  [346, 380, 420, 1.45], [556, 380, 420, 1.45], // las cuatro preguntas
  [584, 960, 1060, 0.95], [632, 960, 1060, 0.95], [652, 620, 1000, 1.45], [720, 620, 1000, 1.45], // cola de atención
  [760, 960, 1060, 0.95], [782, 1900, 700, 0.5], [804, TR.x + TR.w / 2, TR.y + TR.h / 2, 0.98],
  [912, TR.x + TR.w / 2, TR.y + TR.h / 2, 0.98], [930, TR.x + 1040, TR.y + 470, 1.35], [990, TR.x + 1040, TR.y + 470, 1.35],
  [1020, 1760, 780, 0.42], [1044, 1760, 780, 0.42],
] as [number, number, number, number][]).map(([f, x, y, scale]) => ({ f, x, y, scale }));

const camera = (f: number) => {
  const c = cameraAt(f, KEYS, {
    baseTilt: { rx: 4, ry: -4 }, tiltGain: 0.055, maxTilt: 9,
    map: (fr, cam) => zoomThrough(fr, T.through, cam, { x: DONUT.cx, y: DONUT.cy }, 70),
    noBlurFrom: T.through[0],
  });
  // el original sumaba un vaivén lento a la inclinación
  return { ...c, rx: c.rx + Math.sin(f / 50) * 1.2, ry: c.ry + Math.sin(f / 37) * 1.5 };
};

// ---------- puntos: llueven a las columnas y después a la dona ----------
type DotInfo = { st: number; col: number; row: number; slot: number; ring: number; land: number };
const DOTS: DotInfo[] = (() => {
  const out: DotInfo[] = [];
  let ring = 0;
  STATES.forEach((s, si) => {
    const col = COL_ORDER.indexOf(si);
    for (let j = 0; j < s.n; j++) {
      out.push({ st: si, col, row: Math.floor(j / 10), slot: j % 10, ring: ring++, land: T.rain[0] + col * 8 + Math.floor(j / 10) * 6 + random(`l${si}-${j}`) * 14 });
    }
  });
  return out;
})();

const Dots: React.FC<{ f: number }> = ({ f }) => {
  const t = useTheme();
  if (f > T.morph[1] + 14) return null;
  const fade = kf(f, [T.morph[1] - 4, T.morph[1] + 14], [1, 0]);
  return (
    <>
      {DOTS.map((d, i) => {
        const tx = colX(d.col) + d.slot * COLS.step + COLS.dot / 2;
        const ty = COLS.base - d.row * COLS.step - COLS.dot / 2;
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
        return <div key={i} style={{ position: "absolute", left: 0, top: 0, width: COLS.dot, height: COLS.dot, borderRadius: COLS.dot / 2, background: t.data[COLOR_KEY[d.st]!], opacity: op(fade), transform: `translate(${(x - COLS.dot / 2).toFixed(2)}px, ${(y - COLS.dot / 2).toFixed(2)}px)` }} />;
      })}
    </>
  );
};

const ColumnLabels: React.FC<{ f: number }> = ({ f }) => {
  const t = useTheme();
  const out = kf(f, [T.morph[0] - 6, T.morph[0] + 10], [1, 0]);
  if (out <= 0) return null;
  return (
    <>
      {COL_ORDER.map((si, ci) => {
        const s = STATES[si]!;
        const rows = Math.ceil(s.n / 10);
        const shown = DOTS.filter((d) => d.st === si && f >= d.land).length;
        const a = kf(f, [T.rain[0] + ci * 8, T.rain[0] + ci * 8 + 14], [0, 1], OUT) * out;
        return (
          <React.Fragment key={s.key}>
            <div style={{ position: "absolute", left: colX(ci), top: COLS.base - rows * COLS.step - 84, width: COLS.colW, textAlign: "center", fontSize: 56, fontWeight: t.font.weights.stat, color: t.data[COLOR_KEY[si]!], opacity: op(a) }} data-qa-ignore="contrast">{shown}</div>
            <div style={{ position: "absolute", left: colX(ci) - 20, top: COLS.base + 18, width: COLS.colW + 40, textAlign: "center", fontSize: t.type.eyebrow, fontWeight: t.font.weights.medium, color: t.color.text, opacity: op(a) }}>{s.l}</div>
          </React.Fragment>
        );
      })}
      <div style={{ position: "absolute", left: COLS.cx - 400, top: COLS.base + 80, width: 800, textAlign: "center", fontSize: 28, color: t.color.textMuted, opacity: op(kf(f, [T.rain[1] - 20, T.rain[1]], [0, 1]) * out) }}>
        {TOTAL} canales · un punto por canal
      </div>
    </>
  );
};

// ---------- el tablero ----------
const Panel: React.FC<{ x: number; y: number; w: number; h: number; title?: string; f: number; at: number; qa?: string; children?: React.ReactNode; style?: React.CSSProperties }> = ({ x, y, w, h, title, f, at, qa, children, style }) => {
  const t = useTheme();
  const a = kf(f, [at, at + 18], [0, 1], OUT);
  return (
    <div data-qa-ignore={qa} style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: 6, background: t.color.surface, border: `1px solid ${t.color.border}`, overflow: "hidden", ...flyInZ(a, { from: 160, perspective: 2400 }), ...style }}>
      {title && <div style={{ padding: "12px 16px 0", fontSize: t.type.ui.sm, fontWeight: t.font.weights.medium, color: t.color.text }}>{title}</div>}
      {children}
    </div>
  );
};

const Stat: React.FC<{ x: number; y: number; w: number; label: string; n: number; bg: string; f: number; at: number; numColor?: string; glow?: number; qa?: string }> = ({ x, y, w, label, n, bg, f, at, numColor, glow = 0, qa }) => {
  const t = useTheme();
  return (
    <Panel x={x} y={y} w={w} h={140} f={f} at={at} qa={qa} title={label} style={{ boxShadow: glow ? `0 0 0 ${glow * 5}px ${withAlpha(brand.color.accent, 0.67)}` : undefined }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 46, bottom: 0, background: bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: STAT, fontWeight: t.font.weights.stat, color: numColor ?? t.data.strong }}>
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

const DonutPanel: React.FC<{ f: number }> = ({ f }) => {
  const t = useTheme();
  const draw = kf(f, [T.morph[1] - 10, T.morph[1] + 16], [0, 1], OUT);
  const qi = activeQ(f);
  const focus = qi >= 0 ? QUESTIONS[qi]!.sts : [];
  let acc = 0;
  return (
    <Panel x={20} y={180} w={640} h={460} f={f} at={T.build - 30} title="Distribución de estados (por canal)">
      <svg style={{ position: "absolute", left: 0, top: 0 }} width={640} height={460}>
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
        <text x={DONUT.cx - 20} y={DONUT.cy - 180 + 14} textAnchor="middle" fontSize={48} fontWeight={700} fill={t.data.strong} style={{ color: t.data.strong }} fontFamily={t.font.family}>
          {Math.round(kf(f, [T.morph[1], T.morph[1] + 24], [0, TOTAL]))}
        </text>
        <text x={DONUT.cx - 20} y={DONUT.cy - 180 + 42} textAnchor="middle" fontSize={t.type.ui.sm} fill={t.color.textMuted} style={{ color: t.color.textMuted }} fontFamily={t.font.family}>canales</text>
      </svg>
      <div style={{ position: "absolute", left: 410, top: 70, width: 216, fontSize: t.type.ui.xs }}>
        {STATES.map((s, si) => {
          const hot = focus.includes(si);
          return (
            <div key={s.key} style={{ display: "flex", alignItems: "center", gap: 8, height: 36, padding: "0 8px", borderRadius: 4, color: t.color.text, background: hot ? withAlpha(t.data[COLOR_KEY[si]!], 0.2) : undefined, opacity: focus.length && !hot ? 0.4 : undefined }}>
              <span style={{ width: 14, height: 4, borderRadius: 2, background: t.data[COLOR_KEY[si]!] }} />
              <span style={{ flex: 1 }}>{s.l}</span>
              <span style={{ color: t.data.strong, fontWeight: t.font.weights.semibold }}>{s.n}</span>
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
  const qi = activeQ(f);
  if (qi < 0) return null;
  const Q = QUESTIONS[qi]!;
  const start = T.q[qi]!;
  const end = qi === QUESTIONS.length - 1 ? T.qEnd : T.q[qi + 1]!;
  const a = kf(f, [start, start + 10, end - 6, end], [0, 1, 1, 0]);
  const ans = kf(f, [start + 14, start + 26], [0, 1], OUT);
  const firstRow = STATES.findIndex((_, i) => Q.sts.includes(i));
  const rowY = 180 + 70 + firstRow * 36 + 18;
  return (
    <>
      <div style={{ position: "absolute", left: 60, top: 196, padding: "10px 20px", borderRadius: t.radius.pill, background: t.color.surface, color: t.color.text, fontSize: t.type.ui.md, fontWeight: t.font.weights.semibold, opacity: op(a), transform: `translateY(${Math.round((1 - a) * -16)}px)`, boxShadow: t.shadow.lg, whiteSpace: "nowrap" }}>
        {Q.q}
      </div>
      <div style={{ position: "absolute", left: 680, top: rowY - 24, padding: "10px 22px", borderRadius: t.radius.pill, background: t.gradient.brand, color: t.color.onAccent, fontSize: t.type.ui.md, fontWeight: t.font.weights.semibold, opacity: op(ans * a), transform: `scale(${(0.8 + ans * 0.2).toFixed(4)})`, whiteSpace: "nowrap" }}>
        {Q.a}
      </div>
      {Q.sts.map((si) => (
        <DoodleCircle key={si} start={start + 8} end={end - 6} cx={20 + 410 + 108} cy={180 + 70 + si * 36 + 18} rx={128} ry={28} id={`dq${qi}-${si}`} />
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
  const sorted = [...CLIENTS].sort((a, b) => b.sev - a.sev || a.p0 - b.p0);
  const p = kf(f, [T.sort[0], T.sort[1]], [0, 1], bez(0.5, 0, 0.2, 1));
  const cols = "200px 200px 160px 220px 140px 1fr";
  const rowH = 52;
  return (
    <Panel x={20} y={860} w={1880} h={420} f={f} at={T.build + 30} title="En caída — contacto prioritario">
      <div style={{ position: "absolute", left: 16, right: 16, top: 50, display: "grid", gridTemplateColumns: cols, fontSize: t.type.ui.xs, color: t.color.textMuted, paddingBottom: 8, borderBottom: `1px solid ${t.color.border}` }}>
        {["Cliente", "Canal", "Severidad", "Tendencia", "Pedidos P0", "Base mensual pedidos"].map((h) => (
          <span key={h}>{h}</span>
        ))}
      </div>
      {CLIENTS.map((r, i) => {
        const j = sorted.indexOf(r);
        const y = Math.round(90 + (i + (j - i) * p) * rowH);
        const lift = Math.sin(p * Math.PI) * (j < i ? 1 : 0);
        return (
          <div key={r.c} style={{ position: "absolute", left: 16, right: 16, top: y, height: rowH, display: "grid", gridTemplateColumns: cols, alignItems: "center", fontSize: t.type.ui.sm, color: t.color.text, borderBottom: `1px solid ${t.color.border}`, background: lift > 0.05 ? t.color.surfaceAlt : undefined, boxShadow: lift > 0.05 ? `0 ${Math.round(10 * lift)}px 20px -8px ${withAlpha(t.color.bg, 0.9)}` : undefined, zIndex: lift > 0.05 ? 2 : 1 }}>
            <span>{r.c}</span>
            <span>{r.canal}</span>
            <span style={{ height: rowH, display: "flex", alignItems: "center", paddingLeft: 12, background: t.data[SEV[r.sev]!.c], color: onFill(t, t.data[SEV[r.sev]!.c]), fontWeight: t.font.weights.semibold }}>{SEV[r.sev]!.l}</span>
            <span style={{ paddingLeft: 14, color: r.t === "Caída severa" ? t.color.danger : t.data.naranja }}>{r.t}</span>
            <span>{r.p0}</span>
            <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {r.base}
              <span style={{ flex: 1, maxWidth: 260, height: 6, borderRadius: 3, background: t.data.riel }}>
                <span style={{ display: "block", height: 6, borderRadius: 3, width: `${(r.p0 / r.base) * 100}%`, background: t.color.danger }} />
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

const Dashboard: React.FC<{ f: number }> = ({ f }) => {
  const t = useTheme();
  const shell = kf(f, [T.build - 40, T.build - 10], [0, 1], OUT);
  const b = T.build;
  const qi = activeQ(f);
  const hotStat = (sts: number[]) => (qi >= 0 && QUESTIONS[qi]!.sts.some((s) => sts.includes(s)) ? kf(f, [T.q[qi]! + 6, T.q[qi]! + 14], [0, 1]) : 0);
  return (
    <>
      <div style={{ position: "absolute", left: -20, top: 0, width: 1960, height: 1640, borderRadius: 20, background: t.color.bg, opacity: op(shell), boxShadow: `0 50px 100px -30px ${withAlpha(t.color.bg, 0.9)}` }} />
      <div data-qa-ignore="covered contrast min-size" style={{ position: "absolute", left: 20, top: 20, width: 1880, height: 50, display: "flex", alignItems: "center", gap: 16, color: t.color.text, fontSize: t.type.ui.sm, opacity: op(shell) }}>
        <span style={{ width: 26, height: 26, borderRadius: 7, background: `linear-gradient(135deg, ${t.data.logoA}, ${t.data.logoB})` }} />
        <span style={{ color: t.color.textMuted }}>Paneles de control ›</span> Health Score
        <span style={{ marginLeft: "auto", padding: "6px 14px", border: `1px solid ${t.color.border}`, borderRadius: 4 }}>Exportar</span>
        <span style={{ padding: "6px 14px", borderRadius: 4, background: t.data.azulBoton, color: t.data.strong }}>Compartir</span>
      </div>
      <div style={{ position: "absolute", left: 20, top: 82, display: "flex", gap: 12, opacity: op(kf(f, [b - 20, b], [0, 1])) }}>
        {FILTROS.map(([l, v]) => (
          <span key={l} style={{ display: "flex", border: `1px solid ${t.color.border}`, borderRadius: 4, fontSize: t.type.ui.xs, overflow: "hidden", whiteSpace: "nowrap" }}>
            <span style={{ padding: "8px 12px", background: t.color.surfaceAlt, color: t.color.text }}>{l}</span>
            <span style={{ padding: "8px 14px", color: t.data.strong }}>{v} ⌄</span>
          </span>
        ))}
      </div>
      <div style={{ position: "absolute", left: 24, top: 140, whiteSpace: "nowrap", fontSize: t.type.ui.md, color: t.data.strong, fontWeight: t.font.weights.medium, opacity: op(shell) }}>⌄ Vista general</div>
      <DonutPanel f={f} />
      <Panel x={680} y={180} w={760} h={460} f={f} at={b} qa="min-size" title="Estado consolidado por cliente">
        <div style={{ position: "absolute", left: 16, right: 16, top: 52, fontSize: t.type.ui.xs }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 90px 150px", color: t.color.textMuted, paddingBottom: 8, borderBottom: `1px solid ${t.color.border}` }}>
            <span>Cliente</span>
            <span>Canales</span>
            <span>Estado consolidado</span>
          </div>
          {FILAS_CLIENTE.map(([c, n, s]) => (
            <div key={c} style={{ display: "grid", gridTemplateColumns: "1fr 90px 150px", alignItems: "center", height: 46, borderBottom: `1px solid ${t.color.border}`, color: t.color.text }}>
              <span>{c}</span>
              <span>{n}</span>
              <span style={{ height: 46, display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 10, background: t.data[COLOR_KEY[s]!], color: onFill(t, t.data[COLOR_KEY[s]!]) }}>{STATES[s]!.l}</span>
            </div>
          ))}
        </div>
      </Panel>
      <Panel x={1460} y={180} w={440} h={140} f={f} at={b + 8} qa="min-size" title="Frescura de los datos">
        <div style={{ position: "absolute", left: 0, right: 0, top: 46, bottom: 0, background: t.data.fichaFresco, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, color: t.data.strong, fontSize: t.type.ui.md }}>
          Último pedido: hoy <b style={{ fontSize: 40 }}>0</b> días
        </div>
      </Panel>
      <Panel x={1460} y={340} w={440} h={300} f={f} at={b + 14} qa="min-size" title="Canales que cambiaron de estado en 30 días">
        <div style={{ position: "absolute", left: 0, right: 0, top: 60, textAlign: "center", fontSize: 96, fontWeight: t.font.weights.stat, color: t.data.strong }}>
          <CountUp to={86} start={b + 20} duration={30} />
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 200, textAlign: "center", fontSize: t.type.ui.sm, color: t.color.textMuted }}>de {TOTAL} canales</div>
      </Panel>
      <div style={{ position: "absolute", left: 24, top: 672, whiteSpace: "nowrap", fontSize: t.type.ui.md, color: t.data.strong, fontWeight: t.font.weights.medium, opacity: op(kf(f, [b + 10, b + 26], [0, 1])) }}>⌄ Cola de atención</div>
      <Stat x={20} y={710} w={455} label="Inactivos" n={96} bg={t.data.fichaInactivos} f={f} at={b + 18} glow={hotStat([0])} />
      <Stat x={495} y={710} w={455} label="Operación detenida" n={4} bg={t.data.fichaDetenida} f={f} at={b + 22} />
      <Stat x={970} y={710} w={455} label="En caída" n={22} bg={t.data.fichaCaida} f={f} at={b + 26} glow={hotStat([4])} />
      <Stat x={1445} y={710} w={455} label="Severidad alta" n={71} bg={t.color.surface} numColor={t.color.danger} f={f} at={b + 30} qa="min-size" />
      <QueueTable f={f} />
      <div style={{ position: "absolute", left: 24, top: 1300, whiteSpace: "nowrap", fontSize: t.type.ui.md, color: t.data.strong, fontWeight: t.font.weights.medium, opacity: op(kf(f, [b + 40, b + 56], [0, 1])) }}>⌄ Cartera sana</div>
      <Stat x={20} y={1340} w={930} label="Maduros" n={52} bg={t.data.fichaMaduros} f={f} at={b + 44} glow={hotStat([2])} />
      <Stat x={970} y={1340} w={930} label="En crecimiento" n={64} bg={t.data.fichaCrecimiento} f={f} at={b + 48} glow={hotStat([1])} qa="min-size" />
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
  const a = kf(f, [T.trans[0] - 30, T.trans[0] - 6], [0, 1], OUT);
  if (a <= 0) return null;
  const box = (i: number) => ({ x: TR.x + 640 + (i % 3) * 250, y: TR.y + 170 + Math.floor(i / 3) * 330 });
  const dots: { d: number; idx: number }[] = [];
  DEST.forEach((d, di) => {
    for (let j = 0; j < d.n; j++) dots.push({ d: di, idx: j });
  });
  return (
    <>
      <div style={{ position: "absolute", left: TR.x, top: TR.y, width: TR.w, height: TR.h, borderRadius: 18, background: t.color.surface, border: `1px solid ${t.color.border}`, opacity: op(a), boxShadow: `0 50px 100px -30px ${withAlpha(t.color.bg, 0.9)}` }}>
        <div style={{ padding: "22px 30px 0", fontSize: t.type.ui.md, color: t.color.text, fontWeight: t.font.weights.medium }}>Transiciones de estado: hace 30 días → hoy</div>
        <div style={{ position: "absolute", left: 40, top: 92, fontSize: 22, color: t.color.textMuted }}>Hace 30 días · En activación</div>
        <div style={{ position: "absolute", left: 640, top: 92, fontSize: 22, color: t.color.textMuted }}>Hoy</div>
      </div>
      {DEST.map((d, i) => {
        const b = box(i);
        const n = dots.filter((q, qi) => q.d === i && f >= T.trans[0] + qi * 0.6 + 26).length;
        return (
          <div key={d.l} style={{ position: "absolute", left: b.x, top: b.y + 210, width: 230, textAlign: "center", opacity: op(a) }}>
            <div data-qa-ignore="contrast" style={{ fontSize: 40, fontWeight: t.font.weights.stat, color: t.data[d.c] }}>{n}</div>
            <div style={{ fontSize: 18, color: t.color.text }}>{d.l}</div>
          </div>
        );
      })}
      {dots.map((q, qi) => {
        const sx = TR.x + 50 + (qi % 12) * 40 + 20, sy = TR.y + 160 + Math.floor(qi / 12) * 40 + 20;
        const b = box(q.d);
        const tx = b.x + 20 + (q.idx % 10) * 19 + 9, ty = b.y + 200 - Math.floor(q.idx / 10) * 19 - 9;
        const p = kf(f, [T.trans[0] + qi * 0.6, T.trans[0] + qi * 0.6 + 26], [0, 1], bez(0.45, 0, 0.2, 1));
        const x = sx + (tx - sx) * p, y = sy + (ty - sy) * p - Math.sin(p * Math.PI) * 120;
        const size = 30 - p * 14;
        const c = p > 0.5 ? t.data[DEST[q.d]!.c] : t.data.estadoActivacion;
        return <div key={qi} style={{ position: "absolute", left: 0, top: 0, width: size, height: size, borderRadius: size, background: c, opacity: op(a), transform: `translate(${(x - size / 2).toFixed(2)}px, ${(y - size / 2).toFixed(2)}px)` }} />;
      })}
    </>
  );
};

export function SceneBody() {
  const f = useFrame();
  const { width, height } = useFormat();
  const topic = useTopic({ name: "Health Score", line: "a quién contactar primero", index: 3 });
  const cam = camera(f);
  const zoomIn = Math.max(0, Math.min(1, (cam.scale - 1.05) / 0.4));
  return (
    <>
      <World camera={cam} width={width} height={height} perspective={2400}>
        <ThemeScope theme={tableroTheme}>
          {/* el tablero es un mundo más grande que el cuadro y la cámara lo recorre: sus bordes quedan cortados a propósito */}
          <div data-qa-ignore="offscreen">
            <Dashboard f={f} />
          </div>
        </ThemeScope>
        <Questions f={f} />
        <ColumnLabels f={f} />
        <Dots f={f} />
        <ThemeScope theme={tableroTheme}>
          <div data-qa-ignore="offscreen">
            <Transitions f={f} />
          </div>
        </ThemeScope>
        <DoodleCircle start={T.sort[1] + 4} end={760} cx={20 + 16 + 100} cy={860 + 90 + 26} rx={120} ry={32} id="dc-first" />
        <DoodleArrow start={T.trans[0] + 10} end={1000} x1={TR.x + 520} y1={TR.y + 120} x2={TR.x + 640} y2={TR.y + 120} bend={-0.4} id="da-trans" />
      </World>
      {/* la viñeta del original es del color del texto (rgba(26,26,28,.28)): el kit usa 0,22 × strength */}
      <Vignette amount={zoomIn * (1 - kf(f, [T.through[0], T.through[0] + 10], [0, 1]))} color="text" strength={1.27} />
      <DockedHeadline index={topic.index + 1} title={topic.name} subtitle={topic.line} layout="inline" start={-30} hide={hideFromScale(cam.scale, 1, 0.08)} />
      <Wash range={[T.through[1] - 14, T.through[1]]} />
    </>
  );
}

/** Escena sola (fuera de la historia): tema de marca y las nubes del original (desenfoque 56). */
export const SceneVideo: React.FC = () => (
  <ThemeProvider theme={brand}>
    <Stage cloud={{ blur: 56 }}>
      <SceneBody />
    </Stage>
  </ThemeProvider>
);
