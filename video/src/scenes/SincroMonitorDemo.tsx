import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  random,
  useCurrentFrame,
} from "remotion";
import "../brand/fonts";
import { CloudBackground, CountUp } from "../brand/primitives";
import { color, font, gradient, radius, shadow } from "../brand/theme";

/**
 * Sincro Monitor, rebuilt in the Grow2on style. No narration: the story is
 * told by the tool itself (its own labels), the data and the motion.
 * Aggregate figures from the live panel on 10/11/2026. Store domains and the
 * ticket number are fictional, so no client appears on screen.
 */

// ---------- data ----------
const STATUS = [
  { key: "ok", label: "OK", kpi: "Sin problemas", n: 146, c: color.success },
  { key: "infra", label: "Error en servidor", kpi: "Error en servidor", n: 73, c: color.error },
  { key: "sync", label: "Error sincro", kpi: "Error sincro", n: 17, c: color.orange },
  { key: "warn", label: "Advertencia sincro", kpi: "Advertencia sincro", n: 12, c: color.warning },
  { key: "none", label: "Sin datos", kpi: "Sin datos", n: 67, c: color.gray300 },
] as const;
const TOTAL = 315;
const FOCUS_STATUS = 1; // the filter the cursor clicks: server errors
const TICKET = "#48213";
const STORE = "tienda-07.ejemplo.com.ar";

// ---------- world layout ----------
const CW = 1640;
const CH = 920;
const DONUT = { cx: 300, cy: 668, r: 160, w: 30 };
const CHIP = { x: 40, y: 112, h: 52, gap: 14, w: [96, 220, 170, 220] };
const chipX = (i: number) => CHIP.x + CHIP.w.slice(0, i).reduce((a, b) => a + b + CHIP.gap, 0);
const TABLE = { x: 590, y: 380, w: 1010, h: 500, head: 56, row: 54 };
const ROWS = [
  { st: 0, d: "tienda-01.ejemplo.com.ar", s: "sincro.php", t: "22:40", dur: "26.5 s" },
  { st: 1, d: STORE, s: "sincro.php", t: "22:45", dur: "2 m 0 s" },
  { st: 0, d: "tienda-12.ejemplo.com.ar", s: "sincro-pedidos.php", t: "22:48", dur: "15.9 s" },
  { st: 2, d: "tienda-23.ejemplo.com.ar", s: "sincro.php", t: "22:50", dur: "55.2 s" },
  { st: 1, d: "tienda-31.ejemplo.com.ar", s: "sincro-pedidos.php", t: "22:52", dur: "0.4 s" },
  { st: 0, d: "tienda-34.ejemplo.com.ar", s: "sincro.php", t: "22:55", dur: "4.8 s" },
  { st: 3, d: "tienda-40.ejemplo.com.ar", s: "sincro.php", t: "23:00", dur: "7.9 s" },
  { st: 0, d: "tienda-44.ejemplo.com.ar", s: "sincro-pedidos.php", t: "23:00", dur: "6.5 s" },
  { st: 1, d: "tienda-52.ejemplo.com.ar", s: "sincro.php", t: "23:05", dur: "1.1 s" },
  { st: 0, d: "tienda-58.ejemplo.com.ar", s: "sincro.php", t: "23:10", dur: "5.2 s" },
  { st: 1, d: "tienda-63.ejemplo.com.ar", s: "sincro.php", t: "23:11", dur: "0.9 s" },
  { st: 0, d: "tienda-70.ejemplo.com.ar", s: "sincro-pedidos.php", t: "23:15", dur: "2.5 s" },
];
const DETAIL_H = 360;
const LOG = "Timeout: la tienda no respondió en 120 s";
const STEPS = [
  "Obteniendo clientes",
  "Sincronizando clientes",
  "Obteniendo estados de pedido",
  "Sincronizando estados de pedido",
  "Sincronizando productos",
];

// Help desk window, to the right of the dashboard in the same world.
// Structure copied from the real ticket desk ("No asignados" view, 11/11/2026):
// top bar with search, dark icon rail, page title + team, one tab with a
// counter, "Total de tickets", and one card per ticket. Every ticket, company
// and team below is fictional.
const MESA = { x: 1800, y: 70, w: 1320, h: 780, top: 64, rail: 64, pad: 40, head: 272, row: 90, card: 78 };
type Sla = { v: string; tone: "ok" | "warn" | "bad"; done?: boolean };
const MESA_ROWS: {
  id: string; a: string; e: string; date: string; sla: [Sla, Sla]; pr: string; inc?: boolean; off?: boolean;
}[] = [
  { id: "# 48209", a: "Consulta de facturación", e: "Tienda 14", date: "10/11/26", sla: [{ v: "2%", tone: "ok" }, { v: "1%", tone: "ok" }], pr: "Media" },
  { id: "# 48204", a: "Artículo sin stock", e: "Tienda 22", date: "10/11/26", sla: [{ v: "3%", tone: "ok" }, { v: "1%", tone: "ok" }], pr: "Media", inc: true },
  { id: "# 48198", a: "Stock de combo", e: "Tienda 31", date: "09/11/26", sla: [{ v: "12%", tone: "ok" }, { v: "6%", tone: "ok" }], pr: "Media", inc: true },
  { id: "# 48190", a: "Publicaciones pausadas", e: "Tienda 45", date: "05/11/26", sla: [{ v: "0%", tone: "ok", done: true }, { v: "51%", tone: "warn" }], pr: "Media", off: true },
];
const MESA_NEW = {
  id: "# 48213", a: "Error en servidor", e: "Tienda 07", date: "10/11/26",
  sla: [{ v: "0%", tone: "ok" }, { v: "0%", tone: "ok" }] as [Sla, Sla], pr: "Alta", inc: true,
};

// Teams chat window, to the right of the help desk. Structure copied from the
// real "Sincro Monitor · novedades" card the monitor posts to the team chat
// (screenshot from the user, 11/11/2026). Stores and figures are fictional.
const TEAMS = { x: 3220, y: -40, w: 940, h: 1000 };
const TEAMS_CX = TEAMS.x + TEAMS.w / 2;
const TT = { win: 716, signal: [700, 760] as const, typing: 762, card: 792, rows: 806, inc: 876, fix: 936, hi: [960, 980, 1000] };
const NOVEDADES: { l: string; n?: number; v: string }[] = [
  { l: "Sitios afectados", n: 3, v: "" },
  { l: "Incidentes abiertos", n: 6, v: " (1 nuevo, 1 recurrente)" },
  { l: "Prioridad alta", n: 1, v: "" },
  { l: "Arreglos por aprobar", n: 3, v: "" },
  { l: "Resueltos desde el último aviso", n: 0, v: "" },
  { l: "Más antiguo", v: "tienda-12.ejemplo.com.ar · Errores en el log · 15 h" },
];
const FIXES = [
  "Reenviar al ERP los 3 pedidos sin nota de pedido",
  "Relanzar la sincro de pedidos de la tienda",
  "Reintentar la sincro con un timeout de 300 s",
];

