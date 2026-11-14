// El panel "Sugerencia IA" del userscript, recreado oscuro y con su propia paleta: un design system anidado (./tema.ts) dentro de la escena de marca.
// Estructura y rótulos de la herramienta real. Todo se deriva del cuadro: el panel se levanta de la esquina de la mesa, se abre, dicta, da formato,
// busca errores en CloudWatch y crea el reporte.
import React from "react";
import { ThemeScope, kf, typed } from "video-estudio/kit";
import { Easing, useFrame } from "video-estudio/engine";
import { fade as op } from "video-estudio/fx/core";
import { cornerRadius, surfaceStyle, textStyle, useTheme, withAlpha } from "video-estudio/themes";
import { BTN_GAP, BTN_H, C, CW_H, GROUPS, NEW_TICKET, P, PMIN, REPORT_TITLE, RP_H, TICKET } from "./datos";
import { panelTheme } from "./tema";

const OUT = Easing.out;
const IN_OUT = Easing.inOut;

/** Botón del panel. `press` (0..1) lo achica al hacer clic y `glow` le pone un aro del mismo color. */
const PBtn: React.FC<{ label: string; fill: string; ink?: string; full?: boolean; press?: number; glow?: number }> = ({ label, fill, ink, full, press = 0, glow = 0 }) => {
  const t = useTheme();
  const sc = +(1 - press * 0.06).toFixed(4);
  return (
    <div
      style={{
        gridColumn: full ? "1 / -1" : undefined, minHeight: BTN_H, boxSizing: "border-box", borderRadius: cornerRadius(t, "chip"), background: fill, color: ink ?? t.color.onAccent,
        fontSize: t.type.ui.md, lineHeight: 1.25, whiteSpace: "nowrap", ...textStyle(t, "label"), display: "flex", alignItems: "center", justifyContent: "center",
        transform: sc === 1 ? undefined : `scale(${sc})`, boxShadow: glow > 0 ? `0 0 0 ${+(3 + glow * 6).toFixed(2)}px ${withAlpha(fill, 0.35 * glow)}` : undefined,
      }}
    >
      {label}
    </div>
  );
};

/** Campo de texto: oscuro por defecto, claro (`light`) para el cuerpo del reporte. */
const Input: React.FC<{ children?: React.ReactNode; ph?: string; h?: number; light?: boolean; size?: number; line?: number; row?: boolean }> = ({ children, ph, h = 32, light, size, line = 1.25, row }) => {
  const t = useTheme();
  return (
    <div
      style={{
        minHeight: h, boxSizing: "border-box", borderRadius: cornerRadius(t, "control"), border: `1px solid ${t.color.border}`, background: light ? t.data.papel : t.data.entrada,
        color: light ? t.data.tinta : children ? t.color.text : t.color.textMuted, fontSize: size ?? t.type.ui.sm, lineHeight: line, padding: light ? "7px 10px" : "0 10px",
        display: "flex", flexDirection: row ? "row" : "column", justifyContent: row ? "space-between" : "center", alignItems: row ? "center" : undefined, overflow: "hidden",
      }}
    >
      {children ?? ph}
    </div>
  );
};

const press = (f: number, c: number) => kf(f, [c - 3, c + 1, c + 8], [0, 1, 0]);
const after = (f: number, c: number, lag = 2) => f >= c + lag;

const Section: React.FC<{ label: string; open: number }> = ({ label, open }) => {
  const t = useTheme();
  return (
    <div style={{ minHeight: 40, boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: `1px solid ${t.color.border}`, fontSize: t.type.ui.sm, lineHeight: 1.25, ...textStyle(t, "title"), color: t.color.text, whiteSpace: "nowrap" }}>
      <span>
        {open > 0.5 ? "▾" : "▸"} {label}
      </span>
      {open > 0.5 && <span style={{ fontSize: t.type.ui.xs, lineHeight: 1.25, fontWeight: t.font.weights.regular, background: t.color.surfaceAlt, padding: "4px 10px", borderRadius: cornerRadius(t, "control") }}>Pantalla completa</span>}
    </div>
  );
};

