// Piezas chicas compartidas por las zonas de la escena de Sincro Presta: íconos de línea, etiquetas, pastillas de sincro y la ventana que envuelve
// cada herramienta recreada. Todo sale del design system que las rodea (`useTheme()`): estas piezas no escriben colores, radios ni pesos.
import React from "react";
import { ThemeScope } from "video-estudio/kit";
import { cornerRadius, readableOn, suggestShade, surfaceStyle, textStyle, useTheme, withAlpha } from "video-estudio/themes";
import type { Theme } from "video-estudio/themes";

/** La cámara está acercada (escala > 1,05): lo que el encuadre corta a propósito se marca con `data-qa-ignore="offscreen"` solo mientras dura el zoom. */
export const ZoomCtx = React.createContext(1);
export const useZoomed = (umbral = 1.05) => React.useContext(ZoomCtx) > umbral;

/** Ícono de línea (un solo trazo `d`) del color y el grosor pedidos. */
export const Icon: React.FC<{ d: string; c?: string; size?: number; w?: number }> = ({ d, c, size = 20, w = 1.8 }) => {
  const t = useTheme();
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
      <path d={d} fill="none" stroke={c ?? t.color.textMuted} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

/** Color de texto para `c` sobre su propia tinta (12 %) en la superficie: el tono más cercano de su matiz que llega a 4,5:1. */
export const inkOn = (t: Theme, c: string) => suggestShade(c, t.color.surface, 5.2) ?? t.color.text;

/** Etiqueta chica ("Mejora", "Fix", "Antes", "Ahora"): tinta del color `c` y letra del mismo matiz con contraste suficiente. */
export const Tag: React.FC<{ children: React.ReactNode; c: string; size?: number; qa?: string }> = ({ children, c, size, qa }) => {
  const t = useTheme();
  return (
    <span data-qa-ignore={qa} style={{ display: "inline-block", padding: "2px 12px", lineHeight: 1.3, borderRadius: cornerRadius(t, "chip"), backgroundColor: t.color.surface, backgroundImage: `linear-gradient(${withAlpha(c, 0.12)}, ${withAlpha(c, 0.12)})`, color: inkOn(t, c), fontSize: size ?? t.type.ui.md, ...textStyle(t, "label", { strong: true }), whiteSpace: "nowrap" }}>{children}</span>
  );
};

/** Pastilla que viaja entre sistemas (Precios, Stock, Catálogo, Pedidos, Sincro de descuentos): superficie de chip con el borde y el halo del color `c`. */
export const Chip: React.FC<{ children: React.ReactNode; c: string }> = ({ children, c }) => {
  const t = useTheme();
  return (
    <span style={{ display: "inline-block", padding: "9px 20px", lineHeight: 1.25, whiteSpace: "nowrap", ...surfaceStyle(t, "chip", { on: true }), border: `2px solid ${c}`, boxShadow: `0 12px 26px -10px ${withAlpha(c, 0.67)}`, color: inkOn(t, c), fontSize: t.type.ui.md, ...textStyle(t, "label", { strong: true }) }}>{children}</span>
  );
};

/**
 * Ventana de una herramienta recreada: `tool` es su design system (se pinta con su fondo, su texto y su tipografía) y el marco (esquinas,
 * sombra) es el de la ventana del design system del video. `data-qa-fixed-scale`: tamaños de la herramienta real, que no se agrandan con el
 * estrés de tipografía.
 */
export const Ventana: React.FC<{ tool: Theme; x: number; y: number; w: number; h: number; style?: React.CSSProperties; children?: React.ReactNode }> = ({ tool, x, y, w, h, style, children }) => {
  const outer = useTheme();
  return (
    <div data-qa-fixed-scale style={{ position: "absolute", left: x, top: y, width: w, height: h }}>
      <ThemeScope theme={tool} paint style={{ position: "absolute", left: 0, top: 0, width: w, height: h, ...surfaceStyle(outer, "window"), background: tool.color.surface, overflow: "hidden", ...style }}>
        {children}
      </ThemeScope>
    </div>
  );
};

/** Barra de un navegador (tres puntos y la dirección) de la tienda: es marco de la interfaz, no mensaje. */
export const BarraNavegador: React.FC<{ url: string }> = ({ url }) => {
  const t = useTheme();
  return (
    <div data-qa-decor style={{ height: 40, background: t.data.fondoNavegador, display: "flex", alignItems: "center", gap: 8, padding: "0 16px" }}>
      {[t.data.semaforoRojo, t.data.semaforoAmarillo, t.data.semaforoVerde].map((c) => (
        <span key={c} style={{ width: 11, height: 11, borderRadius: "50%", background: c }} />
      ))}
      <div style={{ marginLeft: 14, flex: 1, height: 26, borderRadius: cornerRadius(t, "control") * 2, background: t.color.surface, fontSize: t.type.ui.sm, color: t.color.textMuted, display: "flex", alignItems: "center", padding: "0 12px", lineHeight: 1.25 }}>{url}</div>
    </div>
  );
};

/** Texto sobre un relleno de la herramienta: el color con más contraste entre texto, onAccent y superficie. */
export const sobre = (t: Theme, relleno: string) => readableOn(t, relleno);

export const money = (v: number) => "$ " + v.toLocaleString("es-AR");
