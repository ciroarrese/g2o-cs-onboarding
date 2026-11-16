// El panel de monitoreo en vertical y cuadrado (ver `angosto.ts`): una columna de 800 de ancho. Los chips pasan a una grilla de 2 x 2, las cifras a una grilla de
// 2 columnas (la de "Tiendas" ocupa todo el ancho), la dona queda arriba y la tabla abajo (sin las columnas "Script" y "Duración", que son accesorias),
// y el detalle del log se apila: la terminal arriba y las etapas debajo, a todo el ancho. Mismos textos, cifras y tiempos que el panel horizontal (`Panel.tsx`).
import React from "react";
import { Easing, random, useFormat, useFrame } from "video-estudio/engine";
import { CountUp, Eyebrow, ThemeScope, calloutState, coveredOpacity, kf, typed } from "video-estudio/kit";
import { fade as op } from "video-estudio/fx/core";
import { borderWidth, cornerRadius, dimOpacity, entrance, staggerFrames, surfaceStyle, textStyle, useTheme, withAlpha } from "video-estudio/themes";
import { Check, ICON, appear, inkOn, scaleOf } from "./piezas";
import { FOCUS_STATUS, LOG, ROWS, STATUS, STEPS, STORE, T, TOTAL } from "./mundo";
import { PAN, PV, chipPos, kpiPos, kpiW2 } from "./angosto";
import { StatusPill, TicketButton, statusColor, statusText } from "./Panel";
import { monitorTheme, terminalTheme } from "./temas";

const OUT = Easing.out;

