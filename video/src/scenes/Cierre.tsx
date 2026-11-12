import React from "react";
import { AbsoluteFill, Easing, Img, random, staticFile, useCurrentFrame } from "remotion";
import "../brand/fonts";
import { CloudBackground, GradientText } from "../brand/primitives";
import { color, font, gradient, radius } from "../brand/theme";
import { OUT, k } from "../brand/motion";
import { LABELS, PROJECTS } from "./Apertura";

/**
 * Scene 6: closing. The four tools float together (UI World), the label wall
 * from the opening returns behind them fully lit (Headline Wall), then a white
 * fade with the Grow2on logo and "Hecho con Claude". 420 frames at 30 fps.
 */

const T = { cards: 0, wall: 140, wash: [270, 300] as const, logo: 296, sign: 322 };

// ---------- miniatures of each tool ----------
const Win: React.FC<{ dark?: boolean; children: React.ReactNode }> = ({ dark, children }) => (
  <div style={{ width: 560, height: 340, borderRadius: 22, background: dark ? "#18181b" : color.white, border: `1px solid ${dark ? "#2c2f36" : color.gray200}`, boxShadow: "0 40px 80px -30px rgba(26,26,28,.45)", overflow: "hidden", position: "relative" }}>
    {children}
  </div>
);

const MiniAI = () => (
  <Win dark>
    <div style={{ height: 44, background: "#141414", color: "#eee", fontSize: 16, fontWeight: font.semibold, display: "flex", alignItems: "center", padding: "0 18px" }}>Sugerencia IA - Ticket 48190</div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, padding: 18 }}>
      {[["Solo corregir", "#333", "#fff"], ["Seguir contexto", "#1677ff", "#fff"], ["Con formato", "#8e44ad", "#fff"], ["Escalado desarrollo", "#f0a500", "#111"], ["Dictar", "#2ecc71", "#111"], ["▸ Reportar", "#26262a", "#eee"]].map(([l, bg, fg]) => (
        <div key={l} style={{ height: 50, borderRadius: 8, background: bg, color: fg, fontSize: 17, fontWeight: font.medium, display: "flex", alignItems: "center", justifyContent: "center" }}>{l}</div>
      ))}
    </div>
  </Win>
);

const MiniStore = () => (
  <Win>
    <div style={{ height: 52, display: "flex", alignItems: "center", gap: 18, padding: "0 20px", borderBottom: `1px solid ${color.gray100}` }}>
      <span style={{ fontSize: 22, fontWeight: font.semibold }}>
        hogar<span style={{ color: "#24b9d7" }}>nova</span>
      </span>
      <span style={{ fontSize: 12, color: "#24b9d7", fontWeight: font.semibold }}>COCINA</span>
      <span style={{ fontSize: 12, fontWeight: font.semibold }}>BAÑO</span>
      <span style={{ marginLeft: "auto", padding: "4px 10px", borderRadius: 4, background: "#e5313d", color: "#fff", fontSize: 12 }}>ERP Flexxus ⇄</span>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, padding: 18 }}>
      {["#fde7f1", "#fff0e2", "#ece6ff"].map((c, i) => (
        <div key={c} style={{ boxShadow: "0 2px 6px rgba(0,0,0,.08)" }}>
          <div style={{ height: 120, background: c }} />
          <div style={{ padding: 8, textAlign: "center", fontSize: 15, fontWeight: font.semibold }}>$ {[51200, 36500, 29800][i].toLocaleString("es-AR")}</div>
          <div style={{ height: 24, background: "#24b9d7" }} />
        </div>
      ))}
    </div>
  </Win>
);

const ring = (vals: [number, string][], r: number, w: number, size: number) => {
  const total = vals.reduce((a, v) => a + v[0], 0);
  let acc = 0;
  return (
    <svg width={size} height={size}>
      {vals.map(([v, c], i) => {
        const a0 = -Math.PI / 2 + (acc / total) * Math.PI * 2;
        acc += v;
        const a1 = -Math.PI / 2 + (acc / total) * Math.PI * 2;
        const p = (a: number) => `${size / 2 + Math.cos(a) * r},${size / 2 + Math.sin(a) * r}`;
        return <path key={i} d={`M${p(a0 + 0.02)} A${r},${r} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${p(a1 - 0.02)}`} fill="none" stroke={c} strokeWidth={w} />;
      })}
    </svg>
  );
};

