// El chat del equipo (a la izquierda del panel): el monitor publica la tarjeta "Sincro Monitor · novedades" con el resumen, los incidentes y los arreglos
// por aprobar. Herramienta recreada, sin logo ni colores de terceros: la ventana se identifica con el rótulo "Teams · chat del equipo".
import React from "react";
import { useFrame } from "video-estudio/engine";
import { CountUp, ThemeScope, kf } from "video-estudio/kit";
import { fade as op } from "video-estudio/fx/core";
import { cornerRadius, dimmedColor, entrance, surfaceStyle, textStyle, useTheme, withAlpha } from "video-estudio/themes";
import { Dot, ICON, Icon, appear, inkOn, scaleOf, tint } from "./piezas";
import { FIXES, NOVEDADES, T, TEAMS } from "./mundo";
import { chatTheme } from "./temas";

const TT = T.teams;
const PAD = 28;

const Header: React.FC<{ f: number }> = ({ f }) => {
  const t = useTheme();
  const ping = appear(f, TT.card, TT.card + 24);
  return (
    <div style={{ minHeight: 76, boxSizing: "border-box", background: t.color.surface, borderBottom: `1px solid ${t.color.surfaceAlt}`, display: "flex", alignItems: "center", gap: 14, padding: `0 ${PAD}px` }}>
      <div style={{ position: "relative", width: 40, height: 40, flexShrink: 0, borderRadius: 20, background: t.color.text, color: t.color.surface, display: "flex", alignItems: "center", justifyContent: "center", fontSize: t.type.ui.sm, ...textStyle(t, "title"), lineHeight: 1 }}>
        S
        {ping > 0 && ping < 1 && <div style={{ position: "absolute", inset: -4, borderRadius: 24, border: `3px solid ${t.color.accent}`, transform: `scale(${(1 + ping * 0.6).toFixed(3)})`, opacity: +(1 - ping).toFixed(3) }} />}
      </div>
      <div style={{ fontSize: t.type.ui.md, ...textStyle(t, "title"), color: t.color.text, whiteSpace: "nowrap", lineHeight: 1.25 }}>Sincro Presta Monitor</div>
      {["Chat", "Compartida", "Notas"].map((tab, i) => (
        <div key={tab} style={{ fontSize: t.type.ui.sm, minHeight: 76, boxSizing: "border-box", display: "flex", alignItems: "center", color: i === 0 ? t.color.text : t.color.textMuted, fontWeight: i === 0 ? t.font.weights.semibold : t.font.weights.regular, boxShadow: i === 0 ? `inset 0 -3px 0 ${t.color.accent}` : undefined, marginLeft: i === 0 ? 10 : 0, lineHeight: 1.25, whiteSpace: "nowrap" }}>
          {tab}
        </div>
      ))}
      <div style={{ flex: 1 }} />
      <div style={{ fontSize: t.type.ui.xs, color: t.color.textMuted, padding: "6px 12px", borderRadius: cornerRadius(t, "chip"), background: t.color.surfaceAlt, whiteSpace: "nowrap", lineHeight: 1.25 }}>Teams · chat del equipo</div>
    </div>
  );
};

