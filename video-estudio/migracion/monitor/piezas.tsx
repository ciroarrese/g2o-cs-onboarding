// Piezas chicas que comparten las tres herramientas: íconos de trazo, tilde y cruz de estado, punto de color. Colores siempre del tema del ámbito.
import React from "react";
import { Easing } from "video-estudio/engine";
import { kf } from "video-estudio/kit";
import { contrastRatio, parseColor, suggestShade, useTheme, withAlpha } from "video-estudio/themes";
import type { Theme } from "video-estudio/themes";

/** Entrada de 0 a 1 entre dos cuadros con la curva de salida de la marca. */
export const appear = (f: number, from: number, to: number) => kf(f, [from, to], [0, 1], Easing.out);
/** Valor con `transform: scale()` solo mientras no es 1 (en reposo no queda `scale(1)`: residuo que rompe `--check`). */
export const scaleOf = (s: number): React.CSSProperties => (+s.toFixed(4) === 1 ? {} : { transform: `scale(${+s.toFixed(4)})` });

export const ICON = {
  search: "M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM20 20l-4-4",
  plus: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 8v8M8 12h8",
  alert: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7.5v5.5M12 16.2v.3",
  bell: "M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15zM10 20.5h4",
  chart: "M4 4v16h16M7 15l4-4 3 3 5-6",
  tag: "M3 12V4h8l10 10-8 8zM7.5 8.2v.1",
  swap: "M4 8h14l-3-3M20 16H6l3 3",
  team: "M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM2.5 20a6.5 6.5 0 0 1 13 0M16 4.3a3.5 3.5 0 0 1 0 6.4M18 14a6.5 6.5 0 0 1 3.5 6",
  userAdd: "M10 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM3 21a7 7 0 0 1 12.5-4.3M19 14v6M16 17h6",
  company: "M6 21V8l6-4 6 4v13M4 21h16M10 21v-5h4v5",
  calendar: "M4 6h16v14H4zM4 10h16M8 3v4M16 3v4",
  chevron: "M7 10l5 5 5-5",
  dots: "M12 5v.1M12 12v.1M12 19v.1",
  wrench: "M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.5-.5-.5-2.5z",
  gear: "M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zM12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21M5.6 5.6l1.8 1.8M16.6 16.6l1.8 1.8M5.6 18.4l1.8-1.8M16.6 7.4l1.8-1.8",
} as const;

/** Ícono de trazo de 24 x 24. `color` es un color ya sacado del tema. */
export const Icon: React.FC<{ d: string; color: string; size?: number; w?: number }> = ({ d, color, size = 22, w = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
    <path d={d} fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** Tilde (verde) o cruz (rojo) de estado dentro de un círculo; `p` 0 a 1 la hace entrar. */
export const Check: React.FC<{ ok: boolean; p: number }> = ({ ok, p }) => {
  const t = useTheme();
  const ink = t.color.onAccent;
  return (
    <div style={{ width: 26, height: 26, borderRadius: 13, flexShrink: 0, background: ok ? t.color.success : t.color.danger, display: "flex", alignItems: "center", justifyContent: "center", opacity: p > 0 ? undefined : 0, ...scaleOf(p > 0 ? p : 1) }}>
      <svg width={14} height={14} viewBox="0 0 16 16">
        {ok ? <path d="M3 8.5l3 3 7-7" stroke={ink} strokeWidth={2.6} fill="none" strokeLinecap="round" /> : <path d="M4 4l8 8M12 4l-8 8" stroke={ink} strokeWidth={2.6} strokeLinecap="round" />}
      </svg>
    </div>
  );
};

/** Punto de color con un aro claro. */
export const Dot: React.FC<{ color: string; size?: number }> = ({ color, size = 14 }) => {
  const t = useTheme();
  return <span style={{ display: "inline-block", width: size, height: size, borderRadius: size, background: color, flexShrink: 0, boxShadow: `inset 0 0 0 1.5px ${withAlpha(t.color.surface, 0.4)}` }} />;
};

/** Fondo opaco de una pastilla teñida: la superficie del tema mezclada con `c` (`a` de 0 a 1). */
export const tint = (t: Theme, c: string, a = 0.12) => {
  const s = parseColor(t.color.surface), k = parseColor(c);
  if (!s || !k) return c;
  const m = (x: number, y: number) => Math.round(x + (y - x) * a);
  return `rgb(${m(s.r, k.r)}, ${m(s.g, k.g)}, ${m(s.b, k.b)})`;
};
/** Tono del mismo matiz que `c` que llega a `min`:1 sobre `bg` (el propio `c` si ya llega): texto de un estado sobre su pastilla teñida. */
export const inkOn = (c: string, bg: string, min = 4.5) => (contrastRatio(c, bg) >= min ? c : suggestShade(c, bg, min) ?? c);
