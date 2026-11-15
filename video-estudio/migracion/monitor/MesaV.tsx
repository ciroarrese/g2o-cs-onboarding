// La mesa de ayuda en vertical y cuadrado (abajo a la derecha del panel, ver `angosto.ts`): la lista "No asignados" con una tarjeta de dos renglones por ticket
// (el ticket, el tipo y la prioridad arriba; la empresa, la fecha, los SLA y "Asignar ticket" abajo), el ticket que vuela desde el botón del panel y el ticket
// abierto en una sola columna: el mensaje, el editor de la respuesta debajo y los datos del ticket (empresa, participantes, categoría, SLA) al pie.
// Mismos textos, cifras y tiempos que la mesa horizontal (`Mesa.tsx`); herramienta recreada con su propio design system (`mesaTheme`).
import React from "react";
import { Easing, useFrame } from "video-estudio/engine";
import { FlyingCard, ThemeScope, kf } from "video-estudio/kit";
import { fade as op } from "video-estudio/fx/core";
import { Typewriter } from "video-estudio/fx/text";
import { borderWidth, cornerRadius, dimmedColor, entrance, surfaceStyle, textStyle, useTheme, withAlpha } from "video-estudio/themes";
import { ICON, Icon, appear, inkOn, scaleOf, tint } from "./piezas";
import { LOG, MESA_NEW, MESA_ROWS, REPLY, STORE, T, TICKET } from "./mundo";
import type { Fila } from "./mundo";
import { BTNV, CARD_WV, EDV, MES, MESA_SLOT_V, MEV, TVXV } from "./angosto";
import { Badge, SlaPill, TypeIcon } from "./Mesa";
import { mesaTheme } from "./temas";

/** Marco de la herramienta: barra superior (logo, nombre, íconos). */
const Chrome: React.FC<{ search?: boolean }> = ({ search }) => {
  const t = useTheme();
  const hint = dimmedColor(t, "textMuted", "bg", { min: 4.5 });
  return (
    <div style={{ minHeight: MES.top, boxSizing: "border-box", background: t.color.surface, borderBottom: `1px solid ${t.color.surfaceAlt}`, display: "flex", alignItems: "center", gap: 20, padding: "0 28px 0 22px" }}>
      <div style={{ width: 28, height: 28, borderRadius: cornerRadius(t, "control"), background: t.gradient.brand, flexShrink: 0 }} />
      <div style={{ fontSize: t.type.ui.md, ...textStyle(t, "title"), color: t.color.text, whiteSpace: "nowrap", lineHeight: 1.25 }}>Mesa de ayuda</div>
      {search && (
        <>
          <div style={{ flex: 1 }} />
          <Icon d={ICON.search} color={hint} />
          <Icon d={ICON.plus} color={t.color.accent} />
          <Icon d={ICON.alert} color={t.color.textMuted} />
          <Icon d={ICON.bell} color={t.color.textMuted} />
        </>
      )}
    </div>
  );
};

const Hairline: React.FC = () => {
  const t = useTheme();
  return <div style={{ height: 1, background: t.color.surfaceAlt, flexShrink: 0 }} />;
};

