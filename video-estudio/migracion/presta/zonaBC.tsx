// Zona B: versiones semanales armadas con pilas de "Mejora" y "Fix". Zona C: el límite de 2 minutos del hosting contra la sincro que corre dentro
// del servidor. Todo es de la marca: superficies, esquinas, pesos, entradas y escalonado salen del design system del video.
import React from "react";
import { Easing } from "video-estudio/engine";
import { Eyebrow, GradientText, kf, textWidth } from "video-estudio/kit";
import { fade as op } from "video-estudio/fx/core";
import { cornerRadius, staggerFrames, surfaceStyle, textStyle, useTheme, withAlpha } from "video-estudio/themes";
import { NAME, T, VERS, WEEKS, ZB, ZC } from "./datos";
import { Chip, Icon, Tag, useZoomed } from "./ui";

const OUT = Easing.out;

// ---------- zona B ----------
/** Medidas de las pilas: el ancho de la columna sale del texto más largo medido con la tipografía del tema (con otra fuente crece, no se corta). */
export const medidasB = (t: ReturnType<typeof useTheme>) => {
  const tag = (s: string) => Math.ceil(textWidth(t, s, { size: t.type.ui.xs, role: "label" })) + 28; // etiqueta: texto + relleno
  let colW = 340;
  for (const items of WEEKS) for (const [kind, title] of items) colW = Math.max(colW, 16 + tag(kind) + 10 + Math.ceil(textWidth(t, title, { size: t.type.ui.sm })) + 18);
  colW = Math.ceil(colW / 10) * 10;
  const gap = 20;
  const total = WEEKS.length * colW + (WEEKS.length - 1) * gap;
  return { colW, gap, total, left: Math.round(ZB.x - total / 2), chipH: 56, chipGap: 8, base: ZB.y + 220 };
};

export const ZonaB: React.FC<{ f: number }> = ({ f }) => {
  const t = useTheme();
  const { colW, gap, left, chipH, chipGap, base } = medidasB(t);
  const landed = WEEKS.map((items, w) => items.filter((_, j) => f >= T.weeks + staggerFrames(t, w, { base: 30 }) + staggerFrames(t, j, { base: 7 }) + 14).length);
  const lastWeek = landed.reduce((a, n, i) => (n > 0 ? i : a), -1);
  return (
    <>
      <div style={{ position: "absolute", left: ZB.x - 600, top: ZB.y - 420, width: 1200, textAlign: "center" }}>
        <Eyebrow>{NAME}</Eyebrow>
        <div style={{ fontSize: t.type.hero * 1.25, ...textStyle(t, "title", { strong: true }), letterSpacing: "-0.03em", lineHeight: 1.05 }}>
          <GradientText>{lastWeek >= 0 ? VERS[lastWeek] : "v2.0"}</GradientText>
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 18, marginTop: 4 }}>
          <Tag c={t.color.success}>Mejora</Tag>
          <Tag c={t.color.accent2}>Fix</Tag>
        </div>
      </div>
      {WEEKS.map((items, w) => {
        const x = left + w * (colW + gap);
        const done = landed[w] === items.length;
        return (
          <React.Fragment key={w}>
            {items.map(([kind, title], j) => {
              const s = T.weeks + staggerFrames(t, w, { base: 30 }) + staggerFrames(t, j, { base: 7 });
              const p = kf(f, [s, s + 16], [0, 1], Easing.bezier(0.3, 0, 0.2, 1.2));
              if (p <= 0) return null;
              const y = base - (j + 1) * (chipH + chipGap);
              const c = kind === "Mejora" ? t.color.success : t.color.accent2;
              // las pilas de las semanas 1 a 3 se ven en vista general y la cámara no las acerca (solo las últimas): su letra no llega al mínimo, la forma de la pila es el mensaje
              const q = w < 3 ? "min-size" : undefined;
              return (
                <div key={title} style={{ position: "absolute", left: x, top: Math.round(y - (1 - p) * 420), width: colW, height: chipH, boxSizing: "border-box", ...surfaceStyle(t, "card", { corner: "panel" }), border: `1.5px solid ${withAlpha(c, 0.33)}`, boxShadow: `inset 5px 0 0 ${c}, ${t.shadow.sm}`, display: "flex", alignItems: "center", gap: 10, padding: "0 12px 0 16px", opacity: op(Math.min(1, p * 2)), fontSize: t.type.ui.sm, lineHeight: 1.25, whiteSpace: "nowrap", overflow: "hidden" }}>
                  <Tag c={c} size={t.type.ui.xs} qa={q}>{kind}</Tag>
                  <span data-qa-ignore={q}>{title}</span>
                </div>
              );
            })}
            <div style={{ position: "absolute", left: x, top: base + 12, width: colW, textAlign: "center" }}>
              <div style={{ fontSize: t.type.ui.md, color: t.color.textMuted, lineHeight: 1.25 }}>Semana {w + 1}</div>
              {/* la versión se enciende cuando se completa la pila; antes está apagada con una opacidad calculada contra el fondo, no fija */}
              <div style={{ marginTop: 8 }}>
                <span style={{ display: "inline-block", padding: "6px 16px", lineHeight: 1.25, borderRadius: cornerRadius(t, "chip"), background: done ? t.gradient.brand : t.color.border, color: done ? t.color.onAccent : t.color.textMuted, fontSize: t.type.ui.md, ...textStyle(t, "label", { strong: true }) }}>{VERS[w]}</span>
              </div>
            </div>
          </React.Fragment>
        );
      })}
    </>
  );
};

