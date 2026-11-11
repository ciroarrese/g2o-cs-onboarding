import React from "react";
import { AbsoluteFill, Easing, random, useCurrentFrame } from "remotion";
import "../brand/fonts";
import { CloudBackground, GradientText } from "../brand/primitives";
import { color, font, gradient, radius } from "../brand/theme";
import { DoodleCircle, DoodleArrow, OUT, Vignette, hex, k } from "../brand/motion";
import { DockedHeadline } from "./Apertura";

/**
 * Scene 3: Sincropresta, the PrestaShop <-> ERP module. A world of five zones
 * the camera flies through: the live sync (UI World), versions (Chart Grow),
 * the time limit that is no longer a limit (Chart Grow + Doodle), features
 * moving from one client to the core (UI World), and the account statement PDF,
 * whose QR the camera flies through. All numbers are emulated.
 * 840 frames at 30 fps.
 */

// ---------- zones (world centres) ----------
const ZA = { x: 960, y: 550 };
const ZB = { x: 3060, y: 540 };
const ZC = { x: 3060, y: 1800 };
const ZD = { x: 960, y: 1800 };
const ZE = { x: 960, y: 3060 };

// ---------- timing ----------
const T = {
  flow: [30, 185] as const,
  ver: [214, 286] as const,
  try1: [336, 396] as const,
  revert: [400, 426] as const,
  try2: [432, 496] as const,
  fly: [560, 650] as const,
  toggles: 646,
  pdf: 700,
  through: [800, 840] as const,
};

// ---------- camera ----------
const camera = (f: number) => {
  const t = [0, 175, 190, 205, 295, 312, 330, 505, 522, 540, 690, 705, 722, 790];
  const fx = [ZA.x, ZA.x, 2010, ZB.x, ZB.x, ZB.x, ZC.x, ZC.x, 2010, ZD.x, ZD.x, ZD.x, ZE.x, ZE.x];
  const fy = [ZA.y, ZA.y, 545, ZB.y, ZB.y, 1170, ZC.y, ZC.y, 1800, ZD.y, ZD.y, 2430, ZE.y, ZE.y];
  const s = [0.95, 1.0, 0.5, 1.0, 1.05, 0.55, 1.0, 1.05, 0.5, 0.9, 0.95, 0.55, 1.0, 1.15];
  let cam = { fx: k(f, t, fx), fy: k(f, t, fy), s: k(f, t, s) };
  const p = k(f, [T.through[0], T.through[1]], [0, 1], Easing.bezier(0.7, 0, 0.84, 0));
  if (p > 0) {
    cam = {
      fx: k(f, [T.through[0], T.through[0] + 10], [cam.fx, QR.x + QR.size / 2]),
      fy: k(f, [T.through[0], T.through[0] + 10], [cam.fy, QR.y + QR.size / 2]),
      s: cam.s * Math.pow(45, p),
    };
  }
  const tt = [0, 175, 205, 330, 540, 722, 800];
  return {
    ...cam,
    rx: k(f, tt, [6, 3, 4, 3, 5, 3, 0]),
    ry: k(f, tt, [-10, 4, -6, 4, -6, 4, 0]) + Math.sin(f / 40) * 1.5,
  };
};

// ---------- shared bits ----------
const Win: React.FC<{ x: number; y: number; w: number; h: number; title: React.ReactNode; z?: number; children: React.ReactNode; dark?: boolean }> = ({ x, y, w, h, title, z = 0, children, dark }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: w,
      height: h,
      borderRadius: 24,
      background: dark ? "#1f1f22" : color.white,
      border: `1px solid ${dark ? "#333" : color.gray200}`,
      boxShadow: "0 40px 90px -30px rgba(26,26,28,.4)",
      overflow: "hidden",
      transform: `translateZ(${z}px)`,
    }}
  >
    <div style={{ height: 52, display: "flex", alignItems: "center", gap: 10, padding: "0 20px", borderBottom: `1px solid ${dark ? "#333" : color.gray100}`, background: dark ? "#18181b" : color.white }}>
      {[color.error, color.warning, color.success].map((c) => (
        <span key={c} style={{ width: 11, height: 11, borderRadius: 6, background: c, opacity: 0.8 }} />
      ))}
      <div style={{ marginLeft: 12, fontSize: 17, color: dark ? "#ddd" : color.gray600 }}>{title}</div>
    </div>
    {children}
  </div>
);

