import React from "react";
import { AbsoluteFill, Easing, random, useCurrentFrame } from "remotion";
import "../brand/fonts";
import { CloudBackground } from "../brand/primitives";
import { color, font, gradient, radius } from "../brand/theme";
import { DoodleArrow, DoodleCircle, OUT, Vignette, k } from "../brand/motion";
import { DockedHeadline } from "./Apertura";

/**
 * Scene 5: Health Score. The Grafana dashboard recreated (dark, as the real
 * one) with Grow2on type. 300 channels fall into seven state columns, become
 * the dashboard's donut, the dashboard builds in layers, four questions light
 * their answer, the attention queue sorts itself by severity, and the
 * 30-day transitions show channels leaving activation. All numbers emulated;
 * client names are fictional. 1080 frames at 30 fps.
 */

// ---------- data (emulated) ----------
const STATES = [
  { key: "inactivo", l: "Inactivo", n: 96, c: "#a8243a" },
  { key: "crec", l: "En crecimiento", n: 64, c: "#2e8b4a" },
  { key: "maduro", l: "Maduro", n: 52, c: "#73bf69" },
  { key: "activ", l: "En activación", n: 48, c: "#3d7fe0" },
  { key: "caida", l: "En caída", n: 22, c: "#f2495c" },
  { key: "estanc", l: "Estancado", n: 14, c: "#e0b400" },
  { key: "detenida", l: "Operación detenida", n: 4, c: "#a352cc" },
] as const;
const TOTAL = STATES.reduce((a, s) => a + s.n, 0); // 300
const COL_ORDER = [3, 1, 2, 5, 4, 0, 6]; // activación → crecimiento → maduro → estancado → caída → inactivo → detenida

// ---------- Grafana dark palette ----------
const G = { bg: "#111217", panel: "#181b1f", line: "#2c2f36", text: "#ccccdc", muted: "#8e8e9a", strong: "#ffffff" };

// ---------- timing ----------
const T = {
  rain: [6, 120] as const,
  morph: [148, 200] as const,
  build: 206,
  q: [340, 392, 444, 496] as const,
  qEnd: 556,
  sort: [640, 672] as const,
  trans: [800, 900] as const,
  through: [1044, 1080] as const,
};

// ---------- world layout ----------
const COLS = { cx: 960, base: -560, colW: 240, gap: 34, dot: 20, step: 24 };
const colX = (i: number) => COLS.cx - (7 * COLS.colW + 6 * COLS.gap) / 2 + i * (COLS.colW + COLS.gap);
const DONUT = { cx: 230, cy: 420, r: 150, w: 34 };
const TR = { x: 2100, y: 200, w: 1420, h: 880 };

// ---------- camera ----------
const KEYS: [number, number, number, number][] = [
  [0, 960, -800, 0.95], [140, 960, -800, 0.95],
  [196, DONUT.cx + 100, DONUT.cy, 1.2], [232, 960, 780, 0.6], [330, 960, 780, 0.6],
  [346, 380, 420, 1.45], [556, 380, 420, 1.45], // the four questions
  [584, 960, 1060, 0.95], [632, 960, 1060, 0.95], [652, 620, 1000, 1.45], [720, 620, 1000, 1.45], // attention queue
  [760, 960, 1060, 0.95], [782, 1900, 700, 0.5], [804, TR.x + TR.w / 2, TR.y + TR.h / 2, 0.98],
  [912, TR.x + TR.w / 2, TR.y + TR.h / 2, 0.98], [930, TR.x + 1040, TR.y + 470, 1.35], [990, TR.x + 1040, TR.y + 470, 1.35],
  [1020, 1760, 780, 0.42], [1044, 1760, 780, 0.42],
];
const camAt = (f: number) => {
  const t = KEYS.map((q) => q[0]);
  let c = { fx: k(f, t, KEYS.map((q) => q[1])), fy: k(f, t, KEYS.map((q) => q[2])), s: k(f, t, KEYS.map((q) => q[3])) };
  const p = k(f, [T.through[0], T.through[1]], [0, 1], Easing.bezier(0.7, 0, 0.84, 0));
  if (p > 0) {
    c = {
      fx: k(f, [T.through[0], T.through[0] + 12], [c.fx, DONUT.cx]),
      fy: k(f, [T.through[0], T.through[0] + 12], [c.fy, DONUT.cy]),
      s: c.s * Math.pow(70, p),
    };
  }
  return c;
};
const camera = (f: number) => {
  const c = camAt(f);
  const prev = camAt(f - 1);
  const vx = (c.fx - prev.fx) * c.s, vy = (c.fy - prev.fy) * c.s;
  const v = Math.hypot(vx, vy);
  return {
    ...c,
    rx: 4 + Math.max(-8, Math.min(8, vy * 0.06)) + Math.sin(f / 50) * 1.2,
    ry: -4 - Math.max(-10, Math.min(10, vx * 0.05)) + Math.sin(f / 37) * 1.5,
    blur: f >= T.through[0] ? 0 : Math.min(7, Math.max(0, (v - 12) / 14)),
  };
};