// ---------- timing (frames, 30 fps) ----------
const T = {
  filterClick: 218,
  rowClick: 300,
  ticketClick: 440,
  ticketDone: 466,
  fly: [480, 556] as const,
  land: 556,
};

// ---------- helpers ----------
const OUT = Easing.bezier(0.16, 1, 0.3, 1);
const IN_OUT = Easing.bezier(0.65, 0, 0.35, 1);
const k = (
  f: number,
  input: number[],
  output: number[],
  easing: (t: number) => number = IN_OUT,
) =>
  interpolate(f, input, output, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });
const hex = (a: number) => Math.round(Math.max(0, Math.min(1, a)) * 255).toString(16).padStart(2, "0");

/** Camera: which world point sits at screen centre, how close, how tilted. */
const camera = (f: number) => {
  const t = [0, 112, 160, 190, 225, 270, 305, 410, 470, 520, 590, 640, 700, 712, 752, 900, 1030, 1080];
  const s = [2.4, 2.4, 1, 1, 1.12, 1.12, 1.5, 1.5, 1.5, 0.56, 0.56, 1.0, 1.0, 1.0, 0.98, 1.0, 1.02, 0.42];
  const fx = [300, 300, 820, 820, 760, 760, 1060, 1060, 1060, 1560, 1560, 2460, 2460, 2460, TEAMS_CX, TEAMS_CX, TEAMS_CX, 2090];
  const fy = [668, 668, 460, 460, 400, 400, 610, 610, 610, 470, 470, 400, 400, 400, 460, 460, 470, 450];
  const tt = [0, 112, 136, 168, 470, 520, 590, 640, 700, 712, 752, 800, 1030, 1080, 1140];
  return {
    s: k(f, t, s),
    fx: k(f, t, fx),
    fy: k(f, t, fy),
    rx: k(f, tt, [0, 0, 12, 0, 0, 8, 6, 0, 0, 0, 5, 0, 0, 4, 3]),
    ry: k(f, tt, [0, 0, -10, 0, 0, -6, -5, 0, 0, 0, -5, 0, 0, -3, -2]),
  };
};

const label: React.CSSProperties = {
  fontSize: 15,
  fontWeight: font.medium,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  color: color.gray600,
};

const typed = (text: string, f: number, start: number, cps = 1.4) =>
  text.slice(0, Math.max(0, Math.floor((f - start) * cps)));

// ---------- dashboard pieces ----------
const Header: React.FC<{ f: number }> = ({ f }) => {
  const pulse = (Math.sin(f / 6) + 1) / 2;
  return (
    <div
      style={{
        position: "absolute",
        left: 40,
        right: 40,
        top: 26,
        height: 60,
        display: "flex",
        alignItems: "center",
        gap: 16,
        opacity: k(f, [128, 150], [0, 1]),
      }}
    >
      <div style={{ width: 46, height: 46, borderRadius: 14, background: gradient.brand }} />
      <div>
        <div style={{ fontSize: 30, fontWeight: font.semibold, color: color.black, lineHeight: 1.1 }}>
          Sincro Monitor
        </div>
        <div style={{ fontSize: 17, color: color.gray600 }}>Monitoreo de sincronizaciones</div>
      </div>
      <div style={{ flex: 1 }} />
      <div
        style={{
          width: 12,
          height: 12,
          borderRadius: 6,
          background: color.success,
          boxShadow: `0 0 0 ${3 + pulse * 7}px ${color.success}${hex((1 - pulse) * 0.35)}`,
        }}
      />
      <div style={{ fontSize: 18, color: color.gray600, marginRight: 12 }}>Auto 60s</div>
      <div
        style={{
          height: 44,
          padding: "0 20px",
          borderRadius: radius.pill,
          border: `1px solid ${color.gray200}`,
          display: "flex",
          alignItems: "center",
          fontSize: 18,
          fontWeight: font.medium,
          color: color.black,
        }}
      >
        Recargar vista
      </div>
    </div>
  );
};

const Chips: React.FC<{ f: number; filterOn: number }> = ({ f, filterOn }) => (
  <>
    {STATUS.slice(0, 4).map((st, i) => {
      const appear = k(f, [140 + i * 4, 160 + i * 4], [0, 1], OUT);
      const focus = i === FOCUS_STATUS;
      const active = focus ? filterOn : 0;
      const press = focus ? k(f, [T.filterClick - 2, T.filterClick + 2, T.filterClick + 10], [0, 0.07, 0]) : 0;
      return (
        <div
          key={st.key}
          style={{
            position: "absolute",
            left: chipX(i),
            top: CHIP.y,
            width: CHIP.w[i],
            height: CHIP.h,
            borderRadius: radius.pill,
            border: `2px solid ${active > 0.05 ? st.c : color.gray200}`,
            background: active > 0.05 ? `${st.c}${hex(active * 0.12)}` : color.white,
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "0 18px",
            fontSize: 18,
            fontWeight: font.medium,
            color: active > 0.5 ? st.c : color.black,
            opacity: appear * (focus ? 1 : 1 - filterOn * 0.5),
            translate: `0 ${(1 - appear) * 16}px`,
            scale: String(1 + active * 0.05 - press),
            whiteSpace: "nowrap",
          }}
        >
          <div style={{ width: 12, height: 12, borderRadius: 6, background: st.c, flexShrink: 0 }} />
          {st.label}
        </div>
      );
    })}
    <div
      style={{
        position: "absolute",
        left: chipX(4) + 20,
        top: CHIP.y + 14,
        fontSize: 18,
        color: color.gray600,
        opacity: k(f, [160, 175], [0, 1]),
      }}
    >
      Mostrando{" "}
      <b style={{ color: color.black }}>
        {Math.round(interpolate(filterOn, [0, 1], [TOTAL, STATUS[FOCUS_STATUS].n]))}
      </b>{" "}
      tiendas
    </div>
  </>
);

const Kpis: React.FC<{ f: number; filterOn: number }> = ({ f, filterOn }) => {
  const cards = [
    { n: TOTAL, c: null as string | null, idx: -1, l: "Tiendas" },
    ...STATUS.slice(0, 4).map((s, i) => ({ n: s.n, c: s.c as string, idx: i, l: s.kpi })),
  ];
  const w = (CW - 80 - 4 * 20) / 5;
  return (
    <>
      {cards.map((card, i) => {
        const appear = k(f, [138 + i * 5, 165 + i * 5], [0, 1], OUT);
        const focus = card.idx === FOCUS_STATUS || card.idx === -1;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 40 + i * (w + 20),
              top: 190,
              width: w,
              height: 160,
              borderRadius: radius.lg,
              background: color.white,
              border: `1px solid ${color.gray200}`,
              boxShadow: shadow.cardSoft,
              overflow: "hidden",
              opacity: appear * (focus ? 1 : 1 - filterOn * 0.55),
              translate: `0 ${(1 - appear) * 30}px`,
              scale: String(card.idx === FOCUS_STATUS ? 1 + filterOn * 0.04 : 1),
              padding: "26px 28px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                height: 6,
                width: `${appear * 100}%`,
                background: card.c ?? gradient.brand,
              }}
            />
            <div style={label}>{card.l}</div>
            <div
              style={{
                fontSize: 68,
                fontWeight: font.stat,
                lineHeight: 1,
                color: card.c ?? color.black,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              <CountUp to={card.n} delay={145 + i * 5} duration={34} />
            </div>
          </div>
        );
      })}
    </>
  );
};

