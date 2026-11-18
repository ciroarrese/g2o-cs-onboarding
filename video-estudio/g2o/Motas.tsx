// Motas de marca (rosa -> naranja -> violeta) que se agrupan contra el borde derecho y laten: el fondo de la intro y del cierre.
// Portado de las plantillas de YouTube del design system. Todo sale del cuadro: sin azar ni estado.
import React from "react";
import { useFrame, useVideoConfig } from "video-estudio/engine";
import { useTheme } from "video-estudio/themes";

type Mota = { x: number; y: number; r: number; mezcla: number; op: number; demora: number; fase: number };

const hexRgb = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));

function sembrar(semilla: number, cantidad: number): Mota[] {
  let s = semilla;
  const rnd = () => (s = (s * 9301 + 49297) % 233280) / 233280;
  const out: Mota[] = [];
  for (let i = 0; i < cantidad; i++) {
    const d = Math.pow(rnd(), 2.2) * 46;
    const x = 100 - d;
    const y = rnd() * 100;
    const z = rnd();
    out.push({ x, y, r: 1.5 + rnd() * 3, mezcla: (x - 54) / 46, op: 0.5 + z * 0.5, demora: 0.2 + rnd() * 1.4, fase: rnd() * 6.28 });
  }
  return out;
}

const suave = (t: number) => (t <= 0 ? 0 : t >= 1 ? 1 : 1 - Math.pow(1 - t, 3));

export function Motas({ semilla = 3, cantidad = 260, salida = 0 }: { semilla?: number; cantidad?: number; /** 0 a 1: cuánto se apagan */ salida?: number }) {
  const f = useFrame();
  const { fps } = useVideoConfig();
  const t = useTheme();
  const T = f / fps;
  const paradas = [t.color.accent, t.color.accent2, t.data.violeta].map(hexRgb);
  const color = (m: number) => {
    const i = m < 0.5 ? 0 : 1;
    const l = m < 0.5 ? m * 2 : (m - 0.5) * 2;
    const A = paradas[i]!, B = paradas[i + 1]!;
    return `rgb(${A.map((v, k) => Math.round(v + (B[k]! - v) * l)).join(",")})`;
  };
  const motas = React.useMemo(() => sembrar(semilla, cantidad), [semilla, cantidad]);
  return (
    <div data-qa-decor="motas de fondo" style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      {motas.map((d, i) => {
        const p = suave((T - d.demora) / 0.8);
        const pulso = 0.75 + 0.25 * Math.sin(T * 1.6 + d.fase);
        return (
          <div
            key={i}
            style={{
              position: "absolute", left: `${d.x}%`, top: `${d.y}%`, width: d.r * 2, height: d.r * 2, borderRadius: "50%",
              background: color(d.mezcla), opacity: d.op * pulso * p * (1 - salida),
              transform: `translateY(${Math.round(Math.sin(T * 0.7 + d.fase) * 6)}px)`,
            }}
          />
        );
      })}
    </div>
  );
}
