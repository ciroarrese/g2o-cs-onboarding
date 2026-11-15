// El estudio: ventana, línea de tiempo con los bloques del video, tarjetas de contexto, conversación con el agente, escalones de etapas,
// rótulos de la tercera parte y la línea de texto de cada momento. Todo en coordenadas del mundo, con las ayudas del design system.
import React from "react";
import { Easing, useFrame } from "video-estudio/engine";
import { Eyebrow, Highlight, Numeral, flight, kf } from "video-estudio/kit";
import { fade as op } from "video-estudio/fx/core";
import { CheckMark } from "video-estudio/stories";
import { cornerRadius, entrance, surfaceStyle, textStyle, useTheme, withAlpha } from "video-estudio/themes";
import { MiniAsistente } from "../asistente/thumb";
import { MiniPresta } from "../presta/thumb";
import { MiniMonitor } from "../monitor/thumb";
import { MiniHealth } from "../historia/thumbs";
import { BLOQUES, CINCO, FORMATOS, PREVIEW, SISTEMAS, WIN } from "./datos";

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
const abs = (x: number, y: number, extra?: React.CSSProperties): React.CSSProperties => ({ position: "absolute", left: x, top: y, ...extra });

// ---------- ventana ----------
export const Ventana: React.FC<{ f: number }> = ({ f }) => {
  const t = useTheme();
  const dots = [t.color.danger, t.color.warning, t.color.success];
  return (
    <div style={{ ...abs(WIN.x, WIN.y), width: WIN.w, height: WIN.h, boxSizing: "border-box", ...surfaceStyle(t, "window"), opacity: op(kf(f, [20, 60], [0, 1])) }}>
      <div style={{ height: WIN.bar, display: "flex", alignItems: "center", gap: 10, padding: "0 24px", boxSizing: "border-box", borderBottom: `1px solid ${t.color.border}` }}>
        {dots.map((c, i) => <span key={i} style={{ width: 14, height: 14, borderRadius: cornerRadius(t, "chip"), background: c }} />)}
        <span style={{ marginLeft: 14, lineHeight: 1.25 }}><Eyebrow color={t.color.text}>Video Studio</Eyebrow></span>
      </div>
    </div>
  );
};

// ---------- línea de tiempo ----------
const MINIS = [MiniAsistente, MiniPresta, MiniMonitor, MiniHealth];
const TL = { x: 105, y: 914, blockY: 950, blockH: 80 };

