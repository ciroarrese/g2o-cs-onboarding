import React from "react";
import { AbsoluteFill, Easing, random, useCurrentFrame } from "remotion";
import "../brand/fonts";
import { CloudBackground } from "../brand/primitives";
import { color, font, gradient, radius } from "../brand/theme";
import { Cursor, DoodleArrow, DoodleCircle, IN_OUT, OUT, Vignette, after, hex, k, typed } from "../brand/motion";
import { DockedHeadline } from "./Apertura";

/**
 * Scene 2: the AI assistant inside a ticket. Structure copied from the real
 * help desk ticket view and from the userscript panel ("Sugerencia IA").
 * Every company, person and ticket on screen is fictional.
 * 840 frames at 30 fps.
 */

// ---------- timing ----------
const C = {
  lift: [110, 190] as const,
  dictar: 232,
  dictStop: 342,
  formato: 384,
  formatoDone: 412,
  cw: 520,
  buscar: 556,
  cards: 576,
  cwClose: 620,
  reportar: 646,
  crear: 708,
  creado: 730,
  fly: [736, 776] as const,
  through: [806, 840] as const,
};

// ---------- layout (world coordinates) ----------
const W = { x: 60, y: 110, w: 1240, h: 900, top: 56, rail: 56 };
const MAIN = { x: 156, w: 720 };
const SIDE = { x: 916, w: 344 };
const P = { x: 1330, y: 170, w: 540 };
const PMIN = { x: W.x + W.w - 20 - 480, y: W.y + W.h - 20 - 44, w: 480 };
const CW_H = 312;
const RP_H = 262;
const EDITOR = { y: 598, h: 220 };
const COMMENT_Y = 890;

// ---------- copy (fictional) ----------
const TICKET = "48190";
const NEW_TICKET = "48231";
const DICTATED =
  "hola cómo estás revisamos los pedidos de la tienda tres pedidos quedaron trabados por un artículo sin stock en el ERP ya ajustamos el stock y los reenviamos hoy cualquier cosa quedamos atentos";
const FORMATTED: { bullet?: boolean; seg: [string, boolean][] }[] = [
  { seg: [["Hola, ¿cómo estás?", true]] },
  { seg: [["Revisamos los pedidos de la tienda:", false]] },
  { bullet: true, seg: [["3 pedidos", true], [" quedaron trabados por un artículo sin stock en el ERP.", false]] },
  { bullet: true, seg: [["Ya ajustamos el stock y los ", false], ["reenviamos hoy", true], [".", false]] },
  { seg: [["Cualquier cosa, quedamos atentos.", false]] },
];
const GROUPS = [
  { fam: "Producto / item pedido", c: "#3b82f6", n: 14, msg: "El artículo 10-2231 no existe en el ERP" },
  { fam: "Parametros Flexxus / cliente", c: "#a855f7", n: 9, msg: "Lista de precios sin configurar para el cliente" },
  { fam: "Cliente / alta cliente", c: "#f59e0b", n: 6, msg: "No se pudo dar de alta el cliente: CUIT duplicado" },
  { fam: "Origen marketplace / payload", c: "#14b8a6", n: 3, msg: "Pedido sin dirección de envío" },
];
const REPORT_TITLE = "Tienda 18 | Pedidos que no bajan al ERP";

