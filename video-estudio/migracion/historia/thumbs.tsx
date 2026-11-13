// Miniatura real de Health Score para el cierre (lienzo de 560x340, quieta), portada de MiniHealth de Cierre.tsx.
import React from "react";
import { ThemeScope } from "video-estudio/kit";
import { useTheme } from "video-estudio/themes";
import { tablero, tableroTheme } from "../theme";

const SIZE = 200, R = 82, W = 24;
const E = tablero.estados;
const RING: [number, string][] = [[96, E.inactivo], [64, E.crecimiento], [52, E.maduro], [48, E.activacion], [22, E.caida], [14, E.estancado], [4, E.detenida]];

function Ring() {
  const total = RING.reduce((a, v) => a + v[0], 0);
  let acc = 0;
  return (
    <svg width={SIZE} height={SIZE}>
      {RING.map(([v, c], i) => {
        const a0 = -Math.PI / 2 + (acc / total) * Math.PI * 2;
        acc += v;
        const a1 = -Math.PI / 2 + (acc / total) * Math.PI * 2;
        const p = (a: number) => `${SIZE / 2 + Math.cos(a) * R},${SIZE / 2 + Math.sin(a) * R}`;
        return <path key={i} d={`M${p(a0 + 0.02)} A${R},${R} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${p(a1 - 0.02)}`} fill="none" stroke={c} strokeWidth={W} />;
      })}
    </svg>
  );
}

function Inner() {
  const t = useTheme();
  const F = tablero.fichas;
  const filas: [string, number, string][] = [["Inactivos", 96, F.inactivos], ["En caída", 22, F.caida], ["En crecimiento", 64, F.crecimiento]];
  return (
    <>
      <div style={{ padding: "14px 18px", color: t.color.text, fontSize: 16 }}>Distribución de estados (por canal)</div>
      <div style={{ display: "flex", gap: 18, padding: "0 18px", alignItems: "center" }}>
        <Ring />
        <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
          {filas.map(([l, n, c]) => (
            <div key={l} style={{ borderRadius: 6, background: c, color: tablero.strong, padding: "8px 12px", display: "flex", justifyContent: "space-between", fontSize: 16 }}>
              {l}
              <b style={{ fontSize: 22 }}>{n}</b>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export const MiniHealth: React.FC = () => (
  <ThemeScope theme={tableroTheme} paint style={{ width: 560, height: 340, borderRadius: 22, border: `1px solid ${tableroTheme.color.border}`, boxSizing: "border-box", overflow: "hidden" }}>
    <Inner />
  </ThemeScope>
);
