import React from "react";
import { AbsoluteFill, Easing, interpolate, random } from "remotion";
import { color } from "./theme";

/** Shared motion helpers. Everything is a pure function of the frame. */

export const OUT = Easing.bezier(0.16, 1, 0.3, 1);
export const IN_OUT = Easing.bezier(0.65, 0, 0.35, 1);

/** Clamped interpolate with an easing (default ease-in-out). */
export const k = (f: number, input: number[], output: number[], easing: (t: number) => number = IN_OUT) =>
  interpolate(f, input, output, { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing });

/** Two-digit hex alpha for colour strings. */
export const hex = (a: number) => Math.round(Math.max(0, Math.min(1, a)) * 255).toString(16).padStart(2, "0");

/** Text typed at `cps` characters per frame from `start`. */
export const typed = (text: string, f: number, start: number, cps = 1.4) =>
  text.slice(0, Math.max(0, Math.floor((f - start) * cps)));

/**
 * Keyframed path: `keys` are [frame, x, y] stops; returns the position at `f`.
 * Used for the cursor and anything that travels between targets.
 */
export const path = (f: number, keys: [number, number, number][]) => {
  const t = keys.map((q) => q[0]);
  return { x: k(f, t, keys.map((q) => q[1])), y: k(f, t, keys.map((q) => q[2])) };
};

/** Cursor with a pink click ripple at each frame in `clicks`. World coordinates. */
export const Cursor: React.FC<{
  f: number;
  keys: [number, number, number][];
  clicks: number[];
  show: [number, number];
}> = ({ f, keys, clicks, show }) => {
  const { x, y } = path(f, keys);
  const visible = k(f, [show[0], show[0] + 10, show[1] - 10, show[1]], [0, 1, 1, 0], Easing.linear);
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: visible, zIndex: 50 }}>
      {clicks.map((c) => {
        const p = k(f, [c, c + 18], [0, 1], OUT);
        return (
          <div
            key={c}
            style={{
              position: "absolute",
              left: -30,
              top: -30,
              width: 60,
              height: 60,
              borderRadius: 30,
              border: `3px solid ${color.pink}`,
              scale: String(0.3 + p * 1.2),
              opacity: p > 0 && p < 1 ? 1 - p : 0,
            }}
          />
        );
      })}
      <svg
        width={34}
        height={40}
        viewBox="0 0 24 28"
        style={{
          position: "absolute",
          left: -4,
          top: -3,
          filter: "drop-shadow(0 4px 6px rgba(0,0,0,.25))",
          scale: String(1 - clicks.reduce((a, c) => a + k(f, [c - 3, c, c + 6], [0, 0.15, 0]), 0)),
        }}
      >
        <path d="M2 2l18 11-8 2-4 8z" fill={color.black} stroke="#fff" strokeWidth={1.6} strokeLinejoin="round" />
      </svg>
    </div>
  );
};

/** True when a click at `c` has happened (with a small lag for the UI to react). */
export const after = (f: number, c: number, lag = 2) => f >= c + lag;

// ---------- Doodle Boil ----------
// Hand-drawn strokes in the brand gradient that "boil": the wobble is re-seeded
// every 3 frames, like traditional hand-drawn animation.

const boilSeed = (f: number) => Math.floor(f / 3);

const DoodleDefs: React.FC<{ id: string }> = ({ id }) => (
  <defs>
    <linearGradient id={id} x1="0" x2="1" y1="0" y2="0">
      <stop offset="0" stopColor={color.pink} />
      <stop offset="1" stopColor={color.orange} />
    </linearGradient>
  </defs>
);

/** A wobbly ellipse drawn on from `start`, slightly overshooting its own start. */
export const DoodleCircle: React.FC<{
  f: number;
  start: number;
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  end?: number;
  id: string;
  width?: number;
}> = ({ f, start, cx, cy, rx, ry, end = 99999, id, width = 5 }) => {
  if (f < start) return null;
  const draw = k(f, [start, start + 16], [0, 1], OUT);
  const fade = k(f, [end, end + 10], [1, 0], Easing.linear);
  const seed = boilSeed(f);
  const n = 28;
  const pts: string[] = [];
  for (let i = 0; i <= n + 3; i++) {
    const a = -2.2 + (i / n) * Math.PI * 2.15;
    const j = (random(`${id}-${seed}-${i}`) - 0.5) * 7;
    const grow = 1 + (i / n) * 0.06;
    pts.push(`${(cx + Math.cos(a) * (rx + j) * grow).toFixed(1)},${(cy + Math.sin(a) * (ry + j) * grow).toFixed(1)}`);
  }
  const len = 2 * Math.PI * Math.max(rx, ry) * 1.2;
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible", pointerEvents: "none", opacity: fade, zIndex: 40 }} width={1} height={1}>
      <DoodleDefs id={id} />
      <polyline
        points={pts.join(" ")}
        fill="none"
        stroke={`url(#${id})`}
        strokeWidth={width}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={len}
        strokeDashoffset={len * (1 - draw)}
      />
    </svg>
  );
};

/** A wobbly curved arrow from (x1,y1) to (x2,y2), drawn on from `start`. */
export const DoodleArrow: React.FC<{
  f: number;
  start: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  bend?: number;
  id: string;
  end?: number;
}> = ({ f, start, x1, y1, x2, y2, bend = 0.25, id, end = 99999 }) => {
  if (f < start) return null;
  const draw = k(f, [start, start + 20], [0, 1], OUT);
  const fade = k(f, [end, end + 10], [1, 0], Easing.linear);
  const seed = boilSeed(f);
  const mx = (x1 + x2) / 2 - (y2 - y1) * bend;
  const my = (y1 + y2) / 2 + (x2 - x1) * bend;
  const n = 24;
  const pts: [number, number][] = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const x = (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * mx + t * t * x2;
    const y = (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * my + t * t * y2;
    const j = i === 0 || i === n ? 0 : (random(`${id}-${seed}-${i}`) - 0.5) * 4;
    pts.push([x + j, y + j]);
  }
  const shown = pts.slice(0, Math.max(2, Math.round(draw * pts.length)));
  const [ax, ay] = shown[shown.length - 1];
  const [bx, by] = shown[shown.length - 2];
  const ang = Math.atan2(ay - by, ax - bx);
  const head = (d: number) => `${ax - Math.cos(ang + d) * 22},${ay - Math.sin(ang + d) * 22}`;
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible", pointerEvents: "none", opacity: fade, zIndex: 40 }} width={1} height={1}>
      <DoodleDefs id={id} />
      <polyline points={shown.map((p) => p.join(",")).join(" ")} fill="none" stroke={`url(#${id})`} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
      {draw > 0.95 && (
        <polyline points={`${head(0.5)} ${ax},${ay} ${head(-0.5)}`} fill="none" stroke={color.orange} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
      )}
    </svg>
  );
};

/** Soft vignette used during Digital Zoom, so the eye goes to the centre. */
export const Vignette: React.FC<{ amount: number }> = ({ amount }) => (
  <AbsoluteFill
    style={{
      pointerEvents: "none",
      background: `radial-gradient(ellipse at center, transparent 45%, rgba(26,26,28,${0.28 * amount}) 100%)`,
    }}
  />
);
