// La mesa de ayuda recreada (vista de un ticket), en el estilo de la marca: ventana, barra superior, riel, encabezado, mensaje inicial,
// editor de respuesta, comentarios y columna derecha. Estructura y rótulos de la herramienta real; empresa, personas y número de ticket, ficticios.
// Las posiciones son las del mundo del original, escritas relativas a la ventana (su esquina es W.x, W.y). Alturas y interlíneas explícitas.
import React from "react";
import { kf, typed } from "video-estudio/kit";
import { Easing, useFrame } from "video-estudio/engine";
import { fade as op } from "video-estudio/fx/core";
import { cornerRadius, entrance, surfaceStyle, textStyle, useTheme } from "video-estudio/themes";
import { C, COMMENT_Y, DICTATED, EDITOR, FORMATTED, MAIN, NEW_TICKET, SIDE, TICKET, W } from "./datos";

const OUT = Easing.out;

const Icon: React.FC<{ d: string; c?: string; size?: number; w?: number }> = ({ d, c, size = 22, w = 1.8 }) => {
  const t = useTheme();
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
      <path d={d} fill="none" stroke={c ?? t.color.textMuted} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};
export const ICON = {
  search: "M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM20 20l-4-4",
  chart: "M4 4v16h16M7 15l4-4 3 3 5-6",
  tag: "M3 12V4h8l10 10-8 8zM7.5 8.2v.1",
  swap: "M4 8h14l-3-3M20 16H6l3 3",
  team: "M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM2.5 20a6.5 6.5 0 0 1 13 0M16 4.3a3.5 3.5 0 0 1 0 6.4M18 14a6.5 6.5 0 0 1 3.5 6",
  userAdd: "M10 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM3 21a7 7 0 0 1 12.5-4.3M19 14v6M16 17h6",
  chevron: "M7 10l5 5 5-5",
  mic: "M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3zM5 11a7 7 0 0 0 14 0M12 18v3",
  plus: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 8v8M8 12h8",
  bell: "M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15zM10 20.5h4",
};
export { Icon };

