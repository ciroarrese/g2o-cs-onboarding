// Zona D: las funciones hechas para cada cliente se funden en la pantalla de configuración del módulo (back office de PrestaShop, pestaña
// "Funciones") y se activan con los interruptores SÍ / NO.
import React from "react";
import { Easing } from "video-estudio/engine";
import { kf, textWidth } from "video-estudio/kit";
import { fade as op, xform } from "video-estudio/fx/core";
import { cornerRadius, readableOn, surfaceStyle, textStyle, useTheme, withAlpha } from "video-estudio/themes";
import { CFG, FEATURES, NAME, T, ZD } from "./datos";
import { tiendaTheme } from "./temas";
import { Ventana, inkOn, useZoomed } from "./ui";

const OUT = Easing.out;

/** Fila `i` de la pantalla de configuración (esquina superior izquierda en el mundo). */
export const filaCfg = (i: number) => ({ x: CFG.x + 26, y: CFG.y + CFG.rowY + i * CFG.rowH - 50, w: CFG.w - 52, h: CFG.rowH - 12 });
/** Centro del interruptor SÍ / NO de la fila `i` (el cursor hace clic ahí). */
export const interruptor = (i: number) => ({ x: CFG.x + CFG.w - 70, y: CFG.y + CFG.rowY + i * CFG.rowH - 50 + 42 });

const Configuracion: React.FC<{ f: number }> = ({ f }) => {
  const t = useTheme();
  const toggledOn = (i: number) => (i === 1 ? f >= T.click1 + 2 : i === 3 ? f >= T.click2 + 2 : FEATURES[i]![2]);
  const saved = f >= T.save + 2;
  const acento = inkOn(t, t.color.accent);
  const ctl = cornerRadius(t, "control");
  const guardar = saved ? t.color.success : t.color.accent;
  return (
    <>
      <div data-qa-decor style={{ height: 56, background: t.data.boCabecera, color: readableOn(t, t.data.boCabecera!), display: "flex", alignItems: "center", padding: "0 22px", fontSize: t.type.ui.md, gap: 10, lineHeight: 1.25 }}>
        <span style={{ color: t.data.boTexto }}>Módulos /</span> {NAME}
        <span style={{ marginLeft: "auto", fontSize: t.type.ui.xs, padding: "4px 10px", borderRadius: ctl, background: t.color.accent, color: readableOn(t, t.color.accent) }}>Configurar</span>
      </div>
      <div data-qa-decor style={{ display: "flex", gap: 26, padding: "16px 26px 0", fontSize: t.type.ui.sm, borderBottom: `1px solid ${t.color.border}`, lineHeight: 1.25 }}>
        {["General", "Precios", "Pedidos", "Funciones"].map((s) => (
          <span key={s} style={{ paddingBottom: 10, ...(s === "Funciones" ? textStyle(t, "label", { strong: true }) : {}), color: s === "Funciones" ? acento : t.color.text, borderBottom: `3px solid ${s === "Funciones" ? t.color.accent : "transparent"}` }}>{s}</span>
        ))}
      </div>
      {FEATURES.map(([name, desc], i) => {
        const s = T.merge + i * 14;
        const rowIn = kf(f, [s + 14, s + 24], [0, 1], OUT);
        const on = toggledOn(i);
        const flip = i === 1 ? kf(f, [T.click1, T.click1 + 8], [0, 1]) : i === 3 ? kf(f, [T.click2, T.click2 + 8], [0, 1]) : 1;
        const r = filaCfg(i);
        const noFill = t.data.noRojo;
        return (
          <div key={name} data-qa-ignore={f >= 858 && f <= 940 ? "offscreen" : undefined /* las filas de abajo entran justo cuando la cámara arranca el acercamiento a los interruptores y quedan en el borde del encuadre */} style={{ position: "absolute", left: 26, top: CFG.rowY + i * CFG.rowH - 50, width: r.w, minHeight: r.h, boxSizing: "border-box", display: "flex", alignItems: "center", gap: 16, borderBottom: `1px solid ${t.color.border}`, opacity: op(rowIn) }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: t.type.eyebrow, ...textStyle(t, "title"), lineHeight: 1.25 }}>{name}</div>
              <div style={{ fontSize: t.type.ui.sm, color: t.color.textMuted, marginTop: 4, lineHeight: 1.25 }}>{desc}</div>
            </div>
            {/* el interruptor "SÍ / NO" de PrestaShop; el que se cambia da un pequeño salto */}
            <div style={{ display: "flex", borderRadius: ctl, overflow: "hidden", border: `1px solid ${t.color.border}`, fontSize: t.type.ui.md, ...textStyle(t, "label", { strong: true }), lineHeight: 1.25, transform: xform({ scale: 1 + (i === 1 || i === 3 ? Math.sin(flip * Math.PI) * 0.12 : 0) }) }}>
              <span style={{ padding: "7px 16px", background: on ? t.color.success : t.color.surface, color: on ? readableOn(t, t.color.success) : t.color.textMuted }}>SÍ</span>
              <span style={{ padding: "7px 16px", background: !on ? noFill : t.color.surface, color: !on ? readableOn(t, noFill!) : t.color.textMuted }}>NO</span>
            </div>
          </div>
        );
      })}
      <div data-qa-ignore="min-size" /* botón visible en la vista general antes y después del acercamiento a los interruptores */ style={{ position: "absolute", right: 26, bottom: 24, padding: "11px 26px", borderRadius: ctl, background: guardar, color: readableOn(t, guardar), fontSize: t.type.ui.md, ...textStyle(t, "label", { strong: true }), lineHeight: 1.25, transform: xform({ scale: 1 - kf(f, [T.save - 3, T.save + 1, T.save + 8], [0, 0.08, 0]) }) }}>
        {saved ? "Configuración guardada" : "Guardar"}
      </div>
    </>
  );
};