export const LineaDeTiempo: React.FC<{ f: number }> = ({ f }) => {
  const t = useTheme();
  const gap = 10;
  let x = TL.x;
  const hide = kf(f, [430, 452], [0, 1]);
  if (hide >= 1) return null;
  const rise = kf(f, [64, 90], [0, 1]);
  const out = { opacity: op(rise * (1 - hide)), transform: hide > 0 ? `translateY(${Math.round(hide * 60)}px)` : undefined };
  const last = BLOQUES.length - 1;
  return (
    <div style={{ ...abs(0, 0), width: 1, height: 1, ...out }}>
      <div style={{ ...abs(TL.x, TL.y - 6), whiteSpace: "nowrap", lineHeight: 1.25 }}><Eyebrow>Línea de tiempo</Eyebrow></div>
      {BLOQUES.map((b, i) => {
        const left = x;
        x += b.w + gap;
        const Mini = i > 0 ? MINIS[i - 1]! : null;
        return (
          <div key={b.id} style={{ ...abs(left, TL.blockY), width: b.w, height: TL.blockH, boxSizing: "border-box", display: "flex", alignItems: "center", gap: 12, padding: "0 10px", ...surfaceStyle(t, "card", { level: "sm", corner: "panel" }), ...(i === last ? { borderColor: t.color.accent } : {}) }}>
            {Mini ? (
              <>
                {/* miniatura real de la escena (560x340) a escala 0,2: es adorno de la línea de tiempo y se mide con el estrés de tipografía aparte */}
                {/* data-qa-ignore="clip": la miniatura es otra escena dibujada para su propia tipografía; con la tipografía ancha de reemplazo sus rótulos chicos se cortan dentro de ella, no en esta escena */}
                <div data-qa-decor data-qa-fixed-scale data-qa-ignore="clip" style={{ position: "relative", width: 112, height: 68, flex: "none", overflow: "hidden", borderRadius: cornerRadius(t, "control") }}>
                  <div style={{ position: "absolute", left: 0, top: 0, width: 560, height: 340, transformOrigin: "0 0", transform: "scale(0.2)" }}><Mini /></div>
                </div>
                <span style={{ fontSize: t.type.display.sm, lineHeight: 1.2 }}><Numeral frame={f}>{b.label}</Numeral></span>
              </>
            ) : (
              <span style={{ fontSize: t.type.eyebrow, lineHeight: 1.25, color: t.color.text, whiteSpace: "nowrap", ...textStyle(t, "label") }}>{b.label}</span>
            )}
          </div>
        );
      })}
      {/* cabezal parado donde estamos: casi al final del bloque 04 (Health Score) */}
      <div style={{ ...abs(TL.x + BLOQUES.reduce((a, b) => a + b.w + gap, 0) - gap - 52, TL.blockY - 16), width: 4, height: TL.blockH + 24, background: t.color.accent, borderRadius: cornerRadius(t, "bar") }} />
      <div style={{ ...abs(TL.x + BLOQUES.reduce((a, b) => a + b.w + gap, 0) - gap - 52 - 9, TL.blockY - 26), width: 22, height: 14, background: t.color.accent, borderRadius: cornerRadius(t, "control") }} />
    </div>
  );
};

// ---------- línea de texto de cada momento ----------
type Linea = { from: number; to: number; before: string; hl: string; after: string };
export const LINEAS: Linea[] = [
  { from: 76, to: 176, before: "Este video también lo armó un ", hl: "agente", after: "" },
  { from: 190, to: 318, before: "", hl: "Contexto", after: " + design system" },
  { from: 324, to: 438, before: "Paso a paso, con ", hl: "aprobación", after: "" },
  { from: 454, to: 560, before: "Mismo video, otro ", hl: "design system", after: "" },
  { from: 566, to: 692, before: "", hl: "5", after: " sistemas de diseño" },
  { from: 698, to: 776, before: "", hl: "3", after: " formatos" },
];
export const Banda: React.FC<{ f: number }> = ({ f }) => {
  const t = useTheme();
  return (
    <>
      {LINEAS.map((l, i) => {
        if (f < l.from || f > l.to + 8) return null;
        const p = kf(f, [l.from, l.from + 16], [0, 1]);
        const out = kf(f, [l.to, l.to + 8], [0, 1]);
        return (
          <div key={i} style={{ ...abs(0, 186), width: 1920, minHeight: 72, textAlign: "center", fontSize: t.type.display.md, lineHeight: 1.25, whiteSpace: "nowrap", color: t.color.text, ...textStyle(t, "title"), ...entrance(t, p, 0, { distance: 20 }), opacity: op(Math.min(p, 1 - out)) }}>
            {l.before}<Highlight frame={f}>{l.hl}</Highlight>{l.after}
          </div>
        );
      })}
    </>
  );
};

// ---------- segunda parte: tarjetas de contexto ----------
const CARD = { x: 84, y: PREVIEW.top, w: 340, h: 176, gap: 20 };
const cardTop = (i: number) => CARD.y + i * (CARD.h + CARD.gap);
const IN = (i: number) => 188 + i * 10;
const GO = (i: number) => 262 + i * 16;

const Tarjeta: React.FC<{ i: number; titulo: string; children: React.ReactNode }> = ({ i, titulo, children }) => {
  const t = useTheme();
  return (
    <div style={{ width: CARD.w, height: CARD.h, boxSizing: "border-box", padding: "12px 20px", ...surfaceStyle(t, "card", { level: "sm" }) }}>
      <div style={{ fontSize: t.type.caption, lineHeight: 1.25, color: t.color.text, whiteSpace: "nowrap", ...textStyle(t, "title") }}>{titulo}</div>
      <div style={{ position: "relative", marginTop: 12, height: 90 }}>{children}</div>
    </div>
  );
};