/** Tarjeta de ticket de dos renglones. */
const TicketCardV: React.FC<{ r: Fila; highlight?: number; isNew?: boolean }> = ({ r, highlight = 0, isNew }) => {
  const t = useTheme();
  const btn = { minHeight: 40, boxSizing: "border-box" as const, borderRadius: cornerRadius(t, "control"), display: "flex", alignItems: "center", fontSize: t.type.ui.md, ...textStyle(t, "label"), lineHeight: 1.25, whiteSpace: "nowrap" as const };
  const prColor = r.off ? inkOn(t.data.grisMedio!, t.data.grisClaro!, 4.5) : isNew ? inkOn(t.color.danger, tint(t, t.color.accent, 0.11)) : t.color.text;
  return (
    <div style={{ minHeight: MES.card, width: CARD_WV, boxSizing: "border-box", display: "flex", flexDirection: "column", justifyContent: "center", gap: 12, padding: "14px 18px 14px 22px", ...surfaceStyle(t, "panel", { level: isNew ? "md" : "sm" }), ...(isNew ? { background: withAlpha(t.color.accent, 0.03 + highlight * 0.08), border: `1px solid ${withAlpha(t.color.accent, 0.33)}`, boxShadow: `inset 5px 0 0 ${t.color.accent}, ${t.shadow.md}` } : {}), fontSize: t.type.ui.sm, color: t.color.text, whiteSpace: "nowrap", lineHeight: 1.25 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ minWidth: 70, color: t.color.textMuted }}>{r.id}</div>
        <TypeIcon inc={r.inc} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ ...textStyle(t, "label", { strong: isNew }), textDecoration: "underline", textUnderlineOffset: 3 }}>{r.a}</div>
          <div style={{ fontSize: t.type.ui.xs, color: t.color.textMuted, marginTop: 3 }}>Soporte sincro</div>
        </div>
        <div style={{ ...btn, minWidth: 86, justifyContent: "center", gap: 4, border: r.off ? "none" : `${borderWidth(t, "chip")}px solid ${isNew ? t.color.danger : t.color.text}`, background: r.off ? t.data.grisClaro : undefined, color: prColor }}>
          {r.pr}
          <Icon d={ICON.chevron} color={prColor} size={14} w={2.2} />
        </div>
      </div>
      <Hairline />
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Icon d={ICON.company} color={t.color.textMuted} size={20} />
          <div>
            <div style={{ textDecoration: "underline", textUnderlineOffset: 3 }}>{r.e}</div>
            <div style={{ fontSize: t.type.ui.xs, color: t.color.textMuted, marginTop: 3, textDecoration: "underline" }}>Nivel 03</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Icon d={ICON.calendar} color={t.color.textMuted} size={18} />
          {r.date}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <SlaPill s={r.sla[0]} />
          <SlaPill s={r.sla[1]} />
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ ...btn, padding: "0 16px", border: `${borderWidth(t, "chip")}px solid ${t.color.text}` }}>Asignar ticket</div>
      </div>
    </div>
  );
};

/** Destello diagonal que cruza la ventana cuando el ticket aterriza. */
const Sweep: React.FC<{ f: number; from: number }> = ({ f, from }) => {
  const t = useTheme();
  if (f < from || f > from + 45) return null;
  const p = kf(f, [from, from + 45], [-0.4, 1.4], Easing.linear);
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: MEV.w, height: MEV.h, borderRadius: cornerRadius(t, "window") + 12, overflow: "hidden", pointerEvents: "none", zIndex: 5 }}>
      <div style={{ position: "absolute", top: -300, bottom: -300, width: 260, left: Math.round(p * MEV.w), transform: "rotate(18deg)", background: `linear-gradient(90deg, transparent, ${withAlpha(t.color.surface, 0.6)}, transparent)` }} />
    </div>
  );
};