const PanelBody: React.FC<{ open: number }> = ({ open }) => {
  const f = useFrame();
  const t = useTheme();
  const listening = after(f, C.dictar) && f < C.dictStop + 2;
  const loading = after(f, C.formato) && f < C.formatoDone;
  const status = listening ? "Escuchando..." : after(f, C.formatoDone) && f < C.cw ? "Insertado en el editor." : "";
  const cwOpen = kf(f, [C.cw + 2, C.cw + 18], [0, 1], OUT) * (1 - kf(f, [C.cwClose + 2, C.cwClose + 16], [0, 1], OUT));
  const rpOpen = kf(f, [C.reportar + 2, C.reportar + 18], [0, 1], OUT);
  // el contenido de una sección entra cuando ya casi terminó de abrirse y sale antes de que se cierre: no hay texto cortado a medias
  const cwShow = kf(f, [C.cw + 8, C.cw + 18], [0, 1]) * (1 - kf(f, [C.cwClose, C.cwClose + 5], [0, 1]));
  const rpShow = kf(f, [C.reportar + 8, C.reportar + 18], [0, 1]);
  const searching = after(f, C.buscar) && f < C.cards;
  const created = after(f, C.creado);
  const creating = after(f, C.crear) && !created;
  const bodyH = 16 + (BTN_H * 3 + BTN_GAP * 2) + 30 + 40 + cwOpen * CW_H + 40 + rpOpen * RP_H + 16;
  const total = GROUPS.reduce((a, g) => a + g.n, 0);
  const d = t.data;
  return (
    <>
      <div style={{ height: 44, boxSizing: "border-box", background: t.color.surface, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 14px", borderBottom: open > 0 ? `1px solid ${t.color.border}` : "none" }}>
        <span style={{ fontSize: t.type.ui.sm, lineHeight: 1.25, whiteSpace: "nowrap", ...textStyle(t, "title") }}>Sugerencia IA - Ticket {TICKET}</span>
        <span data-qa-decor /* botón de minimizar del marco del panel */ style={{ width: 24, height: 24, borderRadius: cornerRadius(t, "control"), background: t.color.surfaceAlt, fontSize: t.type.ui.sm, lineHeight: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>{open > 0.5 ? "—" : "▢"}</span>
      </div>
      {open > 0 && <div style={{ height: bodyH * open, overflow: "hidden" }}>
        <div style={{ padding: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: BTN_GAP }}>
            <PBtn label={loading ? "..." : "Solo corregir"} fill={t.color.surfaceAlt} />
            <PBtn label={loading ? "..." : "Seguir contexto"} fill={d.azul} />
            <PBtn label={loading ? "..." : "Con formato"} fill={d.violeta} full press={press(f, C.formato)} glow={kf(f, [C.formato, C.formato + 6, C.formatoDone + 10], [0, 1, 0])} />
            <PBtn label={loading ? "..." : "Escalado desarrollo"} fill={d.ambar} ink={d.tinta} />
            <PBtn label={listening ? "Detener dictado" : "Dictar"} fill={listening ? d.rojo : d.verde} ink={listening ? t.color.onAccent : d.tinta} press={press(f, C.dictar) + press(f, C.dictStop)} glow={listening ? (Math.sin(f / 5) + 1) / 2 : 0} />
          </div>
          <div style={{ height: 30, display: "flex", alignItems: "center", fontSize: t.type.ui.sm, lineHeight: 1.25, color: t.color.textMuted }}>{status}</div>

          <Section label="CloudWatch" open={cwOpen} />
          <div style={{ height: cwOpen * CW_H, overflow: "hidden" }}>
            {/* cerrada no se monta: el texto de una sección de alto 0 no existe para el espectador (ni para qa) */}
            {cwShow > 0 && <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingTop: 4, opacity: op(cwShow) }}>
              <div style={{ fontSize: t.type.ui.sm, lineHeight: 1.25, ...textStyle(t, "title") }}>Errores de pedidos (CloudWatch)</div>
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 8 }}>
                <Input ph="serviceId (opcional)" />
                <Input>2</Input>
              </div>
              <PBtn label={searching ? "Buscando..." : "Buscar errores"} fill={t.color.surfaceAlt} press={press(f, C.buscar)} />
              <div style={{ minHeight: 16, fontSize: t.type.ui.xs, lineHeight: 1.25, color: t.color.textMuted }}>
                {after(f, C.cards, 0) ? `${Math.round(kf(f, [C.cards, C.cards + 24], [0, total]))} eventos, ${GROUPS.length}/${GROUPS.length} grupos` : ""}
              </div>
              {GROUPS.map((g, i) => {
                const s = C.cards + i * 5;
                const a = kf(f, [s, s + 14], [0, 1], OUT);
                const n = Math.round(kf(f, [s, s + 22], [0, g.n], OUT));
                const col = d[g.c]!;
                return (
                  <div key={g.fam} style={{ minHeight: 38, boxSizing: "border-box", border: `1px solid ${t.color.border}`, borderLeft: `4px solid ${col}`, borderRadius: cornerRadius(t, "control"), padding: "3px 8px", fontSize: t.type.ui.xs, lineHeight: 1.25, display: "grid", gridTemplateColumns: "1fr 120px", columnGap: 8, alignItems: "start", opacity: a < 1 ? +a.toFixed(4) : undefined, transform: a < 1 ? `translateX(${Math.round((1 - a) * 30)}px)` : undefined }}>
                    <div style={{ ...textStyle(t, "title"), color: col, whiteSpace: "nowrap" }}>{g.fam} (x{n})</div>
                    <div style={{ height: 6, marginTop: 5, borderRadius: cornerRadius(t, "bar"), background: d.pista }}>
                      <div style={{ height: 6, borderRadius: cornerRadius(t, "bar"), width: `${(n / GROUPS[0].n) * 100}%`, background: col }} />
                    </div>
                    <div style={{ gridColumn: "1 / -1", color: t.color.text, whiteSpace: "nowrap" }}>{g.msg}</div>
                  </div>
                );
              })}
            </div>}
          </div>

          <Section label="Reportar" open={rpOpen} />
          <div style={{ height: rpOpen * RP_H, overflow: "hidden" }}>
            {rpShow > 0 && (created ? (
              <div style={{ fontSize: t.type.ui.md, lineHeight: 1.25, color: t.color.success, paddingTop: 10, opacity: op(rpShow) }}>Reporte creado (ticket #{NEW_TICKET}).</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingTop: 4, opacity: op(rpShow) }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                  {["Desarrollo", "Integraciones", "Soporte Sincro"].map((s, i) => (
                    <div key={s} style={{ minHeight: 30, borderRadius: cornerRadius(t, "control"), background: i === 0 ? d.azul : t.color.surfaceAlt, color: t.color.onAccent, fontSize: t.type.ui.xs, lineHeight: 1.25, whiteSpace: "nowrap", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {s}
                    </div>
                  ))}
                </div>
                <Input>{typed(REPORT_TITLE, f, C.reportar + 14, 2.4) || undefined}</Input>
                <Input row>
                  Guardia de Desarrollo <span>⌄</span>
                </Input>
                <Input light h={90} size={t.type.ui.xs} line={1.45}>
                  <span><b>Ticket origen:</b> #{TICKET}</span>
                  <span><b>Empresa:</b> Tienda 18</span>
                  <span>Tres pedidos no bajaron al ERP por un artículo sin stock.</span>
                </Input>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  <PBtn label="Cargar datos del ticket" fill={t.color.surfaceAlt} />
                  <PBtn label={creating ? "Creando..." : "Crear reporte"} fill={d.azul} press={press(f, C.crear)} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>}
    </>
  );
};

/** El panel en su lugar: del rincón de la mesa (minimizado) a la derecha (abierto), con un vaivén suave una vez levantado. */
export const Panel: React.FC = () => {
  const f = useFrame();
  const p = kf(f, [C.lift[0], C.lift[1]], [0, 1], IN_OUT);
  const open = kf(f, [C.lift[0] + 40, C.lift[1] + 10], [0, 1], OUT);
  const x = PMIN.x + (P.x - PMIN.x) * p;
  const y = PMIN.y + (P.y - PMIN.y) * p;
  const w = PMIN.w + (P.w - PMIN.w) * p;
  const bob = Math.sin(f / 24) * 6 * p;
  // el original lo levantaba 140 px hacia la cámara (translateZ, un 7 % más grande): ni la perspectiva propia ni `scale()` sobre este panel pasan --check (el texto de los campos se rasteriza distinto), así que no se agranda
  return (
    <ThemeScope theme={panelTheme} paint style={{ position: "absolute", left: Math.round(x), top: Math.round(y + bob), width: Math.round(w), boxSizing: "border-box", overflow: "hidden", zIndex: 20, ...surfaceStyle(panelTheme, "window"), background: panelTheme.color.bg }}>
      {/* reproducción del panel del userscript: tamaños fijos de la herramienta real */}
      <div data-qa-fixed-scale>
        <PanelBody open={open} />
      </div>
    </ThemeScope>
  );
};
