// Cuarta parte: el muro de efectos del catálogo corriendo a la vez en baldosas chicas, el contador de efectos, los tres controles y la música al compás.
// Los efectos son los de `fx/` con su propio escalonado: cada uno arranca en `START(i)` y queda en su imagen final (todos llevan `frame`, ninguno guarda nada).
import React from "react";
import { random } from "video-estudio/engine";
import { Eyebrow, kf } from "video-estudio/kit";
import {
  BarsGrow, CardFlip, ChatThread, DigitRoll, DonutRing, Globe, MarkerDraw, MaskedRise, NotificationStack, OrbitRings, ParticleSphere, ScrambleDecode, TileGrid,
} from "video-estudio/fx";
import { fade as op } from "video-estudio/fx/core";
import { CheckMark } from "video-estudio/stories";
import { cornerRadius, entrance, staggerFrames, surfaceStyle, textStyle, useTheme, withAlpha } from "video-estudio/themes";
import { EFECTOS, WALL_X } from "./datos";

const abs = (x: number, y: number, extra?: React.CSSProperties): React.CSSProperties => ({ position: "absolute", left: x, top: y, ...extra });

export const MURO = { cols: 4, tw: 330, th: 210, gap: 18, x: 60, y: 190, fx: 156 };
/** Cuadro en que aparece la baldosa i (la cámara llega al muro entre el 780 y el 850) y en que arranca su efecto: 14 cuadros ANTES de aparecer,
 *  así cada baldosa se ve con algo desde el primer cuadro visible (nunca un rectángulo vacío esperando su turno). */
export const APARECE = (t: ReturnType<typeof useTheme>, i: number) => 800 + staggerFrames(t, i, { base: 5 });
export const START = (t: ReturnType<typeof useTheme>, i: number) => APARECE(t, i) - 14;
export const CONTADOR = { start: 842, duration: 48 };
export const TICKS = [932, 966, 1000];
const CONTROLES = ["Mismo resultado en cada render", "Calidad", "Privacidad"];
const BEAT = (60 / 107) * 30; // cuadros por pulso
const MUSICA = { x: 440, y: 886, w: 1420, h: 120 };

type Baldosa = { name: string; render: (f: number, s: number, t: ReturnType<typeof useTheme>) => React.ReactNode };
const W = MURO.tw, H = MURO.fx;
const centro: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: W, height: H, display: "flex", alignItems: "center", justifyContent: "center" };

const cara: React.CSSProperties = { width: 190, height: 110, display: "flex", alignItems: "center", justifyContent: "center" };
const BALDOSAS: Baldosa[] = [
  { name: "MaskedRise", render: (f, s, t) => <div style={centro}><MaskedRise frame={f} start={s} text="Título" fontSize={t.type.h2} /></div> },
  { name: "Globe", render: (f, s) => <Globe frame={f} start={s} duration={60} width={W} height={H} bg="surface" /> },
  { name: "ParticleSphere", render: (f, s) => <ParticleSphere frame={f} start={s} duration={60} width={W} height={H} bg="surface" /> },
  { name: "CardFlip", render: (f, s, t) => (
    <CardFlip frame={f} start={s} duration={60} width={W} height={H} bg="surface" cardWidth={190} cardHeight={110}
      front={<div style={cara}><Eyebrow color={t.color.text}>Antes</Eyebrow></div>} back={<div style={cara}><Eyebrow color={t.color.text}>Después</Eyebrow></div>} />
  ) },
  { name: "BarsGrow", render: (f, s) => <BarsGrow frame={f} start={s} duration={50} width={W} height={H} data={[40, 64, 52]} labels={["A", "B", "C"]} format={() => ""} /> },
  { name: "OrbitRings", render: (f, s) => <OrbitRings frame={f} start={s} duration={60} width={W} height={H} bg="surface" /> },
  { name: "DonutRing", render: (f, s) => <div style={centro}><DonutRing frame={f} start={s} duration={55} width={H} height={H} value={5} max={5} unit="" label="" /></div> },
  { name: "NotificationStack", render: (f, s) => <NotificationStack frame={f} start={s} duration={50} width={W - 20} height={H} items={[{ title: "Hecho", body: "Control aprobado", time: "ya" }]} style={{ left: 10 }} /> },
  { name: "ChatThread", render: (f, s) => <ChatThread frame={f} start={s} duration={60} width={W - 28} height={H} style={{ left: 14 }} messages={[{ from: "them", text: "¿Aprobás?" }, { from: "me", text: "Aprobado." }]} /> },
  { name: "TileGrid", render: (f, s) => <div style={centro}><TileGrid frame={f} start={s} duration={50} width={W - 60} height={H - 24} cols={6} rows={3} lit={0.7} /></div> },
  { name: "MarkerDraw", render: (f, s) => <div style={centro}><MarkerDraw frame={f} start={s} duration={40} width={W - 30} height={110} text="Clave" kind="circle" /></div> },
  { name: "ScrambleDecode", render: (f, s, t) => <div style={centro}><ScrambleDecode frame={f} start={s} duration={50} text="Listo" fontSize={t.type.h2} /></div> },
];