const DonutPanel: React.FC<{ f: number; filterOn: number; shell: number }> = ({ f, filterOn, shell }) => {
  const C = 2 * Math.PI * DONUT.r;
  const reveal = k(f, [100, 124], [0, 1], OUT);
  const strokeW = k(f, [100, 128], [6, DONUT.w], OUT);
  const focused = filterOn > 0.5;
  let acc = 0;
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: 40,
          top: TABLE.y,
          width: 520,
          height: TABLE.h,
          borderRadius: radius.lg,
          border: `1px solid ${color.gray200}`,
          opacity: shell,
          padding: "22px 26px",
        }}
      >
        <div style={label}>Estado por cliente</div>
      </div>
      <svg width={CW} height={CH} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        <g transform={`rotate(-90 ${DONUT.cx} ${DONUT.cy})`} opacity={reveal}>
          {STATUS.map((st, i) => {
            const len = (st.n / TOTAL) * C;
            const off = acc;
            acc += len;
            const isFocus = i === FOCUS_STATUS;
            const pop = isFocus ? filterOn * 14 : 0;
            const mid = ((off + len / 2) / C) * Math.PI * 2;
            return (
              <circle
                key={st.key}
                cx={DONUT.cx + Math.cos(mid) * pop}
                cy={DONUT.cy + Math.sin(mid) * pop}
                r={DONUT.r}
                fill="none"
                stroke={st.c}
                strokeWidth={strokeW + (isFocus ? filterOn * 10 : 0)}
                strokeDasharray={`${Math.max(len - 3, 0)} ${C}`}
                strokeDashoffset={-off}
                opacity={isFocus ? 1 : 1 - filterOn * 0.75}
              />
            );
          })}
        </g>
        <g opacity={k(f, [130, 150], [0, 1])} fontFamily={font.family} textAnchor="middle">
          <text
            x={DONUT.cx}
            y={DONUT.cy + 14}
            fontWeight={font.stat}
            fontSize={68}
            fill={focused ? color.error : color.black}
          >
            {focused ? STATUS[FOCUS_STATUS].n : TOTAL}
          </text>
          <text x={DONUT.cx} y={DONUT.cy + 46} fontSize={20} fill={color.gray600}>
            {focused ? "error en servidor" : "tiendas"}
          </text>
        </g>
      </svg>
    </>
  );
};

const Check: React.FC<{ ok: boolean; p: number }> = ({ ok, p }) => (
  <div
    style={{
      width: 26,
      height: 26,
      borderRadius: 13,
      flexShrink: 0,
      background: ok ? color.success : color.error,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      scale: String(p),
      opacity: p > 0 ? 1 : 0,
    }}
  >
    <svg width={14} height={14} viewBox="0 0 16 16">
      {ok ? (
        <path d="M3 8.5l3 3 7-7" stroke="#fff" strokeWidth={2.6} fill="none" strokeLinecap="round" />
      ) : (
        <path d="M4 4l8 8M12 4l-8 8" stroke="#fff" strokeWidth={2.6} strokeLinecap="round" />
      )}
    </svg>
  </div>
);

const Spinner: React.FC<{ f: number }> = ({ f }) => (
  <svg width={20} height={20} viewBox="0 0 20 20" style={{ rotate: `${f * 18}deg` }}>
    <circle cx={10} cy={10} r={8} stroke="#ffffff55" strokeWidth={3} fill="none" />
    <path d="M10 2a8 8 0 0 1 8 8" stroke="#fff" strokeWidth={3} fill="none" strokeLinecap="round" />
  </svg>
);