const Pill: React.FC<{ children: React.ReactNode; c?: string; style?: React.CSSProperties }> = ({ children, c = color.pink, style }) => (
  <span style={{ padding: "8px 16px", borderRadius: radius.pill, background: color.white, border: `2px solid ${c}`, color: c, fontSize: 18, fontWeight: font.semibold, whiteSpace: "nowrap", boxShadow: `0 10px 24px -10px ${c}99`, ...style }}>
    {children}
  </span>
);

// ---------- zone A: the live sync ----------
const SW = { x: 120, y: 290, w: 660, h: 540 };
const EW = { x: 1140, y: 290, w: 660, h: 540 };
const HUB = { x: 960, y: 300 };
const PRODUCTS = [
  { n: "Taladro 650 W", p: [48900, 51200], s: [12, 9] },
  { n: "Amoladora 115 mm", p: [36500, 38300], s: [4, 7] },
  { n: "Set de mechas", p: [9800, 10300], s: [30, 26] },
  { n: "Lijadora orbital", p: [42700, 44800], s: [0, 6] },
];
const money = (v: number) => "$ " + v.toLocaleString("es-AR");
const LANES = [
  { label: "Catálogo", dir: -1, y0: 470, y1: 470, c: color.purple, off: 0 },
  { label: "Precios", dir: -1, y0: 560, y1: 560, c: color.pink, off: 12 },
  { label: "Stock", dir: -1, y0: 650, y1: 650, c: color.orange, off: 24 },
  { label: "Pedidos", dir: 1, y0: 740, y1: 740, c: color.success, off: 36 },
];
const LOOP = 48;

const laneProgress = (f: number, off: number) => {
  if (f < T.flow[0] + off) return -1;
  return ((f - T.flow[0] - off) % LOOP) / LOOP;
};
const arrivals = (f: number, off: number) => (f < T.flow[0] + off ? 0 : Math.floor((f - T.flow[0] - off) / LOOP));

