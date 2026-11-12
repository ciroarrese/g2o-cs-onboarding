import React from "react";
import { AbsoluteFill, Easing, interpolate, random, useCurrentFrame } from "remotion";
import "../brand/fonts";
import { CloudBackground, GradientText } from "../brand/primitives";
import { color, font, gradient, radius } from "../brand/theme";

/**
 * Opening: a wall of real labels from the four tools (Headline Wall), the
 * title, then the four project headlines; the camera flies through the first
 * one (Zoom Through) and its headline docks top-left, as in every scene.
 * 300 frames at 30 fps.
 */

export const PROJECTS = [
  { name: "Asistente IA", line: "responde, dicta y escala sin salir del ticket" },
  { name: "Módulo Sincro Presta", line: "la tienda y el ERP, siempre sincronizados" },
  { name: "Sincro Monitor", line: "avisa antes de que el cliente reclame" },
  { name: "Health Score", line: "a quién contactar primero" },
] as const;

const LABELS = [
  "Solo corregir", "Seguir contexto", "Con formato", "Escalado desarrollo", "Dictar",
  "Crear reporte", "Errores de pedidos", "Precios incrementales", "Cuenta corriente",
  "Control de crédito", "Pre-venta", "Productos sustitutos", "Sincronizando productos",
  "Error en servidor", "Error sincro", "Crear ticket", "Asignar ticket", "Arreglos por aprobar",
  "Incidentes abiertos", "Sincro Monitor · novedades", "En crecimiento", "Maduro", "En caída",
  "Cola de atención", "En activación", "Cartera sana", "Severidad alta", "Oportunidades comerciales",
];

const T = { title: 6, wallOff: [84, 112] as const, heads: 96, headGap: 22, fly: [232, 282] as const, dock: 270 };

const OUT = Easing.bezier(0.16, 1, 0.3, 1);
const IN_OUT = Easing.bezier(0.65, 0, 0.35, 1);
const k = (f: number, i: number[], o: number[], e: (t: number) => number = IN_OUT) =>
  interpolate(f, i, o, { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: e });

// Wall layout: 5 columns x 6 rows, brick offset, light jitter and depth.
const COLS = 5;
const WALL = LABELS.map((text, i) => {
  const col = i % COLS;
  const row = Math.floor(i / COLS);
  return {
    text,
    x: -820 + col * 410 + (row % 2) * 150 + (random(`x${i}`) - 0.5) * 40,
    y: -400 + row * 160 + (random(`y${i}`) - 0.5) * 24,
    z: -260 + random(`z${i}`) * 360,
    on: 14 + random(`on${i}`) * 62,
  };
});

const Chip: React.FC<{ text: string; lit: number; pop: number }> = ({ text, lit, pop }) => (
  <div
    style={{
      padding: "16px 28px",
      borderRadius: radius.pill,
      background: color.white,
      border: `2px solid ${lit > 0.5 ? color.pink + "66" : color.gray200}`,
      boxShadow: `0 ${10 + pop * 16}px ${30 + pop * 20}px -14px rgba(231,0,126,${0.12 + pop * 0.35})`,
      fontSize: 30,
      fontWeight: font.medium,
      color: lit > 0.5 ? color.black : color.gray300,
      whiteSpace: "nowrap",
      scale: String(1 + pop * 0.12),
    }}
  >
    {text}
  </div>
);

const Headline: React.FC<{ i: number; f: number; small?: boolean }> = ({ i, f, small }) => {
  const p = PROJECTS[i];
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: small ? 12 : 26, whiteSpace: "nowrap" }}>
      <span
        style={{
          fontSize: small ? 20 : 30,
          fontWeight: font.stat,
          width: small ? undefined : 58,
        }}
      >
        <GradientText>{String(i + 1).padStart(2, "0")}</GradientText>
      </span>
      <span style={{ fontSize: small ? 28 : 76, fontWeight: font.semibold, color: color.black, letterSpacing: "-0.02em" }}>
        {p.name}
      </span>
      <span style={{ fontSize: small ? 22 : 40, color: color.gray600 }}>· {p.line}</span>
    </div>
  );
};

/** Small docked headline, top-left; reused by every project scene. */
export const DockedHeadline: React.FC<{ i: number; f: number; start: number; hide?: number }> = ({ i, f, start, hide = 0 }) => {
  const a = k(f, [start, start + 18], [0, 1], OUT) * (1 - Math.max(0, Math.min(1, hide)));
  return (
    <div
      style={{
        position: "absolute",
        left: 64,
        top: 48,
        padding: "14px 24px",
        borderRadius: radius.pill,
        background: "rgba(255,255,255,.86)",
        border: `1px solid ${color.gray200}`,
        boxShadow: "0 12px 30px -16px rgba(26,26,28,.3)",
        opacity: a,
        translate: `${(1 - a) * -30}px 0`,
      }}
    >
      <Headline i={i} f={f} small />
    </div>
  );
};