export const TarjetasFuncion: React.FC<{ f: number }> = ({ f }) => {
  const t = useTheme();
  const cut = useZoomed(0.9) ? "offscreen" : undefined; // las últimas tarjetas se funden mientras la cámara empieza el acercamiento a los interruptores
  const cw = Math.min(390, Math.max(360, ...FEATURES.map(([n]) => Math.ceil(textWidth(t, n, { size: t.type.ui.md, role: "title" })) + 48))), ch = 190;
  return (
    <>
      {FEATURES.map(([name, desc], i) => {
        const appear = kf(f, [T.cards + i * 4, T.cards + i * 4 + 14], [0, 1], OUT);
        const s = T.merge + i * 14;
        const m = kf(f, [s, s + 20], [0, 1], Easing.bezier(0.5, 0, 0.2, 1));
        if (m >= 1) return null;
        const sx = ZD.x - 820 + (i % 2) * (cw + 40);
        const sy = ZD.y - 330 + Math.floor(i / 2) * 230;
        const r = filaCfg(i);
        const x = sx + (r.x - sx) * m;
        const y = sy + (r.y - sy) * m - Math.sin(m * Math.PI) * 60;
        const w = cw + (r.w - cw) * m;
        const h = ch + (r.h - ch) * m;
        return (
          <div key={name} data-qa-ignore={cut} style={{ position: "absolute", left: Math.round(x), top: Math.round(y), width: Math.round(w), height: Math.round(h), boxSizing: "border-box", ...surfaceStyle(t, "card", { on: m <= 0.6, level: "lg" }), padding: "16px 20px", opacity: op(appear * (1 - Math.max(0, m - 0.7) / 0.3)), zIndex: 20 }}>
            <div style={{ fontSize: t.type.ui.md, ...textStyle(t, "title"), lineHeight: 1.25, whiteSpace: "nowrap" }}>{name}</div>
            <div style={{ fontSize: t.type.ui.md, color: t.color.textMuted, marginTop: 6, lineHeight: 1.25, opacity: op(Math.max(0, 1 - m * 3.5)) }}>{desc}</div>
            <div style={{ fontSize: t.type.ui.md, color: inkOn(t, t.color.accent), marginTop: 8, lineHeight: 1.25, opacity: op(Math.max(0, 1 - m * 3.5)) }}>Hecha para Tienda {String(3 + i * 7).padStart(2, "0")}</div>
          </div>
        );
      })}
    </>
  );
};

export const ZonaD: React.FC<{ f: number }> = ({ f }) => {
  const winIn = kf(f, [T.cards - 6, T.cards + 20], [0, 1], OUT);
  return (
    <>
      <div style={{ opacity: op(winIn) }}>
        <Ventana tool={tiendaTheme} x={CFG.x} y={CFG.y} w={CFG.w} h={CFG.h}>
          <Configuracion f={f} />
        </Ventana>
      </div>
      <TarjetasFuncion f={f} />
    </>
  );
};