const Card: React.FC<{ f: number }> = ({ f }) => {
  const t = useTheme();
  const card = appear(f, TT.card, TT.card + 18);
  const rowIn = (i: number) => appear(f, TT.rows + i * 9, TT.rows + i * 9 + 14);
  const incIn = (i: number) => appear(f, TT.inc + i * 14, TT.inc + i * 14 + 16);
  const fixIn = (i: number) => appear(f, TT.fix + i * 10, TT.fix + i * 10 + 16);
  const fixHi = (i: number) => kf(f, [TT.hi[i]!, TT.hi[i]! + 8, TT.hi[i]! + 40], [0, 1, 0.25]);
  const slide = (p: number) => entrance(t, p, 0, { native: "slide", side: "right", distance: 20 });
  const incidents = [
    { c: t.color.danger, b: "Error en servidor", m: " (#41, nuevo, 1 h): la tienda no respondió en 120 s · ticket # 48213" },
    { c: t.color.accent2, b: "Pedidos sin enviar al ERP", m: " (#36, persistente, 12 h): 3 sin nota de pedido · ", fix: "2 arreglos por aprobar" },
  ];
  return (
    <div style={{ margin: `0 ${PAD}px 0 ${PAD + 46}px`, padding: "22px 26px 24px", boxSizing: "border-box", ...surfaceStyle(t, "panel", { glow: card * 0.6 }), ...entrance(t, card, 0, { native: "rise", distance: 24 }), fontSize: t.type.ui.sm, color: t.color.text, lineHeight: 1.35 }}>
      <div style={{ fontSize: t.type.ui.md, ...textStyle(t, "title") }}>Sincro Monitor · novedades</div>
      <div style={{ fontSize: t.type.ui.xs, color: t.color.textMuted, marginBottom: 12 }}>10/11 23:20 (hora AR)</div>
      {NOVEDADES.map((r, i) => (
        <div key={r.l} style={{ display: "flex", padding: "5px 0", ...slide(rowIn(i)) }}>
          <div style={{ minWidth: 300, ...textStyle(t, "label") }}>{r.l}</div>
          <div>
            {r.n !== undefined && <CountUp to={r.n} start={TT.rows + i * 9} duration={16} />}
            {r.v}
          </div>
        </div>
      ))}
      <div style={{ height: 1, background: t.color.surfaceAlt, margin: "14px 0" }} />
      <div style={{ ...textStyle(t, "title"), marginBottom: 8, opacity: op(incIn(0)) }}>A. Incidentes abiertos</div>
      {/* el rojo de estado es también un código de color: el rótulo y el texto del renglón dicen lo mismo (prioridad alta, error en servidor) */}
      <div style={{ display: "flex", gap: 10, alignItems: "baseline", opacity: op(incIn(0)), color: t.color.danger }}>
        <Dot color={t.color.danger} />
        <div>
          <b style={{ textDecoration: "underline", textUnderlineOffset: 3 }}>tienda-07.ejemplo.com.ar</b> · prioridad alta · 2 incidentes · desde hace 1 h
        </div>
      </div>
      {incidents.map((it, i) => (
        <div key={it.b} style={{ display: "flex", gap: 10, alignItems: "baseline", margin: "8px 0 0 26px", ...slide(incIn(i + 1)) }}>
          <span style={{ width: 6, height: 6, borderRadius: 3, background: t.data.grisMedio, flexShrink: 0, alignSelf: "center" }} />
          <Dot color={it.c} size={12} />
          <div>
            <b>{it.b}</b>
            {it.m}
            {it.fix && (
              <span style={{ whiteSpace: "nowrap" }}>
                <span style={{ display: "inline-block", verticalAlign: -3, marginRight: 4 }}><Icon d={ICON.wrench} color={t.color.accent} size={17} /></span>
                {it.fix}
              </span>
            )}
          </div>
        </div>
      ))}
      <div style={{ height: 1, background: t.color.surfaceAlt, margin: "16px 0 14px" }} />
      <div style={{ ...textStyle(t, "title"), marginBottom: 8, opacity: op(fixIn(0)) }}>B. Arreglos por aprobar</div>
      {FIXES.map((txt, i) => {
        const h = fixHi(i);
        return (
          <div key={txt} style={{ display: "flex", alignItems: "center", gap: 12, padding: "9px 12px", margin: "0 -12px", borderRadius: cornerRadius(t, "control"), background: withAlpha(t.color.accent, h * 0.1), ...slide(fixIn(i)) }}>
            <Icon d={ICON.wrench} color={t.color.accent} size={20} />
            <div style={{ flex: 1 }}>{txt}</div>
            <span style={{ fontSize: t.type.ui.xs, ...textStyle(t, "label"), color: inkOn(t.color.accent, tint(t, t.color.accent)), padding: "4px 12px", borderRadius: cornerRadius(t, "chip"), background: tint(t, t.color.accent), lineHeight: 1.25, whiteSpace: "nowrap", ...scaleOf(1 + h * 0.08) }}>Por aprobar</span>
          </div>
        );
      })}
      <div style={{ marginTop: 18, display: "inline-block", padding: "10px 18px", border: `1.5px solid ${t.color.text}`, borderRadius: cornerRadius(t, "control"), fontSize: t.type.ui.sm, ...textStyle(t, "label"), lineHeight: 1.25, opacity: op(fixIn(2)) }}>
        Abrir Sincro Monitor
      </div>
    </div>
  );
};