// ---------- dots: rain into columns, then into the donut ----------
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
  if (f > T.morph[1] + 14) return null;
  const fade = k(f, [T.morph[1] - 4, T.morph[1] + 14], [1, 0]);
  return (
    <>
      {DOTS.map((d, i) => {
        const tx = colX(d.col) + d.slot * COLS.step + COLS.dot / 2;
        const ty = COLS.base - d.row * COLS.step - COLS.dot / 2;
        const fall = k(f, [d.land - 18, d.land], [0, 1], Easing.bezier(0.5, 0, 0.75, 0));
        const bounce = k(f, [d.land, d.land + 4, d.land + 9], [0, -5, 0]);
        let x = tx, y = ty - (1 - fall) * 700 + bounce;
        const m = k(f, [T.morph[0] + d.ring * 0.08, T.morph[0] + 28 + d.ring * 0.08], [0, 1], Easing.bezier(0.45, 0, 0.2, 1));
        if (m > 0) {
          const a = -Math.PI / 2 + ((d.ring + 0.5) / TOTAL) * Math.PI * 2;
          const ex = DONUT.cx + Math.cos(a) * DONUT.r, ey = DONUT.cy + Math.sin(a) * DONUT.r;
          x = x + (ex - x) * m;
          y = y + (ey - y) * m - Math.sin(m * Math.PI) * 220;
        }
        return (
          <div key={i} style={{ position: "absolute", left: x - COLS.dot / 2, top: y - COLS.dot / 2, width: COLS.dot, height: COLS.dot, borderRadius: 10, background: STATES[d.st].c, opacity: (fall > 0 ? 1 : 0) * fade }} />
        );
      })}
    </>
  );
};

const ColumnLabels: React.FC<{ f: number }> = ({ f }) => {
  const out = k(f, [T.morph[0] - 6, T.morph[0] + 10], [1, 0]);
  return (
    <>
      {COL_ORDER.map((si, ci) => {
        const s = STATES[si];
        const rows = Math.ceil(s.n / 10);
        const shown = DOTS.filter((d) => d.st === si && f >= d.land).length;
        const a = k(f, [T.rain[0] + ci * 8, T.rain[0] + ci * 8 + 14], [0, 1], OUT) * out;
        return (
          <React.Fragment key={s.key}>
            <div style={{ position: "absolute", left: colX(ci), top: COLS.base - rows * COLS.step - 84, width: COLS.colW, textAlign: "center", fontSize: 56, fontWeight: font.stat, color: s.c, opacity: a }}>{shown}</div>
            <div style={{ position: "absolute", left: colX(ci) - 20, top: COLS.base + 18, width: COLS.colW + 40, textAlign: "center", fontSize: 26, fontWeight: font.medium, color: color.black, opacity: a }}>{s.l}</div>
          </React.Fragment>
        );
      })}
      <div style={{ position: "absolute", left: COLS.cx - 400, top: COLS.base + 80, width: 800, textAlign: "center", fontSize: 28, color: color.gray600, opacity: k(f, [T.rain[1] - 20, T.rain[1]], [0, 1]) * out }}>
        {TOTAL} canales · un punto por canal
      </div>
    </>
  );
};

