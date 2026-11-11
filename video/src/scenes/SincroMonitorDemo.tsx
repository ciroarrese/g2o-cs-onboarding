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
const MESA = { x: 1800, y: 70, w: 1080, h: 780, head: 150, row: 72 };
const MESA_ROWS = [
  { id: "#48212", a: "Consulta sobre facturación", e: "Administración", st: "En curso" },
  { id: "#48209", a: "Alta de usuario en el panel", e: "Soporte", st: "En curso" },
  { id: "#48204", a: "Duda con costos de envío", e: "Soporte", st: "Esperando cliente" },
  { id: "#48198", a: "Cambio masivo de precios", e: "Onboarding", st: "En curso" },
  { id: "#48190", a: "Publicaciones pausadas en Mercado Libre", e: "Soporte", st: "Resuelto" },
  { id: "#48187", a: "Configuración de medios de pago", e: "Onboarding", st: "Resuelto" },
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
  const t = [0, 112, 160, 190, 225, 270, 305, 410, 470, 520, 590, 640, 700, 760];
  const s = [2.4, 2.4, 1, 1, 1.12, 1.12, 1.5, 1.5, 1.5, 0.6, 0.6, 1.08, 1.08, 0.6];
  const fx = [300, 300, 820, 820, 760, 760, 1060, 1060, 1060, 1470, 1470, 2340, 2340, 1470];
  const fy = [668, 668, 460, 460, 400, 400, 610, 610, 610, 470, 470, 400, 400, 470];
  const tt = [0, 112, 136, 168, 470, 520, 590, 640, 700, 760, 820];
  return {
    s: k(f, t, s),
    fx: k(f, t, fx),
    fy: k(f, t, fy),
    rx: k(f, tt, [0, 0, 12, 0, 0, 8, 6, 0, 0, 6, 4]),
    ry: k(f, tt, [0, 0, -10, 0, 0, -6, -5, 0, 0, -5, -3]),
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
const MESA_SLOT = { x: MESA.x + 40, y: MESA.y + MESA.head };

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
const NewTicketRow: React.FC<{ highlight: number }> = ({ highlight }) => (
  <div
    style={{
      height: MESA.row,
      display: "flex",
      alignItems: "center",
      gap: 20,
      padding: "0 40px",
      borderBottom: `1px solid ${color.gray100}`,
      background: `${color.pink}${hex(0.04 + highlight * 0.1)}`,
      boxShadow: `inset 5px 0 0 ${color.pink}`,
      fontSize: 19,
      whiteSpace: "nowrap",
    }}
  >
    <div style={{ width: 90, fontWeight: font.semibold, color: color.pink }}>{TICKET}</div>
    <div style={{ flex: 1, overflow: "hidden" }}>
      <div style={{ fontWeight: font.semibold, color: color.black }}>
        Error en servidor · {STORE}
      </div>
      <div style={{ fontSize: 15, color: color.gray600 }}>Creado desde Sincro Monitor · ticket interno</div>
    </div>
    <div style={{ width: 170, color: color.gray600 }}>Soporte sincro</div>
    <div style={{ width: 170 }}>
      <span
        style={{
          padding: "6px 14px",
          borderRadius: radius.pill,
          background: gradient.brand,
          color: color.white,
          fontSize: 15,
          fontWeight: font.semibold,
        }}
      >
        Nuevo
      </span>
    </div>
  </div>
);

const Mesa: React.FC<{ f: number }> = ({ f }) => {
  const appear = k(f, [478, 520], [0, 1], OUT);
  const insert = k(f, [T.land - 4, T.land + 16], [0, 1], OUT);
  const glow = k(f, [T.land, T.land + 10, T.land + 70], [0, 1, 0.35]);
  return (
    <div
      style={{
        position: "absolute",
        left: MESA.x,
        top: MESA.y,
        width: MESA.w,
        height: MESA.h,
        borderRadius: 28,
        background: color.white,
        border: `1px solid ${color.gray200}`,
        boxShadow: "0 40px 90px -30px rgba(26,26,28,.35)",
        overflow: "hidden",
        opacity: appear,
        translate: `${(1 - appear) * 160}px 0`,
      }}
    >
      <div style={{ padding: "30px 40px 0", display: "flex", alignItems: "center", gap: 16 }}>
        <div
          style={{
            width: 46,
            height: 46,
            borderRadius: 14,
            background: color.black,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width={24} height={24} viewBox="0 0 24 24">
            <path d="M4 7h16v4a2 2 0 0 0 0 4v4H4v-4a2 2 0 0 0 0-4z" fill="none" stroke="#fff" strokeWidth={2} />
          </svg>
        </div>
        <div style={{ fontSize: 30, fontWeight: font.semibold, color: color.black }}>Mesa de ayuda</div>
        <div style={{ flex: 1 }} />
        <div style={{ fontSize: 18, color: color.gray600 }}>
          Abiertos{" "}
          <b style={{ color: color.black }}>{f >= T.land ? 24 : 23}</b>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          gap: 20,
          padding: "0 40px",
          height: 56,
          marginTop: 22,
          alignItems: "center",
          borderBottom: `1px solid ${color.gray100}`,
          ...label,
        }}
      >
        <div style={{ width: 90 }}>N.º</div>
        <div style={{ flex: 1 }}>Asunto</div>
        <div style={{ width: 170 }}>Equipo</div>
        <div style={{ width: 170 }}>Estado</div>
      </div>
      <div style={{ height: insert * MESA.row, overflow: "hidden", opacity: insert }}>
        <NewTicketRow highlight={glow} />
      </div>
      {MESA_ROWS.map((r) => (
        <div
          key={r.id}
          style={{
            height: MESA.row,
            display: "flex",
            alignItems: "center",
            gap: 20,
            padding: "0 40px",
            borderBottom: `1px solid ${color.gray100}`,
            fontSize: 19,
            color: color.black,
            whiteSpace: "nowrap",
          }}
        >
          <div style={{ width: 90, color: color.gray600 }}>{r.id}</div>
          <div style={{ flex: 1 }}>{r.a}</div>
          <div style={{ width: 170, color: color.gray600 }}>{r.e}</div>
          <div style={{ width: 170, color: r.st === "Resuelto" ? color.success : color.gray600 }}>{r.st}</div>
        </div>
      ))}
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
      w: interpolate(p, [0, 1], [220, MESA.w - 80]),
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
              height: MESA.row - 8,
              borderRadius: radius.lg,
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
          <div style={{ position: "absolute", left: MESA.x, top: MESA.y, width: MESA.w, height: MESA.h }}>
            <Sweep f={f} from={T.land + 2} w={MESA.w} />
          </div>
          <div style={{ position: "absolute", inset: 0 }}>
            <Sweep f={f} from={770} w={CW + MESA.w} />
          </div>
        </div>
      </AbsoluteFill>
      <DotField f={f} s={cam.s} />
    </AbsoluteFill>
  );
};