const Baldosas: React.FC<{ f: number }> = ({ f }) => {
  const t = useTheme();
  return (
    <>
      {BALDOSAS.map((b, i) => {
        const col = i % MURO.cols, row = Math.floor(i / MURO.cols);
        const at = APARECE(t, i);
        const p = kf(f, [at, at + 22], [0, 1]);
        if (p <= 0) return null;
        return (
          <div key={b.name} style={{ ...abs(MURO.x + col * (MURO.tw + MURO.gap), MURO.y + row * (MURO.th + MURO.gap)), width: MURO.tw, height: MURO.th, boxSizing: "border-box", overflow: "hidden", ...surfaceStyle(t, "card", { level: "sm", corner: "panel" }), ...entrance(t, p, i, { distance: 24 }), opacity: op(p) }}>
            <div style={{ position: "relative", width: "100%", height: MURO.fx, overflow: "hidden" }}>{f >= START(t, i) - 1 && b.render(f, START(t, i), t)}</div>
            <div style={{ height: MURO.th - MURO.fx, boxSizing: "border-box", display: "flex", alignItems: "center", padding: "0 18px", lineHeight: 1.25, whiteSpace: "nowrap" }}><Eyebrow color={t.color.text} size={t.type.eyebrow * 0.8}>{b.name}</Eyebrow></div>
          </div>
        );
      })}
    </>
  );
};

const Contador: React.FC<{ f: number }> = ({ f }) => {
  const t = useTheme();
  const colX = MURO.x + 4 * (MURO.tw + MURO.gap) + 24;
  const colW = 1920 - colX - 84;
  const p = kf(f, [832, 850], [0, 1]);
  return (
    <>
      <div style={{ ...abs(colX, MURO.y + 40), width: colW, ...entrance(t, p, 0, { distance: 20 }), opacity: op(p) }}>
        {/* el rollo de dígitos de DigitRoll deja pasar el dígito vecino por encima de la ventana mientras rueda (fx/): solo ese cuadro pisa el área segura de arriba */}
        <div data-qa-ignore="safe-area" style={{ position: "relative", width: colW, height: Math.min(t.type.stat, colW * 0.5) * 1.15 }}>
          <DigitRoll frame={f} start={CONTADOR.start} duration={CONTADOR.duration} value={EFECTOS} from={0} fontSize={Math.min(t.type.stat, colW * 0.5)} width={colW} height={Math.min(t.type.stat, colW * 0.5) * 1.15} />
        </div>
        <div style={{ fontSize: t.type.caption, lineHeight: 1.25, minHeight: 80, color: t.color.text, ...textStyle(t, "title") }}>efectos y animaciones</div>
      </div>
      <div style={{ ...abs(colX, MURO.y + 380), width: colW, display: "flex", flexDirection: "column", gap: 14 }}>
        {CONTROLES.map((c, i) => {
          const d = kf(f, [TICKS[i]!, TICKS[i]! + 14], [0, 1]);
          return (
            <div key={c} style={{ display: "flex", alignItems: "center", gap: 14, minHeight: 72 }}>
              <span style={{ position: "relative", width: 40, height: 40, flex: "none" }}>
                <span style={abs(0, 0, { width: 40, height: 40, boxSizing: "border-box", borderRadius: cornerRadius(t, "chip"), border: `2px solid ${t.color.border}`, background: t.color.surface })} />
                {d > 0 && <span style={abs(0, 0)}><CheckMark p={d} size={40} id={`ctl${i}`} /></span>}
              </span>
              <span style={{ fontSize: t.type.eyebrow, lineHeight: 1.25, color: t.color.text, ...textStyle(t, "label", { strong: d >= 1 }) }}>{c}</span>
            </div>
          );
        })}
      </div>
    </>
  );
};

