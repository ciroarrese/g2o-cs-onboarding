// Miniatura de Sincro Presta para el cierre (lienzo de 560x340, quieta): la tienda y el ERP con el mismo precio y el módulo en el medio.
import React from "react";
import { ThemeScope } from "video-estudio/kit";
import { cornerRadius, readableOn, surfaceStyle, textStyle, useTheme, withAlpha } from "video-estudio/themes";
import { ART, NAME, PRODUCTS, TILE } from "./datos";
import { erpTheme, tiendaTheme } from "./temas";
import { Icon, money } from "./ui";

const Tienda: React.FC = () => {
  const t = useTheme();
  return (
    <div style={{ display: "flex", gap: 8, padding: 10 }}>
      {PRODUCTS.slice(0, 2).map((p, i) => (
        <div key={p.id} style={{ flex: 1, background: t.color.surface, boxShadow: t.shadow.sm, textAlign: "center" }}>
          <div style={{ height: 56, background: t.data[TILE[i]!], display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon d={ART[p.id]!} size={34} c={withAlpha(t.color.text, 0.33)} w={1.4} />
          </div>
          <div style={{ padding: "6px 4px 8px", fontSize: t.type.ui.xs, lineHeight: 1.25 }}>
            <div style={{ minHeight: 34, fontSize: t.type.ui.xs }}>{p.n}</div>
            <div style={{ fontSize: t.type.ui.sm, whiteSpace: "nowrap", ...textStyle(t, "label", { strong: true }) }}>{money(i === 0 ? p.p[1] : p.p[0])}</div>
            <div style={{ marginTop: 4, minHeight: 18, background: t.color.accent, color: readableOn(t, t.color.accent), fontSize: t.type.ui.xs }}>AÑADIR</div>
          </div>
        </div>
      ))}
    </div>
  );
};

const Erp: React.FC = () => {
  const t = useTheme();
  return (
    <div style={{ padding: 10, fontSize: t.type.ui.xs, lineHeight: 1.25 }}>
      <div style={{ background: t.color.accent, color: t.color.onAccent, textAlign: "center", padding: "3px 0", fontSize: t.type.ui.xs }}>-Flexxus-</div>
      <div style={{ marginTop: 8, border: `1px solid ${t.color.border}`, background: t.color.surface }}>
        {PRODUCTS.slice(0, 3).map((p, i) => (
          <div key={p.id} style={{ display: "flex", justifyContent: "space-between", padding: "5px 6px", borderBottom: i < 2 ? `1px solid ${t.color.surfaceAlt}` : undefined, background: i === 0 ? withAlpha(t.data.resaltado, 0.6) : undefined }}>
            <span>{p.code}</span>
            <span>{money(i === 0 ? p.p[1] : p.p[0])}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const MiniPresta: React.FC = () => {
  const t = useTheme();
  const win = { ...surfaceStyle(t, "window", { level: "sm" }), overflow: "hidden", position: "absolute" as const, height: 168 };
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 560, height: 340, color: t.color.text }}>
      <div style={{ position: "absolute", left: 20, top: 20, width: 520, height: 44, ...surfaceStyle(t, "card", { corner: "chip", level: "md" }), display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxSizing: "border-box" }}>
        <span style={{ fontSize: t.type.ui.sm, ...textStyle(t, "title"), lineHeight: 1.25 }}>{NAME}</span>
      </div>
      <ThemeScope theme={tiendaTheme} paint style={{ ...win, left: 20, top: 84, width: 250, background: tiendaTheme.color.surface, ...surfaceStyle(t, "window", { level: "sm" }) }}>
        <Tienda />
      </ThemeScope>
      <ThemeScope theme={erpTheme} paint style={{ ...win, left: 290, top: 84, width: 250, background: erpTheme.color.bg, ...surfaceStyle(t, "window", { level: "sm" }) }}>
        <Erp />
      </ThemeScope>
      <div style={{ position: "absolute", left: 20, top: 268, width: 520, display: "flex", justifyContent: "center", gap: 8 }}>
        {["Precios", "Stock", "Catálogo", "Pedidos"].map((s) => (
          <span key={s} style={{ padding: "3px 12px", ...surfaceStyle(t, "chip", { on: true, level: "sm" }), borderRadius: cornerRadius(t, "chip"), fontSize: t.type.ui.sm, lineHeight: 1.25, ...textStyle(t, "label", { strong: true }) }}>{s}</span>
        ))}
      </div>
    </div>
  );
};

export const thumbnail = MiniPresta;
