// El panel de monitoreo (Sincro Monitor): encabezado, filtros por estado, cifras, dona, tabla con el detalle del log y el botón "Crear ticket".
// Herramienta recreada (no es una captura): vive en su propio design system (`monitorTheme`) y se marca `data-qa-fixed-scale`.
import React from "react";
import { Easing, random, useFrame } from "video-estudio/engine";
import { CountUp, Eyebrow, ThemeScope, calloutState, coveredOpacity, kf, typed } from "video-estudio/kit";
import { fade as op } from "video-estudio/fx/core"; // opacidad solo mientras cambia: en reposo no se emite (residuos que rompen --check)
import { borderWidth, cornerRadius, dimOpacity, entrance, staggerFrames, surfaceStyle, textStyle, useTheme, withAlpha } from "video-estudio/themes";
import { Check, ICON, appear, inkOn, scaleOf, tint } from "./piezas";
import { CH, CW, DETAIL_H, DONUT, FOCUS_STATUS, LOG, ROWS, STATUS, STEPS, STORE, T, TABLE, TICKET, TOTAL, CHIP } from "./mundo";
import { monitorTheme, terminalTheme } from "./temas";

const OUT = Easing.out;
type Theme = ReturnType<typeof useTheme>;
const dataColor = (t: Theme, rol: string) => (t.data as Record<string, string>)[rol]!;
/** Color de un estado del monitor. */
export const statusColor = (t: Theme, i: number) => dataColor(t, STATUS[i]!.rol);
/** Texto de un estado sobre su pastilla teñida: el mismo matiz, oscurecido hasta llegar a 4,5:1 (el amarillo y el naranja de relleno no leen como letra chica). */
const statusText = (t: Theme, i: number) => inkOn(statusColor(t, i), tint(t, statusColor(t, i)));

// ---------- encabezado ----------
const Header: React.FC<{ f: number; bellOn: boolean }> = ({ f, bellOn }) => {
  const t = useTheme();
  const pulse = (Math.sin(f / 6) + 1) / 2;
  return (
    <div style={{ position: "absolute", left: 40, right: 40, top: 26, minHeight: 60, display: "flex", alignItems: "center", gap: 16, opacity: op(appear(f, 128, 150)) }}>
      <div style={{ width: 46, height: 46, borderRadius: cornerRadius(t, "panel"), background: t.gradient.brand, flexShrink: 0 }} />
      <div>
        <div style={{ fontSize: t.type.caption * 0.94, ...textStyle(t, "title"), color: t.color.text, lineHeight: 1.15 }}>Sincro Monitor</div>
        <div style={{ fontSize: t.type.ui.sm, color: t.color.textMuted, lineHeight: 1.25 }}>Monitoreo de sincronizaciones</div>
      </div>
      <div style={{ flex: 1 }} />
      <HeaderBell f={f} on={bellOn} />
      <div style={{ width: 12, height: 12, borderRadius: 6, flexShrink: 0, background: t.data.pulso, boxShadow: `0 0 0 ${3 + pulse * 7}px ${withAlpha(t.data.pulso!, (1 - pulse) * 0.35)}` }} />
      <div style={{ fontSize: t.type.ui.sm, color: t.color.textMuted, marginRight: 12, whiteSpace: "nowrap", lineHeight: 1.25 }}>Auto 60s</div>
      <div style={{ minHeight: 44, boxSizing: "border-box", padding: "0 20px", display: "flex", alignItems: "center", ...surfaceStyle(t, "chip", { on: false, level: "sm" }), boxShadow: undefined, fontSize: t.type.ui.sm, ...textStyle(t, "label"), color: t.color.text, whiteSpace: "nowrap", lineHeight: 1.25 }}>
        Recargar vista
      </div>
    </div>
  );
};