const Avatar: React.FC<{ t: string; c: string; size?: number }> = ({ t: label, c, size = 34 }) => {
  const th = useTheme();
  return (
    <div data-qa-decor /* iniciales del avatar */ style={{ width: size, height: size, borderRadius: cornerRadius(th, "chip"), background: c, color: th.color.onAccent, fontSize: th.type.ui.xs, fontWeight: th.font.weights.semibold, lineHeight: 1, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      {label}
    </div>
  );
};

/** Bloque de la columna derecha: título con flecha, línea y contenido; `minHeight` fija el lugar del siguiente sin que el contenido lo pise. */
const SideBlock: React.FC<{ title: string; minHeight: number; children: React.ReactNode }> = ({ title, minHeight, children }) => {
  const t = useTheme();
  return (
    <div style={{ minHeight, boxSizing: "border-box" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: t.type.ui.sm, lineHeight: 1.25, color: t.color.text, paddingBottom: 10, borderBottom: `1px solid ${t.color.border}` }}>
        {title}
        <Icon d={ICON.chevron} size={18} />
      </div>
      <div style={{ paddingTop: 12 }}>{children}</div>
    </div>
  );
};

/** Campo de la columna derecha (borde, fondo de superficie). */
const Field: React.FC<{ children: React.ReactNode; h: number; size: number }> = ({ children, h, size }) => {
  const t = useTheme();
  return (
    <div style={{ minHeight: h, boxSizing: "border-box", ...surfaceStyle(t, "card", { corner: "control", level: "sm" }), display: "flex", alignItems: "center", padding: "0 12px", fontSize: size, lineHeight: 1.25, color: t.color.text }}>
      {children}
    </div>
  );
};

/**
 * `zoomed`: la cámara está encuadrando una parte (el panel o el editor) y deja cortado el resto de la mesa a propósito.
 * `recede`: 0 a 1, cuánto se aleja la ventana cuando el panel se levanta (la profundidad que el original le daba con translateZ).
 */
export const TicketView: React.FC<{ zoomed: boolean; recede: number }> = ({ zoomed, recede }) => {
  const f = useFrame();
  const t = useTheme();
  const editorOpen = kf(f, [C.dictar + 4, C.dictar + 22], [0, 1], OUT);
  const formatted = f >= C.formatoDone;
  const dictText = typed(DICTATED, f, C.dictar + 18, 1.9);
  const caret = Math.floor(f / 10) % 2 === 0 && f < C.dictStop;
  const commentIn = kf(f, [C.fly[1] - 4, C.fly[1] + 14], [0, 1], OUT);
  const glow = kf(f, [C.fly[1], C.fly[1] + 10, C.fly[1] + 60], [0, 1, 0.3]);
  // coordenadas relativas a la ventana
  const rx = (x: number) => x - W.x;
  const ry = (y: number) => y - W.y;
  const lifting = f > C.lift[0] && f < C.lift[1];
  const cut = zoomed ? "offscreen" : undefined; // el encuadre de la cámara deja cortado el resto de la mesa a propósito
  const sink = recede > 0 ? { transform: `perspective(2200px) translateZ(${-60 * recede}px)` } : {};
  const ink = t.color.text;
  return (
    /* reproducción de la mesa de ayuda: tamaños fijos de la herramienta real */
    <div data-qa-fixed-scale style={{ position: "absolute", left: W.x, top: W.y, width: W.w, height: W.h, ...sink }}>
      {/* ventana: barra superior y riel (marco de la herramienta) */}
      <div data-qa-decor style={{ position: "absolute", inset: 0, boxSizing: "border-box", ...surfaceStyle(t, "window"), background: t.color.bg, overflow: "hidden" }}>
        <div style={{ height: W.top, boxSizing: "border-box", background: t.color.surface, borderBottom: `1px solid ${t.color.border}`, display: "flex", alignItems: "center", gap: 18, padding: "0 26px 0 18px" }}>
          <div style={{ width: 26, height: 26, borderRadius: cornerRadius(t, "control"), background: t.gradient.brand }} />
          <div style={{ fontSize: t.type.ui.sm, lineHeight: 1.25, ...textStyle(t, "title"), color: ink }}>Mesa de ayuda</div>
          <div style={{ flex: 1 }} />
          <div style={{ width: 300, height: 34, boxSizing: "border-box", borderRadius: cornerRadius(t, "control"), background: t.color.bg, border: `1px solid ${t.color.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 12px", fontSize: t.type.ui.xs, lineHeight: 1.25, whiteSpace: "nowrap", color: t.color.textMuted }}>
            Buscar por ticket o empresa
            <Icon d={ICON.search} size={16} />
          </div>
          <Icon d={ICON.plus} c={t.color.accent} size={20} />
          <Icon d={ICON.bell} size={20} />
        </div>
        <div style={{ position: "absolute", left: 0, top: W.top, bottom: 0, width: W.rail, background: ink, display: "flex", flexDirection: "column", alignItems: "center", gap: 12, paddingTop: 20 }}>
          {[ICON.chart, ICON.tag, ICON.swap, ICON.team, ICON.userAdd].map((d, i) => (
            <div key={d} style={{ width: 40, height: 40, borderRadius: cornerRadius(t, "control"), background: i === 1 ? t.gradient.brand : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon d={d} c={t.color.surface} size={20} />
            </div>
          ))}
        </div>
      </div>

      {/* encabezado */}
      <div data-qa-ignore={cut} style={{ position: "absolute", left: rx(MAIN.x), top: ry(W.y + W.top + 26), display: "flex", alignItems: "center", gap: 12, whiteSpace: "nowrap" }}>
        <Icon d={ICON.tag} c={t.color.accent} size={26} />
        <div style={{ fontSize: t.type.caption, lineHeight: 1.25, ...textStyle(t, "label"), color: ink }}>Pedidos que no bajan al ERP</div>
      </div>
      <div data-qa-ignore={cut} style={{ position: "absolute", left: rx(MAIN.x + 38), top: ry(W.y + W.top + 74), display: "flex", alignItems: "center", gap: 14, fontSize: t.type.ui.sm, lineHeight: 1.25, whiteSpace: "nowrap" }}>
        <span style={{ color: t.color.accent }}>Tickets / Agente de soporte / #{TICKET}</span>
        <span style={{ width: 9, height: 9, borderRadius: cornerRadius(t, "chip"), background: t.color.danger }} />
        <span style={{ color: t.color.textMuted }}>Esperando al agente</span>
      </div>
      <div data-qa-ignore={cut} style={{ position: "absolute", left: rx(960), top: ry(W.y + W.top + 30), display: "flex", gap: 16, alignItems: "center", whiteSpace: "nowrap" }}>
        <div style={{ padding: "10px 18px", border: `1.5px solid ${ink}`, borderRadius: cornerRadius(t, "control"), fontSize: t.type.ui.sm, lineHeight: 1.25, ...textStyle(t, "label"), color: ink }}>Reasignar Ticket</div>
        <div style={{ padding: "10px 18px", ...surfaceStyle(t, "card", { corner: "control", level: "md" }), fontSize: t.type.ui.xs, lineHeight: 1.25, color: t.color.textMuted, textAlign: "center" }}>
          Prioridad
          <div style={{ color: t.color.accent }}>Media</div>
        </div>
      </div>
      <div style={{ position: "absolute", left: W.rail, top: ry(290), width: W.w - W.rail, height: 1, background: t.color.border }} />

      {/* mensaje inicial */}
      <div style={{ position: "absolute", left: rx(MAIN.x), top: ry(312), width: MAIN.w, height: 210, boxSizing: "border-box", ...surfaceStyle(t, "card", { corner: "panel", level: "sm" }), padding: "18px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: t.type.ui.xs, lineHeight: 1.25, color: t.color.textMuted, paddingBottom: 12, borderBottom: `1px solid ${t.color.border}`, whiteSpace: "nowrap" }}>
          <Avatar t="T" c={t.color.accent2} size={30} />
          <span style={{ color: ink, textDecoration: "underline" }}>Tienda 18</span> Cliente
          <span style={{ marginLeft: 12 }}>11 NOV 26 - 09:12</span>
          <span style={{ marginLeft: "auto", color: t.color.accent, ...textStyle(t, "label", { strong: true }) }}>#{TICKET}</span>
        </div>
        <div style={{ fontSize: t.type.ui.sm, lineHeight: 1.6, color: ink, marginTop: 14 }}>
          Hola, tenemos tres pedidos de ayer que no bajaron al ERP.
          <br />
          ¿Nos pueden revisar? Gracias.
        </div>
      </div>

      {/* acciones */}
      <div style={{ position: "absolute", left: rx(MAIN.x), top: ry(540), width: MAIN.w, minHeight: 40, display: "flex", alignItems: "center", fontSize: t.type.ui.sm, lineHeight: 1.25, whiteSpace: "nowrap" }}>
        <span style={{ color: ink }}>Más opciones ⌄</span>
        <span style={{ marginLeft: "auto", color: t.color.accent, marginRight: 22 }}>Derivar</span>
        <span data-qa-ignore={cut} /* la cámara encuadra el panel y deja el borde de la mesa cortado */ style={{ padding: "9px 20px", borderRadius: cornerRadius(t, "control"), background: t.color.accent, color: t.color.onAccent, ...textStyle(t, "label") }}>Responder</span>
      </div>

      {/* editor de respuesta */}
      <div
        style={{
          position: "absolute", left: rx(MAIN.x), top: ry(EDITOR.y), width: MAIN.w, height: EDITOR.h * editorOpen, boxSizing: "border-box", overflow: "hidden", opacity: op(editorOpen),
          ...surfaceStyle(t, "card", { corner: "panel", on: editorOpen > 0.5, glow: 0.5 * editorOpen }),
        }}
      >
        <div data-qa-decor style={{ height: 38, boxSizing: "border-box", display: "flex", alignItems: "center", gap: 18, padding: "0 16px", borderBottom: `1px solid ${t.color.border}`, fontSize: t.type.ui.sm, lineHeight: 1.25, color: t.color.textMuted }}>
          <b>B</b>
          <i>I</i>
          <u>U</u>
          <span>•≡</span>
          <span>1.≡</span>
        </div>
        <div data-qa-ignore={cut} /* con el zoom del panel la cámara deja el borde izquierdo del editor cortado a propósito */ style={{ padding: "14px 18px", fontSize: t.type.ui.sm, lineHeight: 1.55, color: ink }}>
          {!formatted ? (
            <span>
              {dictText}
              {caret && <span style={{ color: t.color.accent }}>|</span>}
            </span>
          ) : (
            FORMATTED.map((l, i) => {
              const a = kf(f, [C.formatoDone + i * 4, C.formatoDone + i * 4 + 12], [0, 1], OUT);
              return (
                <div key={i} style={{ display: "flex", gap: 10, minHeight: 27, ...entrance(t, a, i, { native: "slide", side: "right", distance: 14 }), paddingLeft: l.bullet ? 10 : 0 }}>
                  {l.bullet && <span>•</span>}
                  <span>{l.seg.map(([s, b], j) => (b ? <b key={j}>{s}</b> : <span key={j}>{s}</span>))}</span>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* comentarios */}
      <div style={{ position: "absolute", left: rx(MAIN.x), top: ry(838), width: MAIN.w, display: "flex", justifyContent: "space-between", alignItems: "baseline", fontSize: t.type.ui.sm, lineHeight: 1.25, color: ink, paddingBottom: 8, borderBottom: `1px solid ${t.color.border}` }}>
        Comentarios
        <span data-qa-ignore={cut} /* encuadre del panel: el contador queda cortado a propósito */ style={{ color: t.color.textMuted, fontSize: t.type.ui.xs, whiteSpace: "pre" }}><span>Total de comentarios: </span><span data-qa-decor /* el contador sube de 4 a 5 en el cuadro final: no se lee a este zoom */>{f >= C.fly[1] ? 5 : 4}</span></span>
      </div>
      <div
        style={{
          position: "absolute", left: rx(MAIN.x), top: ry(COMMENT_Y), width: MAIN.w, height: 96, boxSizing: "border-box", padding: "14px 20px", overflow: "hidden",
          ...surfaceStyle(t, "card", { corner: "panel", on: true, glow }), ...entrance(t, commentIn, 0, { native: "rise", distance: 20 }),
        }}
      >
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 5, background: t.color.accent }} />
        <div data-qa-decor /* autor y etiqueta del comentario: marco, el mensaje es la línea de abajo */ style={{ display: "flex", gap: 10, alignItems: "center", fontSize: t.type.ui.xs, lineHeight: 1.25, color: t.color.textMuted, whiteSpace: "nowrap" }}>
          <Avatar t="AS" c={ink} size={26} />
          Agente de soporte · Agente
          <span style={{ marginLeft: 8, padding: "2px 10px", borderRadius: cornerRadius(t, "chip"), background: t.color.surfaceAlt, color: t.color.textMuted, fontSize: t.type.ui.xs, lineHeight: 1.25 }}>Interno</span>
        </div>
        <div style={{ fontSize: t.type.ui.sm, lineHeight: 1.3, marginTop: 8, color: ink, whiteSpace: "nowrap" }}>
          <b>Ticket interno creado para Desarrollo:</b> <span style={{ color: t.color.accent, textDecoration: "underline" }}>#{NEW_TICKET}</span>
        </div>
      </div>

      {/* columna derecha */}
      <div data-qa-ignore={[cut, lifting ? "contrast covered" : undefined].filter(Boolean).join(" ") || undefined} /* encuadre del panel (corta la columna) y, mientras el panel se levanta, pasa por encima de ella */ style={{ position: "absolute", left: rx(SIDE.x), top: ry(312), width: SIDE.w }}>
        <SideBlock title="Empresa asociada" minHeight={94}>
          <Field h={38} size={t.type.ui.sm}>Tienda 18</Field>
        </SideBlock>
        <SideBlock title="Participantes" minHeight={134}>
          {[
            ["AS", "Agente de soporte", "Agente responsable"],
            ["AG", "Agente de guardia", "Agente"],
          ].map(([a, n, r]) => (
            <div key={n} style={{ display: "flex", alignItems: "center", gap: 10, minHeight: 26, fontSize: t.type.ui.xs, lineHeight: 1.25, marginBottom: 10, whiteSpace: "nowrap" }}>
              <Avatar t={a!} c={a === "AS" ? ink : t.color.chart[2]!} size={26} />
              <span style={{ textDecoration: "underline" }}>{n}</span>
              <span style={{ color: t.color.textMuted }}>&gt; {r}</span>
            </div>
          ))}
        </SideBlock>
        <SideBlock title="SLA" minHeight={110}>
          <div style={{ display: "flex", gap: 24 }}>
            {[
              ["1° Respuesta", t.color.success, 0.12],
              ["Resolución", t.color.warning, 0.46],
            ].map(([l, c, v]) => (
              <div key={l as string} style={{ flex: 1, fontSize: t.type.ui.xs, lineHeight: 1.25, whiteSpace: "nowrap" }}>
                {l as string}
                <div style={{ height: 6, borderRadius: cornerRadius(t, "bar"), background: t.color.surfaceAlt, marginTop: 10 }}>
                  <div style={{ height: 6, borderRadius: cornerRadius(t, "bar"), width: `${(v as number) * 100}%`, background: c as string }} />
                </div>
              </div>
            ))}
          </div>
        </SideBlock>
        <SideBlock title="Categorización" minHeight={100}>
          {["Consulta/incidente", "Integraciones"].map((c) => (
            <div key={c} style={{ marginBottom: 8 }}>
              <Field h={36} size={t.type.ui.xs}>{c}</Field>
            </div>
          ))}
        </SideBlock>
      </div>
    </div>
  );
};
