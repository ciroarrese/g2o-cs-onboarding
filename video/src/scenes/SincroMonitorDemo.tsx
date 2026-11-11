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
 * Proof scene: the Sincro Monitor rebuilt with no copy. Labels are skeleton
 * bars, so only numbers, colour and motion carry the story. Aggregate figures
 * from the live panel on 10/11/2026; no store names anywhere.
 */

// ---------- data ----------
const STATUS = [
  { key: "ok", n: 146, c: color.success },
  { key: "infra", n: 73, c: color.error },
  { key: "sync", n: 17, c: color.orange },
  { key: "warn", n: 12, c: color.warning },
  { key: "none", n: 67, c: color.gray300 },
] as const;
const TOTAL = 315;
const FOCUS_STATUS = 1; // the filter the cursor clicks: server errors

// ---------- canvas layout (dashboard coordinates) ----------
const CW = 1640;
const CH = 920;
const DONUT = { cx: 300, cy: 650, r: 170, w: 30 };
const CHIP = { x: 40, y: 110, w: 150, h: 56, gap: 16 };
const TABLE = { x: 590, y: 380, w: 1010, h: 500, head: 64, row: 54 };
const ROW_STATUS = [0, 1, 0, 2, 1, 0, 3, 0, 1, 0, 4, 1, 0, 0];
const DETAIL_H = 350;

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

/** Camera: which dashboard point sits at screen centre, and how close. */
const camera = (f: number) => {
  const t = [0, 112, 160, 190, 225, 270, 305, 410, 455, 520];
  const s = [2.4, 2.4, 1, 1, 1.12, 1.12, 1.55, 1.55, 0.96, 0.96];
  const fx = [300, 300, 820, 820, 760, 760, 1060, 1060, 820, 820];
  const fy = [650, 650, 460, 460, 400, 400, 600, 600, 460, 460];
  return {
    s: k(f, t, s),
    fx: k(f, t, fx),
    fy: k(f, t, fy),
    rx: k(f, [0, 112, 136, 168, 410, 455, 520], [0, 0, 12, 0, 0, 8, 5]),
    ry: k(f, [0, 112, 136, 168, 410, 455, 520], [0, 0, -10, 0, 0, -6, -4]),
  };
};

const Bar: React.FC<{ w: number; h?: number; c?: string; o?: number }> = ({
  w,
  h = 12,
  c = color.gray200,
  o = 1,
}) => <div style={{ width: w, height: h, borderRadius: h, background: c, opacity: o }} />;