/** Campana del encabezado: suena y muestra un globo con el número cuando llega el aviso. */
const HeaderBell: React.FC<{ f: number; on: boolean }> = ({ f, on }) => {
  const t = useTheme();
  const ring = on ? Math.sin((f - T.alert) * 0.9) * 18 * Math.max(0, 1 - (f - T.alert) / 40) : 0;
  const pop = kf(f, [T.alert, T.alert + 6, T.alert + 14], [0, 1.3, 1]);
  // el original la ubica en x 1170: el margen la deja ahí con la tipografía de la marca
  return (
    <div style={{ position: "relative", width: 44, height: 44, flexShrink: 0, marginRight: 40, borderRadius: 22, background: on ? withAlpha(t.color.accent, 0.08) : undefined, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width={26} height={26} viewBox="0 0 24 24" style={{ transform: Math.abs(ring) > 0.01 ? `rotate(${ring.toFixed(2)}deg)` : undefined, transformOrigin: "50% 10%" }}>
        <path d={ICON.bell} fill="none" stroke={on ? t.color.accent : t.color.textMuted} strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {on && (
        <span style={{ position: "absolute", right: -4, top: -4, minWidth: 22, height: 22, boxSizing: "border-box", borderRadius: 11, background: t.color.danger, color: t.color.onAccent, fontSize: t.type.ui.xs, ...textStyle(t, "label", { strong: true }), display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1, ...scaleOf(pop) }}>1</span>
      )}
    </div>
  );
};

// ---------- filtros por estado ----------
const Chips: React.FC<{ f: number; filterOn: number }> = ({ f, filterOn }) => {
  const t = useTheme();
  // atenuación calculada contra el fondo: lo que no es el filtro queda lo más tenue que sigue leyéndose (4,5:1)
  const dim = dimOpacity(t.color.text, t.color.surface, { min: 4.5 });
  return (
    <div style={{ position: "absolute", left: CHIP.x, top: CHIP.y, display: "flex", alignItems: "center", gap: CHIP.gap }}>
      {STATUS.slice(0, 4).map((st, i) => {
        const p = appear(f, 140 + staggerFrames(t, i, { base: 4 }), 160 + staggerFrames(t, i, { base: 4 }));
        const focus = i === FOCUS_STATUS;
        const active = focus ? filterOn : 0;
        const press = focus ? kf(f, [T.filterClick - 2, T.filterClick + 2, T.filterClick + 10], [0, 0.07, 0]) : 0;
        const c = statusColor(t, i);
        const lit = active > 0.05;
        const e = entrance(t, p, i, { native: "rise", distance: 16 });
        // la entrada y la atenuación van en capas distintas: el texto atenuado no hereda una opacidad fija
        const sc = scaleOf(1 + active * 0.05 - press);
        return (
          <div key={st.key} style={{ ...e, ...(sc.transform ? { transform: `${e.transform ?? ""} ${sc.transform}`.trim() } : {}), position: "relative", minWidth: CHIP.w[i], minHeight: CHIP.h, boxSizing: "border-box" }}>
            <div style={{ position: "absolute", inset: 0, ...surfaceStyle(t, "chip", { on: false }), boxShadow: undefined, borderColor: lit ? c : undefined, background: lit ? `color-mix(in srgb, ${c} ${(active * 12).toFixed(1)}%, ${t.color.surface})` : t.color.surface, opacity: op(focus ? 1 : 1 - filterOn * 0.5) }} />
            <div style={{ position: "relative", minHeight: CHIP.h, boxSizing: "border-box", display: "flex", alignItems: "center", gap: 10, padding: "0 18px", fontSize: t.type.ui.sm, ...textStyle(t, "label"), lineHeight: 1.25, color: active > 0.5 ? statusText(t, i) : t.color.text, opacity: op(focus ? 1 : 1 - filterOn * (1 - dim)), whiteSpace: "nowrap" }}>
              <div style={{ width: 12, height: 12, borderRadius: 6, background: c, flexShrink: 0 }} />
              {st.label}
            </div>
          </div>
        );
      })}
      <div style={{ marginLeft: 20, fontSize: t.type.ui.sm, color: t.color.textMuted, lineHeight: 1.25, whiteSpace: "nowrap", opacity: op(appear(f, 160, 175)) }}>
        Mostrando <b style={{ color: t.color.text, ...textStyle(t, "label", { strong: true }) }}>{Math.round(kf(filterOn, [0, 1], [TOTAL, STATUS[FOCUS_STATUS]!.n], Easing.linear))}</b> tiendas
      </div>
    </div>
  );
};

// ---------- cifras ----------
const Kpis: React.FC<{ f: number; filterOn: number }> = ({ f, filterOn }) => {
  const t = useTheme();
  // el aviso cae sobre las dos últimas tarjetas: su texto se apaga mientras el aviso (y después la campanita) está encima
  const under = coveredOpacity(calloutState(f, [T.alert, T.teams.signal[0] + 6]));
  const cards = [{ n: TOTAL, idx: -1, l: "Tiendas" }, ...STATUS.slice(0, 4).map((s, i) => ({ n: s.n, idx: i, l: s.kpi }))];
  const dimLabel = dimOpacity(t.color.textMuted, t.color.surface, { min: 4.5 });
  return (
    <div style={{ position: "absolute", left: 40, top: 190, width: CW - 80, display: "flex", gap: 20 }}>
      {cards.map((card, i) => {
        const p = appear(f, 138 + staggerFrames(t, i, { base: 5 }), 165 + staggerFrames(t, i, { base: 5 }));
        const focus = card.idx === FOCUS_STATUS || card.idx === -1;
        const num = card.idx < 0 ? t.color.text : inkOn(statusColor(t, card.idx), t.color.surface, 3.5);
        const bar = card.idx < 0 ? t.gradient.brand : statusColor(t, card.idx);
        const dimNum = dimOpacity(num, t.color.surface, { min: 3.5 });
        const sc = scaleOf(card.idx === FOCUS_STATUS ? 1 + filterOn * 0.04 : 1);
        const e = entrance(t, p, i, { native: "rise", distance: 30 });
        return (
          <div key={i} style={{ ...e, ...(sc.transform ? { transform: `${e.transform ?? ""} ${sc.transform}`.trim() } : {}), flex: 1, position: "relative", minHeight: 160, boxSizing: "border-box", padding: "26px 28px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            {/* la superficie (relleno, borde, sombra y barra de color) es la que se atenúa; el texto baja solo hasta el contraste mínimo */}
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
    </div>
  );
};

// ---------- dona ----------
const DonutPanel: React.FC<{ f: number; filterOn: number; shell: number }> = ({ f, filterOn, shell }) => {
  const t = useTheme();
  const C = 2 * Math.PI * DONUT.r;
  const reveal = appear(f, 100, 124);
  const strokeW = kf(f, [100, 128], [6, DONUT.w], OUT);
  const focused = filterOn > 0.5;
  let acc = 0;
  return (
    <>
      <div style={{ position: "absolute", left: 40, top: TABLE.y, width: 520, height: TABLE.h, boxSizing: "border-box", ...surfaceStyle(t, "card"), padding: "22px 26px", opacity: op(shell) }}>
        <Eyebrow size={t.type.ui.xs}>Estado por cliente</Eyebrow>
      </div>
      <svg width={CW} height={CH} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        <g transform={`rotate(-90 ${DONUT.cx} ${DONUT.cy})`} opacity={op(reveal)}>
          {STATUS.map((st, i) => {
            const len = (st.n / TOTAL) * C;
            const off = acc;
            acc += len;
            const isFocus = i === FOCUS_STATUS;
            const pop = isFocus ? filterOn * 14 : 0;
            const mid = ((off + len / 2) / C) * Math.PI * 2;
            return (
              <circle key={st.key} cx={DONUT.cx + Math.cos(mid) * pop} cy={DONUT.cy + Math.sin(mid) * pop} r={DONUT.r} fill="none" stroke={statusColor(t, i)} strokeWidth={strokeW + (isFocus ? filterOn * 10 : 0)} strokeDasharray={`${Math.max(len - 3, 0)} ${C}`} strokeDashoffset={-off} opacity={op(isFocus ? 1 : 1 - filterOn * 0.75)} />
            );
          })}
        </g>
        <g opacity={op(appear(f, 130, 150))} fontFamily={t.font.family} textAnchor="middle">
          <text x={DONUT.cx} y={DONUT.cy + 14} fontWeight={t.font.weights.stat} fontSize={t.type.stat * 0.38} fill={focused ? t.data.estadoInfra : t.color.text} style={{ color: focused ? t.data.estadoInfra : t.color.text }}>
            {focused ? STATUS[FOCUS_STATUS]!.n : TOTAL}
          </text>
          <text x={DONUT.cx} y={DONUT.cy + 46} fontSize={t.type.ui.md} fill={t.color.textMuted} style={{ color: t.color.textMuted }}>
            {focused ? "error en servidor" : "tiendas"}
          </text>
        </g>
      </svg>
    </>
  );
};

// ---------- botón "Crear ticket" ----------
const Spinner: React.FC<{ f: number }> = ({ f }) => {
  const t = useTheme();
  return (
    <svg width={20} height={20} viewBox="0 0 20 20" style={{ transform: `rotate(${(f * 18) % 360}deg)` }}>
      <circle cx={10} cy={10} r={8} stroke={withAlpha(t.color.onAccent, 0.33)} strokeWidth={3} fill="none" />
      <path d="M10 2a8 8 0 0 1 8 8" stroke={t.color.onAccent} strokeWidth={3} fill="none" strokeLinecap="round" />
    </svg>
  );
};

const TicketButton: React.FC<{ f: number }> = ({ f }) => {
  const t = useTheme();
  const btnIn = appear(f, 395, 412);
  const press = kf(f, [T.ticketClick - 3, T.ticketClick + 1, T.ticketClick + 8], [0, 1, 0]);
  const creating = f >= T.ticketClick + 2 && f < T.ticketDone;
  const done = appear(f, T.ticketDone, T.ticketDone + 14);
  const sc = scaleOf(btnIn * (1 - press * 0.07));
  return (
    <div style={{ alignSelf: "flex-end", minHeight: 50, minWidth: 220, boxSizing: "border-box", padding: "0 24px", borderRadius: cornerRadius(t, "chip"), background: done > 0 ? t.color.surface : t.gradient.brand, border: done > 0 ? `${borderWidth(t, "chip")}px solid ${t.color.success}` : "none", opacity: op(btnIn), ...sc, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, fontSize: t.type.ui.md, ...textStyle(t, "title"), lineHeight: 1.25, color: done > 0 ? inkOn(t.color.success, t.color.surface) : t.color.onAccent, boxShadow: press > 0.001 ? `0 0 0 ${press * 16}px ${withAlpha(t.color.accent, 0.13)}` : undefined, whiteSpace: "nowrap" }}>
      {done > 0 ? (
        <>
          <Check ok p={done} />
          Ticket {TICKET}
        </>
      ) : creating ? (
        <>
          <Spinner f={f} />
          Creando…
        </>
      ) : (
        "Crear ticket"
      )}
    </div>
  );
};

// ---------- detalle del log (se abre al clickear la fila) ----------
const Detail: React.FC<{ f: number }> = ({ f }) => {
  const t = useTheme();
  const open = appear(f, T.rowClick + 5, T.rowClick + 35);
  if (open <= 0) return null; // cerrado: no hay texto escondido en una caja de alto cero
  return (
    <div style={{ height: open * DETAIL_H, overflow: "hidden" }}>
      {/* el detalle se abre hacia abajo: mientras crece, su borde corta el contenido a propósito (no es texto cortado por error) */}
      <div data-qa-ignore={open < 1 ? "clip" : undefined} style={{ margin: "8px 20px 16px", minHeight: DETAIL_H - 24, boxSizing: "border-box", ...surfaceStyle(t, "panel", { level: "sm" }), boxShadow: undefined, background: t.color.bg, display: "flex", gap: 28, padding: 22 }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
          <Eyebrow size={t.type.ui.xs} color={inkOn(t.color.danger, t.color.bg)}>Error del log</Eyebrow>
          {/* terminal: otra herramienta dentro de la herramienta, oscura y monoespaciada (su propio ámbito) */}
          <ThemeScope theme={terminalTheme} paint style={{ flex: 1, ...surfaceStyle(terminalTheme, "card", { corner: "control" }), background: terminalTheme.color.bg, border: "none", boxShadow: undefined, padding: "18px 20px", boxSizing: "border-box", fontSize: terminalTheme.type.ui!.sm, lineHeight: 1.6, color: terminalTheme.color.text }}>
            <div style={{ minHeight: "1.6em", whiteSpace: "pre-wrap" }}>{typed(`job 8f2a · ${STORE}`, f, 322, 2)}</div>
            <div style={{ minHeight: "1.6em", color: terminalTheme.data!.errorLog, whiteSpace: "pre-wrap" }}>
              {typed(LOG, f, 345, 1.6)}
              {f > 345 && f < 395 && Math.floor(f / 8) % 2 === 0 ? "▍" : ""}
            </div>
            <div style={{ minHeight: "1.6em", whiteSpace: "pre-wrap" }}>{typed("Reintento programado: próxima corrida", f, 375, 2)}</div>
          </ThemeScope>
        </div>
        <div style={{ width: 360, display: "flex", flexDirection: "column", gap: 10 }}>
          <Eyebrow size={t.type.ui.xs}>Últimas etapas ejecutadas</Eyebrow>
          {STEPS.map((s, i) => {
            const p = kf(f, [340 + i * 9, 352 + i * 9], [0, 1], Easing.lands);
            const ok = i < STEPS.length - 1;
            const shake = !ok ? Math.sin(f * 1.4) * kf(f, [380, 386, 396], [0, 4, 0]) : 0;
            return (
              <div key={s} style={{ display: "flex", alignItems: "center", gap: 12, transform: Math.abs(shake) > 0.01 ? `translateX(${Math.round(shake)}px)` : undefined, fontSize: t.type.ui.sm, lineHeight: 1.25, color: ok ? t.color.text : t.color.danger, fontWeight: ok ? t.font.weights.regular : t.font.weights.semibold, opacity: p > 0 ? undefined : 0 }}>
                <Check ok={ok} p={p} />
                {s}
              </div>
            );
          })}
          <div style={{ flex: 1 }} />
          <TicketButton f={f} />
        </div>
      </div>
    </div>
  );
};

// ---------- tabla ----------
const StatusPill: React.FC<{ st: number }> = ({ st }) => {
  const t = useTheme();
  const c = statusColor(t, st);
  return (
    <div style={{ minWidth: 200, flexShrink: 0, display: "flex", alignItems: "center" }}>
      <div style={{ minHeight: 30, boxSizing: "border-box", borderRadius: cornerRadius(t, "chip"), background: tint(t, c), color: statusText(t, st), display: "flex", alignItems: "center", gap: 8, padding: "0 12px", fontSize: t.type.ui.xs, ...textStyle(t, "label", { strong: true }), lineHeight: 1.25, whiteSpace: "nowrap" }}>
        <div style={{ width: 9, height: 9, borderRadius: 5, background: c, flexShrink: 0 }} />
        {STATUS[st]!.label}
      </div>
    </div>
  );
};

const Table: React.FC<{ f: number; filterOn: number }> = ({ f, filterOn }) => {
  const t = useTheme();
  const p = appear(f, 150, 175);
  const target = ROWS.findIndex((r) => r.st === FOCUS_STATUS);
  const rowClick = kf(f, [T.rowClick - 2, T.rowClick + 2, T.rowClick + 10], [0, 1, 0]);
  const cols = { st: 200, sc: 190, t: 110, dur: 100 };
  const grey = { fontSize: t.type.ui.sm, color: t.color.textMuted };
  // alto acumulado: con el detalle abierto, las filas que quedan más abajo del borde de la tabla no se dibujan (no hay texto oculto por el borde)
  const detailH = appear(f, T.rowClick + 5, T.rowClick + 35) * DETAIL_H;
  let y = TABLE.head;
  const tops = ROWS.map((r, i) => {
    const top = y;
    y += TABLE.row * (1 - (r.st === FOCUS_STATUS ? 0 : filterOn)) + (i === target ? detailH : 0);
    return top;
  });
  return (
    <div style={{ position: "absolute", left: TABLE.x, top: TABLE.y, width: TABLE.w, height: TABLE.h, boxSizing: "border-box", ...surfaceStyle(t, "card"), overflow: "hidden", ...entrance(t, p, 0, { native: "slide", side: "right", distance: 40 }) }}>
      <div style={{ minHeight: TABLE.head, boxSizing: "border-box", display: "flex", alignItems: "center", padding: "0 26px", borderBottom: `1px solid ${t.color.surfaceAlt}` }}>
        <div style={{ minWidth: cols.st }}><Eyebrow size={t.type.ui.xs}>Estado</Eyebrow></div>
        <div style={{ flex: 1 }}><Eyebrow size={t.type.ui.xs}>Dominio</Eyebrow></div>
        <div style={{ minWidth: cols.sc }}><Eyebrow size={t.type.ui.xs}>Script</Eyebrow></div>
        <div style={{ minWidth: cols.t }}><Eyebrow size={t.type.ui.xs}>Último run</Eyebrow></div>
        <div style={{ minWidth: cols.dur }}><Eyebrow size={t.type.ui.xs}>Duración</Eyebrow></div>
        <div style={{ width: 20 }} />
      </div>
      {ROWS.map((r, i) => {
        const keep = r.st === FOCUS_STATUS;
        const collapse = keep ? 0 : filterOn;
        const rowIn = appear(f, 158 + staggerFrames(t, i, { context: "rows", base: 3 }), 176 + staggerFrames(t, i, { context: "rows", base: 3 }));
        const isTarget = i === target;
        const tint = isTarget ? rowClick * 0.12 + kf(f, [T.rowClick, T.rowClick + 20], [0, 0.05]) : 0;
        const e = entrance(t, rowIn, i, { native: "slide", side: "right", distance: 30 });
        if (tops[i]! + TABLE.row * 0.5 > TABLE.h - 6) return isTarget ? <Detail key={i} f={f} /> : null;
        // mientras el detalle crece, las filas de abajo se corren hacia el borde de la tabla: se apagan antes de llegar y el borde las corta a propósito
        const sliding = f >= T.rowClick + 5 && f <= T.rowClick + 37;
        const nearEdge = sliding ? kf(tops[i]! + TABLE.row / 2, [TABLE.h - 70, TABLE.h - 6], [1, 0], Easing.linear) : 1;
        return (
          <React.Fragment key={i}>
            <div data-qa-ignore={sliding && i > target ? "clip" : undefined} style={{ ...e, height: TABLE.row * (1 - collapse), opacity: op(rowIn * (1 - collapse) * nearEdge), overflow: "hidden", boxSizing: "border-box", display: "flex", alignItems: "center", padding: "0 26px", borderBottom: `1px solid ${t.color.surfaceAlt}`, background: tint > 0 ? withAlpha(t.color.accent, tint) : undefined, fontSize: t.type.ui.sm, lineHeight: 1.25, color: t.color.text, whiteSpace: "nowrap" }}>
              <StatusPill st={r.st} />
              <div style={{ flex: 1, ...textStyle(t, "label") }}>{r.d}</div>
              <div style={{ minWidth: cols.sc, ...grey }}>{r.s}</div>
              <div style={{ minWidth: cols.t, ...grey }}>{r.t}</div>
              <div style={{ minWidth: cols.dur, ...grey }}>{r.dur}</div>
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

/** Todo el panel, en su ámbito de tema. `bellOn`: ya llegó el aviso (la campana suena). */
export const MonitorPanel: React.FC<{ filterOn: number; peek: boolean }> = ({ filterOn, peek }) => {
  const f = useFrame();
  const shell = kf(f, [112, 150], [0, 1], OUT);
  return (
    <ThemeScope theme={monitorTheme}>
      {/* reproducción de la herramienta real (panel de monitoreo) con tamaños fijos: no se agranda con el estrés de tipografía */}
      {/* si la cámara está en otra ventana, el panel asoma por el borde del cuadro a propósito: es el vecino, no el sujeto (`peek`) */}
      <div data-qa-fixed-scale data-qa-ignore={peek ? "offscreen" : undefined} style={{ position: "absolute", left: 0, top: 0, width: CW, height: CH, color: monitorTheme.color.text, fontFamily: monitorTheme.font.family }}>
        <PanelBody f={f} shell={shell} filterOn={filterOn} />
      </div>
    </ThemeScope>
  );
};

const PanelBody: React.FC<{ f: number; shell: number; filterOn: number }> = ({ f, shell, filterOn }) => {
  const t = useTheme();
  return (
    <>
      <div style={{ position: "absolute", left: 0, top: 0, width: CW, height: CH, boxSizing: "border-box", ...surfaceStyle(t, "window", { corner: "hero" }), opacity: op(shell) }} />
      <Header f={f} bellOn={f >= T.alert} />
      <Chips f={f} filterOn={filterOn} />
      <Kpis f={f} filterOn={filterOn} />
      <DonutPanel f={f} filterOn={filterOn} shell={shell} />
      <Table f={f} filterOn={filterOn} />
    </>
  );
};

// ---------- apertura: un punto por tienda ----------
/** Un punto por tienda (TOTAL): se encienden por estado y se juntan en el aro de la dona. En pantalla (la cámara está en la dona, escala `s`). */
export const DotField: React.FC<{ s: number }> = ({ s }) => {
  const f = useFrame();
  const t = useTheme();
  const cols = 21;
  const sp = 40;
  const ox = 960 - ((cols - 1) * sp) / 2;
  const oy = 540 - (14 * sp) / 2;
  const fade = kf(f, [104, 122], [1, 0], Easing.linear);
  if (fade <= 0) return null;
  const statusOf: number[] = [];
  STATUS.forEach((st, si) => {
    for (let j = 0; j < st.n; j++) statusOf.push(si);
  });
  const slots = statusOf.map((st, ringIdx) => ({ st, ringIdx, r: random(`slot${ringIdx}`) })).sort((a, b) => a.r - b.r);
  const R = DONUT.r * s;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: op(fade), pointerEvents: "none" }}>
      {slots.map((d, gi) => {
        const col = gi % cols;
        const row = Math.floor(gi / cols);
        const p = kf(f, [2 + (col + row) * 0.9, 14 + (col + row) * 0.9], [0, 1], OUT);
        const lit = kf(f, [26 + (col + row) * 1.1, 34 + (col + row) * 1.1], [0, 1]);
        const a = -Math.PI / 2 + ((d.ringIdx + 0.5) / TOTAL) * Math.PI * 2;
        const m = kf(f, [58 + d.ringIdx * 0.08, 96 + d.ringIdx * 0.08], [0, 1]);
        const x = ox + col * sp + (960 + Math.cos(a) * R - (ox + col * sp)) * m;
        const y = oy + row * sp + (540 + Math.sin(a) * R - (oy + row * sp)) * m;
        const size = 16 + (13 - 16) * m;
        const k = p * (1 + Math.sin(lit * Math.PI) * 0.6);
        if (k <= 0) return null;
        const color = lit > 0.5 ? monitorTheme.data![STATUS[d.st]!.rol]! : t.color.border;
        return <div key={gi} style={{ position: "absolute", left: 0, top: 0, width: size, height: size, borderRadius: size / 2, background: color, transform: `translate(${(x - size / 2).toFixed(2)}px, ${(y - size / 2).toFixed(2)}px) scale(${k.toFixed(3)})` }} />;
      })}
    </div>
  );
};
