// Grow2on tokens, mirrored from .claude/skills/grow2on-design/tokens/*.css
// for use in Remotion (inline styles, no CSS variables at render time).

export const color = {
  pink: "#e7007e",
  pinkDark: "#b8005f",
  pinkLight: "#fce4f0",
  orange: "#f56406",
  orangeLight: "#fee6d3",
  purple: "#770ce9",
  black: "#1a1a1c",
  white: "#ffffff",
  gray50: "#f7f7f8",
  gray100: "#eeedef",
  gray200: "#dcdadd",
  gray300: "#b8b6ba",
  gray600: "#5c5b5f",
  success: "#1fa25a",
  warning: "#f5a623",
  error: "#d7016b",
  tintPink8: "#e7007e14",
} as const;

export const gradient = {
  brand: `linear-gradient(90deg, ${color.pink} 0%, ${color.orange} 100%)`,
  thumb3: "linear-gradient(135deg,#ffe3cf,#ffd6ea,#e9d5ff)",
} as const;

export const font = {
  family: "Geist",
  regular: 400,
  medium: 500,
  semibold: 600,
  // The brand only uses 700 for stat numbers.
  stat: 700,
} as const;

export const radius = { sm: 6, md: 10, panel: 12, lg: 16, sheet: 20, pill: 999 } as const;

export const shadow = {
  sm: "0 1px 2px rgba(26,26,28,.06)",
  md: "0 4px 12px rgba(26,26,28,.1)",
  lg: "0 12px 32px rgba(26,26,28,.14)",
  cardSoft: "0 8px 20px -8px rgba(0,0,0,.12)",
} as const;

// Video type scale for 1920x1080 (web sizes are too small for video).
export const type = {
  hero: 120,
  h1: 96,
  h2: 72,
  body: 44,
  caption: 32,
  eyebrow: 26,
  stat: 180,
} as const;

// Safe area for 1920x1080.
export const safe = { x: 140, y: 110 } as const;

// cubic-bezier(.4,0,.2,1) — the brand's reveal easing.
export const EASE_STANDARD = [0.4, 0, 0.2, 1] as const;