// ---------- zona C ----------
const mmss = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
export const CAJA_C = { x: ZC.x - 760, w: 1520, h: 330, top: ZC.y - 420, bot: ZC.y + 40, trackX: 330, trackW: 1080, limite: 0.42 };

/** Caja de una de las dos fases. `dim` atenúa solo su superficie (un hermano del contenido): el texto no baja de contraste mientras la caja espera. */
const Caja: React.FC<{ y: number; tone: string; children: React.ReactNode; dim?: number }> = ({ y, tone, children, dim = 1 }) => {
  const t = useTheme();
  return (
    <div style={{ position: "absolute", left: CAJA_C.x, top: y, width: CAJA_C.w, height: CAJA_C.h }}>
      <div style={{ position: "absolute", inset: 0, ...surfaceStyle(t, "window"), border: `1.5px solid ${withAlpha(tone, 0.27)}`, boxShadow: t.shadow.lg, opacity: op(dim) }} />
      {children}
    </div>
  );
};
const Icono: React.FC<{ d: string; c: string }> = ({ d, c }) => {
  const t = useTheme();
  return (
  <div style={{ position: "absolute", left: 50, top: 110, width: 210, height: 150, borderRadius: cornerRadius(t, "card"), background: withAlpha(c, 0.08), display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
    <Icon d={d} c={c} size={64} w={1.4} />
  </div>
  );
};

export const ZonaC: React.FC<{ f: number }> = ({ f }) => {
  const t = useTheme();
  const zoomed = useZoomed();
  const cut = zoomed ? "offscreen" : undefined; // la caja es más ancha que lo que encuadra el zoom: lo que queda en el borde está cortado a propósito
  const { x: L, trackX, trackW, limite, top, bot } = CAJA_C;
  const p1 = kf(f, [T.web[0], T.web[1]], [0, limite], Easing.linear);
  const failed = f >= T.fail;
  const revert = kf(f, [T.fail + 8, T.fail + 26], [0, 1], Easing.bezier(0.5, 0, 0.2, 1));
  const shake = failed && f < T.fail + 12 ? Math.round(Math.sin(f * 2.4) * 7 * (1 - (f - T.fail) / 12)) : 0;
  const webSecs = Math.min(120, Math.round((p1 / limite) * 120));
  const srvP = kf(f, [T.srv[0], T.srv[1]], [0, 1], Easing.bezier(0.3, 0, 0.35, 1));
  const srvSecs = Math.round(srvP * 250);
  const done = f >= T.srv[1];
  const move = kf(f, [T.move[0], T.move[1]], [0, 1], Easing.bezier(0.5, 0, 0.2, 1));
  const srvOn = kf(f, [T.move[0] - 10, T.move[0] + 10], [0, 1], OUT);
  // la caja del servidor espera con la superficie atenuada (el texto queda entero)
  const dimBase = 0.35;
  const lbl = { fontSize: t.type.ui.md, color: t.color.textMuted, lineHeight: 1.25 } as const;
  return (
    <>
      {/* antes: dentro de la petición del navegador */}
      <div style={{ transform: shake ? `translateX(${shake}px)` : undefined }}>
        <Caja y={top} tone={failed ? t.color.danger : t.color.border}>
          <div data-qa-ignore={cut} style={{ position: "absolute", left: 50, top: 34, display: "flex", alignItems: "center", gap: 14 }}>
            <Tag c={t.color.textMuted}>Antes</Tag>
            <span style={{ fontSize: t.type.caption, ...textStyle(t, "title"), lineHeight: 1.25 }}>Dentro de la página web</span>
          </div>
          <Icono d="M3 5h18v14H3zM3 9h18M7 7h.1M10 7h.1" c={t.color.textMuted} />
          <div data-qa-ignore={cut} style={{ position: "absolute", left: 5, top: 270, width: 300, textAlign: "center", ...lbl }}>Petición del navegador</div>
          <div data-qa-ignore={cut} style={{ position: "absolute", right: 50, top: 24, fontSize: t.type.display.sm, ...textStyle(t, "title", { strong: true }), lineHeight: 1.2, color: failed ? t.color.danger : t.color.text, fontVariantNumeric: "tabular-nums" }}>{mmss(webSecs)}</div>
          <div style={{ position: "absolute", left: trackX, top: 136, ...lbl }}>Sincronizando descuentos</div>
          <div style={{ position: "absolute", left: trackX, top: 176, width: trackW, height: 44, borderRadius: cornerRadius(t, "bar"), background: t.color.surfaceAlt, overflow: "hidden" }}>
            <div style={{ width: `${p1 * (1 - revert) * 100}%`, height: "100%", borderRadius: cornerRadius(t, "bar"), background: failed ? t.color.danger : t.gradient.brand }} />
          </div>
          {/* el muro del hosting */}
          <div style={{ position: "absolute", left: trackX + trackW * limite - 6, top: 150, width: 12, height: 96, borderRadius: cornerRadius(t, "control"), background: t.color.text, boxShadow: failed ? `0 0 0 ${+kf(f, [T.fail, T.fail + 6, T.fail + 30], [0, 10, 0]).toFixed(2)}px ${withAlpha(t.color.danger, 0.27)}` : undefined }} />
          <div style={{ position: "absolute", left: trackX + trackW * limite - 170, top: 252, width: 340, textAlign: "center", fontSize: t.type.ui.md, ...textStyle(t, "label", { strong: true }), lineHeight: 1.25 }}>Límite del hosting · 2:00</div>
          {failed && <div style={{ position: "absolute", right: 50, top: 268, fontSize: t.type.eyebrow, ...textStyle(t, "label", { strong: true }), lineHeight: 1.25, color: t.color.danger, opacity: op(kf(f, [T.fail, T.fail + 8], [0, 1])) }}>Se corta y se revierte todo</div>}
        </Caja>
      </div>

      {/* ahora: un proceso interno del servidor */}
      <Caja y={bot} tone={done ? t.color.success : t.color.chart[2]!} dim={dimBase + srvOn * (1 - dimBase)}>
        <div data-qa-ignore={cut} style={{ position: "absolute", left: 50, top: 34, display: "flex", alignItems: "center", gap: 14 }}>
          <Tag c={t.color.success}>Ahora</Tag>
          <span style={{ fontSize: t.type.caption, ...textStyle(t, "title"), lineHeight: 1.25 }}>Proceso interno en el servidor</span>
        </div>
        <Icono d="M4 4h16v6H4zM4 14h16v6H4zM8 7h.1M8 17h.1M12 7h5M12 17h5" c={t.color.chart[2]!} />
        <div data-qa-ignore={cut} style={{ position: "absolute", left: 5, top: 270, width: 300, textAlign: "center", ...lbl }}>Servidor</div>
        <div data-qa-ignore={cut} style={{ position: "absolute", right: 50, top: 24, fontSize: t.type.display.sm, ...textStyle(t, "title", { strong: true }), lineHeight: 1.2, color: done ? t.color.success : t.color.text, fontVariantNumeric: "tabular-nums" }}>{mmss(srvSecs)}</div>
        <div style={{ position: "absolute", left: trackX, top: 136, ...lbl }}>Sincronizando descuentos · {Math.round(srvP * 486250).toLocaleString("es-AR")}</div>
        <div style={{ position: "absolute", left: trackX, top: 176, width: trackW, height: 44, borderRadius: cornerRadius(t, "bar"), background: t.color.surfaceAlt, overflow: "hidden" }}>
          <div style={{ width: `${srvP * 100}%`, height: "100%", borderRadius: cornerRadius(t, "bar"), background: done ? t.color.success : t.gradient.brand }} />
        </div>
        {/* el fantasma del límite de antes: ya no hay muro */}
        <div style={{ position: "absolute", left: trackX + trackW * 0.48 - 2, top: 150, width: 4, height: 96, borderLeft: `3px dashed ${t.color.border}` }} />
        <div style={{ position: "absolute", left: trackX + trackW * 0.48 - 170, top: 100, width: 340, textAlign: "center", ...lbl, ...textStyle(t, "label") }}>2:00 · sin límite</div>
        {done && <div style={{ position: "absolute", right: 50, top: 268, fontSize: t.type.eyebrow, ...textStyle(t, "label", { strong: true }), lineHeight: 1.25, color: t.color.success, opacity: op(kf(f, [T.srv[1], T.srv[1] + 8], [0, 1])) }}>Completo</div>}
      </Caja>

      {/* el trabajo pasa de la petición web al servidor */}
      {f >= T.move[0] - 4 && f <= T.srv[0] + 4 && (
        <div style={{ position: "absolute", left: 0, top: 0, transform: `translate(${L + trackX + 40}px, ${Math.round(top + 198 + move * (bot - top))}px) translate(-50%, -50%) scale(${(1 + Math.sin(move * Math.PI) * 0.15).toFixed(3)})`, zIndex: 30 }}>
          <Chip c={t.color.chart[2]!}>Sincro de descuentos</Chip>
        </div>
      )}
    </>
  );
};