// ---------- the Grafana dashboard ----------
const Panel: React.FC<{ x: number; y: number; w: number; h: number; title?: string; f: number; at: number; z?: number; children?: React.ReactNode; style?: React.CSSProperties }> = ({ x, y, w, h, title, f, at, z = 0, children, style }) => {
  const a = k(f, [at, at + 18], [0, 1], OUT);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: 6, background: G.panel, border: `1px solid ${G.line}`, overflow: "hidden", opacity: a, transform: `translateZ(${(1 - a) * 160 + z}px)`, ...style }}>
      {title && <div style={{ padding: "12px 16px 0", fontSize: 17, fontWeight: font.medium, color: G.text }}>{title}</div>}
      {children}
    </div>
  );
};

const Stat: React.FC<{ x: number; y: number; w: number; label: string; n: number; bg: string; f: number; at: number; numColor?: string; glow?: number }> = ({ x, y, w, label, n, bg, f, at, numColor = "#fff", glow = 0 }) => (
  <Panel x={x} y={y} w={w} h={140} f={f} at={at} title={label} style={{ boxShadow: glow ? `0 0 0 ${glow * 5}px ${color.pink}aa` : "none" }}>
    <div style={{ position: "absolute", left: 0, right: 0, top: 46, bottom: 0, background: bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 58, fontWeight: font.stat, color: numColor }}>
      {Math.round(k(f, [at + 6, at + 34], [0, n], OUT))}
    </div>
  </Panel>
);

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
  for (let i = QUESTIONS.length - 1; i >= 0; i--) if (f >= T.q[i] && f < (i === QUESTIONS.length - 1 ? T.qEnd : T.q[i + 1])) return i;
  return -1;
};

const DonutPanel: React.FC<{ f: number }> = ({ f }) => {
  const draw = k(f, [T.morph[1] - 10, T.morph[1] + 16], [0, 1], OUT);
  const qi = activeQ(f);
  const focus = qi >= 0 ? QUESTIONS[qi].sts : [];
  let acc = 0;
  return (
    <Panel x={20} y={180} w={640} h={460} f={f} at={T.build - 30} title="Distribución de estados (por canal)">
      <svg style={{ position: "absolute", left: 0, top: 0 }} width={640} height={460}>
        {STATES.map((s, si) => {
          const a0 = -Math.PI / 2 + (acc / TOTAL) * Math.PI * 2;
          acc += s.n;
          const a1 = -Math.PI / 2 + (acc / TOTAL) * Math.PI * 2;
          const hot = focus.includes(si);
          const pop = hot ? k(f, [T.q[qi], T.q[qi] + 10], [0, 1], OUT) : 0;
          const mid = (a0 + a1) / 2;
          const dx = Math.cos(mid) * 14 * pop, dy = Math.sin(mid) * 14 * pop;
          const end = a0 + (a1 - a0) * draw;
          if (end - a0 < 0.001) return null;
          return <path key={s.key} d={arc(DONUT.cx - 20 + dx, DONUT.cy - 180 + dy, DONUT.r, a0 + 0.01, end - 0.01)} fill="none" stroke={s.c} strokeWidth={DONUT.w + pop * 10} opacity={focus.length && !hot ? 0.25 : 1} />;
        })}
        <text x={DONUT.cx - 20} y={DONUT.cy - 180 + 14} textAnchor="middle" fontSize={48} fontWeight={700} fill={G.strong} fontFamily="Geist">
          {Math.round(k(f, [T.morph[1], T.morph[1] + 24], [0, TOTAL]))}
        </text>
        <text x={DONUT.cx - 20} y={DONUT.cy - 180 + 42} textAnchor="middle" fontSize={16} fill={G.muted} fontFamily="Geist">canales</text>
      </svg>
      {/* legend */}
      <div style={{ position: "absolute", left: 410, top: 70, width: 216, fontSize: 15 }}>
        {STATES.map((s, si) => {
          const hot = focus.includes(si);
          return (
            <div key={s.key} style={{ display: "flex", alignItems: "center", gap: 8, height: 36, padding: "0 8px", borderRadius: 4, color: G.text, background: hot ? `${s.c}33` : "transparent", opacity: focus.length && !hot ? 0.4 : 1 }}>
              <span style={{ width: 14, height: 4, borderRadius: 2, background: s.c }} />
              <span style={{ flex: 1 }}>{s.l}</span>
              <span style={{ color: G.strong, fontWeight: font.semibold }}>{s.n}</span>
            </div>
          );
        })}
      </div>
    </Panel>
  );
};