const MiniMonitor = () => (
  <Win>
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "16px 20px" }}>
      <span style={{ width: 28, height: 28, borderRadius: 8, background: gradient.brand }} />
      <span style={{ fontSize: 20, fontWeight: font.semibold }}>Sincro Monitor</span>
    </div>
    <div style={{ display: "flex", gap: 18, padding: "0 20px" }}>
      {ring([[128, color.success], [61, color.error], [23, color.orange], [14, color.warning], [54, color.gray300]], 82, 22, 200)}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, flex: 1 }}>
        {[["Tiendas", 280, color.black], ["Sin problemas", 128, color.success], ["Error en servidor", 61, color.error], ["Error sincro", 23, color.orange]].map(([l, n, c]) => (
          <div key={l as string} style={{ borderRadius: 10, border: `1px solid ${color.gray200}`, padding: "8px 10px" }}>
            <div style={{ fontSize: 10, color: color.gray600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{l as string}</div>
            <div style={{ fontSize: 30, fontWeight: font.stat, color: c as string }}>{n as number}</div>
          </div>
        ))}
      </div>
    </div>
  </Win>
);

const MiniHealth = () => (
  <Win dark>
    <div style={{ padding: "14px 18px", color: "#ccccdc", fontSize: 16 }}>Distribución de estados (por canal)</div>
    <div style={{ display: "flex", gap: 18, padding: "0 18px", alignItems: "center" }}>
      {ring([[96, "#a8243a"], [64, "#2e8b4a"], [52, "#73bf69"], [48, "#3d7fe0"], [22, "#f2495c"], [14, "#e0b400"], [4, "#a352cc"]], 82, 24, 200)}
      <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
        {[["Inactivos", 96, "#8a1c2c"], ["En caída", 22, "#d6283c"], ["En crecimiento", 64, "#1f6b36"]].map(([l, n, c]) => (
          <div key={l as string} style={{ borderRadius: 6, background: c as string, color: "#fff", padding: "8px 12px", display: "flex", justifyContent: "space-between", fontSize: 16 }}>
            {l as string}
            <b style={{ fontSize: 22 }}>{n as number}</b>
          </div>
        ))}
      </div>
    </div>
  </Win>
);

const CARDS = [
  { el: <MiniAI />, x: 520, y: 330, z: 40 },
  { el: <MiniStore />, x: 1400, y: 300, z: -120 },
  { el: <MiniMonitor />, x: 560, y: 770, z: -80 },
  { el: <MiniHealth />, x: 1380, y: 760, z: 60 },
];

// ---------- the label wall, back behind the tools ----------
const WALL = LABELS.map((text, i) => ({
  text,
  x: -860 + (i % 5) * 420 + (Math.floor(i / 5) % 2) * 160 + (random(`cx${i}`) - 0.5) * 40,
  y: -440 + Math.floor(i / 5) * 170 + (random(`cy${i}`) - 0.5) * 24,
  on: T.wall + random(`con${i}`) * 70,
}));

export const Cierre: React.FC = () => {
  const f = useCurrentFrame();
  const s = k(f, [0, 150, 270], [1.5, 0.98, 0.94], Easing.bezier(0.3, 0, 0.2, 1));
  const ry = k(f, [0, 270], [-12, 8]);
  const rx = k(f, [0, 270], [8, 2]);
  const wallIn = k(f, [T.wall - 20, T.wall + 10], [0, 1], OUT);
  const wash = k(f, [T.wash[0], T.wash[1]], [0, 1], Easing.linear);
  const logo = k(f, [T.logo, T.logo + 26], [0, 1], OUT);
  const sign = k(f, [T.sign, T.sign + 22], [0, 1], OUT);
  return (
    <AbsoluteFill style={{ background: color.gray50, fontFamily: font.family, overflow: "hidden" }}>
      <CloudBackground opacity={0.22} />
      {/* wall behind */}
      <AbsoluteFill style={{ perspective: 1600, opacity: wallIn * 0.6, filter: "blur(2px)" }}>
        <div style={{ position: "absolute", left: 960, top: 540, transformStyle: "preserve-3d", transform: `translateZ(-500px) rotateY(${ry * 0.5}deg)` }}>
          {WALL.map((c) => {
            const lit = f >= c.on;
            const pop = k(f, [c.on, c.on + 5, c.on + 20], [0, 1, 0]);
            return (
              <div key={c.text} style={{ position: "absolute", transform: `translate(-50%, -50%) translate(${c.x}px, ${c.y}px)`, padding: "14px 26px", borderRadius: radius.pill, background: color.white, border: `2px solid ${lit ? color.pink + "66" : color.gray200}`, color: lit ? color.black : color.gray300, fontSize: 30, fontWeight: font.medium, whiteSpace: "nowrap", scale: String(1 + pop * 0.12), boxShadow: `0 10px 30px -14px rgba(231,0,126,${0.15 + pop * 0.3})` }}>
                {c.text}
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
      {/* the four tools */}
      <AbsoluteFill style={{ perspective: 2200 }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "960px 540px", transformStyle: "preserve-3d", transform: `rotateX(${rx}deg) rotateY(${ry}deg) scale(${s})` }}>
          {CARDS.map((c, i) => {
            const a = k(f, [T.cards + i * 8, T.cards + i * 8 + 24], [0, 1], OUT);
            const bob = Math.sin(f / 28 + i * 1.7) * 10;
            return (
              <div key={i} style={{ position: "absolute", left: c.x - 280, top: c.y - 170 + bob, transform: `translateZ(${c.z + (1 - a) * 300}px)`, opacity: a }}>
                <div style={{ position: "absolute", left: 0, top: -58, display: "flex", alignItems: "baseline", gap: 12, whiteSpace: "nowrap" }}>
                  <span style={{ fontSize: 22, fontWeight: font.stat }}>
                    <GradientText>{String(i + 1).padStart(2, "0")}</GradientText>
                  </span>
                  <span style={{ fontSize: 32, fontWeight: font.semibold, color: color.black }}>{PROJECTS[i].name}</span>
                </div>
                {c.el}
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
      {/* sign-off */}
      <AbsoluteFill style={{ background: color.white, opacity: wash }} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 34 }}>
        <Img src={staticFile("brand/logo-grow2on.png")} style={{ width: 640, opacity: logo, scale: String(0.92 + logo * 0.08) }} />
        <div style={{ fontSize: 40, color: color.gray600, opacity: sign, translate: `0 ${(1 - sign) * 16}px` }}>
          Hecho con <span style={{ color: color.black, fontWeight: font.semibold }}>Claude</span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