// ---------- pieces ----------
const Header: React.FC<{ f: number }> = ({ f }) => {
  const pulse = (Math.sin(f / 6) + 1) / 2;
  return (
    <div
      style={{
        position: "absolute",
        left: 40,
        right: 40,
        top: 28,
        height: 56,
        display: "flex",
        alignItems: "center",
        gap: 18,
        opacity: k(f, [128, 150], [0, 1]),
      }}
    >
      <div style={{ width: 48, height: 48, borderRadius: 14, background: gradient.brand }} />
      <Bar w={260} h={18} c={color.gray300} />
      <Bar w={140} h={12} />
      <div style={{ flex: 1 }} />
      <div
        style={{
          width: 14,
          height: 14,
          borderRadius: 7,
          background: color.success,
          boxShadow: `0 0 0 ${4 + pulse * 8}px ${color.success}${Math.round((1 - pulse) * 60)
            .toString(16)
            .padStart(2, "0")}`,
        }}
      />
      <Bar w={120} />
      <div
        style={{
          width: 170,
          height: 44,
          borderRadius: radius.pill,
          border: `1px solid ${color.gray200}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Bar w={100} />
      </div>
    </div>
  );
};

const Chips: React.FC<{ f: number; filterOn: number }> = ({ f, filterOn }) => (
  <>
    {STATUS.slice(0, 4).map((st, i) => {
      const appear = k(f, [140 + i * 4, 160 + i * 4], [0, 1], OUT);
      const active = i === FOCUS_STATUS ? filterOn : 0;
      const dim = i === FOCUS_STATUS ? 1 : 1 - filterOn * 0.55;
      return (
        <div
          key={st.key}
          style={{
            position: "absolute",
            left: CHIP.x + i * (CHIP.w + CHIP.gap),
            top: CHIP.y,
            width: CHIP.w,
            height: CHIP.h,
            borderRadius: radius.pill,
            border: `2px solid ${active > 0 ? st.c : color.gray200}`,
            background: active > 0 ? `${st.c}1f` : color.white,
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "0 18px",
            opacity: appear * dim,
            translate: `0 ${(1 - appear) * 16}px`,
            scale: String(1 + active * 0.06 - k(f, [218, 222, 228], [0, 0.08, 0]) * (i === FOCUS_STATUS ? 1 : 0)),
          }}
        >
          <div style={{ width: 16, height: 16, borderRadius: 8, background: st.c }} />
          <Bar w={70} c={active > 0 ? st.c : color.gray200} o={active > 0 ? 0.5 : 1} />
        </div>
      );
    })}
  </>
);

const Kpis: React.FC<{ f: number; filterOn: number }> = ({ f, filterOn }) => {
  const cards = [
    { n: TOTAL, c: null as string | null, idx: -1 },
    ...STATUS.slice(0, 4).map((s, i) => ({ n: s.n, c: s.c as string, idx: i })),
  ];
  const w = (CW - 80 - 4 * 20) / 5;
  return (
    <>
      {cards.map((card, i) => {
        const appear = k(f, [138 + i * 5, 165 + i * 5], [0, 1], OUT);
        const focus = card.idx === FOCUS_STATUS || card.idx === -1;
        const dim = focus ? 1 : 1 - filterOn * 0.6;
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
              opacity: appear * dim,
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
            <Bar w={110} />
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

/** SVG donut, drawn segment by segment. */
const Donut: React.FC<{ f: number; filterOn: number }> = ({ f, filterOn }) => {
  const C = 2 * Math.PI * DONUT.r;
  const reveal = k(f, [100, 124], [0, 1], OUT);
  const strokeW = k(f, [100, 128], [6, DONUT.w], OUT);
  let acc = 0;
  return (
    <svg
      width={CW}
      height={CH}
      style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}
    >
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
      <text
        x={DONUT.cx}
        y={DONUT.cy + 26}
        textAnchor="middle"
        fontFamily={font.family}
        fontWeight={font.stat}
        fontSize={72}
        fill={filterOn > 0.5 ? color.error : color.black}
        opacity={k(f, [130, 150], [0, 1])}
      >
        {filterOn > 0.5 ? STATUS[FOCUS_STATUS].n : TOTAL}
      </text>
    </svg>
  );
};

const Check: React.FC<{ ok: boolean; p: number }> = ({ ok, p }) => (
  <div
    style={{
      width: 30,
      height: 30,
      borderRadius: 15,
      background: ok ? color.success : color.error,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      scale: String(p),
      opacity: p > 0 ? 1 : 0,
    }}
  >
    <svg width={16} height={16} viewBox="0 0 16 16">
      {ok ? (
        <path d="M3 8.5l3 3 7-7" stroke="#fff" strokeWidth={2.6} fill="none" strokeLinecap="round" />
      ) : (
        <path d="M4 4l8 8M12 4l-8 8" stroke="#fff" strokeWidth={2.6} strokeLinecap="round" />
      )}
    </svg>
  </div>
);

const Detail: React.FC<{ f: number }> = ({ f }) => {
  const open = k(f, [305, 335], [0, 1], OUT);
  const lines = [520, 610, 380, 560, 300];
  const steps = 5;
  const btnIn = k(f, [395, 412], [0, 1], OUT);
  const press = k(f, [432, 436, 444], [0, 1, 0]);
  const done = k(f, [440, 458], [0, 1], OUT);
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
          gap: 32,
          padding: 24,
          position: "relative",
        }}
      >
        {/* log block, lines type in */}
        <div
          style={{
            flex: 1,
            borderRadius: radius.md,
            background: color.black,
            padding: 22,
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          {lines.map((w, i) => (
            <Bar
              key={i}
              w={w * k(f, [320 + i * 9, 334 + i * 9], [0, 1], Easing.linear) * 0.85}
              h={10}
              c={i === 1 ? color.error : "#5c5b5f"}
            />
          ))}
        </div>
        {/* pipeline steps */}
        <div style={{ width: 300, display: "flex", flexDirection: "column", gap: 14 }}>
          {Array.from({ length: steps }).map((_, i) => {
            const p = k(f, [340 + i * 9, 352 + i * 9], [0, 1], Easing.bezier(0.34, 1.56, 0.64, 1));
            const ok = i < steps - 1;
            const shake = !ok ? Math.sin(f * 1.4) * k(f, [380, 386, 396], [0, 4, 0]) : 0;
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, translate: `${shake}px 0` }}>
                <Check ok={ok} p={p} />
                <Bar w={[180, 150, 200, 130, 170][i]} c={ok ? color.gray200 : `${color.error}66`} o={p} />
              </div>
            );
          })}
          <div style={{ flex: 1 }} />
          {/* action button turns into a ticket */}
          <div
            style={{
              alignSelf: "flex-end",
              height: 52,
              width: interpolate(done, [0, 1], [210, 52]),
              borderRadius: radius.pill,
              background: done > 0.5 ? color.success : gradient.brand,
              opacity: btnIn,
              scale: String(btnIn * (1 - press * 0.08)),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: `0 0 0 ${press * 14}px ${color.pink}22`,
            }}
          >
            {done > 0.5 ? (
              <svg width={26} height={26} viewBox="0 0 16 16">
                <path
                  d="M3 8.5l3 3 7-7"
                  stroke="#fff"
                  strokeWidth={2.4}
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={16}
                  strokeDashoffset={16 * (1 - k(f, [446, 462], [0, 1]))}
                />
              </svg>
            ) : (
              <Bar w={110} c="#ffffff" o={0.85} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const Table: React.FC<{ f: number; filterOn: number }> = ({ f, filterOn }) => {
  const appear = k(f, [150, 175], [0, 1], OUT);
  const firstFocus = ROW_STATUS.indexOf(FOCUS_STATUS);
  const rowClick = k(f, [298, 302, 310], [0, 1, 0]);
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
          gap: 120,
          padding: "0 28px",
          borderBottom: `1px solid ${color.gray100}`,
        }}
      >
        {[60, 140, 90, 80, 70].map((w, i) => (
          <Bar key={i} w={w} h={10} c={color.gray300} />
        ))}
      </div>
      {ROW_STATUS.map((st, i) => {
        const keep = st === FOCUS_STATUS;
        const collapse = keep ? 0 : k(filterOn, [0, 1], [0, 1]);
        const rowIn = k(f, [158 + i * 3, 176 + i * 3], [0, 1], OUT);
        const isTarget = i === firstFocus;
        const sc = STATUS[st].c;
        return (
          <React.Fragment key={i}>
            <div
              style={{
                height: TABLE.row * (1 - collapse),
                opacity: rowIn * (1 - collapse),
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                gap: 26,
                padding: "0 28px",
                borderBottom: `1px solid ${color.gray100}`,
                translate: `${(1 - rowIn) * 30}px 0`,
                background: isTarget ? `${color.pink}${Math.round(rowClick * 30 + k(f, [300, 320], [0, 12]))
                  .toString(16)
                  .padStart(2, "0")}` : "transparent",
              }}
            >
              <div
                style={{
                  width: 104,
                  height: 28,
                  borderRadius: radius.pill,
                  background: `${sc}22`,
                  display: "flex",
                  alignItems: "center",
                  padding: "0 10px",
                  gap: 8,
                }}
              >
                <div style={{ width: 12, height: 12, borderRadius: 6, background: sc }} />
                <Bar w={50} h={8} c={sc} o={0.5} />
              </div>
              <Bar w={160 + random(`d${i}`) * 140} c={color.gray300} />
              <div style={{ flex: 1 }} />
              <Bar w={90} />
              <div style={{ width: 120 }}>
                <Bar w={30 + random(`t${i}`) * 90} h={8} c={st === 0 ? color.success : sc} o={0.6} />
              </div>
              <svg
                width={18}
                height={18}
                viewBox="0 0 16 16"
                style={{ rotate: isTarget ? `${k(f, [302, 320], [0, 180])}deg` : "0deg" }}
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

const Cursor: React.FC<{ f: number }> = ({ f }) => {
  const chip = {
    x: CHIP.x + FOCUS_STATUS * (CHIP.w + CHIP.gap) + CHIP.w / 2,
    y: CHIP.y + CHIP.h / 2,
  };
  const row = { x: TABLE.x + 380, y: TABLE.y + TABLE.head + TABLE.row / 2 };
  const btn = { x: TABLE.x + TABLE.w - 150, y: TABLE.y + TABLE.head + TABLE.row + DETAIL_H - 58 };
  const t = [182, 214, 262, 296, 400, 430, 470, 495];
  const x = k(f, t, [1250, chip.x, chip.x, row.x, row.x, btn.x, btn.x, 1700]);
  const y = k(f, t, [880, chip.y, chip.y, row.y, row.y, btn.y, btn.y, 980]);
  const visible = k(f, [182, 192, 480, 495], [0, 1, 1, 0], Easing.linear);
  const clicks = [218, 300, 434];
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: visible, pointerEvents: "none" }}>
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

/** 315 dots that light up by status and collapse into the donut ring. */
const DotField: React.FC<{ f: number; cam: ReturnType<typeof camera> }> = ({ f, cam }) => {
  const cols = 21;
  const sp = 40;
  const ox = 960 - ((cols - 1) * sp) / 2;
  const oy = 540 - (14 * sp) / 2;
  const fade = k(f, [104, 122], [1, 0], Easing.linear);
  if (fade <= 0) return null;
  // Status for each grid slot, shuffled; ring order is grouped by status.
  const statusOf: number[] = [];
  STATUS.forEach((s, si) => {
    for (let j = 0; j < s.n; j++) statusOf.push(si);
  });
  const slots = statusOf
    .map((st, ringIdx) => ({ st, ringIdx, r: random(`slot${ringIdx}`) }))
    .sort((a, b) => a.r - b.r);
  const R = DONUT.r * cam.s;
  return (
    <AbsoluteFill style={{ opacity: fade }}>
      {slots.map((d, gi) => {
        const col = gi % cols;
        const row = Math.floor(gi / cols);
        const gx = ox + col * sp;
        const gy = oy + row * sp;
        const appear = k(f, [2 + (col + row) * 0.9, 14 + (col + row) * 0.9], [0, 1], OUT);
        const lit = k(f, [26 + (col + row) * 1.1, 34 + (col + row) * 1.1], [0, 1]);
        const a = -Math.PI / 2 + ((d.ringIdx + 0.5) / TOTAL) * Math.PI * 2;
        const m = k(f, [58 + d.ringIdx * 0.08, 96 + d.ringIdx * 0.08], [0, 1]);
        const x = interpolate(m, [0, 1], [gx, 960 + Math.cos(a) * R]);
        const y = interpolate(m, [0, 1], [gy, 540 + Math.sin(a) * R]);
        const size = interpolate(m, [0, 1], [16, 13]);
        const st = STATUS[d.st];
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
              background: lit > 0.5 ? st.c : color.gray200,
              scale: String(appear * (1 + Math.sin(lit * Math.PI) * 0.6)),
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/** Diagonal light sweep across the finished dashboard. */
const Sweep: React.FC<{ f: number }> = ({ f }) => {
  const p = k(f, [470, 515], [-0.4, 1.4], Easing.linear);
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        borderRadius: 28,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -200,
          bottom: -200,
          width: 260,
          left: p * CW,
          rotate: "18deg",
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,.55), transparent)",
        }}
      />
    </div>
  );
};

export const SincroMonitorDemo: React.FC = () => {
  const f = useCurrentFrame();
  const cam = camera(f);
  const filterOn = k(f, [222, 250], [0, 1], OUT);
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
          {/* dashboard shell */}
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
          {/* donut panel */}
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
            }}
          />
          <Header f={f} />
          <Chips f={f} filterOn={filterOn} />
          <Kpis f={f} filterOn={filterOn} />
          <Donut f={f} filterOn={filterOn} />
          <Table f={f} filterOn={filterOn} />
          <Cursor f={f} />
          <Sweep f={f} />
        </div>
      </AbsoluteFill>
      <DotField f={f} cam={cam} />
    </AbsoluteFill>
  );
};
