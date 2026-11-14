// Miniatura de Sincro Monitor para el cierre (lienzo de 560x340, quieta): el panel con sus cifras y la dona, y el aviso de incidente que
// cae sobre la esquina. Portada de lo que la escena muestra en su momento más claro (cuadros 640 a 700).
import React from "react";
import { ThemeScope } from "video-estudio/kit";
import { cornerRadius, surfaceStyle, textStyle, useTheme } from "video-estudio/themes";
import { statusColor } from "./Panel";
import { ICON, inkOn, tint } from "./piezas";
import { STATUS, STORE, TOTAL } from "./mundo";
import { monitorTheme } from "./temas";

const R = 54, W = 20, SIZE = 140;

function Donut() {
  const t = useTheme();
  const C = 2 * Math.PI * R;
  let acc = 0;
  return (
    <svg width={SIZE} height={SIZE}>
      <g transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}>
        {STATUS.map((st, i) => {
          const len = (st.n / TOTAL) * C;
          const off = acc;
          acc += len;
          return <circle key={st.key} cx={SIZE / 2} cy={SIZE / 2} r={R} fill="none" stroke={statusColor(t, i)} strokeWidth={W} strokeDasharray={`${Math.max(len - 2, 0)} ${C}`} strokeDashoffset={-off} opacity={i === 1 ? 1 : 0.3} />;
        })}
      </g>
      <g fontFamily={t.font.family} textAnchor="middle">
        <text x={SIZE / 2} y={SIZE / 2 + 8} fontSize={t.type.stat * 0.2} fontWeight={t.font.weights.stat} fill={t.data.estadoInfra} style={{ color: t.data.estadoInfra }}>61</text>
      </g>
    </svg>
  );
}

function Inner() {
  const t = useTheme();
  const cards = [{ l: "Tiendas", n: TOTAL, i: -1 }, { l: "Sin problemas", n: 128, i: 0 }, { l: "Error en servidor", n: 61, i: 1 }, { l: "Error sincro", n: 23, i: 2 }];
  const pill = statusColor(t, 1);
  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 18px 0" }}>
        <span style={{ width: 24, height: 24, borderRadius: cornerRadius(t, "control"), background: t.gradient.brand }} />
        <span style={{ fontSize: t.type.ui.sm, ...textStyle(t, "title"), color: t.color.text, lineHeight: 1.25 }}>Sincro Monitor</span>
      </div>
      <div style={{ display: "flex", gap: 10, padding: "12px 18px 0" }}>
        {cards.map((c) => (
          <div key={c.l} style={{ flex: 1, minHeight: 64, boxSizing: "border-box", padding: "8px 10px", ...surfaceStyle(t, "card", { level: "sm" }), display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <span style={{ fontSize: t.type.ui.xs * 0.8, color: t.color.textMuted, lineHeight: 1.2, whiteSpace: "nowrap" }}>{c.l}</span>
            <span style={{ fontSize: t.type.stat * 0.2, fontWeight: t.font.weights.stat, lineHeight: 1, color: c.i < 0 ? t.color.text : inkOn(statusColor(t, c.i), t.color.surface, 3.5) }}>{c.n}</span>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 14, padding: "12px 18px 0", alignItems: "center" }}>
        <Donut />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
          {["tienda-07", "tienda-31", "tienda-52"].map((d) => (
            <div key={d} style={{ display: "flex", alignItems: "center", gap: 8, minHeight: 28, fontSize: t.type.ui.xs * 0.85, color: t.color.text, lineHeight: 1.25, whiteSpace: "nowrap" }}>
              <span style={{ padding: "2px 8px", borderRadius: cornerRadius(t, "chip"), background: tint(t, pill), color: inkOn(pill, tint(t, pill)) }}>Error en servidor</span>
              {d}
            </div>
          ))}
        </div>
      </div>
      {/* el aviso cae sobre la esquina de abajo */}
      <div style={{ position: "absolute", right: 14, bottom: 12, width: 326, boxSizing: "border-box", padding: "10px 14px", ...surfaceStyle(t, "card", { level: "lg" }), boxShadow: `inset 5px 0 0 ${t.color.danger}, ${t.shadow.lg}`, display: "flex", gap: 10, alignItems: "center" }}>
        <svg width={26} height={26} viewBox="0 0 24 24" style={{ flexShrink: 0 }}><path d={ICON.bell} fill="none" stroke={t.color.danger} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /></svg>
        <div style={{ lineHeight: 1.25, whiteSpace: "nowrap" }}>
          <div style={{ fontSize: t.type.ui.xs * 0.95, ...textStyle(t, "title"), color: t.color.text }}>Nuevo incidente · prioridad alta</div>
          <div style={{ fontSize: t.type.ui.xs * 0.8, color: t.color.textMuted }}>{STORE}</div>
        </div>
      </div>
    </>
  );
}

export const MiniMonitor: React.FC = () => (
  <ThemeScope theme={monitorTheme} paint style={{ width: 560, height: 340, ...surfaceStyle(monitorTheme, "window", { corner: "hero" }), background: monitorTheme.color.bg, boxSizing: "border-box", overflow: "hidden" }}>
    <Inner />
  </ThemeScope>
);
export const thumbnail = MiniMonitor;