export const Apertura: React.FC = () => {
  const f = useCurrentFrame();

  // camera dolly through the wall, slow drift + tilt
  const dolly = k(f, [0, 110], [0, 260], Easing.linear);
  const ry = k(f, [0, 110], [-10, 6], Easing.linear);
  const rx = k(f, [0, 110], [6, -3], Easing.linear);
  const wallFade = k(f, [T.wallOff[0], T.wallOff[1]], [1, 0.06]);
  const wallBack = k(f, [T.wallOff[0], T.wallOff[1] + 20], [0, -900], OUT);

  // title
  const titleIn = k(f, [T.title, T.title + 26], [0, 1], OUT);
  const titleOut = k(f, [T.wallOff[0] - 4, T.wallOff[0] + 18], [0, 1]);

  // fly-through of headline 01
  const fly = k(f, [T.fly[0], T.fly[1]], [0, 1], Easing.bezier(0.7, 0, 0.84, 0));
  const flyScale = Math.pow(60, fly);
  const othersOut = k(f, [T.fly[0] - 6, T.fly[0] + 14], [1, 0]);
  const flash = k(f, [T.fly[1] - 18, T.fly[1] - 4], [0, 1], Easing.linear);

  return (
    <AbsoluteFill style={{ background: color.gray50, fontFamily: font.family, overflow: "hidden" }}>
      <CloudBackground opacity={0.22} />

      {/* Headline Wall */}
      <AbsoluteFill style={{ perspective: 1400, opacity: wallFade }}>
        <div
          style={{
            position: "absolute",
            left: 960,
            top: 540,
            transformStyle: "preserve-3d",
            transform: `translateZ(${dolly + wallBack}px) rotateX(${rx}deg) rotateY(${ry}deg)`,
          }}
        >
          {WALL.map((c, i) => {
            const lit = k(f, [c.on, c.on + 3], [0, 1], Easing.linear);
            const pop = k(f, [c.on, c.on + 5, c.on + 22], [0, 1, 0]);
            const appear = k(f, [i * 0.6, 10 + i * 0.6], [0, 1], OUT);
            return (
              <div
                key={c.text}
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  transform: `translate(-50%, -50%) translate3d(${c.x}px, ${c.y}px, ${c.z}px)`,
                  opacity: appear,
                }}
              >
                <Chip text={c.text} lit={lit} pop={pop} />
              </div>
            );
          })}
        </div>
      </AbsoluteFill>

      {/* Title */}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
        <div
          style={{
            padding: "34px 64px",
            borderRadius: 40,
            background: `rgba(247,247,248,${0.82 * titleIn})`,
            boxShadow: `0 30px 80px -30px rgba(26,26,28,${0.25 * titleIn})`,
            backdropFilter: "blur(6px)",
            opacity: titleIn * (1 - titleOut),
            translate: `0 ${(1 - titleIn) * 40 - titleOut * 120}px`,
            scale: String(0.94 + titleIn * 0.06 - titleOut * 0.1),
          }}
        >
          <div style={{ fontSize: 120, fontWeight: font.semibold, color: color.black, letterSpacing: "-0.03em", lineHeight: 1.05 }}>
            Proyectos <GradientText>con IA</GradientText>
          </div>
        </div>
      </AbsoluteFill>

      {/* Four headlines; the first one is the fly-through target */}
      <div style={{ position: "absolute", left: 230, top: 250 }}>
        {PROJECTS.map((_, i) => {
          const s = T.heads + i * T.headGap;
          const a = k(f, [s, s + 24], [0, 1], OUT);
          const isFirst = i === 0;
          return (
            <div
              key={i}
              style={{
                height: 150,
                display: "flex",
                alignItems: "center",
                opacity: a * (isFirst ? 1 - k(f, [T.fly[1] - 6, T.fly[1]], [0, 1]) : othersOut),
                translate: `${(1 - a) * 80}px 0`,
                filter: `blur(${(1 - a) * 8}px)`,
                transformOrigin: "255px 50%",
                scale: isFirst ? String(flyScale) : "1",
              }}
            >
              <Headline i={i} f={f} />
              <div
                style={{
                  position: "absolute",
                  left: 84,
                  top: 118,
                  height: 5,
                  borderRadius: 3,
                  width: k(f, [s + 10, s + 40], [0, 340], OUT),
                  background: gradient.brand,
                  opacity: isFirst ? 1 - fly : othersOut,
                }}
              />
            </div>
          );
        })}
      </div>

      {/* passing through the letters: soft white wash, then the docked tag */}
      <AbsoluteFill style={{ background: color.gray50, opacity: flash * (1 - k(f, [T.fly[1], T.fly[1] + 14], [0, 1])) }} />
      <DockedHeadline i={0} f={f} start={T.dock + 6} />
    </AbsoluteFill>
  );
};