const Window: React.FC<{ f: number }> = ({ f }) => {
  const t = useTheme();
  const p = appear(f, TT.win, TT.win + 36);
  if (p <= 0) return null;
  const typing = f >= TT.typing && f < TT.card;
  const stub = dimmedColor(t, "textMuted", "surface", { min: 5.5 });
  return (
    <div style={{ position: "absolute", left: TEAMS.x, top: TEAMS.y, width: TEAMS.w, height: TEAMS.h, boxSizing: "border-box", ...surfaceStyle(t, "window", { corner: "hero" }), background: t.color.bg, overflow: "hidden", ...entrance(t, p, 0, { native: "slide", side: "right", distance: 160 }) }}>
      <Header f={f} />
      {/* el mensaje anterior, cortado por arriba: su superficie va más tenue y el texto, con el color atenuado calculado */}
      <div style={{ position: "relative", margin: `0 ${PAD + 46}px`, padding: "18px 24px", border: `1px solid ${t.color.border}`, borderTop: "none", borderRadius: "0 0 12px 12px", boxSizing: "border-box" }}>
        <div style={{ position: "absolute", inset: 0, background: t.color.surface, borderRadius: "0 0 12px 12px", opacity: 0.55 }} />
        <div style={{ position: "relative", display: "inline-block", padding: "8px 16px", border: `1.5px solid ${stub}`, borderRadius: cornerRadius(t, "control"), fontSize: t.type.ui.xs, color: stub, lineHeight: 1.25, whiteSpace: "nowrap" }}>Abrir Sincro Monitor</div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, margin: `22px ${PAD}px 8px` }}>
        <div style={{ width: 34, height: 34, borderRadius: cornerRadius(t, "control"), background: t.gradient.brand, flexShrink: 0 }} />
        <div style={{ fontSize: t.type.ui.xs, color: t.color.textMuted, lineHeight: 1.25 }}>
          Flujos de trabajo <span style={{ marginLeft: 8 }}>23:20</span>
        </div>
      </div>
      {typing && (
        <div style={{ marginLeft: PAD + 46, display: "flex", gap: 6, padding: "14px 18px", width: 74, boxSizing: "border-box", ...surfaceStyle(t, "panel", { level: "sm" }), boxShadow: undefined }}>
          {[0, 1, 2].map((i) => (
            <span key={i} style={{ width: 9, height: 9, borderRadius: 5, background: t.data.grisMedio, transform: `translateY(${Math.round(-Math.max(0, Math.sin((f - TT.typing) / 3 - i)) * 5)}px)` }} />
          ))}
        </div>
      )}
      <Card f={f} />
    </div>
  );
};

/** La ventana del chat, en su ámbito de tema (`chatTheme`). */
export const ChatWindow: React.FC<{ peek: boolean }> = ({ peek }) => {
  const f = useFrame();
  return (
    <ThemeScope theme={chatTheme}>
      {/* reproducción de la ventana del chat con tamaños fijos (el original la dibuja a 1:1): no se agranda con el estrés de tipografía */}
      {/* si la cámara está en otra ventana, el chat asoma por el borde del cuadro a propósito: es el vecino, no el sujeto (`peek`) */}
      <div data-qa-fixed-scale data-qa-ignore={peek ? "offscreen" : undefined} style={{ position: "absolute", left: 0, top: 0, color: chatTheme.color.text, fontFamily: chatTheme.font.family }}>
        <Window f={f} />
      </div>
    </ThemeScope>
  );
};
