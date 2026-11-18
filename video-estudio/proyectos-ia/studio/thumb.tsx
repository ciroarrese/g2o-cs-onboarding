// Miniatura de Video Studio para el cierre (lienzo de 560x340, quieta): la ventana del estudio con la vista previa en el medio (miniatura de Health Score),
// una baldosa de efectos a cada lado y la línea de tiempo con los bloques del video y el cabezal. Sin `useFrame`: los efectos se dibujan en su cuadro final (`frame` fijo).
import React from "react";
import { BarsGrow, DonutRing } from "video-estudio/fx";
import { cornerRadius, surfaceStyle, textStyle, useTheme } from "video-estudio/themes";
import { MiniHealth } from "../historia/thumbs";

const FIN = 400; // cuadro final de los efectos (ya compuestos)

const Baldosa: React.FC<{ x: number; y: number; w: number; h: number; children: React.ReactNode }> = ({ x, y, w, h, children }) => {
  const t = useTheme();
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, boxSizing: "border-box", overflow: "hidden", ...surfaceStyle(t, "card", { level: "sm", corner: "panel" }) }}>{children}</div>
  );
};

export const MiniStudio: React.FC = () => {
  const t = useTheme();
  const bloques = [44, 74, 104, 124, 94];
  let x = 22;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 560, height: 340, boxSizing: "border-box", overflow: "hidden", ...surfaceStyle(t, "window"), background: t.color.bg, boxShadow: "none" /* sin sombra propia: la miniatura vuela achicada en la vuelta de revelación y la sombra de un panel tan chico se rasteriza distinto según el historial de cuadros (`--check` fallaba en 0,014 % de los píxeles); el panel del cierre ya trae la suya */ }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 560, height: 34, boxSizing: "border-box", display: "flex", alignItems: "center", gap: 7, padding: "0 16px", borderBottom: `1px solid ${t.color.border}` }}>
        {[t.color.danger, t.color.warning, t.color.success].map((c, i) => <span key={i} style={{ width: 9, height: 9, borderRadius: cornerRadius(t, "chip"), background: c }} />)}
        <span style={{ marginLeft: 8, fontSize: t.type.ui.sm, lineHeight: 1.25, whiteSpace: "nowrap", color: t.color.text, ...textStyle(t, "title") }}>Video Studio</span>
      </div>
      <Baldosa x={20} y={52} w={116} h={150}>
        <BarsGrow frame={FIN} start={0} width={116} height={150} data={[40, 64, 52]} labels={["A", "B", "C"]} format={() => ""} />
      </Baldosa>
      {/* vista previa: miniatura real de Health Score (560x340) a escala 0,45 */}
      <div data-qa-decor style={{ position: "absolute", left: 154, top: 52, width: 252, height: 153, overflow: "hidden", ...surfaceStyle(t, "panel", { on: true }) }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: 560, height: 340, transformOrigin: "0 0", transform: "scale(0.45)" }}><MiniHealth /></div>
      </div>
      <Baldosa x={424} y={52} w={116} h={150}>
        <div style={{ position: "absolute", left: 2, top: 22 }}>
          <DonutRing frame={FIN} start={0} width={112} height={112} value={5} max={5} unit="" label="" />
        </div>
      </Baldosa>
      <div style={{ position: "absolute", left: 22, top: 222, whiteSpace: "nowrap", fontSize: t.type.ui.xs, lineHeight: 1.25, color: t.color.textMuted, ...textStyle(t, "label") }}>Línea de tiempo</div>
      {bloques.map((w, i) => {
        const left = x;
        x += w + 8;
        return <div key={i} style={{ position: "absolute", left, top: 248, width: w, height: 62, boxSizing: "border-box", ...surfaceStyle(t, "card", { level: "sm", corner: "control" }), ...(i === bloques.length - 1 ? { borderColor: t.color.accent } : {}) }} />;
      })}
      <div style={{ position: "absolute", left: 504, top: 238, width: 3, height: 82, background: t.color.accent, borderRadius: cornerRadius(t, "bar") }} />
    </div>
  );
};

export const thumbnail = MiniStudio;