const Desk: React.FC<{ f: number }> = ({ f }) => {
  const t = useTheme();
  const p = appear(f, 468, 504);
  const insert = appear(f, T.land - 4, T.land + 16);
  const glow = kf(f, [T.land, T.land + 10, T.land + 70], [0, 1, 0.35]);
  const n = f >= T.land ? 5 : 4;
  const bump = kf(f, [T.land, T.land + 6, T.land + 16], [1, 1.35, 1]);
  const railIcons = [ICON.chart, ICON.tag, ICON.swap, ICON.team, ICON.userAdd];
  const left = MES.rail + MES.pad;
  return (
    <div style={{ position: "absolute", left: MEV.x, top: MEV.y, width: MEV.w, height: MEV.h, boxSizing: "border-box", ...surfaceStyle(t, "window", { corner: "hero" }), background: t.color.bg, overflow: "hidden", ...entrance(t, p, 0, { native: "slide", side: "right", distance: 160 }) }}>
      <Chrome search />
      {/* riel de íconos (con su contador): marco de la herramienta */}
      <div data-qa-decor style={{ position: "absolute", left: 0, top: MES.top, bottom: 0, width: MES.rail, background: t.data.riel, display: "flex", flexDirection: "column", alignItems: "center", gap: 14, paddingTop: 24 }}>
        {railIcons.map((d, i) => (
          <div key={d} style={{ position: "relative", width: 40, height: 40, borderRadius: cornerRadius(t, "control"), background: i === 2 ? t.gradient.brand : undefined, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon d={d} color={t.color.onAccent} size={22} />
            {i === 2 && (
              <div style={{ position: "absolute", right: -6, top: -6, ...scaleOf(bump) }}>
                <Badge n={n} color={t.color.danger} />
              </div>
            )}
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left, top: MES.top + 24 }}>
        <div style={{ fontSize: t.type.caption * 0.94, ...textStyle(t, "label"), color: t.color.text, lineHeight: 1.2, whiteSpace: "nowrap" }}>No asignados</div>
        <div style={{ fontSize: t.type.ui.sm, color: inkOn(t.color.accent, t.color.bg), marginTop: 6, lineHeight: 1.25, whiteSpace: "nowrap" }}>Agente responsable / Equipo Soporte Sincro</div>
      </div>
      {/* pestaña y total: marco de la herramienta */}
      <div data-qa-decor style={{ position: "absolute", left, top: MES.top + 108, width: CARD_WV, minHeight: 44, boxSizing: "border-box", borderBottom: `1px solid ${t.color.border}`, display: "flex", alignItems: "flex-start" }}>
        <div style={{ minHeight: 44, display: "flex", alignItems: "flex-start", gap: 8, fontSize: t.type.ui.sm, ...textStyle(t, "label"), color: t.color.accent, boxShadow: `inset 0 -3px 0 ${t.color.accent}`, paddingRight: 4, lineHeight: 1.25, whiteSpace: "nowrap" }}>
          No asignados
          <span style={{ display: "inline-flex", ...scaleOf(bump) }}><Badge n={n} /></span>
        </div>
        <div style={{ flex: 1 }} />
        <Icon d={ICON.search} color={t.color.textMuted} size={20} />
        <div style={{ width: 1, height: 22, background: t.color.border, margin: "0 14px" }} />
        <Icon d={ICON.dots} color={t.color.textMuted} size={20} w={2.6} />
      </div>
      <div data-qa-decor style={{ position: "absolute", left, top: MES.top + 160, fontSize: t.type.ui.xs, color: t.color.textMuted, lineHeight: 1.25 }}>Total de tickets: {n}</div>
      {/* tarjetas de ticket: el nuevo se inserta arriba y empuja a los demás */}
      <div style={{ position: "absolute", left, top: MES.head }}>
        <div style={{ height: Math.round(insert * MES.pitch), opacity: op(insert) }}>
          <TicketCardV r={MESA_NEW} highlight={glow} isNew />
        </div>
        {MESA_ROWS.map((r) => (
          <div key={r.id} style={{ minHeight: MES.pitch }}>
            <TicketCardV r={r} />
          </div>
        ))}
      </div>
      <Sweep f={f} from={T.land + 2} />
    </div>
  );
};

/** El ticket sale del botón del panel y vuela a la mesa (abajo a la derecha, con arco), con estela. */
const FlyingTicket: React.FC<{ f: number }> = ({ f }) => {
  const t = useTheme();
  const [a, b] = T.fly;
  if (f < a - 6 || f > b + 2) return null;
  const p = kf(f, [a, b], [0, 1], Easing.inOut);
  const w = 220 + (CARD_WV - 220) * p;
  const lift = appear(f, a - 6, a + 6);
  const H = 78;
  const from = { x: BTNV.x, y: BTNV.y + H / 2 - 25 };
  const to = { x: MESA_SLOT_V.x + CARD_WV / 2, y: MESA_SLOT_V.y + MES.card / 2 };
  return (
    <FlyingCard range={[a, b]} from={from} to={to} arc={-200} width={CARD_WV} height={H} trail={4} trailLag={3} hideAfter>
      <div style={{ width: CARD_WV, height: H, display: "flex", justifyContent: "center" }}>
        <div data-qa-ignore={p < 1 ? "clip" : undefined} /* la tarjeta crece de 220 px al ancho de la fila: mientras crece, su borde corta el texto a propósito */ style={{ width: Math.round(w), height: H, boxSizing: "border-box", ...surfaceStyle(t, "panel", { glow: lift * 0.6, level: "lg" }), border: `2px solid ${t.color.accent}`, transform: `rotate(${(Math.sin(p * Math.PI) * -6).toFixed(2)}deg)`, display: "flex", alignItems: "center", gap: 16, padding: "0 22px", fontSize: t.type.ui.md, ...textStyle(t, "title"), color: t.color.accent, whiteSpace: "nowrap", overflow: "hidden", lineHeight: 1.25 }}>
          {/* el contenido aparece cuando la tarjeta ya despegó: apenas salida del botón es chico y se ve cortado por su borde */}
          <span data-qa-ignore="min-size" /* la tarjeta vuela con la cámara alejada: su texto es detalle de una pieza en movimiento */ style={{ display: "flex", alignItems: "center", gap: 16, opacity: op(kf(p, [0.02, 0.2], [0, 1])) }}>
            <svg width={24} height={24} viewBox="0 0 24 24" style={{ flexShrink: 0 }}><path d="M4 7h16v4a2 2 0 0 0 0 4v4H4v-4a2 2 0 0 0 0-4z" fill="none" stroke={t.color.accent} strokeWidth={2} /></svg>
            {TICKET}
            <span style={{ color: t.color.text }}>Error en servidor · {STORE}</span>
          </span>
        </div>
      </div>
    </FlyingCard>
  );
};

/** El ticket abierto: crece desde su tarjeta hasta cubrir la ventana; se escribe la respuesta y se envía. */
const TicketView: React.FC<{ f: number }> = ({ f }) => {
  const t = useTheme();
  const open = kf(f, T.opened, [0, 1], Easing.bezier(0.3, 0, 0.2, 1));
  if (open <= 0) return null;
  const r0 = { x: MESA_SLOT_V.x, y: MESA_SLOT_V.y, w: CARD_WV, h: MES.card };
  const x = Math.round(r0.x + (MEV.x - r0.x) * open), y = Math.round(r0.y + (MEV.y - r0.y) * open);
  const w = r0.w + (MEV.w - r0.w) * open, h = r0.h + (MEV.h - r0.h) * open;
  const editor = appear(f, T.responder + 2, T.responder + 16);
  const sent = appear(f, T.send + 2, T.send + 18);
  const waiting = f >= T.send + 10;
  const left = MES.rail + MES.pad;
  const inner = (dx: number, dy: number): React.CSSProperties => ({ position: "absolute", left: dx, top: dy });
  const pressR = kf(f, [T.responder - 3, T.responder + 1, T.responder + 8], [0, 0.08, 0]);
  const pressS = kf(f, [T.send - 3, T.send + 1, T.send + 8], [0, 0.08, 0]);
  const sx = w / MEV.w, sy = h / MEV.h;
  const growing = open < 1;
  const lbl = { fontSize: t.type.ui.sm, lineHeight: 1.25, paddingBottom: 8, borderBottom: `1px solid ${t.color.border}` };
  const field = (l: string, v: string) => (
    <div key={l} style={{ flex: 1 }}>
      <div style={lbl}>{l}</div>
      <div style={{ marginTop: 10, minHeight: 36, boxSizing: "border-box", borderRadius: cornerRadius(t, "control"), border: `1px solid ${t.color.border}`, background: t.color.surface, display: "flex", alignItems: "center", padding: "0 12px", lineHeight: 1.25, whiteSpace: "nowrap" }}>{v}</div>
    </div>
  );
  return (
    <div style={{ position: "absolute", left: x, top: y, width: Math.round(w), height: Math.round(h), boxSizing: "border-box", ...surfaceStyle(t, "window", { corner: "hero" }), background: t.color.bg, overflow: "hidden", zIndex: 20 }}>
      {/* la ventana se achica a la tarjeta de la lista: mientras crece, su contenido se escala con ella y es movimiento, no texto fijo */}
      <div style={{ width: MEV.w, height: MEV.h, transformOrigin: "0 0", transform: growing ? `scale(${sx.toFixed(4)}, ${sy.toFixed(4)})` : undefined, opacity: op(kf(f, [T.opened[0] + 8, T.opened[1]], [0, 1])) }}>
        <Chrome />
        <div style={{ position: "absolute", left: 0, top: MES.top, bottom: 0, width: MES.rail, background: t.data.riel }} />
        <div style={{ ...inner(left, MES.top + 22), fontSize: t.type.caption * 0.8, ...textStyle(t, "label"), color: t.color.text, whiteSpace: "nowrap", lineHeight: 1.2 }}>Error en servidor · {STORE}</div>
        <div style={{ ...inner(left, MES.top + 58), display: "flex", alignItems: "center", gap: 12, fontSize: t.type.ui.sm, whiteSpace: "nowrap", lineHeight: 1.25 }}>
          <span style={{ color: inkOn(t.color.accent, t.color.bg) }}>Tickets / No asignados / {TICKET}</span>
          <span style={{ width: 9, height: 9, borderRadius: 5, background: waiting ? t.color.success : t.color.danger }} />
          <span style={{ color: t.color.textMuted }}>{waiting ? "Esperando al cliente" : "Esperando al agente"}</span>
        </div>
        {/* primer mensaje: el ticket que creó el monitor */}
        <div style={{ ...inner(left, 156), width: CARD_WV, minHeight: 215, boxSizing: "border-box", padding: "16px 22px", ...surfaceStyle(t, "panel", { level: "sm" }), boxShadow: undefined }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: t.type.ui.xs, color: t.color.textMuted, lineHeight: 1.25 }}>
            <span style={{ width: 28, height: 28, borderRadius: 14, background: t.gradient.brand, color: t.color.onAccent, fontSize: t.type.ui.xs, ...textStyle(t, "label", { strong: true }), display: "flex", alignItems: "center", justifyContent: "center" }}>SM</span>
            Sincro Monitor · ticket interno
            <span style={{ marginLeft: "auto", color: inkOn(t.color.accent, t.color.surface), ...textStyle(t, "label", { strong: true }) }}>{TICKET}</span>
          </div>
          <div style={{ fontSize: t.type.ui.sm, lineHeight: 1.55, color: t.color.text, marginTop: 10 }}>
            {LOG}. Falló en "Sincronizando productos".
            <br />
            <span style={{ color: t.color.textMuted }}>Arreglo sugerido: reintentar la sincro con un timeout de 300 s.</span>
          </div>
        </div>
        <div style={{ ...inner(left, 392), width: CARD_WV, minHeight: 40, display: "flex", alignItems: "center", fontSize: t.type.ui.sm, lineHeight: 1.25 }}>
          <span>Más opciones ⌄</span>
          <span style={{ marginLeft: "auto", color: inkOn(t.color.accent, t.color.bg), marginRight: 20 }}>Derivar</span>
          <span style={{ padding: "9px 20px", borderRadius: cornerRadius(t, "control"), background: t.color.accent, color: t.color.onAccent, ...textStyle(t, "label"), ...scaleOf(1 - pressR) }}>Responder</span>
        </div>
        {/* editor (se escribe la respuesta) y, al enviar, la respuesta enviada en el mismo lugar */}
        <div style={{ ...inner(left, EDV.y - MEV.y), width: EDV.w, height: Math.round(EDV.h * editor * (1 - sent)), opacity: op(editor * (1 - sent)), overflow: "hidden", boxSizing: "border-box", ...surfaceStyle(t, "panel", { on: true, level: "md" }), boxShadow: editor > 0.01 ? `0 14px 30px -14px ${withAlpha(t.color.accent, 0.3 * editor)}` : undefined }}>
          <div style={{ minHeight: 38, boxSizing: "border-box", display: "flex", alignItems: "center", gap: 18, padding: "0 16px", borderBottom: `1px solid ${t.color.surfaceAlt}`, fontSize: t.type.ui.sm, color: t.color.textMuted, lineHeight: 1.25 }}>
            <b>B</b>
            <i>I</i>
            <u>U</u>
            <span>•≡</span>
          </div>
          <div style={{ padding: "14px 18px" }}>
            <Typewriter text={REPLY} start={T.typeFrom} duration={101} fontSize={t.type.ui.md} weight={t.font.weights.regular} width={EDV.w - 38} style={{ lineHeight: 1.55, whiteSpace: "pre-wrap", alignItems: "flex-start" }} />
          </div>
          <span style={{ position: "absolute", right: 16, bottom: 12, padding: "8px 20px", borderRadius: cornerRadius(t, "control"), background: t.color.accent, color: t.color.onAccent, fontSize: t.type.ui.sm, ...textStyle(t, "label"), lineHeight: 1.25, ...scaleOf(1 - pressS) }}>Enviar</span>
        </div>
        <div style={{ ...inner(left, EDV.y - MEV.y), width: EDV.w, boxSizing: "border-box", padding: "14px 20px", ...surfaceStyle(t, "panel", { level: "sm" }), border: `1.5px solid ${withAlpha(t.color.success, 0.33)}`, boxShadow: sent > 0.01 ? `inset 5px 0 0 ${t.color.success}, 0 16px 34px -14px ${withAlpha(t.color.success, 0.4 * sent)}` : `inset 5px 0 0 ${t.color.success}`, opacity: op(sent), ...(sent > 0 && sent < 1 ? { transform: `translateY(${Math.round((1 - sent) * 30)}px)` } : {}) }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: t.type.ui.sm, color: t.color.textMuted, lineHeight: 1.25 }}>
            <span style={{ width: 32, height: 32, borderRadius: 16, background: t.color.text, color: t.color.surface, fontSize: t.type.ui.sm, ...textStyle(t, "label", { strong: true }), display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>AS</span>
            <span style={{ whiteSpace: "nowrap" }}>Agente de soporte · hace un momento</span>
            <span style={{ marginLeft: "auto", color: inkOn(t.color.success, t.color.surface), ...textStyle(t, "label", { strong: true }), whiteSpace: "nowrap" }}>Enviado ✓</span>
          </div>
          <div style={{ fontSize: t.type.ui.sm, lineHeight: 1.5, color: t.color.text, marginTop: 8 }}>{REPLY}</div>
        </div>
        {/* datos del ticket: antes iban en una columna a la derecha; acá van al pie, de a dos */}
        <div style={{ ...inner(left, 774), width: CARD_WV, fontSize: t.type.ui.sm, color: t.color.text, display: "flex", flexDirection: "column", gap: 22 }}>
          <div style={{ display: "flex", gap: 28 }}>
            {field("Empresa asociada", "Tienda 07")}
            {field("Participantes", "Agente de soporte")}
          </div>
          <div style={{ display: "flex", gap: 28 }}>
            {field("Categorización", "Integraciones")}
            <div style={{ flex: 1 }}>
              <div style={lbl}>SLA</div>
              <div style={{ display: "flex", gap: 18, marginTop: 12 }}>
                {([["1° Respuesta", waiting ? 1 : 0.3], ["Resolución", 0.12]] as const).map(([l, v]) => (
                  <div key={l} style={{ flex: 1, lineHeight: 1.25, whiteSpace: "nowrap" }}>
                    {l}
                    <div style={{ height: 6, borderRadius: 3, background: t.color.surfaceAlt, marginTop: 8 }}>
                      <div style={{ height: 6, borderRadius: 3, width: `${v * 100}%`, background: t.color.success }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/** La mesa de ayuda completa (lista, ticket en vuelo y ticket abierto), en su ámbito de tema. */
export const MesaDeAyudaV: React.FC<{ peek?: boolean }> = ({ peek }) => {
  const f = useFrame();
  return (
    <ThemeScope theme={mesaTheme}>
      {/* reproducción de la herramienta real (mesa de ayuda) con tamaños fijos: no se agranda con el estrés de tipografía */}
      <div data-qa-fixed-scale data-qa-ignore={peek ? "offscreen" : undefined} style={{ position: "absolute", left: 0, top: 0, color: mesaTheme.color.text, fontFamily: mesaTheme.font.family }}>
        {/* con el ticket abierto cubriendo la ventana, la lista de abajo no se dibuja (no hay texto oculto bajo otro) */}
        {f < T.opened[1] && <Desk f={f} />}
        <FlyingTicket f={f} />
        <TicketView f={f} />
      </div>
    </ThemeScope>
  );
};