const Capturas: React.FC = () => {
  const t = useTheme();
  return (
    <div style={{ display: "flex", gap: 14 }}>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{ position: "relative", width: 90, height: 76, boxSizing: "border-box", background: t.color.surfaceAlt, border: `1px solid ${t.color.border}`, borderRadius: cornerRadius(t, "control"), overflow: "hidden" }}>
          <span style={abs(8, 8, { width: 34 + i * 10, height: 8, borderRadius: cornerRadius(t, "bar"), background: t.color.chart[i % t.color.chart.length] })} />
          <span style={abs(8, 24, { width: 72, height: 6, borderRadius: cornerRadius(t, "bar"), background: t.color.border })} />
          <span style={abs(8, 38, { width: 56 - i * 8, height: 6, borderRadius: cornerRadius(t, "bar"), background: t.color.border })} />
          <span style={abs(8, 56, { width: 28, height: 10, borderRadius: cornerRadius(t, "bar"), background: t.color.accent })} />
        </div>
      ))}
    </div>
  );
};

const DesignSystem: React.FC = () => {
  const t = useTheme();
  const chips = [t.color.accent, t.color.accent2, t.color.success, t.color.warning, t.color.danger];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, height: 90 }}>
      {chips.map((c, i) => <span key={i} style={{ width: 34, height: 34, flex: "none", borderRadius: cornerRadius(t, "chip"), background: c, border: `1px solid ${t.color.border}` }} />)}
      <span style={{ marginLeft: 6, fontSize: t.type.display.sm, lineHeight: 1.2, color: t.color.text, ...textStyle(t, "title") }}>Aa</span>
    </div>
  );
};

const Guion: React.FC = () => {
  const t = useTheme();
  const w = [100, 78, 90];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {w.map((p, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ width: 14, height: 10, flex: "none", borderRadius: cornerRadius(t, "bar"), background: t.color.accent2 }} />
          <span style={{ width: `${p}%`, maxWidth: 250, height: 9, borderRadius: cornerRadius(t, "bar"), background: t.color.border }} />
        </div>
      ))}
    </div>
  );
};

/** Tres tarjetas entran desde la izquierda y vuelan hacia la vista previa, que se enciende cuando cada una llega. */
export const Tarjetas: React.FC<{ f: number }> = ({ f }) => {
  const targets = { x: PREVIEW.cx, y: PREVIEW.top + PREVIEW.h / 2 };
  const items: [string, React.ReactNode][] = [["Capturas", <Capturas key="c" />], ["Design system", <DesignSystem key="d" />], ["Guion", <Guion key="g" />]];
  return (
    <>
      {items.map(([titulo, cont], i) => {
        const dx = Math.round(kf(f, [IN(i), IN(i) + 22], [-560, 0], Easing.out));
        const fl = flight(f, [GO(i), GO(i) + 34], { x: CARD.x + CARD.w / 2, y: cardTop(i) + CARD.h / 2 }, targets, { arc: (i - 1) * 90 });
        if (f < IN(i)) return null;
        // cuando la tarjeta ya voló, en su lugar queda una huella tenue (la tarjeta ya está en el video): el riel izquierdo no se vacía
        if (f >= GO(i) + 34) {
          const ghost = 0.3 * (1 - kf(f, [428, 444], [0, 1]));
          return ghost > 0 ? <div key={i} style={{ ...abs(CARD.x, cardTop(i)), width: CARD.w, height: CARD.h, opacity: op(ghost) }}><Tarjeta i={i} titulo={titulo}>{cont}</Tarjeta></div> : null;
        }
        const tx = Math.round(fl.x - (CARD.x + CARD.w / 2)) + dx;
        const ty = Math.round(fl.y - (cardTop(i) + CARD.h / 2));
        const s = 1 - 0.65 * fl.t;
        const o = 1 - kf(f, [GO(i) + 22, GO(i) + 34], [0, 1]);
        return (
          <div key={i} style={{ ...abs(CARD.x, cardTop(i)), width: CARD.w, height: CARD.h, transform: fl.t > 0 ? `translate(${tx}px, ${ty}px) scale(${s.toFixed(4)})` : dx !== 0 ? `translate(${dx}px, 0px)` : undefined, opacity: op(o), zIndex: 5 }}>
            <Tarjeta i={i} titulo={titulo}>{cont}</Tarjeta>
          </div>
        );
      })}
    </>
  );
};