// ---------- encabezado ----------
const Header: React.FC<{ f: number; bellOn: boolean }> = ({ f, bellOn }) => {
  const t = useTheme();
  const pulse = (Math.sin(f / 6) + 1) / 2;
  const ring = bellOn ? Math.sin((f - T.alert) * 0.9) * 18 * Math.max(0, 1 - (f - T.alert) / 40) : 0;
  const pop = kf(f, [T.alert, T.alert + 6, T.alert + 14], [0, 1.3, 1]);
  return (
    <div style={{ position: "absolute", left: PAN.pad, right: PAN.pad, top: 24, minHeight: 60, display: "flex", alignItems: "center", gap: 14, opacity: op(appear(f, 128, 150)) }}>
      <div style={{ width: 46, height: 46, borderRadius: cornerRadius(t, "panel"), background: t.gradient.brand, flexShrink: 0 }} />
      <div>
        <div style={{ fontSize: t.type.caption * 0.94, ...textStyle(t, "title"), color: t.color.text, lineHeight: 1.15, whiteSpace: "nowrap" }}>Sincro Monitor</div>
        <div style={{ fontSize: t.type.ui.sm, color: t.color.textMuted, lineHeight: 1.25, whiteSpace: "nowrap" }}>Monitoreo de sincronizaciones</div>
      </div>
      <div style={{ flex: 1 }} />
      {/* campana: suena y muestra un globo con el número cuando llega el aviso */}
      <div style={{ position: "relative", width: 44, height: 44, flexShrink: 0, borderRadius: 22, background: bellOn ? withAlpha(t.color.accent, 0.08) : undefined, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width={26} height={26} viewBox="0 0 24 24" style={{ transform: Math.abs(ring) > 0.01 ? `rotate(${ring.toFixed(2)}deg)` : undefined, transformOrigin: "50% 10%" }}>
          <path d={ICON.bell} fill="none" stroke={bellOn ? t.color.accent : t.color.textMuted} strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {bellOn && (
          <span style={{ position: "absolute", right: -4, top: -4, minWidth: 22, height: 22, boxSizing: "border-box", borderRadius: 11, background: t.color.danger, color: t.color.onAccent, fontSize: t.type.ui.xs, ...textStyle(t, "label", { strong: true }), display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1, ...scaleOf(pop) }}>1</span>
        )}
      </div>
      <div style={{ width: 12, height: 12, borderRadius: 6, flexShrink: 0, background: t.data.pulso, boxShadow: `0 0 0 ${3 + pulse * 7}px ${withAlpha(t.data.pulso!, (1 - pulse) * 0.35)}` }} />
      <div style={{ minHeight: 44, boxSizing: "border-box", padding: "0 18px", display: "flex", alignItems: "center", ...surfaceStyle(t, "chip", { on: false, level: "sm" }), boxShadow: undefined, fontSize: t.type.ui.sm, ...textStyle(t, "label"), color: t.color.text, whiteSpace: "nowrap", lineHeight: 1.25 }}>
        Recargar vista
      </div>
    </div>
  );
};

// ---------- filtros por estado (grilla de 2 x 2) ----------
const Chips: React.FC<{ f: number; filterOn: number }> = ({ f, filterOn }) => {
  const t = useTheme();
  const dim = dimOpacity(t.color.text, t.color.surface, { min: 4.5 });
  return (
    <>
      {STATUS.slice(0, 4).map((st, i) => {
        const p = appear(f, 140 + staggerFrames(t, i, { base: 4 }), 160 + staggerFrames(t, i, { base: 4 }));
        const focus = i === FOCUS_STATUS;
        const active = focus ? filterOn : 0;
        const press = focus ? kf(f, [T.filterClick - 2, T.filterClick + 2, T.filterClick + 10], [0, 0.07, 0]) : 0;
        const c = statusColor(t, i);
        const lit = active > 0.05;
        const e = entrance(t, p, i, { native: "rise", distance: 16 });
        const sc = scaleOf(1 + active * 0.05 - press);
        const pos = chipPos(i);
        return (
          <div key={st.key} style={{ ...e, ...(sc.transform ? { transform: `${e.transform ?? ""} ${sc.transform}`.trim() } : {}), position: "absolute", left: pos.x, top: pos.y, width: PAN.chip.w, minHeight: PAN.chip.h, boxSizing: "border-box" }}>
            <div style={{ position: "absolute", inset: 0, ...surfaceStyle(t, "chip", { on: false }), boxShadow: undefined, borderColor: lit ? c : undefined, background: lit ? `color-mix(in srgb, ${c} ${(active * 12).toFixed(1)}%, ${t.color.surface})` : t.color.surface, opacity: op(focus ? 1 : 1 - filterOn * 0.5) }} />
            <div style={{ position: "relative", minHeight: PAN.chip.h, boxSizing: "border-box", display: "flex", alignItems: "center", gap: 10, padding: "0 18px", fontSize: t.type.ui.sm, ...textStyle(t, "label"), lineHeight: 1.25, color: active > 0.5 ? statusText(t, i) : t.color.text, opacity: op(focus ? 1 : 1 - filterOn * (1 - dim)), whiteSpace: "nowrap" }}>
              <div style={{ width: 12, height: 12, borderRadius: 6, background: c, flexShrink: 0 }} />
              {st.label}
            </div>
          </div>
        );
      })}
      <div style={{ position: "absolute", left: PAN.pad + 4, top: PAN.countY, fontSize: t.type.ui.sm, color: t.color.textMuted, lineHeight: 1.25, whiteSpace: "nowrap", opacity: op(appear(f, 160, 175)) }}>
        Mostrando <b style={{ color: t.color.text, ...textStyle(t, "label", { strong: true }) }}>{Math.round(kf(filterOn, [0, 1], [TOTAL, STATUS[FOCUS_STATUS]!.n], Easing.linear))}</b> tiendas
      </div>
    </>
  );
};

// ---------- cifras (grilla de 2 columnas; "Tiendas" a todo el ancho) ----------
const Kpis: React.FC<{ f: number; filterOn: number }> = ({ f, filterOn }) => {
  const t = useTheme();
  const under = coveredOpacity(calloutState(f, [T.alert, T.teams.signal[0] + 6]));
  const cards = [{ n: TOTAL, idx: -1, l: "Tiendas" }, ...STATUS.slice(0, 4).map((s, i) => ({ n: s.n, idx: i, l: s.kpi }))];
  const dimLabel = dimOpacity(t.color.textMuted, t.color.surface, { min: 4.5 });
  return (
    <>
      {cards.map((card, i) => {
        const p = appear(f, 138 + staggerFrames(t, i, { base: 5 }), 165 + staggerFrames(t, i, { base: 5 }));
        const focus = card.idx === FOCUS_STATUS || card.idx === -1;
        const num = card.idx < 0 ? t.color.text : inkOn(statusColor(t, card.idx), t.color.surface, 3.5);
        const bar = card.idx < 0 ? t.gradient.brand : statusColor(t, card.idx);
        const dimNum = dimOpacity(num, t.color.surface, { min: 3.5 });
        const sc = scaleOf(card.idx === FOCUS_STATUS ? 1 + filterOn * 0.04 : 1);
        const e = entrance(t, p, i, { native: "rise", distance: 30 });
        const pos = kpiPos(i);
        return (
          <div key={i} style={{ ...e, ...(sc.transform ? { transform: `${e.transform ?? ""} ${sc.transform}`.trim() } : {}), position: "absolute", left: pos.x, top: pos.y, width: pos.w, minHeight: PAN.kpi.h, boxSizing: "border-box", padding: "20px 24px 18px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div style={{ position: "absolute", inset: 0, ...surfaceStyle(t, "card"), overflow: "hidden", opacity: op(focus ? 1 : 1 - filterOn * 0.4) }}>
              <div style={{ position: "absolute", left: 0, top: 0, height: 6, width: `${p * 100}%`, background: bar }} />
            </div>
            <div style={{ position: "relative", opacity: op((focus ? 1 : 1 - filterOn * (1 - dimLabel)) * (card.idx >= 2 ? under : 1)) }}>
              <Eyebrow size={t.type.ui.xs} color={t.color.textMuted}>{card.l}</Eyebrow>
            </div>
            <div style={{ position: "relative", fontSize: t.type.stat * 0.38, fontWeight: t.font.weights.stat, lineHeight: 1, color: num, fontVariantNumeric: "tabular-nums", opacity: op((focus ? 1 : 1 - filterOn * (1 - dimNum)) * (card.idx >= 2 ? under : 1)) }}>
              <CountUp to={card.n} start={145 + staggerFrames(t, i, { base: 5 })} duration={34} />
            </div>
          </div>
        );
      })}
    </>
  );
};

// ---------- dona (arriba de la tabla) ----------
const Donut: React.FC<{ f: number; filterOn: number; shell: number }> = ({ f, filterOn, shell }) => {
  const t = useTheme();
  const D = PAN.donut;
  const C = 2 * Math.PI * D.r;
  const reveal = appear(f, 100, 124);
  const strokeW = kf(f, [100, 128], [6, D.w], OUT);
  const focused = filterOn > 0.5;
  let acc = 0;
  return (
    <>
      <div style={{ position: "absolute", left: PAN.pad, top: D.y, width: PAN.w - 2 * PAN.pad, height: D.h, boxSizing: "border-box", ...surfaceStyle(t, "card"), padding: "22px 26px", opacity: op(shell) }}>
        {f >= 112 && <div style={{ textAlign: "center" }}><Eyebrow size={t.type.ui.xs}>Estado por cliente</Eyebrow></div>}
      </div>
      <svg width={PAN.w} height={PAN.h} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        <g transform={`rotate(-90 ${D.cx} ${D.cy})`} opacity={op(reveal)}>
          {STATUS.map((st, i) => {
            const len = (st.n / TOTAL) * C;
            const off = acc;
            acc += len;
            const isFocus = i === FOCUS_STATUS;
            const pop = isFocus ? filterOn * 14 : 0;
            const mid = ((off + len / 2) / C) * Math.PI * 2;
            return (
              <circle key={st.key} cx={D.cx + Math.cos(mid) * pop} cy={D.cy + Math.sin(mid) * pop} r={D.r} fill="none" stroke={statusColor(t, i)} strokeWidth={strokeW + (isFocus ? filterOn * 10 : 0)} strokeDasharray={`${Math.max(len - 3, 0)} ${C}`} strokeDashoffset={-off} opacity={op(isFocus ? 1 : 1 - filterOn * 0.75)} />
            );
          })}
        </g>
        {f >= 130 && <g opacity={op(appear(f, 130, 150))} fontFamily={t.font.family} textAnchor="middle">
          <text x={D.cx} y={D.cy + 14} fontWeight={t.font.weights.stat} fontSize={t.type.stat * 0.38} fill={focused ? t.data.estadoInfra : t.color.text} style={{ color: focused ? t.data.estadoInfra : t.color.text }}>
            {focused ? STATUS[FOCUS_STATUS]!.n : TOTAL}
          </text>
          <text x={D.cx} y={D.cy + 46} fontSize={t.type.ui.md} fill={t.color.textMuted} style={{ color: t.color.textMuted }}>
            {focused ? "error en servidor" : "tiendas"}
          </text>
        </g>}
      </svg>
    </>
  );
};

// ---------- detalle del log (a todo el ancho: la terminal arriba y las etapas debajo) ----------
const Detail: React.FC<{ f: number }> = ({ f }) => {
  const t = useTheme();
  const open = appear(f, T.rowClick + 5, T.rowClick + 35);
  if (open <= 0) return null;
  return (
    <div style={{ height: open * PAN.detail, overflow: "hidden" }}>
      {/* el detalle se abre hacia abajo: mientras crece, su borde corta el contenido a propósito (no es texto cortado por error) */}
      <div data-qa-ignore={open < 1 ? "clip" : undefined} style={{ margin: "8px 20px 16px", minHeight: PAN.detail - 24, boxSizing: "border-box", ...surfaceStyle(t, "panel", { level: "sm" }), boxShadow: undefined, background: t.color.bg, display: "flex", flexDirection: "column", gap: 14, padding: 18 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <Eyebrow size={t.type.ui.xs} color={inkOn(t.color.danger, t.color.bg)}>Error del log</Eyebrow>
          <ThemeScope theme={terminalTheme} paint style={{ ...surfaceStyle(terminalTheme, "card", { corner: "control" }), background: terminalTheme.color.bg, border: "none", boxShadow: undefined, padding: "14px 18px", boxSizing: "border-box", fontSize: terminalTheme.type.ui!.sm, lineHeight: 1.6, color: terminalTheme.color.text }}>
            <div style={{ minHeight: "1.6em", whiteSpace: "pre-wrap" }}>{typed(`job 8f2a · ${STORE}`, f, 322, 2)}</div>
            <div style={{ minHeight: "1.6em", color: terminalTheme.data!.errorLog, whiteSpace: "pre-wrap" }}>
              {typed(LOG, f, 345, 1.6)}
              {f > 345 && f < 395 && Math.floor(f / 8) % 2 === 0 ? "▍" : ""}
            </div>
            <div style={{ minHeight: "1.6em", whiteSpace: "pre-wrap" }}>{typed("Reintento programado: próxima corrida", f, 375, 2)}</div>
          </ThemeScope>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <Eyebrow size={t.type.ui.xs}>Últimas etapas ejecutadas</Eyebrow>
          {STEPS.map((s, i) => {
            const p = kf(f, [340 + i * 9, 352 + i * 9], [0, 1], Easing.lands);
            const ok = i < STEPS.length - 1;
            const shake = !ok ? Math.sin(f * 1.4) * kf(f, [380, 386, 396], [0, 4, 0]) : 0;
            return (
              <div key={s} style={{ display: "flex", alignItems: "center", gap: 12, minHeight: 28, transform: Math.abs(shake) > 0.01 ? `translateX(${Math.round(shake)}px)` : undefined, fontSize: t.type.ui.sm, lineHeight: 1.25, color: ok ? t.color.text : t.color.danger, fontWeight: ok ? t.font.weights.regular : t.font.weights.semibold, opacity: p > 0 ? undefined : 0 }}>
                <Check ok={ok} p={p} />
                {s}
              </div>
            );
          })}
        </div>
        <div style={{ flex: 1 }} />
        <TicketButton f={f} puntos="..." />
      </div>
    </div>
  );
};

// ---------- tabla (estado, dominio y último run) ----------
const Table: React.FC<{ f: number; filterOn: number }> = ({ f, filterOn }) => {
  const t = useTheme();
  const TB = PAN.table;
  const p = appear(f, 150, 175);
  const target = ROWS.findIndex((r) => r.st === FOCUS_STATUS);
  const rowClick = kf(f, [T.rowClick - 2, T.rowClick + 2, T.rowClick + 10], [0, 1, 0]);
  const grey = { fontSize: t.type.ui.sm, color: t.color.textMuted };
  const detailH = appear(f, T.rowClick + 5, T.rowClick + 35) * PAN.detail;
  let y = TB.head;
  const tops = ROWS.map((r, i) => {
    const top = y;
    y += TB.row * (1 - (r.st === FOCUS_STATUS ? 0 : filterOn)) + (i === target ? detailH : 0);
    return top;
  });
  const cols = { st: 200, t: 110 };
  return (
    <div style={{ position: "absolute", left: TB.x, top: TB.y, width: TB.w, height: TB.h, boxSizing: "border-box", ...surfaceStyle(t, "card"), overflow: "hidden", ...entrance(t, p, 0, { native: "slide", side: "right", distance: 40 }) }}>
      <div style={{ minHeight: TB.head, boxSizing: "border-box", display: "flex", alignItems: "center", padding: "0 18px", borderBottom: `1px solid ${t.color.surfaceAlt}` }}>
        <div style={{ minWidth: cols.st }}><Eyebrow size={t.type.ui.xs}>Estado</Eyebrow></div>
        <div style={{ flex: 1 }}><Eyebrow size={t.type.ui.xs}>Dominio</Eyebrow></div>
        <div style={{ minWidth: cols.t }}><Eyebrow size={t.type.ui.xs}>Último run</Eyebrow></div>
        <div style={{ width: 20 }} />
      </div>
      {ROWS.map((r, i) => {
        const keep = r.st === FOCUS_STATUS;
        const collapse = keep ? 0 : filterOn;
        const rowIn = appear(f, 158 + staggerFrames(t, i, { context: "rows", base: 3 }), 176 + staggerFrames(t, i, { context: "rows", base: 3 }));
        const isTarget = i === target;
        const tint = isTarget ? rowClick * 0.12 + kf(f, [T.rowClick, T.rowClick + 20], [0, 0.05]) : 0;
        const e = entrance(t, rowIn, i, { native: "slide", side: "right", distance: 30 });
        if (tops[i]! + TB.row * 0.5 > TB.h - 6) return isTarget ? <Detail key={i} f={f} /> : null;
        if (collapse >= 0.999) return isTarget ? <Detail key={i} f={f} /> : null; // fila ya plegada por el filtro: no hay texto invisible
        const sliding = f >= T.rowClick + 5 && f <= T.rowClick + 37;
        const nearEdge = sliding ? kf(tops[i]! + TB.row / 2, [TB.h - 70, TB.h - 6], [1, 0], Easing.linear) : 1;
        return (
          <React.Fragment key={i}>
            <div data-qa-ignore={sliding && i > target ? "clip" : undefined} style={{ ...e, height: TB.row * (1 - collapse), opacity: op(rowIn * (1 - collapse) * nearEdge), overflow: "hidden", boxSizing: "border-box", display: "flex", alignItems: "center", padding: "0 18px", borderBottom: `1px solid ${t.color.surfaceAlt}`, background: tint > 0 ? withAlpha(t.color.accent, tint) : undefined, fontSize: t.type.ui.sm, lineHeight: 1.25, color: t.color.text, whiteSpace: "nowrap" }}>
              <StatusPill st={r.st} />
              <div style={{ flex: 1, ...textStyle(t, "label") }}>{r.d}</div>
              <div style={{ minWidth: cols.t, ...grey }}>{r.t}</div>
              <svg width={20} height={20} viewBox="0 0 16 16" style={{ flexShrink: 0, transform: isTarget && f > T.rowClick + 2 ? `rotate(${kf(f, [T.rowClick + 2, T.rowClick + 20], [0, 180]).toFixed(2)}deg)` : undefined }}>
                <path d="M4 6l4 4 4-4" stroke={t.data.grisMedio} strokeWidth={2} fill="none" />
              </svg>
            </div>
            {isTarget && <Detail f={f} />}
          </React.Fragment>
        );
      })}
    </div>
  );
};

/** Todo el panel angosto, en su ámbito de tema. */
export const MonitorPanelV: React.FC<{ filterOn: number; peek?: boolean }> = ({ filterOn, peek }) => {
  const f = useFrame();
  const t = monitorTheme;
  const shell = kf(f, [112, 150], [0, 1], OUT);
  return (
    <ThemeScope theme={t}>
      {/* reproducción de la herramienta real (panel de monitoreo) con tamaños fijos: no se agranda con el estrés de tipografía */}
      {/* si la cámara está en otra ventana, el panel asoma por el borde del cuadro a propósito: es el vecino, no el sujeto (`peek`) */}
      <div data-qa-fixed-scale data-qa-ignore={peek ? "offscreen" : undefined} style={{ position: "absolute", left: PV.x, top: PV.y, width: PAN.w, height: PAN.h, color: t.color.text, fontFamily: t.font.family }}>
        <PanelBodyV f={f} shell={shell} filterOn={filterOn} />
      </div>
    </ThemeScope>
  );
};

const PanelBodyV: React.FC<{ f: number; shell: number; filterOn: number }> = ({ f, shell, filterOn }) => {
  const t = useTheme();
  return (
    <>
      <div style={{ position: "absolute", left: 0, top: 0, width: PAN.w, height: PAN.h, boxSizing: "border-box", ...surfaceStyle(t, "window", { corner: "hero" }), opacity: op(shell) }} />
      {/* lo que todavía no entró no se dibuja (no hay texto invisible); cada pieza conserva su lugar entre los hijos, porque `qa` identifica un texto entre cuadros por su ruta */}
      <div>{f >= 128 && <Header f={f} bellOn={f >= T.alert} />}</div>
      <div>{f >= 140 && <Chips f={f} filterOn={filterOn} />}</div>
      <div>{f >= 138 && <Kpis f={f} filterOn={filterOn} />}</div>
      <Donut f={f} filterOn={filterOn} shell={shell} />
      <div>{f >= 150 && <Table f={f} filterOn={filterOn} />}</div>
    </>
  );
};

// ---------- apertura: un punto por tienda ----------
/** Igual que `DotField` del panel horizontal, con la rejilla y el aro de la dona angosta. `s` es la escala de la cámara. */
export const DotFieldV: React.FC<{ s: number }> = ({ s }) => {
  const f = useFrame();
  const t = useTheme();
  const { width, height, format } = useFormat();
  // la grilla llena el cuadro: en vertical 13 x 22 puntos de 26 px cada 76 (912 x 1672), en cuadrado 18 x 16 de 20 px cada 54
  const cols = format === "vertical" ? 13 : 18;
  const rows = Math.ceil(TOTAL / cols);
  const sp = format === "vertical" ? 76 : 54;
  const dot0 = format === "vertical" ? 26 : 20;
  const cx = width / 2;
  const cy = height / 2;
  const ox = cx - ((cols - 1) * sp) / 2;
  const oy = cy - (rows * sp) / 2;
  const fade = kf(f, [104, 122], [1, 0], Easing.linear);
  if (fade <= 0) return null;
  const statusOf: number[] = [];
  STATUS.forEach((st, si) => {
    for (let j = 0; j < st.n; j++) statusOf.push(si);
  });
  const slots = statusOf.map((st, ringIdx) => ({ st, ringIdx, r: random(`slot${ringIdx}`) })).sort((a, b) => a.r - b.r);
  const R = PAN.donut.r * s;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: op(fade), pointerEvents: "none" }}>
      {slots.map((d, gi) => {
        const col = gi % cols;
        const row = Math.floor(gi / cols);
        const p = kf(f, [2 + (col + row) * 0.9, 14 + (col + row) * 0.9], [0, 1], OUT);
        const lit = kf(f, [26 + (col + row) * 1.1, 34 + (col + row) * 1.1], [0, 1]);
        const a = -Math.PI / 2 + ((d.ringIdx + 0.5) / TOTAL) * Math.PI * 2;
        const m = kf(f, [58 + d.ringIdx * 0.08, 96 + d.ringIdx * 0.08], [0, 1]);
        const x = ox + col * sp + (cx + Math.cos(a) * R - (ox + col * sp)) * m;
        const y = oy + row * sp + (cy + Math.sin(a) * R - (oy + row * sp)) * m;
        const size = dot0 + (13 - dot0) * m;
        const k = p * (1 + Math.sin(lit * Math.PI) * 0.6);
        if (k <= 0) return null;
        const color = lit > 0.5 ? monitorTheme.data![STATUS[d.st]!.rol]! : t.color.border;
        return <div key={gi} style={{ position: "absolute", left: 0, top: 0, width: size, height: size, borderRadius: size / 2, background: color, transform: `translate(${(x - size / 2).toFixed(2)}px, ${(y - size / 2).toFixed(2)}px) scale(${k.toFixed(3)})` }} />;
      })}
    </div>
  );
};

export { kpiW2 };
