import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { EASE_STANDARD, color, font, gradient, radius, safe, shadow, type } from "./theme";

const ease = Easing.bezier(...EASE_STANDARD);
const loop = (frame: number, fps: number, seconds: number) =>
  (Math.sin((frame / fps / seconds) * Math.PI * 2 - Math.PI / 2) + 1) / 2;

/** Brand gradient text, panning on the 3.5s ease-in-out loop (frame-driven). */
export const GradientText: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ children, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pos = loop(frame, fps, 3.5) * 100;
  return (
    <span
      style={{
        background: gradient.brand,
        backgroundSize: "300% auto",
        backgroundPosition: `${pos}% 50%`,
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        color: "transparent",
        WebkitTextFillColor: "transparent",
        ...style,
      }}
    >
      {children}
    </span>
  );
};

/** Pink / orange / purple blurred blobs drifting slowly (CloudBackground). */
export const CloudBackground: React.FC<{ opacity?: number }> = ({ opacity = 0.5 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const blobs = [
    { c: color.pink, size: "46%", left: "6%", top: "8%", s: 18, dx: 42, dy: -32, k: 1.14 },
    { c: color.orange, size: "38%", left: "52%", top: "22%", s: 22, dx: -38, dy: 36, k: 1.12 },
    { c: color.purple, size: "34%", left: "42%", top: "60%", s: 26, dx: 42, dy: -32, k: 1.14 },
  ];
  return (
    <AbsoluteFill style={{ inset: "-10%", filter: "blur(56px)", opacity }}>
      {blobs.map((b, i) => {
        const t = loop(frame, fps, b.s);
        return (
          <span
            key={i}
            style={{
              position: "absolute",
              borderRadius: "50%",
              background: b.c,
              width: b.size,
              aspectRatio: "1",
              left: b.left,
              top: b.top,
              transform: `translate(${b.dx * t}px, ${b.dy * t}px) scale(${1 + (b.k - 1) * t})`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/** White page with the brand cloud glow and safe-area padding. */
export const Stage: React.FC<{
  children: React.ReactNode;
  clouds?: number;
  background?: string;
}> = ({ children, clouds = 0.22, background = color.white }) => (
  <AbsoluteFill style={{ background, fontFamily: font.family, color: color.gray600 }}>
    {clouds > 0 && <CloudBackground opacity={clouds} />}
    <AbsoluteFill style={{ padding: `${safe.y}px ${safe.x}px` }}>{children}</AbsoluteFill>
  </AbsoluteFill>
);

/** Rise-in reveal (g2o-rise): 24px up + fade, brand easing. */
export const Reveal: React.FC<{
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  style?: React.CSSProperties;
}> = ({ children, delay = 0, duration = 15, style }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame - delay, [0, duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });
  return (
    <div style={{ opacity: p, transform: `translateY(${(1 - p) * 24}px)`, ...style }}>
      {children}
    </div>
  );
};

export const Eyebrow: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      fontSize: type.eyebrow,
      fontWeight: font.medium,
      letterSpacing: "0.06em",
      textTransform: "uppercase",
      color: color.pink,
    }}
  >
    {children}
  </div>
);

export const Heading: React.FC<{
  children: React.ReactNode;
  size?: number;
  style?: React.CSSProperties;
}> = ({ children, size = type.h1, style }) => (
  <div
    style={{
      fontSize: size,
      fontWeight: font.semibold,
      lineHeight: 1.15,
      color: color.black,
      letterSpacing: "-0.01em",
      ...style,
    }}
  >
    {children}
  </div>
);

/** Number that counts up to `to` using the brand easing. */
export const CountUp: React.FC<{
  to: number;
  delay?: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
}> = ({ to, delay = 0, duration = 40, decimals = 0, prefix = "", suffix = "" }) => {
  const frame = useCurrentFrame();
  const v = interpolate(frame - delay, [0, duration], [0, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const txt = v.toLocaleString("es-AR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return (
    <>
      {prefix}
      {txt}
      {suffix}
    </>
  );
};

/** StatCard: white card, hairline border, gradient number, grey label. */
export const StatCard: React.FC<{
  value: React.ReactNode;
  label: string;
  style?: React.CSSProperties;
}> = ({ value, label, style }) => (
  <div
    style={{
      background: color.white,
      border: `1px solid ${color.gray200}`,
      borderRadius: radius.lg * 2,
      boxShadow: shadow.cardSoft,
      padding: "48px 48px 44px",
      display: "flex",
      flexDirection: "column",
      gap: 12,
      ...style,
    }}
  >
    <GradientText style={{ fontSize: 120, fontWeight: font.stat, lineHeight: 1 }}>
      {value}
    </GradientText>
    <div style={{ fontSize: 36, fontWeight: font.semibold, lineHeight: 1.3, color: color.gray600 }}>
      {label}
    </div>
  </div>
);