/** Cada tarjeta que llega enciende un instante el marco de la vista previa (0 a 1). */
export const pulso = (f: number) => Math.max(...[0, 1, 2].map((i) => kf(f, [GO(i) + 30, GO(i) + 36, GO(i) + 50], [0, 1, 0])));

// ---------- segunda parte: etapas y conversación ----------
const RAIL = { x: 1496, w: 340 };
const ETAPAS = ["Cuestionario", "Guion", "Escenas", "Controles"];
const HECHA = [250, 310, 370, 430];
const ROW = 52;

export const Etapas: React.FC<{ f: number }> = ({ f }) => {
  const t = useTheme();
  const top = PREVIEW.top;
  const total = kf(f, [190, 250, 310, 370], [0, 1 / 3, 2 / 3, 1], Easing.linear);
  const lineH = ROW * 3;
  return (
    <div style={{ ...abs(RAIL.x, top), width: RAIL.w, height: ROW * 4 }}>
      <span style={abs(16, ROW / 2, { width: 2, height: lineH, background: t.color.border })} />
      <span style={abs(16, ROW / 2, { width: 2, height: Math.round(lineH * total), background: t.color.accent })} />
      {ETAPAS.map((e, i) => {
        const done = kf(f, [HECHA[i]!, HECHA[i]! + 14], [0, 1]);
        const start = i === 0 ? 190 : HECHA[i - 1]!;
        const active = f >= start && f < HECHA[i]!;
        return (
          <div key={e} style={{ ...abs(0, i * ROW), height: ROW, width: RAIL.w, display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ position: "relative", width: 34, height: 34, flex: "none" }}>
              <span style={abs(0, 0, { width: 34, height: 34, boxSizing: "border-box", borderRadius: cornerRadius(t, "chip"), background: t.color.surface, border: `2px solid ${active ? t.color.accent : t.color.border}` })} />
              {done > 0 && <span style={abs(0, 0)}><CheckMark p={done} size={34} id={`et${i}`} /></span>}
            </span>
            <span style={{ fontSize: t.type.caption, lineHeight: 1.25, whiteSpace: "nowrap", color: done >= 1 || active ? t.color.text : t.color.textMuted, ...textStyle(t, "label", { strong: active }) }}>{e}</span>
          </div>
        );
      })}
    </div>
  );
};

const MENSAJES = [
  { who: "agente", text: "¿Para quién?", at: 196 },
  { who: "persona", text: "Mi equipo.", at: 228 },
  { who: "agente", text: "Guion listo.", at: 288 },
  { who: "persona", text: "Aprobado.", at: 320 },
  { who: "agente", text: "Armo escenas.", at: 366 },
  { who: "persona", text: "Dale.", at: 398 },
];
const PITCH = 72;
const SLOTS = 4; // mensajes a la vista: al llegar el quinto, el primero sale