const ZoneA: React.FC<{ f: number }> = ({ f }) => {
  const appear = k(f, [0, 30], [0, 1], OUT);
  const priceHits = arrivals(f, LANES[1].off);
  const stockHits = arrivals(f, LANES[2].off);
  const orders = arrivals(f, LANES[3].off);
  const pricePulse = (() => {
    const q = laneProgress(f, LANES[1].off);
    return q >= 0 && q < 0.2 && priceHits > 0 ? 1 - q / 0.2 : 0;
  })();
  return (
    <div style={{ opacity: appear }}>
      <Win x={SW.x} y={SW.y} w={SW.w} h={SW.h} title={<span>tienda-07.ejemplo.com.ar · PrestaShop</span>} z={40}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, padding: 24 }}>
          {PRODUCTS.map((pr, i) => {
            const updated = priceHits >= 1 + (i % 2);
            const stock = stockHits >= 1 + (i % 2) ? pr.s[1] : pr.s[0];
            return (
              <div key={pr.n} style={{ borderRadius: 16, border: `1px solid ${color.gray200}`, overflow: "hidden", boxShadow: updated ? `0 0 0 ${pricePulse * 6}px ${color.pink}33` : "none" }}>
                <div style={{ height: 140, background: gradient.thumb3, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 54, color: "#ffffffcc", fontWeight: font.semibold }}>{pr.n[0]}</div>
                <div style={{ padding: "12px 14px", fontSize: 17, color: color.black }}>
                  <div style={{ fontWeight: font.medium }}>{pr.n}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                    <span style={{ color: updated ? color.pink : color.black, fontWeight: font.semibold }}>{money(updated ? pr.p[1] : pr.p[0])}</span>
                    <span style={{ fontSize: 14, color: stock > 0 ? color.success : color.error }}>{stock > 0 ? `Stock ${stock}` : "Sin stock"}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Win>
      <Win x={EW.x} y={EW.y} w={EW.w} h={EW.h} title="ERP Flexxus" z={40} dark>
        <div style={{ padding: "18px 22px", fontSize: 16, color: "#ddd" }}>
          <div style={{ display: "grid", gridTemplateColumns: "90px 1fr 120px 70px", padding: "8px 0", color: "#888", borderBottom: "1px solid #333" }}>
            <span>Código</span>
            <span>Artículo</span>
            <span>Precio</span>
            <span>Stock</span>
          </div>
          {PRODUCTS.map((pr, i) => (
            <div key={pr.n} style={{ display: "grid", gridTemplateColumns: "90px 1fr 120px 70px", padding: "12px 0", borderBottom: "1px solid #2a2a2a" }}>
              <span>10-{2231 + i * 7}</span>
              <span>{pr.n}</span>
              <span>{money(pr.p[1])}</span>
              <span>{pr.s[1]}</span>
            </div>
          ))}
          <div style={{ marginTop: 22, color: "#888" }}>Pedidos recibidos</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 10 }}>
            {Array.from({ length: Math.min(orders, 3) }).map((_, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 14px", borderRadius: 10, background: "#26262a", borderLeft: `4px solid ${color.success}` }}>
                <span>Pedido #{3104 + i}</span>
                <span style={{ color: color.success }}>Recibido</span>
              </div>
            ))}
          </div>
        </div>
      </Win>

      {/* hub */}
      <div style={{ position: "absolute", left: HUB.x - 80, top: HUB.y - 80, width: 160, height: 160, borderRadius: 80, background: color.white, boxShadow: "0 20px 50px -14px rgba(231,0,126,.5)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", transform: "translateZ(120px)" }}>
        <svg width={56} height={56} viewBox="0 0 24 24" style={{ rotate: `${f * 4}deg` }}>
          <defs>
            <linearGradient id="hubg" x1="0" x2="1">
              <stop offset="0" stopColor={color.pink} />
              <stop offset="1" stopColor={color.orange} />
            </linearGradient>
          </defs>
          <path d="M20 12a8 8 0 0 1-14 5.3M4 12a8 8 0 0 1 14-5.3M18 3v4h-4M6 21v-4h4" fill="none" stroke="url(#hubg)" strokeWidth={2.2} strokeLinecap="round" />
        </svg>
        <div style={{ fontSize: 16, fontWeight: font.semibold, color: color.black, marginTop: 6 }}>Sincropresta</div>
      </div>

      <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1} height={1}>
        <line x1={HUB.x} y1={HUB.y + 80} x2={HUB.x} y2={780} stroke={color.pink} strokeOpacity={0.35} strokeWidth={3} strokeDasharray="2 10" strokeLinecap="round" />
        {LANES.map((l) => (
          <line key={l.label} x1={SW.x + SW.w} y1={l.y0} x2={EW.x} y2={l.y0} stroke={l.c} strokeOpacity={0.18} strokeWidth={2} />
        ))}
      </svg>
      {/* lanes */}
      {LANES.map((l) => {
        const q = laneProgress(f, l.off);
        if (q < 0 || f > T.flow[1] + 20) return null;
        const t = l.dir < 0 ? q : q;
        const sx = l.dir < 0 ? EW.x : SW.x + SW.w;
        const ex = l.dir < 0 ? SW.x + SW.w : EW.x;
        const x = sx + (ex - sx) * t;
        const y = l.y0 - Math.sin(t * Math.PI) * 40;
        const a = Math.min(1, q * 8, (1 - q) * 8);
        return (
          <div key={l.label} style={{ position: "absolute", left: x, top: y, translate: "-50% -50%", opacity: a, transform: "translateZ(160px)" }}>
            <Pill c={l.c}>{l.label}</Pill>
          </div>
        );
      })}
    </div>
  );
};

