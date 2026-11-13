// Miniatura real de Health Score para el cierre (lienzo de 560x340, quieta), portada de MiniHealth de Cierre.tsx.
import React from "react";
import { ThemeScope } from "video-estudio/kit";
import { useTheme } from "video-estudio/themes";
import { tableroTheme } from "../theme";

const SIZE = 200, R = 82, W = 24;
const RING = [[96, "estadoInactivo"], [64, "estadoCrecimiento"], [52, "estadoMaduro"], [48, "estadoActivacion"], [22, "estadoCaida"], [14, "estadoEstancado"], [4, "estadoDetenida"]] as const;

function Ring() {
  const t = useTheme();
  const total = RING.reduce((a, v) => a + v[0], 0);
  let acc = 0;
  return (
    <svg width={SIZE} height={SIZE}>
      {RING.map(([v, c], i) => {
        const a0 = -Math.PI / 2 + (acc / total) * Math.PI * 2;
        acc += v;
        const a1 = -Math.PI / 2 + (acc / total) * Math.PI * 2;
        const p = (a: number) => `${SIZE / 2 + Math.cos(a) * R},${SIZE / 2 + Math.sin(a) * R}`;
        return <path key={i} d={`M${p(a0 + 0.02)} A${R},${R} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${p(a1 - 0.02)}`} fill="none" stroke={t.data[c]} strokeWidth={W} />;
      })}
    </svg>
  );
}

function Inner() {
  const t = useTheme();
  const filas = [["Inactivos", 96, t.data.fichaInactivos], ["En caída", 22, t.data.fichaCaida], ["En crecimiento", 64, t.data.fichaCrecimiento]] as const;
  return (
    <>
      <div style={{ padding: "14px 18px", color: t.color.text, fontSize: t.type.ui.sm }}>Distribución de estados (por canal)</div>
      <div style={{ display: "flex", gap: 18, padding: "0 18px", alignItems: "center" }}>
        <Ring />
        <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
          {filas.map(([l, n, c]) => (
            <div key={l} style={{ borderRadius: 6, background: c, color: t.data.strong, padding: "8px 12px", display: "flex", justifyContent: "space-between", fontSize: t.type.ui.sm }}>
              {l}
              <b style={{ fontSize: t.type.ui.md }}>{n}</b>
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