export const Conversacion: React.FC<{ f: number }> = ({ f }) => {
  const t = useTheme();
  const top = PREVIEW.top + ROW * 4 + 18;
  const base = MENSAJES.reduce((a, m, j) => a + (j >= SLOTS ? kf(f, [m.at, m.at + 12], [0, 1]) : 0), 0);
  return (
    <>
      <div style={{ ...abs(RAIL.x, top), whiteSpace: "nowrap", lineHeight: 1.25 }}><Eyebrow>Conversación</Eyebrow></div>
      {MENSAJES.map((m, i) => {
        const a = kf(f, [m.at, m.at + 12], [0, 1]);
        const gone = base - i;
        if (a <= 0 || gone >= 1) return null;
        const agente = m.who === "agente";
        return (
          <div key={i} style={{ ...abs(RAIL.x, top + 44 + Math.round((i - base) * PITCH)), width: RAIL.w, display: "flex", justifyContent: agente ? "flex-start" : "flex-end", opacity: op(a * (1 - Math.max(0, gone))) }}>
            <div style={{ minHeight: 58, boxSizing: "border-box", display: "flex", alignItems: "center", padding: "6px 20px", fontSize: t.type.caption, lineHeight: 1.25, whiteSpace: "nowrap", color: t.color.text, ...(agente ? surfaceStyle(t, "card", { level: "sm", corner: "panel" }) : { background: t.color.surfaceAlt, borderRadius: cornerRadius(t, "panel") }), ...textStyle(t, "label") }}>{m.text}</div>
          </div>
        );
      })}
    </>
  );
};

// ---------- tercera parte: rótulos ----------
const LEFT = { x: 84, w: 296 };
const RIGHT = { x: 1540, w: 296 };

const Pastilla: React.FC<{ text: string; on: boolean }> = ({ text, on }) => {
  const t = useTheme();
  return (
    <div style={{ boxSizing: "border-box", minWidth: 190, padding: "4px 22px", fontSize: t.type.caption, lineHeight: 1.25, whiteSpace: "nowrap", textAlign: "center", color: t.color.text, ...surfaceStyle(t, "chip", { on, faint: !on }), ...textStyle(t, "label", { strong: on }) }}>{text}</div>
  );
};

/** Qué sistema y qué formato muestra la vista previa en el cuadro `f`. */
export const actual = (f: number) => {
  let s = -1;
  SISTEMAS.forEach((x, i) => { if (f >= x.at) s = i; });
  let fo = 0;
  FORMATOS.forEach((x, i) => { if (f >= x.at) fo = i; });
  return { sistema: s, formato: fo };
};

export const RielesTercera: React.FC<{ f: number }> = ({ f }) => {
  const t = useTheme();
  const a = kf(f, [452, 470], [0, 1]) * (1 - kf(f, [758, 776], [0, 1]));
  if (f < 440 || a <= 0) return null;
  const { sistema, formato } = actual(f);
  const top = 330;
  const sis = SISTEMAS[Math.max(0, sistema)]!;
  const nombre = sis.label;
  return (
    <>
      <div style={{ ...abs(LEFT.x, top), width: LEFT.w, opacity: op(a) }}>
        <div style={{ lineHeight: 1.25 }}><Eyebrow>Sistema</Eyebrow></div>
        <div key={sis.id} style={{ marginTop: 4, minHeight: 72, fontSize: t.type.display.md, lineHeight: 1.25, whiteSpace: "nowrap", color: t.color.text, ...textStyle(t, "title"), ...entrance(t, kf(f, [sis.at, sis.at + 14], [0, 1]), 0, { distance: 16 }) }}>{nombre}</div>
        <div style={{ marginTop: 34, lineHeight: 1.25 }}><Eyebrow>Formato</Eyebrow></div>
        <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-start" }}>
          {FORMATOS.map((x, i) => <Pastilla key={x.id} text={x.id} on={f >= 626 && i === formato} />)}
        </div>
      </div>
      <div style={{ ...abs(RIGHT.x, top), width: RIGHT.w, opacity: op(a) }}>
        <div style={{ lineHeight: 1.25 }}><Eyebrow>Ejemplos</Eyebrow></div>
        <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-start" }}>
          {CINCO.map((c) => <Pastilla key={c} text={c} on={(c === "neon" && sis.id === "neon") || c === sis.id} />)}
        </div>
      </div>
    </>
  );
};

export { withAlpha, useFrame, clamp01 };