// ---------- zone B: versions ----------
const WEEKS = [34, 47, 39, 55, 42];
const ZoneB: React.FC<{ f: number }> = ({ f }) => {
  const v = k(f, [T.ver[0], T.ver[1]], [0, 1], Easing.bezier(0.3, 0, 0.2, 1));
  const minor = Math.floor(v * 9);
  const patch = Math.floor((v * 9 - minor) * 9) + (minor === 9 ? 4 : 0);
  const label = `v2.${Math.min(minor, 9)}.${minor >= 9 ? 4 : patch}`;
  const max = Math.max(...WEEKS);
  return (
    <div style={{ position: "absolute", left: ZB.x - 760, top: ZB.y - 430, width: 1520, height: 860 }}>
      <div style={{ textAlign: "center", fontSize: 26, color: color.gray600, fontWeight: font.medium }}>Sincropresta core</div>
      <div style={{ textAlign: "center", fontSize: 190, fontWeight: font.stat, letterSpacing: "-0.03em", lineHeight: 1.05 }}>
        <GradientText>{label}</GradientText>
      </div>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-end", gap: 70, height: 380, marginTop: 30 }}>
        {WEEKS.map((n, i) => {
          const s = T.ver[0] + 6 + i * 11;
          const g = k(f, [s, s + 26], [0, 1], OUT);
          const val = Math.round(n * g);
          const rel = f >= s + 14;
          return (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
              <div style={{ fontSize: 26, fontWeight: font.stat, color: color.black, opacity: g }}>{val}</div>
              <div style={{ width: 150, height: (n / max) * 260 * g, borderRadius: "14px 14px 4px 4px", background: i === WEEKS.length - 1 ? gradient.brand : `${color.pink}${hex(0.25 + i * 0.12)}` }} />
              <div style={{ fontSize: 20, color: color.gray600 }}>Semana {i + 1}</div>
              <div style={{ opacity: rel ? 1 : 0, scale: String(rel ? 1 : 0.6), transition: "none" }}>
                <Pill c={color.purple} style={{ fontSize: 15, padding: "4px 12px" }}>
                  v2.{1 + i * 2}
                </Pill>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ---------- zone C: the time limit ----------
const LIMIT = 0.68;
const ZoneC: React.FC<{ f: number }> = ({ f }) => {
  const second = f >= T.revert[1] + 2;
  const p1 = k(f, [T.try1[0], T.try1[1]], [0, LIMIT], Easing.linear);
  const failed = f >= T.try1[1] && !second;
  const revert = k(f, [T.revert[0], T.revert[1]], [0, 1], Easing.bezier(0.5, 0, 0.2, 1));
  const p2 = k(f, [T.try2[0], T.try2[1]], [0, 1], Easing.bezier(0.3, 0, 0.3, 1));
  const prog = second ? p2 : p1 * (1 - revert);
  const done = second && f >= T.try2[1];
  const secs = Math.round((second ? p2 * 151 : p1 * (120 / LIMIT)) * (second ? 1 : 1));
  const shownSecs = !second ? Math.min(120, Math.round(p1 / LIMIT * 120)) : secs;
  const mm = `${Math.floor(shownSecs / 60)}:${String(shownSecs % 60).padStart(2, "0")}`;
  const count = Math.round((second ? p2 : p1 * (1 - revert)) * 486250);
  const barC = failed ? color.error : done ? color.success : gradient.brand;
  const shake = failed && f < T.try1[1] + 10 ? Math.sin(f * 2.4) * 8 * (1 - (f - T.try1[1]) / 10) : 0;
  const L = { x: ZC.x - 650, y: ZC.y - 260, w: 1300, h: 520 };
  const trackX = 70, trackW = 1160;
  return (
    <div style={{ position: "absolute", left: L.x + shake, top: L.y, width: L.w, height: L.h, borderRadius: 28, background: color.white, border: `1px solid ${color.gray200}`, boxShadow: "0 40px 90px -30px rgba(26,26,28,.35)" }}>
      <div style={{ position: "absolute", left: 50, top: 40, display: "flex", alignItems: "center", gap: 16 }}>
        <Pill c={second ? color.success : color.gray600}>{second ? "Ahora" : "Antes"}</Pill>
        <span style={{ fontSize: 34, fontWeight: font.semibold, color: color.black }}>Sincronizando descuentos</span>
      </div>
      <div style={{ position: "absolute", right: 50, top: 36, fontSize: 52, fontWeight: font.stat, color: failed ? color.error : color.black, fontVariantNumeric: "tabular-nums" }}>{mm}</div>
      {/* track */}
      <div style={{ position: "absolute", left: trackX, top: 230, width: trackW, height: 46, borderRadius: 23, background: color.gray100, overflow: "hidden" }}>
        <div style={{ width: `${prog * 100}%`, height: "100%", borderRadius: 23, background: barC }} />
      </div>
      {/* limit marker */}
      <div style={{ position: "absolute", left: trackX + trackW * LIMIT - 2, top: 200, width: 4, height: 106, borderRadius: 2, background: color.black }} />
      <div style={{ position: "absolute", left: trackX + trackW * LIMIT - 150, top: 316, width: 300, textAlign: "center", fontSize: 20, color: color.gray600 }}>Límite del servidor · 2:00</div>
      {/* status */}
      <div style={{ position: "absolute", left: trackX, top: 140, fontSize: 24, color: color.gray600 }}>
        {count.toLocaleString("es-AR")} descuentos
      </div>
      <div style={{ position: "absolute", left: trackX, top: 400, fontSize: 28, fontWeight: font.semibold, color: failed ? color.error : done ? color.success : color.gray600 }}>
        {failed ? "Tiempo agotado · la sincro se revierte" : done ? "Completo" : second || f >= T.try1[0] ? "Procesando…" : ""}
      </div>
    </div>
  );
};

// ---------- zone D: from one client to the core ----------
const FEATURES = [
  "Control de crédito",
  "Pre-venta por orden de compra",
  "Productos sustitutos",
  "Familias ocultas",
  "Precios incrementales",
  "Cuenta corriente",
];
const ZoneD: React.FC<{ f: number }> = ({ f }) => {
  const coreGlow = k(f, [T.fly[1] - 10, T.fly[1] + 10, T.fly[1] + 60], [0, 1, 0.4]);
  return (
    <>
      {/* ring core */}
      <svg style={{ position: "absolute", left: ZD.x - 330, top: ZD.y - 200, overflow: "visible" }} width={660} height={400}>
        <defs>
          <linearGradient id="ringg" x1="0" x2="1">
            <stop offset="0" stopColor={color.pink} />
            <stop offset="0.6" stopColor={color.purple} />
            <stop offset="1" stopColor={color.orange} />
          </linearGradient>
        </defs>
        <ellipse cx={330} cy={200} rx={320} ry={120} fill="none" stroke="url(#ringg)" strokeWidth={30} transform={`rotate(${-14 + Math.sin(f / 30) * 3} 330 200)`} opacity={0.9} />
      </svg>
      <div style={{ position: "absolute", left: ZD.x - 150, top: ZD.y - 150, width: 300, height: 300, borderRadius: 150, background: color.white, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", boxShadow: `0 30px 70px -20px rgba(231,0,126,${0.3 + coreGlow * 0.4}), 0 0 0 ${coreGlow * 20}px ${color.pink}22` }}>
        <div style={{ fontSize: 40, fontWeight: font.semibold, color: color.black }}>Sincropresta</div>
        <div style={{ fontSize: 22, color: color.gray600 }}>core</div>
      </div>

      {FEATURES.map((ft, i) => {
        const ang = -Math.PI / 2 + (i / FEATURES.length) * Math.PI * 2 + 0.3;
        const ox = ZD.x + Math.cos(ang) * 760;
        const oy = ZD.y + Math.sin(ang) * 400;
        const s = T.fly[0] + i * 14;
        const p = k(f, [s, s + 34], [0, 1], Easing.bezier(0.5, 0, 0.2, 1));
        const appear = k(f, [520 + i * 4, 540 + i * 4], [0, 1], OUT);
        const x = ox + (ZD.x - ox) * p;
        const y = oy + (ZD.y - oy) * p - Math.sin(p * Math.PI) * 120;
        const gone = p >= 1;
        return (
          <React.Fragment key={ft}>
            <div style={{ position: "absolute", left: ox - 110, top: oy + 40, width: 220, textAlign: "center", fontSize: 18, color: color.gray600, opacity: appear * (1 - p * 0.6) }}>
              Tienda {String(3 + i * 7).padStart(2, "0")}
            </div>
            {!gone && (
              <div style={{ position: "absolute", left: x, top: y, translate: "-50% -50%", opacity: appear, scale: String(1 - p * 0.5) }}>
                <Pill c={color.pink} style={{ fontSize: 22, padding: "12px 22px" }}>
                  {ft}
                </Pill>
              </div>
            )}
          </React.Fragment>
        );
      })}

      {/* parameters list: each feature switches on for the whole portfolio */}
      <div style={{ position: "absolute", left: ZD.x + 420, top: ZD.y - 230, width: 420, borderRadius: 22, background: color.white, border: `1px solid ${color.gray200}`, boxShadow: "0 30px 70px -30px rgba(26,26,28,.35)", padding: "20px 24px", opacity: k(f, [T.toggles - 30, T.toggles], [0, 1], OUT), translate: `${(1 - k(f, [T.toggles - 30, T.toggles], [0, 1], OUT)) * 60}px 0` }}>
        <div style={{ fontSize: 20, fontWeight: font.semibold, color: color.black, marginBottom: 10 }}>Parámetros</div>
        {FEATURES.map((ft, i) => {
          const on = k(f, [T.toggles + i * 5, T.toggles + i * 5 + 8], [0, 1], OUT);
          return (
            <div key={ft} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", fontSize: 18, color: color.black, borderTop: i ? `1px solid ${color.gray100}` : "none" }}>
              {ft}
              <span style={{ width: 46, height: 26, borderRadius: 13, background: on > 0.5 ? gradient.brand : color.gray200, position: "relative" }}>
                <span style={{ position: "absolute", top: 3, left: 3 + on * 20, width: 20, height: 20, borderRadius: 10, background: color.white }} />
              </span>
            </div>
          );
        })}
      </div>
    </>
  );
};

// ---------- zone E: the account statement PDF ----------
const PDF = { x: ZE.x - 300, y: ZE.y - 360, w: 600, h: 720 };
const QR = { x: PDF.x + PDF.w - 190, y: PDF.y + PDF.h - 168, size: 130 };
const QrCode: React.FC = () => {
  const n = 25;
  const cell = QR.size / n;
  const finder = (r: number, c: number) => {
    const inBox = (R: number, C: number) => r >= R && r < R + 7 && c >= C && c < C + 7;
    for (const [R, C] of [[0, 0], [0, n - 7], [n - 7, 0]]) {
      if (inBox(R, C)) {
        const rr = r - R, cc = c - C;
        return rr === 0 || rr === 6 || cc === 0 || cc === 6 || (rr >= 2 && rr <= 4 && cc >= 2 && cc <= 4) ? 1 : 0;
      }
    }
    return -1;
  };
  const cells: React.ReactNode[] = [];
  for (let r = 0; r < n; r++)
    for (let c = 0; c < n; c++) {
      const fv = finder(r, c);
      const on = fv === -1 ? random(`qr${r}-${c}`) > 0.52 : fv === 1;
      if (on) cells.push(<rect key={`${r}-${c}`} x={c * cell} y={r * cell} width={cell + 0.3} height={cell + 0.3} fill={color.black} />);
    }
  return (
    <svg style={{ position: "absolute", left: QR.x, top: QR.y }} width={QR.size} height={QR.size}>
      {cells}
    </svg>
  );
};
const ZoneE: React.FC<{ f: number }> = ({ f }) => {
  const a = k(f, [T.pdf - 10, T.pdf + 24], [0, 1], OUT);
  const rows = [
    ["FA-A 0004-00012873", "05/11/26", "$ 184.500"],
    ["FA-A 0004-00012911", "12/11/26", "$ 96.200"],
    ["FA-A 0004-00012960", "19/11/26", "$ 251.900"],
    ["FA-A 0004-00013002", "26/11/26", "$ 74.300"],
    ["ND-A 0004-00000318", "30/11/26", "$ 12.800"],
  ];
  return (
    <div style={{ opacity: a, translate: `0 ${(1 - a) * 60}px` }}>
      <div style={{ position: "absolute", left: PDF.x, top: PDF.y, width: PDF.w, height: PDF.h, background: color.white, borderRadius: 10, boxShadow: "0 50px 100px -30px rgba(26,26,28,.45)", padding: "44px 46px", boxSizing: "border-box", rotate: `${Math.sin(f / 30) * 0.8}deg` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: 34, fontWeight: font.semibold, color: color.black }}>Cuenta corriente</div>
            <div style={{ fontSize: 18, color: color.gray600, marginTop: 4 }}>Tienda 18 · Cliente 004521</div>
          </div>
          <div style={{ width: 60, height: 60, borderRadius: 14, background: gradient.brand }} />
        </div>
        <div style={{ height: 1, background: color.gray200, margin: "26px 0 16px" }} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 110px 120px", fontSize: 15, color: color.gray600, paddingBottom: 8 }}>
          <span>Comprobante</span>
          <span>Vencimiento</span>
          <span style={{ textAlign: "right" }}>Saldo</span>
        </div>
        {rows.map((r, i) => {
          const ra = k(f, [T.pdf + 10 + i * 6, T.pdf + 24 + i * 6], [0, 1], OUT);
          return (
            <div key={r[0]} style={{ display: "grid", gridTemplateColumns: "1fr 110px 120px", fontSize: 17, color: color.black, padding: "12px 0", borderTop: `1px solid ${color.gray100}`, opacity: ra }}>
              <span>{r[0]}</span>
              <span>{r[1]}</span>
              <span style={{ textAlign: "right" }}>{r[2]}</span>
            </div>
          );
        })}
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, fontWeight: font.semibold, color: color.black, padding: "18px 0", borderTop: `2px solid ${color.black}` }}>
          <span>Saldo total</span>
          <GradientText>$ 619.700</GradientText>
        </div>
        <div style={{ position: "absolute", left: 46, bottom: 60, fontSize: 15, color: color.gray600, lineHeight: 1.7 }}>
          CAE 76451238904512
          <br />
          Vto. CAE 21/11/2026
        </div>
      </div>
      <QrCode />
    </div>
  );
};

export const Sincropresta: React.FC = () => {
  const f = useCurrentFrame();
  const cam = camera(f);
  const zoomIn = Math.max(0, Math.min(1, (cam.s - 1.02) / 0.2));
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
          }}
        >
          <ZoneA f={f} />
          <ZoneB f={f} />
          <ZoneC f={f} />
          <ZoneD f={f} />
          <ZoneE f={f} />
          <DoodleCircle f={f} start={T.try2[0] + 40} end={T.try2[1] + 50} cx={ZC.x - 650 + 70 + 1160 * LIMIT} cy={ZC.y - 260 + 253} rx={70} ry={86} id="dc-limit" />
          <DoodleArrow f={f} start={T.try2[1] + 4} end={T.try2[1] + 50} x1={ZC.x + 200} y1={ZC.y + 220} x2={ZC.x + 560} y2={ZC.y + 20} bend={0.2} id="da-done" />
          <DoodleCircle f={f} start={T.pdf + 50} end={T.through[0] + 6} cx={QR.x + QR.size / 2} cy={QR.y + QR.size / 2} rx={92} ry={92} id="dc-qr" />
        </div>
      </AbsoluteFill>
      <Vignette amount={zoomIn * (1 - k(f, [T.through[0], T.through[0] + 10], [0, 1]))} />
      <DockedHeadline i={1} f={f} start={-30} />
      <AbsoluteFill style={{ background: color.gray50, opacity: wash }} />
    </AbsoluteFill>
  );
};