/** Franja de onda con las marcas de pulso (107 por minuto = un pulso cada 16,82 cuadros; en la mezcla del video el pulso cae en el cuadro 800 de esta escena) y los marcadores de los sonidos de esta escena. */
const Musica: React.FC<{ f: number }> = ({ f }) => {
  const t = useTheme();
  const p = kf(f, [878, 910], [0, 1]);
  const N = 142, bw = MUSICA.w / N;
  const t0 = 800, span = 250; // la franja muestra los últimos 250 cuadros de la escena
  const xOf = (fr: number) => ((fr - t0) / span) * MUSICA.w;
  const beats: number[] = [];
  for (let b = t0; b < t0 + span; b += BEAT) beats.push(b);
  const clics = [890, TICKS[0]! + 8, TICKS[1]! + 8, TICKS[2]! + 8]; // los sonidos de la escena (cues.json): golpe del 50 y tres tildes
  const head = xOf(f);
  return (
    <div style={{ ...abs(60, MUSICA.y - 12), width: 1800, height: MUSICA.h + 24, opacity: op(p) }}>
      <div style={{ ...abs(0, 36), width: 360, fontSize: t.type.caption, lineHeight: 1.25, color: t.color.text, ...textStyle(t, "title") }}>Música al compás</div>
      <svg width={MUSICA.w} height={MUSICA.h + 24} style={{ position: "absolute", left: 380, top: 0, overflow: "visible" }}>
        {beats.map((b, i) => <line key={`b${i}`} x1={xOf(b)} x2={xOf(b)} y1={12} y2={MUSICA.h + 12} stroke={t.color.accent} strokeOpacity={0.55} strokeWidth={5} />)}
        {Array.from({ length: N }, (_, i) => {
          const tt = t0 + (i / N) * span;
          const ph = (tt - t0) % BEAT;
          const env = Math.exp(-ph / 6);
          const h = Math.max(6, (0.18 + 0.5 * env + 0.3 * random(`wv${i}`)) * MUSICA.h * kf(f, [878 + i * 0.2, 892 + i * 0.2], [0, 1]));
          const past = xOf(tt) <= head;
          return <rect key={i} x={i * bw + 1} y={12 + (MUSICA.h - h) / 2} width={Math.max(2, bw - 3)} height={h} rx={cornerRadius(t, "bar") > 3 ? 3 : 0} fill={past ? t.color.accent : t.color.textMuted} opacity={past ? 1 : 0.55} />;
        })}
        {clics.map((c, i) => (
          <g key={`c${i}`}>
            <line x1={xOf(c)} x2={xOf(c)} y1={14} y2={MUSICA.h + 12} stroke={t.color.accent2} strokeWidth={4} strokeDasharray="2 7" strokeLinecap="round" />
            <path d={`M${xOf(c)} -6 l14 14 l-14 14 l-14 -14 z`} fill={t.color.accent2} stroke={t.color.surface} strokeWidth={3} />
          </g>
        ))}
        <line x1={head} x2={head} y1={4} y2={MUSICA.h + 20} stroke={t.color.text} strokeWidth={3} />
      </svg>
    </div>
  );
};

export const Muro: React.FC<{ f: number }> = ({ f }) => {
  return (
    <div style={{ position: "absolute", left: WALL_X, top: 0, width: 1920, height: 1080 }}>
      <Baldosas f={f} />
      <Contador f={f} />
      <Musica f={f} />
    </div>
  );
};
export { withAlpha };