const Questions: React.FC<{ f: number }> = ({ f }) => {
  const qi = activeQ(f);
  if (qi < 0) return null;
  const Q = QUESTIONS[qi];
  const start = T.q[qi];
  const end = qi === QUESTIONS.length - 1 ? T.qEnd : T.q[qi + 1];
  const a = k(f, [start, start + 10, end - 6, end], [0, 1, 1, 0]);
  const ans = k(f, [start + 14, start + 26], [0, 1], OUT);
  const firstRow = STATES.findIndex((_, i) => Q.sts.includes(i));
  const rowY = 180 + 70 + firstRow * 36 + 18;
  return (
    <>
      <div style={{ position: "absolute", left: 60, top: 196, padding: "10px 20px", borderRadius: radius.pill, background: color.white, color: color.black, fontSize: 24, fontWeight: font.semibold, opacity: a, translate: `0 ${(1 - a) * -16}px`, boxShadow: "0 14px 30px -12px rgba(0,0,0,.5)", whiteSpace: "nowrap", transform: "translateZ(80px)" }}>
        {Q.q}
      </div>
      <div style={{ position: "absolute", left: 680, top: rowY - 24, padding: "10px 22px", borderRadius: radius.pill, background: gradient.brand, color: "#fff", fontSize: 24, fontWeight: font.semibold, opacity: ans * a, scale: String(0.8 + ans * 0.2), whiteSpace: "nowrap", transform: "translateZ(80px)" }}>
        {Q.a}
      </div>
      {Q.sts.map((si) => (
        <DoodleCircle key={si} f={f} start={start + 8} end={end - 6} cx={20 + 410 + 108} cy={180 + 70 + si * 36 + 18} rx={128} ry={28} id={`dq${qi}-${si}`} />
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
  { l: "Baja", c: "#e0b400" },
  { l: "Media", c: "#ff9830" },
  { l: "Alta", c: "#f2495c" },
  { l: "Crítica", c: "#c4162a" },
];
const QueueTable: React.FC<{ f: number }> = ({ f }) => {
  const sorted = [...CLIENTS].sort((a, b) => b.sev - a.sev || a.p0 - b.p0);
  const p = k(f, [T.sort[0], T.sort[1]], [0, 1], Easing.bezier(0.5, 0, 0.2, 1));
  const cols = "200px 200px 160px 220px 140px 1fr";
  const rowH = 52;
  return (
    <Panel x={20} y={860} w={1880} h={420} f={f} at={T.build + 30} title="En caída — contacto prioritario">
      <div style={{ position: "absolute", left: 16, right: 16, top: 50, display: "grid", gridTemplateColumns: cols, fontSize: 15, color: G.muted, paddingBottom: 8, borderBottom: `1px solid ${G.line}` }}>
        {["Cliente", "Canal", "Severidad", "Tendencia", "Pedidos P0", "Base mensual pedidos"].map((h) => (
          <span key={h}>{h}</span>
        ))}
      </div>
      {CLIENTS.map((r, i) => {
        const j = sorted.indexOf(r);
        const y = 90 + (i + (j - i) * p) * rowH;
        const lift = Math.sin(p * Math.PI) * (j < i ? 1 : 0);
        return (
          <div key={r.c} style={{ position: "absolute", left: 16, right: 16, top: y, height: rowH, display: "grid", gridTemplateColumns: cols, alignItems: "center", fontSize: 17, color: G.text, borderBottom: `1px solid ${G.line}`, background: lift > 0.05 ? "#22252b" : "transparent", boxShadow: lift > 0.05 ? `0 ${10 * lift}px 20px -8px rgba(0,0,0,.6)` : "none", zIndex: lift > 0.05 ? 2 : 1 }}>
            <span>{r.c}</span>
            <span>{r.canal}</span>
            <span style={{ height: rowH, display: "flex", alignItems: "center", paddingLeft: 12, background: SEV[r.sev].c, color: "#fff", fontWeight: font.semibold }}>{SEV[r.sev].l}</span>
            <span style={{ paddingLeft: 14, color: r.t === "Caída severa" ? "#f2495c" : "#ff9830" }}>{r.t}</span>
            <span>{r.p0}</span>
            <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {r.base}
              <span style={{ flex: 1, maxWidth: 260, height: 6, borderRadius: 3, background: "#2a2d33" }}>
                <span style={{ display: "block", height: 6, borderRadius: 3, width: `${(r.p0 / r.base) * 100}%`, background: "#f2495c" }} />
              </span>
            </span>
          </div>
        );
      })}
    </Panel>
  );
};

const Dashboard: React.FC<{ f: number }> = ({ f }) => {
  const shell = k(f, [T.build - 40, T.build - 10], [0, 1], OUT);
  const b = T.build;
  const qi = activeQ(f);
  const hotStat = (sts: number[]) => (qi >= 0 && QUESTIONS[qi].sts.some((s) => sts.includes(s)) ? k(f, [T.q[qi] + 6, T.q[qi] + 14], [0, 1]) : 0);
  return (
    <>
      <div style={{ position: "absolute", left: -20, top: 0, width: 1960, height: 1640, borderRadius: 20, background: G.bg, opacity: shell, boxShadow: "0 50px 100px -30px rgba(0,0,0,.6)" }} />
      {/* top bar + filters */}
      <div style={{ position: "absolute", left: 20, top: 20, width: 1880, height: 50, display: "flex", alignItems: "center", gap: 16, color: G.text, fontSize: 17, opacity: shell }}>
        <span style={{ width: 26, height: 26, borderRadius: 7, background: "linear-gradient(135deg,#f05a28,#fbca0a)" }} />
        <span style={{ color: G.muted }}>Paneles de control ›</span> Health Score
        <span style={{ marginLeft: "auto", padding: "6px 14px", border: `1px solid ${G.line}`, borderRadius: 4 }}>Exportar</span>
        <span style={{ padding: "6px 14px", borderRadius: 4, background: "#3d71d9", color: "#fff" }}>Compartir</span>
      </div>
      <div style={{ position: "absolute", left: 20, top: 82, display: "flex", gap: 12, opacity: k(f, [b - 20, b], [0, 1]) }}>
        {[["Base de datos", "Prod"], ["Cliente", "Todos"], ["Meses de base", "2"], ["Fecha de referencia", "Hoy"]].map(([l, v]) => (
          <span key={l} style={{ display: "flex", border: `1px solid ${G.line}`, borderRadius: 4, fontSize: 15, overflow: "hidden", whiteSpace: "nowrap" }}>
            <span style={{ padding: "8px 12px", background: "#22252b", color: G.text }}>{l}</span>
            <span style={{ padding: "8px 14px", color: G.strong }}>{v} ⌄</span>
          </span>
        ))}
      </div>
      <div style={{ position: "absolute", left: 24, top: 140, fontSize: 21, color: G.strong, fontWeight: font.medium, opacity: shell }}>⌄ Vista general</div>
      <DonutPanel f={f} />
      <Panel x={680} y={180} w={760} h={460} f={f} at={b} title="Estado consolidado por cliente">
        <div style={{ position: "absolute", left: 16, right: 16, top: 52, fontSize: 15 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 90px 150px", color: G.muted, paddingBottom: 8, borderBottom: `1px solid ${G.line}` }}>
            <span>Cliente</span>
            <span>Canales</span>
            <span>Estado consolidado</span>
          </div>
          {[["Tienda 12", 3, 1], ["Tienda 27", 2, 2], ["Tienda 05", 1, 3], ["Tienda 31", 2, 4], ["Tienda 40", 4, 1], ["Tienda 19", 1, 0], ["Tienda 33", 2, 2]].map(([c, n, s]) => (
            <div key={c as string} style={{ display: "grid", gridTemplateColumns: "1fr 90px 150px", alignItems: "center", height: 46, borderBottom: `1px solid ${G.line}`, color: G.text }}>
              <span>{c as string}</span>
              <span>{n as number}</span>
              <span style={{ height: 46, display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 10, background: STATES[s as number].c, color: "#fff" }}>{STATES[s as number].l}</span>
            </div>
          ))}
        </div>
      </Panel>
      <Panel x={1460} y={180} w={440} h={140} f={f} at={b + 8} title="Frescura de los datos">
        <div style={{ position: "absolute", left: 0, right: 0, top: 46, bottom: 0, background: "#1a7f37", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, color: "#fff", fontSize: 22 }}>
          Último pedido: hoy <b style={{ fontSize: 40 }}>0</b> días
        </div>
      </Panel>
      <Panel x={1460} y={340} w={440} h={300} f={f} at={b + 14} title="Canales que cambiaron de estado en 30 días">
        <div style={{ position: "absolute", left: 0, right: 0, top: 60, textAlign: "center", fontSize: 96, fontWeight: font.stat, color: G.strong }}>{Math.round(k(f, [b + 20, b + 50], [0, 86], OUT))}</div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 200, textAlign: "center", fontSize: 17, color: G.muted }}>de {TOTAL} canales</div>
      </Panel>
      <div style={{ position: "absolute", left: 24, top: 672, fontSize: 21, color: G.strong, fontWeight: font.medium, opacity: k(f, [b + 10, b + 26], [0, 1]) }}>⌄ Cola de atención</div>
      <Stat x={20} y={710} w={455} label="Inactivos" n={96} bg="#8a1c2c" f={f} at={b + 18} glow={hotStat([0])} />
      <Stat x={495} y={710} w={455} label="Operación detenida" n={4} bg="#8e3fb5" f={f} at={b + 22} />
      <Stat x={970} y={710} w={455} label="En caída" n={22} bg="#d6283c" f={f} at={b + 26} glow={hotStat([4])} />
      <Stat x={1445} y={710} w={455} label="Severidad alta" n={71} bg={G.panel} numColor="#f2495c" f={f} at={b + 30} />
      <QueueTable f={f} />
      <div style={{ position: "absolute", left: 24, top: 1300, fontSize: 21, color: G.strong, fontWeight: font.medium, opacity: k(f, [b + 40, b + 56], [0, 1]) }}>⌄ Cartera sana</div>
      <Stat x={20} y={1340} w={930} label="Maduros" n={52} bg="#4a9a3f" f={f} at={b + 44} glow={hotStat([2])} />
      <Stat x={970} y={1340} w={930} label="En crecimiento" n={64} bg="#1f6b36" f={f} at={b + 48} glow={hotStat([1])} />
    </>
  );
};

// ---------- 30 days ago → today ----------
const DEST = [
  { l: "En crecimiento", n: 34, c: "#2e8b4a" },
  { l: "Maduro", n: 22, c: "#73bf69" },
  { l: "Sigue en activación", n: 36, c: "#3d7fe0" },
  { l: "Estancado", n: 6, c: "#e0b400" },
  { l: "En caída", n: 14, c: "#f2495c" },
  { l: "Inactivo", n: 8, c: "#a8243a" },
];
const Transitions: React.FC<{ f: number }> = ({ f }) => {
  const a = k(f, [T.trans[0] - 30, T.trans[0] - 6], [0, 1], OUT);
  const box = (i: number) => ({ x: TR.x + 640 + (i % 3) * 250, y: TR.y + 170 + Math.floor(i / 3) * 330 });
  const dots: { d: number; idx: number }[] = [];
  DEST.forEach((d, di) => {
    for (let j = 0; j < d.n; j++) dots.push({ d: di, idx: j });
  });
  return (
    <>
      <div style={{ position: "absolute", left: TR.x, top: TR.y, width: TR.w, height: TR.h, borderRadius: 18, background: G.panel, border: `1px solid ${G.line}`, opacity: a, boxShadow: "0 50px 100px -30px rgba(0,0,0,.6)" }}>
        <div style={{ padding: "22px 30px 0", fontSize: 24, color: G.text, fontWeight: font.medium }}>Transiciones de estado: hace 30 días → hoy</div>
        <div style={{ position: "absolute", left: 40, top: 92, fontSize: 22, color: G.muted }}>Hace 30 días · En activación</div>
        <div style={{ position: "absolute", left: 640, top: 92, fontSize: 22, color: G.muted }}>Hoy</div>
      </div>
      {DEST.map((d, i) => {
        const b = box(i);
        const n = dots.filter((q, qi) => q.d === i && f >= T.trans[0] + qi * 0.6 + 26).length;
        return (
          <div key={d.l} style={{ position: "absolute", left: b.x, top: b.y + 210, width: 230, textAlign: "center", opacity: a }}>
            <div style={{ fontSize: 40, fontWeight: font.stat, color: d.c }}>{n}</div>
            <div style={{ fontSize: 18, color: G.text }}>{d.l}</div>
          </div>
        );
      })}
      {dots.map((q, qi) => {
        const sx = TR.x + 50 + (qi % 12) * 40 + 20, sy = TR.y + 160 + Math.floor(qi / 12) * 40 + 20;
        const b = box(q.d);
        const tx = b.x + 20 + (q.idx % 10) * 19 + 9, ty = b.y + 200 - Math.floor(q.idx / 10) * 19 - 9;
        const p = k(f, [T.trans[0] + qi * 0.6, T.trans[0] + qi * 0.6 + 26], [0, 1], Easing.bezier(0.45, 0, 0.2, 1));
        const x = sx + (tx - sx) * p, y = sy + (ty - sy) * p - Math.sin(p * Math.PI) * 120;
        const size = 30 - p * 14;
        const c = p > 0.5 ? DEST[q.d].c : "#3d7fe0";
        return <div key={qi} style={{ position: "absolute", left: x - size / 2, top: y - size / 2, width: size, height: size, borderRadius: size, background: c, opacity: a }} />;
      })}
    </>
  );
};

export const HealthScore: React.FC = () => {
  const f = useCurrentFrame();
  const cam = camera(f);
  const zoomIn = Math.max(0, Math.min(1, (cam.s - 1.05) / 0.4));
  const wash = k(f, [T.through[1] - 14, T.through[1]], [0, 1], Easing.linear);
  return (
    <AbsoluteFill style={{ background: color.gray50, fontFamily: font.family, overflow: "hidden" }}>
      <CloudBackground opacity={0.22} />
      <AbsoluteFill style={{ perspective: 2400 }}>
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: 1,
            height: 1,
            transformOrigin: "0 0",
            transformStyle: "preserve-3d",
            transform: `translate(960px, 540px) rotateX(${cam.rx}deg) rotateY(${cam.ry}deg) scale(${cam.s}) translate(${-cam.fx}px, ${-cam.fy}px)`,
            filter: cam.blur > 0.3 ? `blur(${cam.blur.toFixed(1)}px)` : undefined,
          }}
        >
          <Dashboard f={f} />
          <Questions f={f} />
          <ColumnLabels f={f} />
          <Dots f={f} />
          <Transitions f={f} />
          <DoodleCircle f={f} start={T.sort[1] + 4} end={760} cx={20 + 16 + 100} cy={860 + 90 + 26} rx={120} ry={32} id="dc-first" />
          <DoodleArrow f={f} start={T.trans[0] + 10} end={1000} x1={TR.x + 520} y1={TR.y + 120} x2={TR.x + 640} y2={TR.y + 120} bend={-0.4} id="da-trans" />
        </div>
      </AbsoluteFill>
      <Vignette amount={zoomIn * (1 - k(f, [T.through[0], T.through[0] + 10], [0, 1]))} />
      <DockedHeadline i={3} f={f} start={-30} hide={(cam.s - 1.0) / 0.08} />
      <AbsoluteFill style={{ background: color.gray50, opacity: wash }} />
    </AbsoluteFill>
  );
};