const TicketButton: React.FC<{ f: number }> = ({ f }) => {
  const btnIn = k(f, [395, 412], [0, 1], OUT);
  const press = k(f, [T.ticketClick - 3, T.ticketClick + 1, T.ticketClick + 8], [0, 1, 0]);
  const creating = f >= T.ticketClick + 2 && f < T.ticketDone;
  const done = k(f, [T.ticketDone, T.ticketDone + 14], [0, 1], OUT);
  return (
    <div
      style={{
        alignSelf: "flex-end",
        height: 50,
        width: 220,
        borderRadius: radius.pill,
        background: done > 0 ? color.white : gradient.brand,
        border: done > 0 ? `2px solid ${color.success}` : "none",
        opacity: btnIn,
        scale: String(btnIn * (1 - press * 0.07)),
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        fontSize: 19,
        fontWeight: font.semibold,
        color: done > 0 ? color.success : color.white,
        boxShadow: `0 0 0 ${press * 16}px ${color.pink}22`,
        whiteSpace: "nowrap",
      }}
    >
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

const Detail: React.FC<{ f: number }> = ({ f }) => {
  const open = k(f, [T.rowClick + 5, T.rowClick + 35], [0, 1], OUT);
  return (
    <div style={{ height: open * DETAIL_H, overflow: "hidden" }}>
      <div
        style={{
          margin: "8px 20px 16px",
          height: DETAIL_H - 24,
          borderRadius: radius.panel,
          background: color.gray50,
          border: `1px solid ${color.gray200}`,
          display: "flex",
          gap: 28,
          padding: 22,
        }}
      >
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ ...label, color: color.error }}>Error del log</div>
          <div
            style={{
              flex: 1,
              borderRadius: radius.md,
              background: color.black,
              padding: "18px 20px",
              fontFamily: "ui-monospace, Menlo, monospace",
              fontSize: 18,
              lineHeight: 1.6,
              color: "#b8b6ba",
            }}
          >
            <div>{typed(`job ${"8f2a"} · ${STORE}`, f, 322, 2)}</div>
            <div style={{ color: "#ff5ca8" }}>
              {typed(LOG, f, 345, 1.6)}
              {f > 345 && f < 395 && Math.floor(f / 8) % 2 === 0 ? "▍" : ""}
            </div>
            <div>{typed("Reintento programado: próxima corrida", f, 375, 2)}</div>
          </div>
        </div>
        <div style={{ width: 360, display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={label}>Últimas etapas ejecutadas</div>
          {STEPS.map((s, i) => {
            const p = k(f, [340 + i * 9, 352 + i * 9], [0, 1], Easing.bezier(0.34, 1.56, 0.64, 1));
            const ok = i < STEPS.length - 1;
            const shake = !ok ? Math.sin(f * 1.4) * k(f, [380, 386, 396], [0, 4, 0]) : 0;
            return (
              <div
                key={s}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  translate: `${shake}px 0`,
                  fontSize: 18,
                  color: ok ? color.black : color.error,
                  fontWeight: ok ? font.regular : font.semibold,
                  opacity: p > 0 ? 1 : 0,
                }}
              >
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

const StatusPill: React.FC<{ st: number }> = ({ st }) => {
  const s = STATUS[st];
  return (
    <div
      style={{
        width: 200,
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
      }}
    >
      <div
        style={{
          height: 30,
          borderRadius: radius.pill,
          background: `${s.c}1f`,
          color: st === 3 ? "#a86b00" : s.c,
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "0 12px",
          fontSize: 15,
          fontWeight: font.semibold,
          whiteSpace: "nowrap",
        }}
      >
        <div style={{ width: 9, height: 9, borderRadius: 5, background: s.c }} />
        {s.label}
      </div>
    </div>
  );
};

const Table: React.FC<{ f: number; filterOn: number }> = ({ f, filterOn }) => {
  const appear = k(f, [150, 175], [0, 1], OUT);
  const target = ROWS.findIndex((r) => r.st === FOCUS_STATUS);
  const rowClick = k(f, [T.rowClick - 2, T.rowClick + 2, T.rowClick + 10], [0, 1, 0]);
  const cols = { st: 200, dom: 1, sc: 190, t: 110, dur: 100 };
  return (
    <div
      style={{
        position: "absolute",
        left: TABLE.x,
        top: TABLE.y,
        width: TABLE.w,
        height: TABLE.h,
        borderRadius: radius.lg,
        background: color.white,
        border: `1px solid ${color.gray200}`,
        boxShadow: shadow.cardSoft,
        overflow: "hidden",
        opacity: appear,
        translate: `${(1 - appear) * 40}px 0`,
      }}
    >
      <div
        style={{
          height: TABLE.head,
          display: "flex",
          alignItems: "center",
          padding: "0 26px",
          borderBottom: `1px solid ${color.gray100}`,
          ...label,
        }}
      >
        <div style={{ width: cols.st }}>Estado</div>
        <div style={{ flex: 1 }}>Dominio</div>
        <div style={{ width: cols.sc }}>Script</div>
        <div style={{ width: cols.t }}>Último run</div>
        <div style={{ width: cols.dur }}>Duración</div>
        <div style={{ width: 20 }} />
      </div>
      {ROWS.map((r, i) => {
        const keep = r.st === FOCUS_STATUS;
        const collapse = keep ? 0 : filterOn;
        const rowIn = k(f, [158 + i * 3, 176 + i * 3], [0, 1], OUT);
        const isTarget = i === target;
        const tint = isTarget ? rowClick * 0.12 + k(f, [T.rowClick, T.rowClick + 20], [0, 0.05]) : 0;
        return (
          <React.Fragment key={i}>
            <div
              style={{
                height: TABLE.row * (1 - collapse),
                opacity: rowIn * (1 - collapse),
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                padding: "0 26px",
                borderBottom: `1px solid ${color.gray100}`,
                translate: `${(1 - rowIn) * 30}px 0`,
                background: tint > 0 ? `${color.pink}${hex(tint)}` : "transparent",
                fontSize: 18,
                color: color.black,
                whiteSpace: "nowrap",
              }}
            >
              <StatusPill st={r.st} />
              <div style={{ flex: 1, fontWeight: font.medium }}>{r.d}</div>
              <div style={{ width: cols.sc, color: color.gray600 }}>{r.s}</div>
              <div style={{ width: cols.t, color: color.gray600 }}>{r.t}</div>
              <div style={{ width: cols.dur, color: color.gray600 }}>{r.dur}</div>
              <svg
                width={20}
                height={20}
                viewBox="0 0 16 16"
                style={{ rotate: isTarget ? `${k(f, [T.rowClick + 2, T.rowClick + 20], [0, 180])}deg` : "0deg" }}
              >
                <path d="M4 6l4 4 4-4" stroke={color.gray300} strokeWidth={2} fill="none" />
              </svg>
            </div>
            {isTarget && <Detail f={f} />}
          </React.Fragment>
        );
      })}
    </div>
  );
};

// Where things are, in world coordinates.
const firstRowY = TABLE.y + TABLE.head + TABLE.row / 2;
const BTN = { x: TABLE.x + TABLE.w - 20 - 22 - 110, y: TABLE.y + TABLE.head + TABLE.row + DETAIL_H - 16 - 22 - 25 };
const MESA_SLOT = { x: MESA.x + MESA.rail + MESA.pad, y: MESA.y + MESA.head };
const CARD_W = MESA.w - MESA.rail - MESA.pad * 2;

const Cursor: React.FC<{ f: number }> = ({ f }) => {
  const chip = { x: chipX(FOCUS_STATUS) + CHIP.w[FOCUS_STATUS] / 2, y: CHIP.y + CHIP.h / 2 };
  const row = { x: TABLE.x + 420, y: firstRowY };
  const t = [182, 214, 262, 296, 404, T.ticketClick - 4, 470, 500];
  const x = k(f, t, [1250, chip.x, chip.x, row.x, row.x, BTN.x, BTN.x, BTN.x + 300]);
  const y = k(f, t, [880, chip.y, chip.y, row.y, row.y, BTN.y, BTN.y, BTN.y + 200]);
  const visible = k(f, [182, 192, 474, 490], [0, 1, 1, 0], Easing.linear);
  const clicks = [T.filterClick, T.rowClick, T.ticketClick];
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: visible }}>
      {clicks.map((c) => {
        const p = k(f, [c, c + 18], [0, 1], OUT);
        return (
          <div
            key={c}
            style={{
              position: "absolute",
              left: -30,
              top: -30,
              width: 60,
              height: 60,
              borderRadius: 30,
              border: `3px solid ${color.pink}`,
              scale: String(0.3 + p * 1.2),
              opacity: p > 0 && p < 1 ? 1 - p : 0,
            }}
          />
        );
      })}
      <svg
        width={34}
        height={40}
        viewBox="0 0 24 28"
        style={{
          position: "absolute",
          left: -4,
          top: -3,
          filter: "drop-shadow(0 4px 6px rgba(0,0,0,.25))",
          scale: String(1 - clicks.reduce((a, c) => a + k(f, [c - 3, c, c + 6], [0, 0.15, 0]), 0)),
        }}
      >
        <path d="M2 2l18 11-8 2-4 8z" fill={color.black} stroke="#fff" strokeWidth={1.6} strokeLinejoin="round" />
      </svg>
    </div>
  );
};

// ---------- help desk ----------
const Icon: React.FC<{ d: string; c?: string; size?: number; w?: number }> = ({ d, c = color.gray600, size = 22, w = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
    <path d={d} fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const ICON = {
  search: "M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM20 20l-4-4",
  plus: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 8v8M8 12h8",
  alert: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7.5v5.5M12 16.2v.3",
  bell: "M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15zM10 20.5h4",
  chart: "M4 4v16h16M7 15l4-4 3 3 5-6",
  tag: "M3 12V4h8l10 10-8 8zM7.5 8.2v.1",
  swap: "M4 8h14l-3-3M20 16H6l3 3",
  team: "M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM2.5 20a6.5 6.5 0 0 1 13 0M16 4.3a3.5 3.5 0 0 1 0 6.4M18 14a6.5 6.5 0 0 1 3.5 6",
  userAdd: "M10 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM3 21a7 7 0 0 1 12.5-4.3M19 14v6M16 17h6",
  company: "M6 21V8l6-4 6 4v13M4 21h16M10 21v-5h4v5",
  calendar: "M4 6h16v14H4zM4 10h16M8 3v4M16 3v4",
  chevron: "M7 10l5 5 5-5",
  dots: "M12 5v.1M12 12v.1M12 19v.1",
} as const;

/** Red warning triangle for incidents, green gear for queries (as in the real desk). */
const TypeIcon: React.FC<{ inc?: boolean }> = ({ inc }) =>
  inc ? (
    <svg width={24} height={24} viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
      <circle cx={12} cy={12} r={11} fill={color.error} />
      <path d="M12 6.5l5 9h-10z" fill="none" stroke="#fff" strokeWidth={1.8} strokeLinejoin="round" />
      <path d="M12 10.2v2.6M12 14.4v.1" stroke="#fff" strokeWidth={1.6} strokeLinecap="round" />
    </svg>
  ) : (
    <Icon d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zM12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21M5.6 5.6l1.8 1.8M16.6 16.6l1.8 1.8M5.6 18.4l1.8-1.8M16.6 7.4l1.8-1.8" c={color.success} size={22} />
  );

const SlaPill: React.FC<{ s: Sla }> = ({ s }) => {
  const c = s.tone === "ok" ? color.success : s.tone === "warn" ? color.warning : color.error;
  return (
    <div
      style={{
        height: 30,
        padding: "0 10px",
        borderRadius: radius.pill,
        background: `${c}1c`,
        color: c,
        fontSize: 15,
        fontWeight: font.medium,
        display: "flex",
        alignItems: "center",
        gap: 5,
      }}
    >
      {s.v}
      {s.done && (
        <svg width={15} height={15} viewBox="0 0 16 16">
          <circle cx={8} cy={8} r={8} fill={color.success} />
          <path d="M4.5 8.2l2.3 2.2 4.6-4.6" stroke="#fff" strokeWidth={1.8} fill="none" />
        </svg>
      )}
    </div>
  );
};

const Divider = () => <div style={{ width: 1, alignSelf: "stretch", margin: "16px 0", background: color.gray100 }} />;

const TicketCard: React.FC<{ r: typeof MESA_ROWS[number]; highlight?: number; isNew?: boolean }> = ({ r, highlight = 0, isNew }) => (
  <div
    style={{
      height: MESA.card,
      width: CARD_W,
      display: "flex",
      alignItems: "center",
      gap: 14,
      padding: "0 16px 0 20px",
      borderRadius: radius.panel,
      background: isNew ? `${color.pink}${hex(0.03 + highlight * 0.08)}` : color.white,
      border: `1px solid ${isNew ? color.pink + "55" : color.gray200}`,
      boxShadow: isNew ? `inset 5px 0 0 ${color.pink}, ${shadow.md}` : shadow.sm,
      fontSize: 17,
      color: color.black,
      whiteSpace: "nowrap",
    }}
  >
    <div style={{ width: 70, color: color.gray600 }}>{r.id}</div>
    <Divider />
    <TypeIcon inc={r.inc} />
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontWeight: isNew ? font.semibold : font.medium, textDecoration: "underline", textUnderlineOffset: 3, overflow: "hidden", textOverflow: "ellipsis" }}>
        {r.a}
      </div>
      <div style={{ fontSize: 13, color: color.gray600, marginTop: 3 }}>Soporte sincro</div>
    </div>
    <Divider />
    <div style={{ width: 150, display: "flex", alignItems: "center", gap: 10 }}>
      <Icon d={ICON.company} size={20} />
      <div>
        <div style={{ textDecoration: "underline", textUnderlineOffset: 3 }}>{r.e}</div>
        <div style={{ fontSize: 13, color: color.gray600, marginTop: 3, textDecoration: "underline" }}>Nivel 03</div>
      </div>
    </div>
    <Divider />
    <div style={{ width: 108, display: "flex", alignItems: "center", gap: 8, color: color.black }}>
      <Icon d={ICON.calendar} size={18} />
      {r.date}
    </div>
    <Divider />
    <div style={{ width: 128, display: "flex", gap: 8 }}>
      <SlaPill s={r.sla[0]} />
      <SlaPill s={r.sla[1]} />
    </div>
    <Divider />
    <div
      style={{
        height: 40,
        padding: "0 18px",
        borderRadius: radius.md,
        border: `1.5px solid ${color.black}`,
        display: "flex",
        alignItems: "center",
        fontSize: 16,
        fontWeight: font.medium,
      }}
    >
      Asignar ticket
    </div>
    <div
      style={{
        width: 86,
        height: 40,
        borderRadius: radius.md,
        border: r.off ? "none" : `1.5px solid ${isNew ? color.error : color.black}`,
        background: r.off ? color.gray100 : "transparent",
        color: r.off ? color.gray300 : isNew ? color.error : color.black,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
        fontSize: 16,
        fontWeight: font.medium,
      }}
    >
      {r.pr}
      <Icon d={ICON.chevron} size={14} c={r.off ? color.gray300 : isNew ? color.error : color.black} w={2.2} />
    </div>
  </div>
);

const Badge: React.FC<{ n: number; c?: string }> = ({ n, c = color.pink }) => (
  <span
    style={{
      minWidth: 24,
      height: 24,
      padding: "0 7px",
      borderRadius: 12,
      background: c,
      color: color.white,
      fontSize: 14,
      fontWeight: font.semibold,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    {n}
  </span>
);

const Mesa: React.FC<{ f: number }> = ({ f }) => {
  const appear = k(f, [478, 520], [0, 1], OUT);
  const insert = k(f, [T.land - 4, T.land + 16], [0, 1], OUT);
  const glow = k(f, [T.land, T.land + 10, T.land + 70], [0, 1, 0.35]);
  const landed = f >= T.land;
  const n = landed ? 5 : 4;
  const bump = k(f, [T.land, T.land + 6, T.land + 16], [1, 1.35, 1]);
  const railIcons = [ICON.chart, ICON.tag, ICON.swap, ICON.team, ICON.userAdd];
  return (
    <div
      style={{
        position: "absolute",
        left: MESA.x,
        top: MESA.y,
        width: MESA.w,
        height: MESA.h,
        borderRadius: 28,
        background: color.gray50,
        border: `1px solid ${color.gray200}`,
        boxShadow: "0 40px 90px -30px rgba(26,26,28,.35)",
        overflow: "hidden",
        opacity: appear,
        translate: `${(1 - appear) * 160}px 0`,
      }}
    >
      {/* top bar */}
      <div
        style={{
          height: MESA.top,
          background: color.white,
          borderBottom: `1px solid ${color.gray100}`,
          display: "flex",
          alignItems: "center",
          gap: 22,
          padding: "0 30px 0 22px",
        }}
      >
        <div style={{ width: 28, height: 28, borderRadius: 8, background: gradient.brand }} />
        <div style={{ fontSize: 20, fontWeight: font.semibold, color: color.black }}>Mesa de ayuda</div>
        <div style={{ flex: 1 }} />
        <div
          style={{
            width: 330,
            height: 38,
            borderRadius: radius.md,
            background: color.gray50,
            border: `1px solid ${color.gray100}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 14px",
            fontSize: 15,
            color: color.gray300,
          }}
        >
          Buscar por ticket o empresa
          <Icon d={ICON.search} size={18} />
        </div>
        <Icon d={ICON.plus} c={color.pink} />
        <Icon d={ICON.alert} />
        <Icon d={ICON.bell} />
      </div>
      {/* icon rail */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: MESA.top,
          bottom: 0,
          width: MESA.rail,
          background: color.black,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 14,
          paddingTop: 24,
        }}
      >
        {railIcons.map((d, i) => (
          <div
            key={d}
            style={{
              position: "relative",
              width: 44,
              height: 44,
              borderRadius: radius.md,
              background: i === 2 ? gradient.brand : "transparent",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon d={d} c={color.white} size={22} />
            {i === 2 && (
              <div style={{ position: "absolute", right: -6, top: -6, scale: String(bump) }}>
                <Badge n={n} c={color.error} />
              </div>
            )}
          </div>
        ))}
      </div>
      {/* page header */}
      <div style={{ position: "absolute", left: MESA.rail + MESA.pad, top: MESA.top + 26 }}>
        <div style={{ fontSize: 30, fontWeight: font.medium, color: color.black }}>No asignados</div>
        <div style={{ fontSize: 17, color: color.pink, marginTop: 6 }}>Agente responsable / Equipo Soporte Sincro</div>
      </div>
      {/* tab bar */}
      <div
        style={{
          position: "absolute",
          left: MESA.rail + MESA.pad,
          top: MESA.top + 118,
          width: CARD_W,
          height: 44,
          borderBottom: `1px solid ${color.gray200}`,
          display: "flex",
          alignItems: "flex-start",
        }}
      >
        <div
          style={{
            height: 44,
            display: "flex",
            alignItems: "flex-start",
            gap: 8,
            fontSize: 18,
            fontWeight: font.medium,
            color: color.pink,
            boxShadow: `inset 0 -3px 0 ${color.pink}`,
            paddingRight: 4,
          }}
        >
          No asignados
          <span style={{ scale: String(bump) }}>
            <Badge n={n} />
          </span>
        </div>
        <div style={{ flex: 1 }} />
        <Icon d={ICON.search} size={20} />
        <div style={{ width: 1, height: 22, background: color.gray200, margin: "0 14px" }} />
        <Icon d={ICON.dots} size={20} w={2.6} />
      </div>
      <div style={{ position: "absolute", left: MESA.rail + MESA.pad, top: MESA.top + 178, fontSize: 15, color: color.gray600 }}>
        Total de tickets: {n}
      </div>
      {/* ticket cards */}
      <div style={{ position: "absolute", left: MESA.rail + MESA.pad, top: MESA.head }}>
        <div style={{ height: insert * MESA.row, opacity: insert }}>
          <TicketCard r={MESA_NEW} highlight={glow} isNew />
        </div>
        {MESA_ROWS.map((r) => (
          <div key={r.id} style={{ height: MESA.row }}>
            <TicketCard r={r} />
          </div>
        ))}
      </div>
    </div>
  );
};

/** The ticket leaves the button and flies into the help desk, with a trail. */
const FlyingTicket: React.FC<{ f: number }> = ({ f }) => {
  const [a, b] = T.fly;
  if (f < a - 6 || f > b + 2) return null;
  const pos = (ff: number) => {
    const p = k(ff, [a, b], [0, 1], Easing.bezier(0.5, 0, 0.2, 1));
    const sx = BTN.x - 110;
    const sy = BTN.y - 25;
    const ex = MESA_SLOT.x;
    const ey = MESA_SLOT.y;
    return {
      x: interpolate(p, [0, 1], [sx, ex]),
      y: interpolate(p, [0, 1], [sy, ey]) - Math.sin(p * Math.PI) * 260,
      w: interpolate(p, [0, 1], [220, CARD_W]),
      r: Math.sin(p * Math.PI) * -6,
      lift: k(ff, [a - 6, a + 6], [0, 1], OUT),
    };
  };
  const trail = [12, 8, 4, 0];
  return (
    <>
      {trail.map((lag, i) => {
        const p = pos(f - lag);
        const main = lag === 0;
        return (
          <div
            key={lag}
            style={{
              position: "absolute",
              left: p.x,
              top: p.y,
              width: p.w,
              height: MESA.card,
              borderRadius: radius.panel,
              background: main ? color.white : color.pink,
              border: main ? `2px solid ${color.pink}` : "none",
              boxShadow: main ? `0 ${20 * p.lift}px 40px -10px rgba(231,0,126,.45)` : "none",
              opacity: main ? 1 : 0.08 + i * 0.05,
              rotate: `${p.r}deg`,
              scale: String(1 + p.lift * 0.06),
              display: "flex",
              alignItems: "center",
              gap: 16,
              padding: "0 22px",
              fontSize: 19,
              fontWeight: font.semibold,
              color: color.pink,
              whiteSpace: "nowrap",
              overflow: "hidden",
            }}
          >
            {main && (
              <>
                <svg width={24} height={24} viewBox="0 0 24 24">
                  <path d="M4 7h16v4a2 2 0 0 0 0 4v4H4v-4a2 2 0 0 0 0-4z" fill="none" stroke={color.pink} strokeWidth={2} />
                </svg>
                {TICKET}
                <span style={{ color: color.black }}>Error en servidor · {STORE}</span>
              </>
            )}
          </div>
        );
      })}
    </>
  );
};

/** 315 dots that light up by status and collapse into the donut ring. */
const DotField: React.FC<{ f: number; s: number }> = ({ f, s }) => {
  const cols = 21;
  const sp = 40;
  const ox = 960 - ((cols - 1) * sp) / 2;
  const oy = 540 - (14 * sp) / 2;
  const fade = k(f, [104, 122], [1, 0], Easing.linear);
  if (fade <= 0) return null;
  const statusOf: number[] = [];
  STATUS.forEach((st, si) => {
    for (let j = 0; j < st.n; j++) statusOf.push(si);
  });
  const slots = statusOf
    .map((st, ringIdx) => ({ st, ringIdx, r: random(`slot${ringIdx}`) }))
    .sort((a, b) => a.r - b.r);
  const R = DONUT.r * s;
  return (
    <AbsoluteFill style={{ opacity: fade }}>
      {slots.map((d, gi) => {
        const col = gi % cols;
        const row = Math.floor(gi / cols);
        const appear = k(f, [2 + (col + row) * 0.9, 14 + (col + row) * 0.9], [0, 1], OUT);
        const lit = k(f, [26 + (col + row) * 1.1, 34 + (col + row) * 1.1], [0, 1]);
        const a = -Math.PI / 2 + ((d.ringIdx + 0.5) / TOTAL) * Math.PI * 2;
        const m = k(f, [58 + d.ringIdx * 0.08, 96 + d.ringIdx * 0.08], [0, 1]);
        const x = interpolate(m, [0, 1], [ox + col * sp, 960 + Math.cos(a) * R]);
        const y = interpolate(m, [0, 1], [oy + row * sp, 540 + Math.sin(a) * R]);
        const size = interpolate(m, [0, 1], [16, 13]);
        return (
          <div
            key={gi}
            style={{
              position: "absolute",
              left: x - size / 2,
              top: y - size / 2,
              width: size,
              height: size,
              borderRadius: size / 2,
              background: lit > 0.5 ? STATUS[d.st].c : color.gray200,
              scale: String(appear * (1 + Math.sin(lit * Math.PI) * 0.6)),
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/** Diagonal light sweep across a panel. */
const Sweep: React.FC<{ f: number; from: number; w: number }> = ({ f, from, w }) => {
  const p = k(f, [from, from + 45], [-0.4, 1.4], Easing.linear);
  return (
    <div style={{ position: "absolute", inset: 0, borderRadius: 28, overflow: "hidden", pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          top: -300,
          bottom: -300,
          width: 260,
          left: p * w,
          rotate: "18deg",
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,.6), transparent)",
        }}
      />
    </div>
  );
};

// ---------- Teams notification ----------
const Dot: React.FC<{ c: string; size?: number }> = ({ c, size = 14 }) => (
  <span style={{ display: "inline-block", width: size, height: size, borderRadius: size, background: c, flexShrink: 0, boxShadow: `inset 0 0 0 1.5px ${color.white}66` }} />
);
const WRENCH = "M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.5-.5-.5-2.5z";

const Teams: React.FC<{ f: number }> = ({ f }) => {
  const appear = k(f, [TT.win, TT.win + 36], [0, 1], OUT);
  if (appear <= 0) return null;
  const typing = f >= TT.typing && f < TT.card;
  const card = k(f, [TT.card, TT.card + 18], [0, 1], OUT);
  const ping = k(f, [TT.card, TT.card + 24], [0, 1], OUT);
  const rowIn = (i: number) => k(f, [TT.rows + i * 9, TT.rows + i * 9 + 14], [0, 1], OUT);
  const incIn = (i: number) => k(f, [TT.inc + i * 14, TT.inc + i * 14 + 16], [0, 1], OUT);
  const fixIn = (i: number) => k(f, [TT.fix + i * 10, TT.fix + i * 10 + 16], [0, 1], OUT);
  const fixHi = (i: number) => k(f, [TT.hi[i], TT.hi[i] + 8, TT.hi[i] + 40], [0, 1, 0.25]);
  const pad = 28;
  return (
    <div
      style={{
        position: "absolute",
        left: TEAMS.x,
        top: TEAMS.y,
        width: TEAMS.w,
        height: TEAMS.h,
        borderRadius: 28,
        background: color.gray50,
        border: `1px solid ${color.gray200}`,
        boxShadow: "0 40px 90px -30px rgba(26,26,28,.35)",
        overflow: "hidden",
        opacity: appear,
        translate: `${(1 - appear) * 160}px 0`,
      }}
    >
      {/* channel header */}
      <div style={{ height: 76, background: color.white, borderBottom: `1px solid ${color.gray100}`, display: "flex", alignItems: "center", gap: 14, padding: `0 ${pad}px` }}>
        <div style={{ position: "relative", width: 40, height: 40, borderRadius: 20, background: color.black, color: color.white, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: font.semibold }}>
          S
          <div style={{ position: "absolute", inset: -4, borderRadius: 24, border: `3px solid ${color.pink}`, scale: String(1 + ping * 0.6), opacity: ping > 0 && ping < 1 ? 1 - ping : 0 }} />
        </div>
        <div style={{ fontSize: 22, fontWeight: font.semibold, color: color.black }}>Sincro Presta Monitor</div>
        {["Chat", "Compartida", "Notas"].map((tab, i) => (
          <div key={tab} style={{ fontSize: 17, height: 76, display: "flex", alignItems: "center", color: i === 0 ? color.black : color.gray600, fontWeight: i === 0 ? font.semibold : font.regular, boxShadow: i === 0 ? `inset 0 -3px 0 ${color.pink}` : "none", marginLeft: i === 0 ? 10 : 0 }}>
            {tab}
          </div>
        ))}
        <div style={{ flex: 1 }} />
        <div style={{ fontSize: 14, color: color.gray600, padding: "6px 12px", borderRadius: radius.pill, background: color.gray100 }}>Teams · chat del equipo</div>
      </div>
      {/* previous message, cut at the top */}
      <div style={{ margin: `0 ${pad + 46}px`, padding: "18px 24px", background: color.white, border: `1px solid ${color.gray200}`, borderTop: "none", borderRadius: "0 0 12px 12px", opacity: 0.55 }}>
        <div style={{ display: "inline-block", padding: "8px 16px", border: `1.5px solid ${color.gray300}`, borderRadius: radius.md, fontSize: 15, color: color.gray600 }}>Abrir Sincro Monitor</div>
      </div>
      {/* sender */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, margin: `22px ${pad}px 8px` }}>
        <div style={{ width: 34, height: 34, borderRadius: 10, background: gradient.brand }} />
        <div style={{ fontSize: 15, color: color.gray600 }}>
          Flujos de trabajo <span style={{ marginLeft: 8 }}>23:20</span>
        </div>
      </div>
      {typing && (
        <div style={{ marginLeft: pad + 46, display: "flex", gap: 6, padding: "14px 18px", background: color.white, borderRadius: radius.panel, width: 74, border: `1px solid ${color.gray200}` }}>
          {[0, 1, 2].map((i) => (
            <span key={i} style={{ width: 9, height: 9, borderRadius: 5, background: color.gray300, translate: `0 ${-Math.max(0, Math.sin((f - TT.typing) / 3 - i)) * 5}px` }} />
          ))}
        </div>
      )}
      {/* the card */}
      <div
        style={{
          margin: `0 ${pad}px 0 ${pad + 46}px`,
          padding: "22px 26px 24px",
          background: color.white,
          border: `1px solid ${color.gray200}`,
          borderRadius: radius.panel,
          boxShadow: `0 ${18 * card}px 40px -16px rgba(231,0,126,${0.3 * card})`,
          opacity: card,
          scale: String(0.96 + card * 0.04),
          translate: `0 ${(1 - card) * 24}px`,
          transformOrigin: "0 0",
          fontSize: 17,
          color: color.black,
          lineHeight: 1.35,
        }}
      >
        <div style={{ fontSize: 21, fontWeight: font.semibold }}>Sincro Monitor · novedades</div>
        <div style={{ fontSize: 15, color: color.gray600, marginBottom: 12 }}>10/11 23:20 (hora AR)</div>
        {NOVEDADES.map((r, i) => {
          const p = rowIn(i);
          return (
            <div key={r.l} style={{ display: "flex", padding: "5px 0", opacity: p, translate: `${(1 - p) * 20}px 0` }}>
              <div style={{ width: 300, fontWeight: font.medium }}>{r.l}</div>
              <div>
                {r.n !== undefined && <CountUp to={r.n} delay={TT.rows + i * 9} duration={16} />}
                {r.v}
              </div>
            </div>
          );
        })}
        <div style={{ height: 1, background: color.gray100, margin: "14px 0" }} />
        <div style={{ fontWeight: font.semibold, marginBottom: 8, opacity: incIn(0) }}>A. Incidentes abiertos</div>
        <div style={{ display: "flex", gap: 10, alignItems: "baseline", opacity: incIn(0), color: color.error }}>
          <Dot c={color.error} />
          <div>
            <b style={{ textDecoration: "underline", textUnderlineOffset: 3 }}>tienda-07.ejemplo.com.ar</b> · prioridad alta · 2 incidentes · desde hace 1 h
          </div>
        </div>
        {[
          { c: color.error, b: "Error en servidor", m: " (#41, nuevo, 1 h): la tienda no respondió en 120 s · ticket # 48213" },
          { c: color.orange, b: "Pedidos sin enviar al ERP", m: " (#36, persistente, 12 h): 3 sin nota de pedido · ", fix: "2 arreglos por aprobar" },
        ].map((it, i) => {
          const p = incIn(i + 1);
          return (
            <div key={it.b} style={{ display: "flex", gap: 10, alignItems: "baseline", margin: "8px 0 0 26px", opacity: p, translate: `${(1 - p) * 20}px 0` }}>
              <span style={{ color: color.gray300 }}>◦</span>
              <Dot c={it.c} size={12} />
              <div>
                <b>{it.b}</b>
                {it.m}
                {it.fix && (
                  <span style={{ whiteSpace: "nowrap" }}>
                    <span style={{ display: "inline-block", verticalAlign: -3, marginRight: 4 }}>
                      <Icon d={WRENCH} c={color.pink} size={17} />
                    </span>
                    {it.fix}
                  </span>
                )}
              </div>
            </div>
          );
        })}
        <div style={{ height: 1, background: color.gray100, margin: "16px 0 14px" }} />
        <div style={{ fontWeight: font.semibold, marginBottom: 8, opacity: fixIn(0) }}>B. Arreglos por aprobar</div>
        {FIXES.map((t, i) => {
          const p = fixIn(i);
          const h = fixHi(i);
          return (
            <div
              key={t}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "9px 12px",
                margin: "0 -12px",
                borderRadius: radius.md,
                background: `${color.pink}${hex(h * 0.1)}`,
                opacity: p,
                translate: `${(1 - p) * 20}px 0`,
              }}
            >
              <Icon d={WRENCH} c={color.pink} size={20} />
              <div style={{ flex: 1 }}>{t}</div>
              <span style={{ fontSize: 14, fontWeight: font.medium, color: color.pink, padding: "4px 12px", borderRadius: radius.pill, background: color.pinkLight, scale: String(1 + h * 0.08) }}>
                Por aprobar
              </span>
            </div>
          );
        })}
        <div style={{ marginTop: 18, display: "inline-block", padding: "10px 18px", border: `1.5px solid ${color.black}`, borderRadius: radius.md, fontSize: 16, fontWeight: font.medium, opacity: fixIn(2) }}>
          Abrir Sincro Monitor
        </div>
      </div>
    </div>
  );
};

/** A signal leaves the monitor header and lands in the team chat. */
const Signal: React.FC<{ f: number }> = ({ f }) => {
  const [a, b] = TT.signal;
  if (f < a || f > b + 4) return null;
  const pos = (ff: number) => {
    const p = k(ff, [a, b], [0, 1], Easing.bezier(0.5, 0, 0.2, 1));
    return {
      x: interpolate(p, [0, 1], [63, TEAMS.x + 45]),
      y: interpolate(p, [0, 1], [56, TEAMS.y + 160]) - Math.sin(p * Math.PI) * 420,
    };
  };
  return (
    <>
      {[10, 7, 4, 2, 0].map((lag, i) => {
        const p = pos(f - lag);
        const size = lag === 0 ? 26 : 18 - lag;
        return (
          <div
            key={lag}
            style={{
              position: "absolute",
              left: p.x - size / 2,
              top: p.y - size / 2,
              width: size,
              height: size,
              borderRadius: size,
              background: lag === 0 ? gradient.brand : color.pink,
              opacity: lag === 0 ? 1 : 0.12 + i * 0.08,
              boxShadow: lag === 0 ? `0 0 30px 8px ${color.pink}55` : "none",
            }}
          />
        );
      })}
    </>
  );
};

export const SincroMonitorDemo: React.FC = () => {
  const f = useCurrentFrame();
  const cam = camera(f);
  const filterOn = k(f, [T.filterClick + 4, T.filterClick + 32], [0, 1], OUT);
  const shell = k(f, [112, 150], [0, 1], OUT);
  return (
    <AbsoluteFill style={{ background: color.gray50, fontFamily: font.family, overflow: "hidden" }}>
      <CloudBackground opacity={0.22} />
      <AbsoluteFill style={{ perspective: 2400 }}>
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: CW,
            height: CH,
            transformOrigin: "0 0",
            transform: `translate(960px, 540px) rotateX(${cam.rx}deg) rotateY(${cam.ry}deg) scale(${cam.s}) translate(${-cam.fx}px, ${-cam.fy}px)`,
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 28,
              background: color.white,
              boxShadow: `0 40px 90px -30px rgba(26,26,28,${0.35 * shell})`,
              border: `1px solid ${color.gray200}`,
              opacity: shell,
            }}
          />
          <Header f={f} />
          <Chips f={f} filterOn={filterOn} />
          <Kpis f={f} filterOn={filterOn} />
          <DonutPanel f={f} filterOn={filterOn} shell={shell} />
          <Table f={f} filterOn={filterOn} />
          <Cursor f={f} />
          <Mesa f={f} />
          <FlyingTicket f={f} />
          <Teams f={f} />
          <Signal f={f} />
          <div style={{ position: "absolute", left: MESA.x, top: MESA.y, width: MESA.w, height: MESA.h }}>
            <Sweep f={f} from={T.land + 2} w={MESA.w} />
          </div>
          <div style={{ position: "absolute", inset: 0 }}>
            <Sweep f={f} from={1086} w={TEAMS.x + TEAMS.w} />
          </div>
        </div>
      </AbsoluteFill>
      <DotField f={f} s={cam.s} />
    </AbsoluteFill>
  );
};