// ---------- camera ----------
const camera = (f: number) => {
  const t = [0, 100, 190, 218, 240, 262, 338, 360, 392, 414, 496, 516, 612, 640, 700, 730, 760, 798];
  const fx = [980, 960, 965, 1600, 1600, 560, 560, 1600, 1600, 560, 560, 1560, 1560, 1560, 1580, 1580, 960, 960];
  const fy = [560, 560, 545, 330, 330, 640, 640, 300, 300, 640, 640, 470, 520, 500, 520, 520, 560, 600];
  const s = [0.86, 0.9, 0.88, 1.45, 1.45, 1.4, 1.4, 1.45, 1.45, 1.4, 1.4, 1.2, 1.2, 1.2, 1.2, 1.2, 0.9, 0.95];
  let cam = { fx: k(f, t, fx), fy: k(f, t, fy), s: k(f, t, s) };
  // Zoom Through the internal comment that links both tickets
  const p = k(f, [C.through[0], C.through[1]], [0, 1], Easing.bezier(0.7, 0, 0.84, 0));
  if (p > 0) {
    cam = {
      fx: k(f, [C.through[0], C.through[0] + 12], [cam.fx, MAIN.x + 230]),
      fy: k(f, [C.through[0], C.through[0] + 12], [cam.fy, COMMENT_Y + 48]),
      s: cam.s * Math.pow(40, p),
    };
  }
  const tt = [0, 110, 190, 300, 500, 640, 760, 840];
  return {
    ...cam,
    rx: k(f, tt, [8, 4, 2, 0, 0, 0, 4, 0]),
    ry: k(f, tt, [-12, -6, -4, 0, 0, 0, -4, 0]),
  };
};

// ---------- small pieces ----------
const Icon: React.FC<{ d: string; c?: string; size?: number; w?: number }> = ({ d, c = color.gray600, size = 22, w = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
    <path d={d} fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const ICON = {
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

const Avatar: React.FC<{ t: string; c: string; size?: number }> = ({ t, c, size = 34 }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size,
      background: c,
      color: color.white,
      fontSize: size * 0.4,
      fontWeight: font.semibold,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    }}
  >
    {t}
  </div>
);

const SideBlock: React.FC<{ title: string; y: number; children: React.ReactNode }> = ({ title, y, children }) => (
  <div style={{ position: "absolute", left: SIDE.x, top: y, width: SIDE.w }}>
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 17, color: color.black, paddingBottom: 10, borderBottom: `1px solid ${color.gray200}` }}>
      {title}
      <Icon d={ICON.chevron} size={18} />
    </div>
    <div style={{ paddingTop: 12 }}>{children}</div>
  </div>
);

