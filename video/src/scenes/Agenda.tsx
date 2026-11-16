import React from "react";
import { AbsoluteFill, Easing, useCurrentFrame } from "remotion";
import "../brand/fonts";
import { CloudBackground, GradientText } from "../brand/primitives";
import { color, font, gradient } from "../brand/theme";
import { OUT, k } from "../brand/motion";
import { DockedHeadline, PROJECTS } from "./Apertura";

/**
 * Agenda between projects: back to the list of the four headlines (same place
 * as in the opening), the project just shown gets its check, the brand
 * underline moves to the next one and the camera flies through it.
 * `done` = how many projects have been shown. With no next project, the list
 * stays complete and fades out to the closing. 120 frames at 30 fps.
 */

export const AGENDA_FRAMES = 120;

const T = { in: [0, 14] as const, check: [14, 34] as const, next: [40, 62] as const, fly: [66, 112] as const, dock: 104 };

const Check: React.FC<{ p: number }> = ({ p }) => (
  <svg width={46} height={46} viewBox="0 0 46 46" style={{ overflow: "visible" }}>
    <defs>
      <linearGradient id="agchk" x1="0" x2="1">
        <stop offset="0" stopColor={color.pink} />
        <stop offset="1" stopColor={color.orange} />
      </linearGradient>
    </defs>
    <circle cx={23} cy={23} r={21} fill="url(#agchk)" opacity={Math.min(1, p * 2)} transform={`scale(${0.6 + Math.min(1, p * 2) * 0.4})`} style={{ transformOrigin: "23px 23px" }} />
    <path d="M13 24l7 7 13-15" fill="none" stroke="#fff" strokeWidth={4.2} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={34} strokeDashoffset={34 * (1 - Math.max(0, p * 2 - 1))} />
  </svg>
);

export const Agenda: React.FC<{ done: number }> = ({ done }) => {
  const f = useCurrentFrame();
  const next = done < PROJECTS.length ? done : -1;
  const appear = k(f, [T.in[0], T.in[1]], [0, 1], OUT);
  const checkP = k(f, [T.check[0], T.check[1]], [0, 1], Easing.linear);
  const nextP = k(f, [T.next[0], T.next[1]], [0, 1], OUT);
  const fly = next >= 0 ? k(f, [T.fly[0], T.fly[1] - 10], [0, 1], Easing.bezier(0.7, 0, 0.84, 0)) : 0;
  const flash = next >= 0 ? k(f, [T.fly[1] - 26, T.fly[1] - 12], [0, 1], Easing.linear) * (1 - k(f, [T.fly[1] - 8, T.fly[1] + 4], [0, 1])) : 0;
  const end = next < 0 ? k(f, [AGENDA_FRAMES - 30, AGENDA_FRAMES], [0, 1]) : 0;
  return (
    <AbsoluteFill style={{ background: color.gray50, fontFamily: font.family, overflow: "hidden" }}>
      <CloudBackground opacity={0.22} />
      <div style={{ position: "absolute", left: 230, top: 250, opacity: appear * (1 - end) }}>
        {PROJECTS.map((p, i) => {
          const isDone = i < done;
          const justDone = i === done - 1;
          const isNext = i === next;
          const cp = justDone ? checkP : isDone ? 1 : 0;
          // rows already seen go quieter; the next one comes forward
          const quiet = isDone ? 0.45 + (1 - cp) * 0.55 : 1;
          const rowIn = k(f, [i * 3, i * 3 + 14], [0, 1], OUT);
          const others = next >= 0 && !isNext ? 1 - k(f, [T.fly[0] - 6, T.fly[0] + 12], [0, 1]) : 1;
          const scale = isNext ? Math.pow(60, fly) : 1;
          const pop = justDone ? k(f, [T.check[1] - 4, T.check[1] + 2, T.check[1] + 14], [0, 1, 0]) : 0;
          return (
            <div
              key={p.name}
              style={{
                height: 150,
                display: "flex",
                alignItems: "center",
                position: "relative",
                opacity: rowIn * others * (isNext ? 1 - k(f, [T.fly[1] - 16, T.fly[1] - 10], [0, 1]) : 1),
                translate: `${(1 - rowIn) * 60}px 0`,
                transformOrigin: "255px 50%",
                scale: String(scale * (1 + (isNext ? nextP * 0.04 : 0))),
              }}
            >
              <div style={{ display: "flex", alignItems: "baseline", gap: 26, whiteSpace: "nowrap", opacity: quiet }}>
                <span style={{ width: 58, fontSize: 30, fontWeight: font.stat, position: "relative" }}>
                  <span style={{ opacity: 1 - cp }}>
                    <GradientText>{String(i + 1).padStart(2, "0")}</GradientText>
                  </span>
                  {cp > 0 && (
                    <span style={{ position: "absolute", left: -6, top: -6, scale: String(1 + pop * 0.25) }}>
                      <Check p={cp} />
                    </span>
                  )}
                </span>
                <span style={{ fontSize: 76, fontWeight: font.semibold, color: color.black, letterSpacing: "-0.02em" }}>{p.name}</span>
                <span style={{ fontSize: 40, color: color.gray600 }}>· {p.line}</span>
              </div>
              {/* brand underline: on the next project only */}
              <div style={{ position: "absolute", left: 84, top: 118, height: 5, borderRadius: 3, width: isNext ? 340 * nextP : 0, background: gradient.brand, opacity: 1 - fly }} />
              {/* a ring pulse when the check lands */}
              {justDone && pop > 0 && <div style={{ position: "absolute", left: -18, top: 75 - 40, width: 80, height: 80, borderRadius: 40, border: `3px solid ${color.pink}`, scale: String(0.6 + (1 - pop) * 0.8), opacity: pop }} />}
            </div>
          );
        })}
      </div>
      <AbsoluteFill style={{ background: color.gray50, opacity: flash }} />
      {next >= 0 && <DockedHeadline i={next} f={f} start={T.dock} />}
    </AbsoluteFill>
  );
};
