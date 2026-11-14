// Miniatura de Asistente IA para el cierre (lienzo de 560x340, quieta): la caja de respuesta con el texto ya formateado y, al lado, el panel IA
// oscuro con sus botones. Mismas piezas y mismo tema anidado que la escena. Sin `useFrame`: no depende del cuadro del cierre.
import React from "react";
import { ThemeScope } from "video-estudio/kit";
import { cornerRadius, surfaceStyle, textStyle, useTheme } from "video-estudio/themes";
import { FORMATTED } from "./datos";
import { panelTheme } from "./tema";

const Boton: React.FC<{ label: string; fill: string; ink?: string; full?: boolean }> = ({ label, fill, ink, full }) => {
  const t = useTheme();
  return (
    <div style={{ gridColumn: full ? "1 / -1" : undefined, minHeight: 30, boxSizing: "border-box", borderRadius: cornerRadius(t, "chip"), background: fill, color: ink ?? t.color.onAccent, fontSize: t.type.ui.xs, lineHeight: 1.25, whiteSpace: "nowrap", ...textStyle(t, "label"), display: "flex", alignItems: "center", justifyContent: "center" }}>
      {label}
    </div>
  );
};

const Botones: React.FC = () => {
  const d = useTheme().data;
  return (
    <div style={{ padding: 10, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
      <Boton label="Solo corregir" fill={panelTheme.color.surfaceAlt} />
      <Boton label="Seguir contexto" fill={d.azul!} />
      <Boton label="Con formato" fill={d.violeta!} full />
    </div>
  );
};

const Panel: React.FC = () => {
  return (
    <ThemeScope theme={panelTheme} paint style={{ position: "absolute", left: 290, top: 208, width: 252, boxSizing: "border-box", overflow: "hidden", ...surfaceStyle(panelTheme, "window"), background: panelTheme.color.bg }}>
      <div style={{ height: 30, boxSizing: "border-box", background: panelTheme.color.surface, display: "flex", alignItems: "center", padding: "0 10px", fontSize: panelTheme.type.ui!.xs, lineHeight: 1.25, whiteSpace: "nowrap", ...textStyle(panelTheme, "title") }}>Sugerencia IA</div>
      <Botones />
    </ThemeScope>
  );
};

export const MiniAsistente: React.FC = () => {
  const t = useTheme();
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 560, height: 340, boxSizing: "border-box", ...surfaceStyle(t, "window"), background: t.color.bg, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 18, top: 14, width: 400, whiteSpace: "nowrap", fontSize: t.type.ui.sm, lineHeight: 1.25, ...textStyle(t, "title"), color: t.color.text }}>Pedidos que no bajan al ERP</div>
      <div style={{ position: "absolute", left: 18, top: 50, width: 524, minHeight: 140, boxSizing: "border-box", ...surfaceStyle(t, "card", { corner: "panel", on: true, level: "sm" }), padding: "12px 14px", fontSize: t.type.ui.xs, lineHeight: 1.5, color: t.color.text }}>
        {FORMATTED.map((l, i) => (
          <div key={i} style={{ display: "flex", gap: 6, whiteSpace: "nowrap", paddingLeft: l.bullet ? 6 : 0 }}>
            {l.bullet && <span>•</span>}
            <span>{l.seg.map(([s, b], j) => (b ? <b key={j}>{s}</b> : <span key={j}>{s}</span>))}</span>
          </div>
        ))}
      </div>
      <Panel />
      <div style={{ position: "absolute", left: 18, top: 226, width: 256, minHeight: 60, boxSizing: "border-box", ...surfaceStyle(t, "card", { corner: "panel", on: true, level: "sm" }), padding: "8px 14px", fontSize: t.type.ui.xs, lineHeight: 1.4, color: t.color.text }}>
        <b>Ticket interno creado para Desarrollo:</b> <span style={{ color: t.color.accent }}>#48231</span>
      </div>
    </div>
  );
};