// ---------- the ticket view ----------
const TicketView: React.FC<{ f: number }> = ({ f }) => {
  const editorOpen = k(f, [C.dictar + 4, C.dictar + 22], [0, 1], OUT);
  const formatted = f >= C.formatoDone;
  const dictText = typed(DICTATED, f, C.dictar + 18, 1.9);
  const caret = Math.floor(f / 10) % 2 === 0 && f < C.dictStop;
  const commentIn = k(f, [C.fly[1] - 4, C.fly[1] + 14], [0, 1], OUT);
  const glow = k(f, [C.fly[1], C.fly[1] + 10, C.fly[1] + 60], [0, 1, 0.3]);
  return (
    <>
      {/* window */}
      <div
        style={{
          position: "absolute",
          left: W.x,
          top: W.y,
          width: W.w,
          height: W.h,
          borderRadius: 28,
          background: color.gray50,
          border: `1px solid ${color.gray200}`,
          boxShadow: "0 40px 90px -30px rgba(26,26,28,.35)",
          overflow: "hidden",
        }}
      >
        <div style={{ height: W.top, background: color.white, borderBottom: `1px solid ${color.gray100}`, display: "flex", alignItems: "center", gap: 18, padding: "0 26px 0 18px" }}>
          <div style={{ width: 26, height: 26, borderRadius: 8, background: gradient.brand }} />
          <div style={{ fontSize: 18, fontWeight: font.semibold, color: color.black }}>Mesa de ayuda</div>
          <div style={{ flex: 1 }} />
          <div style={{ width: 300, height: 34, borderRadius: radius.md, background: color.gray50, border: `1px solid ${color.gray100}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 12px", fontSize: 14, color: color.gray300 }}>
            Buscar por ticket o empresa
            <Icon d={ICON.search} size={16} />
          </div>
          <Icon d={ICON.plus} c={color.pink} size={20} />
          <Icon d={ICON.bell} size={20} />
        </div>
        <div style={{ position: "absolute", left: 0, top: W.top, bottom: 0, width: W.rail, background: color.black, display: "flex", flexDirection: "column", alignItems: "center", gap: 12, paddingTop: 20 }}>
          {[ICON.chart, ICON.tag, ICON.swap, ICON.team, ICON.userAdd].map((d, i) => (
            <div key={d} style={{ width: 40, height: 40, borderRadius: radius.md, background: i === 1 ? gradient.brand : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon d={d} c={color.white} size={20} />
            </div>
          ))}
        </div>
      </div>

      {/* header (world coordinates) */}
      <div style={{ position: "absolute", left: MAIN.x, top: W.y + W.top + 26, display: "flex", alignItems: "center", gap: 12 }}>
        <Icon d={ICON.tag} c={color.pink} size={26} />
        <div style={{ fontSize: 32, fontWeight: font.medium, color: color.black }}>Pedidos que no bajan al ERP</div>
      </div>
      <div style={{ position: "absolute", left: MAIN.x + 38, top: W.y + W.top + 74, display: "flex", alignItems: "center", gap: 14, fontSize: 16 }}>
        <span style={{ color: color.pink }}>Tickets / Agente de soporte / #{TICKET}</span>
        <span style={{ width: 9, height: 9, borderRadius: 5, background: color.error }} />
        <span style={{ color: color.gray600 }}>Esperando al agente</span>
      </div>
      <div style={{ position: "absolute", left: 960, top: W.y + W.top + 30, display: "flex", gap: 16, alignItems: "center" }}>
        <div style={{ padding: "10px 18px", border: `1.5px solid ${color.black}`, borderRadius: radius.md, fontSize: 16, fontWeight: font.medium }}>Reasignar Ticket</div>
        <div style={{ padding: "10px 18px", background: color.white, borderRadius: radius.md, boxShadow: "0 6px 16px -8px rgba(0,0,0,.2)", fontSize: 14, color: color.gray600, textAlign: "center" }}>
          Prioridad
          <div style={{ color: color.pink }}>Media</div>
        </div>
      </div>
      <div style={{ position: "absolute", left: W.x + W.rail, top: 290, width: W.w - W.rail, height: 1, background: color.gray200 }} />

      {/* first message */}
      <div style={{ position: "absolute", left: MAIN.x, top: 312, width: MAIN.w, height: 210, background: color.white, borderRadius: radius.panel, border: `1px solid ${color.gray200}`, boxShadow: "0 4px 12px rgba(26,26,28,.06)", padding: "18px 24px", boxSizing: "border-box" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 15, color: color.gray600, paddingBottom: 12, borderBottom: `1px solid ${color.gray100}` }}>
          <Avatar t="T" c={color.orange} size={30} />
          <span style={{ color: color.black, textDecoration: "underline" }}>Tienda 18</span> Cliente
          <span style={{ marginLeft: 12 }}>11 NOV 26 - 09:12</span>
          <span style={{ marginLeft: "auto", color: color.pink, fontWeight: font.semibold }}>#{TICKET}</span>
        </div>
        <div style={{ fontSize: 18, lineHeight: 1.6, color: color.black, marginTop: 14 }}>
          Hola, tenemos tres pedidos de ayer que no bajaron al ERP.
          <br />
          ¿Nos pueden revisar? Gracias.
        </div>
      </div>

      {/* actions */}
      <div style={{ position: "absolute", left: MAIN.x, top: 540, width: MAIN.w, height: 40, display: "flex", alignItems: "center", fontSize: 16 }}>
        <span style={{ color: color.black }}>Más opciones ⌄</span>
        <span style={{ marginLeft: "auto", color: color.pink, marginRight: 22 }}>Derivar</span>
        <span style={{ padding: "9px 20px", borderRadius: radius.md, background: color.pink, color: color.white, fontWeight: font.medium }}>Responder</span>
      </div>

      {/* reply editor */}
      <div
        style={{
          position: "absolute",
          left: MAIN.x,
          top: EDITOR.y,
          width: MAIN.w,
          height: EDITOR.h * editorOpen,
          opacity: editorOpen,
          overflow: "hidden",
          background: color.white,
          borderRadius: radius.panel,
          border: `1.5px solid ${editorOpen > 0.5 ? color.pink + "66" : color.gray200}`,
          boxShadow: `0 12px 30px -14px rgba(231,0,126,${0.25 * editorOpen})`,
        }}
      >
        <div style={{ height: 38, display: "flex", alignItems: "center", gap: 18, padding: "0 16px", borderBottom: `1px solid ${color.gray100}`, fontSize: 16, color: color.gray600 }}>
          <b>B</b>
          <i>I</i>
          <u>U</u>
          <span>•≡</span>
          <span>1.≡</span>
        </div>
        <div style={{ padding: "14px 18px", fontSize: 18, lineHeight: 1.55, color: color.black }}>
          {!formatted ? (
            <span>
              {dictText}
              {caret && <span style={{ color: color.pink }}>|</span>}
            </span>
          ) : (
            FORMATTED.map((l, i) => {
              const a = k(f, [C.formatoDone + i * 4, C.formatoDone + i * 4 + 12], [0, 1], OUT);
              return (
                <div key={i} style={{ display: "flex", gap: 10, opacity: a, translate: `${(1 - a) * 14}px 0`, paddingLeft: l.bullet ? 10 : 0 }}>
                  {l.bullet && <span>•</span>}
                  <span>
                    {l.seg.map(([t, b], j) => (b ? <b key={j}>{t}</b> : <span key={j}>{t}</span>))}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* comments */}
      <div style={{ position: "absolute", left: MAIN.x, top: 838, width: MAIN.w, display: "flex", justifyContent: "space-between", fontSize: 16, color: color.black, paddingBottom: 8, borderBottom: `1px solid ${color.gray200}` }}>
        Comentarios
        <span style={{ color: color.gray600, fontSize: 14 }}>Total de comentarios: {f >= C.fly[1] ? 5 : 4}</span>
      </div>
      <div
        style={{
          position: "absolute",
          left: MAIN.x,
          top: COMMENT_Y,
          width: MAIN.w,
          height: 96,
          boxSizing: "border-box",
          padding: "14px 20px",
          borderRadius: radius.panel,
          background: color.white,
          border: `1.5px solid ${color.pink}55`,
          boxShadow: `inset 5px 0 0 ${color.pink}, 0 ${16 * glow}px 36px -12px rgba(231,0,126,${0.4 * glow})`,
          opacity: commentIn,
          translate: `0 ${(1 - commentIn) * 20}px`,
        }}
      >
        <div style={{ display: "flex", gap: 10, alignItems: "center", fontSize: 14, color: color.gray600 }}>
          <Avatar t="AS" c={color.black} size={26} />
          Agente de soporte · Agente
          <span style={{ marginLeft: 8, padding: "2px 10px", borderRadius: radius.pill, background: color.gray100, fontSize: 13 }}>Interno</span>
        </div>
        <div style={{ fontSize: 17, marginTop: 8, color: color.black }}>
          <b>Ticket interno creado para Desarrollo:</b> <span style={{ color: color.pink, textDecoration: "underline" }}>#{NEW_TICKET}</span>
        </div>
      </div>

      {/* right column */}
      <SideBlock title="Empresa asociada" y={312}>
        <div style={{ height: 38, borderRadius: radius.md, border: `1px solid ${color.gray200}`, background: color.white, display: "flex", alignItems: "center", padding: "0 12px", fontSize: 16 }}>Tienda 18</div>
      </SideBlock>
      <SideBlock title="Participantes" y={406}>
        {[
          ["AS", "Agente de soporte", "Agente responsable"],
          ["AG", "Agente de guardia", "Agente"],
        ].map(([a, n, r]) => (
          <div key={n} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 15, marginBottom: 10 }}>
            <Avatar t={a} c={a === "AS" ? color.black : color.purple} size={26} />
            <span style={{ textDecoration: "underline" }}>{n}</span>
            <span style={{ color: color.gray600 }}>&gt; {r}</span>
          </div>
        ))}
      </SideBlock>
      <SideBlock title="SLA" y={540}>
        <div style={{ display: "flex", gap: 24 }}>
          {[
            ["1° Respuesta", color.success, 0.12],
            ["Resolución", color.warning, 0.46],
          ].map(([l, c, v]) => (
            <div key={l as string} style={{ flex: 1, fontSize: 14 }}>
              {l as string}
              <div style={{ height: 6, borderRadius: 3, background: color.gray100, marginTop: 10 }}>
                <div style={{ height: 6, borderRadius: 3, width: `${(v as number) * 100}%`, background: c as string }} />
              </div>
            </div>
          ))}
        </div>
      </SideBlock>
      <SideBlock title="Categorización" y={650}>
        {["Consulta/incidente", "Integraciones"].map((t) => (
          <div key={t} style={{ height: 36, borderRadius: radius.md, border: `1px solid ${color.gray200}`, background: color.white, display: "flex", alignItems: "center", padding: "0 12px", fontSize: 15, marginBottom: 8 }}>
            {t}
          </div>
        ))}
      </SideBlock>
    </>
  );
};

// ---------- the AI panel (dark, as the real one) ----------
const DARK = { bg: "#1f1f1f", bar: "#141414", line: "#333", text: "#eee", input: "#111" };

const PBtn: React.FC<{ label: string; bg: string; fg?: string; full?: boolean; press?: number; glow?: number }> = ({ label, bg, fg = "#fff", full, press = 0, glow = 0 }) => (
  <div
    style={{
      gridColumn: full ? "1 / -1" : undefined,
      height: 40,
      borderRadius: 8,
      background: bg,
      color: fg,
      fontSize: 16,
      fontWeight: font.medium,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      scale: String(1 - press * 0.06),
      boxShadow: glow > 0 ? `0 0 0 ${3 + glow * 6}px ${bg}${hex(0.35 * glow)}` : "none",
    }}
  >
    {label}
  </div>
);

const Input: React.FC<{ children?: React.ReactNode; ph?: string; h?: number; light?: boolean; style?: React.CSSProperties }> = ({ children, ph, h = 32, light, style }) => (
  <div
    style={{
      height: h,
      boxSizing: "border-box",
      borderRadius: 6,
      border: `1px solid ${DARK.line}`,
      background: light ? "#fff" : DARK.input,
      color: light ? "#111" : children ? DARK.text : "#777",
      fontSize: 14,
      padding: "7px 10px",
      overflow: "hidden",
      ...style,
    }}
  >
    {children ?? ph}
  </div>
);

const press = (f: number, c: number) => k(f, [c - 3, c + 1, c + 8], [0, 1, 0]);

const Panel: React.FC<{ f: number }> = ({ f }) => {
  const p = k(f, [C.lift[0], C.lift[1]], [0, 1], IN_OUT);
  const open = k(f, [C.lift[0] + 40, C.lift[1] + 10], [0, 1], OUT);
  const x = PMIN.x + (P.x - PMIN.x) * p;
  const y = PMIN.y + (P.y - PMIN.y) * p;
  const w = PMIN.w + (P.w - PMIN.w) * p;
  const bob = Math.sin(f / 24) * 6 * p;

  const listening = after(f, C.dictar) && f < C.dictStop + 2;
  const loading = after(f, C.formato) && f < C.formatoDone;
  const status = listening ? "Escuchando..." : after(f, C.formatoDone) && f < C.cw ? "Insertado en el editor." : "";

  const cwOpen = k(f, [C.cw + 2, C.cw + 18], [0, 1], OUT) * (1 - k(f, [C.cwClose + 2, C.cwClose + 16], [0, 1], OUT));
  const rpOpen = k(f, [C.reportar + 2, C.reportar + 18], [0, 1], OUT);
  const searching = after(f, C.buscar) && f < C.cards;
  const created = after(f, C.creado);
  const creating = after(f, C.crear) && !created;

  const bodyH = 16 + 136 + 30 + 40 + cwOpen * CW_H + 40 + rpOpen * RP_H + 16;
  const total = GROUPS.reduce((a, g) => a + g.n, 0);

  const section = (label: string, isOpen: number) => (
    <div style={{ height: 40, display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: `1px solid ${DARK.line}`, fontSize: 15, fontWeight: font.semibold, color: DARK.text }}>
      <span>
        {isOpen > 0.5 ? "▾" : "▸"} {label}
      </span>
      {isOpen > 0.5 && <span style={{ fontSize: 13, fontWeight: font.regular, background: "#333", padding: "4px 10px", borderRadius: 6 }}>Pantalla completa</span>}
    </div>
  );

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y + bob,
        width: w,
        borderRadius: 14,
        background: DARK.bg,
        color: DARK.text,
        fontFamily: font.family,
        boxShadow: `0 ${20 + p * 40}px ${50 + p * 50}px -20px rgba(0,0,0,${0.35 + p * 0.25})`,
        overflow: "hidden",
        transform: `translateZ(${p * 140}px)`,
        zIndex: 20,
      }}
    >
      <div style={{ height: 44, background: DARK.bar, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 14px", borderBottom: open > 0 ? `1px solid ${DARK.line}` : "none" }}>
        <span style={{ fontSize: 15, fontWeight: font.semibold }}>Sugerencia IA - Ticket {TICKET}</span>
        <span style={{ width: 24, height: 24, borderRadius: 5, border: "1px solid #444", background: "#2a2a2a", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>{open > 0.5 ? "—" : "▢"}</span>
      </div>
      <div style={{ height: bodyH * open, overflow: "hidden" }}>
        <div style={{ padding: "16px 16px 16px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <PBtn label={loading ? "..." : "Solo corregir"} bg="#333" />
            <PBtn label={loading ? "..." : "Seguir contexto"} bg="#1677ff" />
            <PBtn label={loading ? "..." : "Con formato"} bg="#8e44ad" full press={press(f, C.formato)} glow={k(f, [C.formato, C.formato + 6, C.formatoDone + 10], [0, 1, 0])} />
            <PBtn label={loading ? "..." : "Escalado desarrollo"} bg="#f0a500" fg="#111" />
            <PBtn
              label={listening ? "Detener dictado" : "Dictar"}
              bg={listening ? "#c0392b" : "#2ecc71"}
              fg={listening ? "#fff" : "#111"}
              press={press(f, C.dictar) + press(f, C.dictStop)}
              glow={listening ? (Math.sin(f / 5) + 1) / 2 : 0}
            />
          </div>
          <div style={{ height: 30, display: "flex", alignItems: "center", fontSize: 14, opacity: 0.8 }}>{status}</div>

          {section("CloudWatch", cwOpen)}
          <div style={{ height: cwOpen * CW_H, overflow: "hidden" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingTop: 4 }}>
              <div style={{ fontSize: 14, fontWeight: font.semibold }}>Errores de pedidos (CloudWatch)</div>
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 8 }}>
                <Input ph="serviceId (opcional)" />
                <Input>2</Input>
              </div>
              <PBtn label={searching ? "Buscando..." : "Buscar errores"} bg="#333" press={press(f, C.buscar)} />
              {after(f, C.cards, 0) && (
                <div style={{ fontSize: 13, opacity: 0.8 }}>
                  {Math.round(k(f, [C.cards, C.cards + 24], [0, total]))} eventos, {GROUPS.length}/{GROUPS.length} grupos
                </div>
              )}
              {GROUPS.map((g, i) => {
                const s = C.cards + i * 5;
                const a = k(f, [s, s + 14], [0, 1], OUT);
                const n = Math.round(k(f, [s, s + 22], [0, g.n], OUT));
                return (
                  <div
                    key={g.fam}
                    style={{
                      height: 38,
                      boxSizing: "border-box",
                      border: `1px solid ${DARK.line}`,
                      borderLeft: `4px solid ${g.c}`,
                      borderRadius: 6,
                      padding: "3px 8px",
                      fontSize: 12,
                      opacity: a,
                      translate: `${(1 - a) * 30}px 0`,
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    <div style={{ fontWeight: font.semibold, color: g.c }}>
                      {g.fam} (x{n})
                    </div>
                    <div style={{ opacity: 0.85, whiteSpace: "nowrap" }}>{g.msg}</div>
                    <div style={{ position: "absolute", right: 8, top: 8, width: 120, height: 6, borderRadius: 3, background: "#2a2a2a" }}>
                      <div style={{ height: 6, borderRadius: 3, width: `${(n / GROUPS[0].n) * 100}%`, background: g.c }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {section("Reportar", rpOpen)}
          <div style={{ height: rpOpen * RP_H, overflow: "hidden" }}>
            {created ? (
              <div style={{ fontSize: 15, color: "#2ecc71", paddingTop: 10 }}>Reporte creado (ticket #{NEW_TICKET}).</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingTop: 4 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                  {["Desarrollo", "Integraciones", "Soporte Sincro"].map((t, i) => (
                    <div key={t} style={{ height: 30, borderRadius: 6, background: i === 0 ? "#1677ff" : "#333", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {t}
                    </div>
                  ))}
                </div>
                <Input>{typed(REPORT_TITLE, f, C.reportar + 14, 2.4) || undefined}</Input>
                <Input style={{ display: "flex", justifyContent: "space-between" }}>
                  Guardia de Desarrollo <span>⌄</span>
                </Input>
                <Input light h={90} style={{ fontSize: 13, lineHeight: 1.45 }}>
                  <b>Ticket origen:</b> #{TICKET}
                  <br />
                  <b>Empresa:</b> Tienda 18
                  <br />
                  Tres pedidos no bajaron al ERP por un artículo sin stock.
                </Input>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  <PBtn label="Cargar datos del ticket" bg="#333" />
                  <PBtn label={creating ? "Creando..." : "Crear reporte"} bg="#1677ff" press={press(f, C.crear)} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/** Voice waveform pill that floats over the editor while dictating. */
const Waveform: React.FC<{ f: number }> = ({ f }) => {
  const a = k(f, [C.dictar + 8, C.dictar + 20], [0, 1], OUT) * (1 - k(f, [C.dictStop, C.dictStop + 10], [0, 1]));
  if (a <= 0) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: MAIN.x + MAIN.w - 246,
        top: EDITOR.y + 4,
        width: 230,
        height: 30,
        borderRadius: radius.pill,
        background: color.white,
        boxShadow: "0 14px 34px -12px rgba(231,0,126,.45)",
        border: `1.5px solid ${color.pink}55`,
        display: "flex",
        alignItems: "center",
        gap: 4,
        padding: "0 16px",
        opacity: a,
        scale: String(0.9 + a * 0.1),
        zIndex: 30,
      }}
    >
      <Icon d={ICON.mic} c={color.pink} size={22} />
      {Array.from({ length: 20 }).map((_, i) => {
        const v = 0.25 + Math.abs(Math.sin(f / 3 + i * 0.9) * Math.sin(f / 7 + i * 0.4)) * 0.75 * (0.6 + random(`w${i}`) * 0.4);
        return <span key={i} style={{ width: 4, height: 22 * v, borderRadius: 2, background: gradient.brand }} />;
      })}
    </div>
  );
};

/** The internal ticket travels from "Crear reporte" to the ticket's comments. */
const FlyingTicket: React.FC<{ f: number }> = ({ f }) => {
  const [a, b] = C.fly;
  if (f < a - 4 || f > b + 2) return null;
  const pos = (ff: number) => {
    const t = k(ff, [a, b], [0, 1], Easing.bezier(0.5, 0, 0.2, 1));
    const sx = P.x + 290, sy = 690;
    return {
      x: sx + (MAIN.x - sx) * t,
      y: sy + (COMMENT_Y - sy) * t - Math.sin(t * Math.PI) * 300,
      w: 240 + (MAIN.w - 240) * t,
      r: Math.sin(t * Math.PI) * -6,
    };
  };
  return (
    <>
      {[12, 8, 4, 0].map((lag, i) => {
        const q = pos(f - lag);
        const main = lag === 0;
        return (
          <div
            key={lag}
            style={{
              position: "absolute",
              left: q.x,
              top: q.y,
              width: q.w,
              height: 70,
              borderRadius: radius.panel,
              background: main ? color.white : color.pink,
              border: main ? `2px solid ${color.pink}` : "none",
              boxShadow: main ? "0 20px 40px -10px rgba(231,0,126,.45)" : "none",
              opacity: main ? 1 : 0.08 + i * 0.05,
              rotate: `${q.r}deg`,
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: "0 20px",
              fontSize: 18,
              fontWeight: font.semibold,
              color: color.pink,
              whiteSpace: "nowrap",
              overflow: "hidden",
              zIndex: 35,
            }}
          >
            {main && (
              <>
                <Icon d={ICON.tag} c={color.pink} />#{NEW_TICKET}
                <span style={{ color: color.black }}>Ticket interno · Desarrollo</span>
              </>
            )}
          </div>
        );
      })}
    </>
  );
};

export const AsistenteIA: React.FC = () => {
  const f = useCurrentFrame();
  const cam = camera(f);
  const zoomIn = Math.max(0, Math.min(1, (cam.s - 1.1) / 0.3));
  const through = k(f, [C.through[0], C.through[1]], [0, 1], Easing.linear);
  const wash = k(f, [C.through[1] - 14, C.through[1]], [0, 1], Easing.linear);
  const recede = k(f, [C.lift[0], C.lift[1]], [0, 1]);

  return (
    <AbsoluteFill style={{ background: color.gray50, fontFamily: font.family, overflow: "hidden" }}>
      <CloudBackground opacity={0.22} />
      <AbsoluteFill style={{ perspective: 2200 }}>
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: 1920,
            height: 1080,
            transformOrigin: "0 0",
            transformStyle: "preserve-3d",
            transform: `translate(960px, 540px) rotateX(${cam.rx}deg) rotateY(${cam.ry}deg) scale(${cam.s}) translate(${-cam.fx}px, ${-cam.fy}px)`,
          }}
        >
          <div style={{ position: "absolute", inset: 0, transform: `translateZ(${-recede * 60}px)`, transformStyle: "preserve-3d" }}>
            <TicketView f={f} />
          </div>
          <Waveform f={f} />
          <Panel f={f} />
          <FlyingTicket f={f} />
          <DoodleCircle f={f} start={C.formato + 6} end={C.formatoDone + 4} cx={P.x + 270} cy={P.y + 60 + 68} rx={282} ry={36} id="dc-formato" />
          <DoodleCircle f={f} start={C.cards + 26} end={C.cwClose - 4} cx={P.x + 150} cy={P.y + 274 + 158} rx={150} ry={26} id="dc-cards" />
          <DoodleArrow f={f} start={C.fly[1] + 2} end={C.through[0] + 10} x1={MAIN.x + 470} y1={COMMENT_Y + 50} x2={MAIN.x + 470} y2={300} bend={-0.35} id="da-link" />
          <Cursor
            f={f}
            show={[205, 790]}
            clicks={[C.dictar, C.dictStop, C.formato, C.cw, C.buscar, C.cwClose, C.reportar, C.crear]}
            keys={[
              [205, 1250, 700],
              [226, 1729, 346],
              [C.dictStop - 8, 1729, 346],
              [C.formato - 8, 1600, 300],
              [C.cw - 8, 1416, P.y + 254],
              [C.buscar - 8, 1600, P.y + 274 + 87],
              [C.cwClose - 8, 1416, P.y + 254],
              [C.reportar - 8, 1416, P.y + 294],
              [C.crear - 8, 1729, P.y + 274 + 40 + 233],
              [C.creado + 4, 1729, P.y + 274 + 40 + 233],
              [770, 1500, 900],
            ]}
          />
        </div>
      </AbsoluteFill>
      <Vignette amount={zoomIn * (1 - through)} />
      <DockedHeadline i={0} f={f} start={-30} />
      <AbsoluteFill style={{ background: color.gray50, opacity: wash }} />
    </AbsoluteFill>
  );
};
