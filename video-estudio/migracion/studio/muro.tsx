// Cuarta parte: el muro de efectos del catálogo corriendo a la vez en baldosas chicas, el contador de efectos, los tres controles y la música al compás.
// Los efectos son los de `fx/` con su propio escalonado: cada uno arranca en `START(i)`, queda un momento en su imagen final y vuelve a empezar (en lazo, hasta el último cuadro de la escena).
// El lazo es un módulo sobre el cuadro (`lazo`): el efecto recibe un cuadro local que se reinicia, sin estado ni azar; cada baldosa tiene su propia pausa, así que no pulsan juntas.
import React from "react";
import { Sequence, random } from "video-estudio/engine";
import { Eyebrow, kf } from "video-estudio/kit";
import {
  BarsGrow, CardFlip, ChatThread, DigitRoll, DonutRing, Globe, MarkerDraw, MaskedRise, NotificationStack, OrbitRings, ParticleSphere, ScrambleDecode, TileGrid,
} from "video-estudio/fx";
import { fade as op } from "video-estudio/fx/core";
import { CheckMark } from "video-estudio/stories";
import { cornerRadius, entrance, staggerFrames, surfaceStyle, textStyle, useTheme, withAlpha } from "video-estudio/themes";
import { EFECTOS } from "./datos";
import { useLay } from "./layout";
import type { Lay } from "./layout";

const abs = (x: number, y: number, extra?: React.CSSProperties): React.CSSProperties => ({ position: "absolute", left: x, top: y, ...extra });

/** Cuadro en que aparece la baldosa i (la cámara llega al muro entre el 780 y el 850) y en que arranca su efecto: 14 cuadros ANTES de aparecer,
 *  así cada baldosa se ve con algo desde el primer cuadro visible (nunca un rectángulo vacío esperando su turno). */
export const APARECE = (t: ReturnType<typeof useTheme>, i: number) => 800 + staggerFrames(t, i, { base: 5 });
export const START = (t: ReturnType<typeof useTheme>, i: number) => APARECE(t, i) - 14;
export const CONTADOR = { start: 842, duration: 48 };
export const TICKS = [932, 966, 1000];
const CONTROLES = ["Mismo resultado en cada render", "Calidad", "Privacidad"];
const BEAT = (60 / 107) * 30; // cuadros por pulso

/** Cuadros de pausa (con la imagen final quieta) antes de que la baldosa i vuelva a empezar: 20, 26, 32 o 38 según la baldosa, para que cada una tenga su propio ritmo. */
const PAUSA = (i: number) => 20 + ((i * 5) % 4) * 6;
/** Cuadros de fundido de salida (al final de la pausa) y de entrada (al empezar la vuelta siguiente). */
const FUNDIDO = { out: 8, in: 6 };
/**
 * Lazo del efecto de la baldosa i: `lf` es el cuadro con que se dibuja (entre `s` y `s + dur + pausa`; se reinicia en cada vuelta) y `o` la opacidad
 * (la imagen final se funde antes de volver a empezar y la vuelta siguiente entra con un fundido corto; la primera vuelta no se funde: ya entra con la baldosa).
 * Función pura de `f`.
 */
export const lazo = (f: number, s: number, dur: number, i: number) => {
  const ciclo = dur + PAUSA(i);
  const r = Math.max(0, f - s);
  const vuelta = Math.floor(r / ciclo);
  const c = r - vuelta * ciclo;
  const o = kf(c, [ciclo - FUNDIDO.out, ciclo], [1, 0]) * (vuelta > 0 ? kf(c, [0, FUNDIDO.in], [0, 1]) : 1);
  return { lf: s + c, o, vuelta };
};

type Baldosa = { name: string; dur: number; render: (f: number, s: number, t: ReturnType<typeof useTheme>) => React.ReactNode };

/** Las 12 baldosas del muro para una caja de efecto de `W` x `H` (cambia con el formato: 330x156 en horizontal, más chica en cuadrado). */
const baldosasDe = (W: number, H: number): Baldosa[] => {
const centro: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: W, height: H, display: "flex", alignItems: "center", justifyContent: "center" };
// en una baldosa angosta (cuadrado) las letras y las figuras bajan un poco para que entren también con una tipografía más ancha
const a = W < 300 ? 0.8 : 1;
const cw = Math.min(190, W - 40), ch = Math.min(110, H - 14);
const cara: React.CSSProperties = { width: cw, height: ch, display: "flex", alignItems: "center", justifyContent: "center" };
return [
  { name: "MaskedRise", dur: 50, render: (f, s, t) => <div style={centro}><MaskedRise frame={f} start={s} duration={50} text="Título" fontSize={t.type.h2 * a} /></div> },
  { name: "Globe", dur: 60, render: (f, s) => <Globe frame={f} start={s} duration={60} width={W} height={H} bg="surface" /> },
  { name: "ParticleSphere", dur: 60, render: (f, s) => <ParticleSphere frame={f} start={s} duration={60} width={W} height={H} bg="surface" /> },
  { name: "CardFlip", dur: 60, render: (f, s, t) => (
    <CardFlip frame={f} start={s} duration={60} width={W} height={H} bg="surface" cardWidth={cw} cardHeight={ch}
      front={<div style={cara}><Eyebrow color={t.color.text}>Antes</Eyebrow></div>} back={<div style={cara}><Eyebrow color={t.color.text}>Después</Eyebrow></div>} />
  ) },
  { name: "BarsGrow", dur: 50, render: (f, s) => <BarsGrow frame={f} start={s} duration={50} width={W} height={H} data={[40, 64, 52]} labels={["A", "B", "C"]} format={() => ""} /> },
  { name: "OrbitRings", dur: 60, render: (f, s) => <OrbitRings frame={f} start={s} duration={60} width={W} height={H} bg="surface" /> },
  { name: "DonutRing", dur: 55, render: (f, s) => (
    // data-qa-ignore="clip": el número del anillo (fx/DonutRing) tiene un tamaño fijo y, con la tipografía ancha de reemplazo, la línea del dígito sobresale 7 % del svg en la baldosa chica del cuadrado; el contenedor es justo del tamaño del anillo
    <div style={centro}><div data-qa-ignore="clip" style={{ width: Math.min(H, W), height: H }}><DonutRing frame={f} start={s} duration={55} width={Math.min(H, W)} height={H} value={5} max={5} unit="" label="" /></div></div>
  ) },
  { name: "NotificationStack", dur: 50, render: (f, s) => {
    // en una caja angosta (cuadrado) el aviso se dibuja a 0,95 para que entren el título, la hora y el cuerpo sin cortarse
    const k = W < 300 ? 0.95 : 1;
    const aviso = <NotificationStack frame={f} start={s} duration={50} width={Math.round((W - 20) / k)} height={Math.round(H / k)} items={[{ title: "Hecho", body: "Control aprobado", time: "ya" }]} style={{ left: k === 1 ? 10 : 0 }} />;
    return k === 1 ? aviso : <div style={{ position: "absolute", left: 10, top: 0, width: Math.round((W - 20) / k), height: Math.round(H / k), transformOrigin: "0 0", transform: `scale(${k})` }}>{aviso}</div>;
  } },
  { name: "ChatThread", dur: 60, render: (f, s) => {
    // en una caja baja (cuadrado) la conversación se dibuja a 0,78 para que entren los dos mensajes
    const k = H < 140 ? 0.78 : 1;
    const chat = <ChatThread frame={f} start={s} duration={60} width={Math.round((W - 28) / k)} height={Math.round(H / k)} style={{ left: 14 }} messages={[{ from: "them", text: "¿Aprobás?" }, { from: "me", text: "Aprobado." }]} />;
    // data-qa-ignore="contrast": en los últimos cuadros el velo de salida deja el chat invisible, pero con la caja escalada el control lo mide aparte del velo (blanco sobre el velo claro, 1,07:1 solo con la tipografía ancha de reemplazo); el contenedor es justo del tamaño del chat
    return k === 1 ? chat : <div data-qa-ignore="contrast" style={{ position: "absolute", left: 0, top: 0, width: Math.round((W - 28) / k), height: Math.round(H / k), transformOrigin: "0 0", transform: `scale(${k})` }}>{chat}</div>;
  } },
  { name: "TileGrid", dur: 50, render: (f, s) => <div style={centro}><TileGrid frame={f} start={s} duration={50} width={W - 60} height={H - 24} cols={6} rows={3} lit={0.7} /></div> },
  { name: "MarkerDraw", dur: 40, render: (f, s) => <div style={centro}><MarkerDraw frame={f} start={s} duration={40} width={W - 30} height={Math.round(Math.min(110, H - 10) * a)} text="Clave" kind="circle" /></div> },
  { name: "ScrambleDecode", dur: 50, render: (f, s, t) => <div style={centro}><ScrambleDecode frame={f} start={s} duration={50} text="Listo" fontSize={t.type.h2 * a} /></div> },
];
};

const Baldosas: React.FC<{ f: number; lay: Lay }> = ({ f, lay }) => {
  const t = useTheme();
  const MURO = lay.mu;
  const BALDOSAS = React.useMemo(() => baldosasDe(MURO.tw, MURO.fx), [MURO.tw, MURO.fx]);
  return (
    <>
      {BALDOSAS.map((b, i) => {
        const col = i % MURO.cols, row = Math.floor(i / MURO.cols);
        const at = APARECE(t, i);
        const p = kf(f, [at, at + 22], [0, 1]);
        if (p <= 0) return null;
        const lz = lazo(f, START(t, i), b.dur, i);
        return (
          <div key={b.name} style={{ ...abs(MURO.x + col * (MURO.tw + MURO.gap), MURO.y + row * (MURO.th + MURO.gap)), width: MURO.tw, height: MURO.th, boxSizing: "border-box", overflow: "hidden", ...surfaceStyle(t, "card", { level: "sm", corner: "panel" }), ...entrance(t, p, i, { distance: 24 }), opacity: op(p) }}>
            <div key={op(lz.o) === undefined ? "pleno" : "fundido"} style={{ position: "relative", width: "100%", height: MURO.fx, overflow: "hidden", opacity: op(lz.o) }}>{f >= START(t, i) - 1 && <Sequence from={f - lz.lf}>{b.render(lz.lf, START(t, i), t)}</Sequence>}</div>
            <div style={{ height: MURO.th - MURO.fx, boxSizing: "border-box", display: "flex", alignItems: "center", padding: "0 18px", lineHeight: 1.25, whiteSpace: "nowrap" }}><Eyebrow color={t.color.text} size={t.type.eyebrow * 0.8}>{b.name}</Eyebrow></div>
          </div>
        );
      })}
    </>
  );
};

const Contador: React.FC<{ f: number; lay: Lay }> = ({ f, lay }) => {
  const t = useTheme();
  const { stat: S, ctl: C } = lay.mu;
  const p = kf(f, [832, 850], [0, 1]);
  const dfont = Math.min(t.type.stat, S.dfmax);
  const dh = dfont * 1.15;
  const rollo = (
    // el rollo de dígitos de DigitRoll deja pasar el dígito vecino por encima de la ventana mientras rueda (fx/): solo ese cuadro pisa el área segura de arriba
    <div data-qa-ignore="safe-area" style={{ position: "relative", width: S.dw, height: dh, flex: "none" }}>
      <DigitRoll frame={f} start={CONTADOR.start} duration={CONTADOR.duration} value={EFECTOS} from={0} fontSize={dfont} width={S.dw} height={dh} />
    </div>
  );
  const fila = S.mode === "row";
  const etiqueta = t.type[S.labelSize];
  return (
    <>
      <div style={{ ...abs(S.x, S.y), width: S.w, ...(fila ? { display: "flex", alignItems: "center", gap: 20 } : {}), ...entrance(t, p, 0, { distance: 20 }), opacity: op(p) }}>
        {rollo}
        <div style={{ fontSize: etiqueta, lineHeight: 1.25, minHeight: S.labelMinH, width: fila ? S.labelW : undefined, color: t.color.text, ...textStyle(t, "title") }}>efectos y animaciones</div>
      </div>
      <div style={{ ...abs(C.x, C.y), width: C.w, display: "flex", flexDirection: "column", gap: C.gap }}>
        {CONTROLES.map((c, i) => {
          const d = kf(f, [TICKS[i]!, TICKS[i]! + 14], [0, 1]);
          return (
            <div key={c} style={{ display: "flex", alignItems: "center", gap: 14, minHeight: C.rowH }}>
              <span style={{ position: "relative", width: 40, height: 40, flex: "none" }}>
                <span style={abs(0, 0, { width: 40, height: 40, boxSizing: "border-box", borderRadius: cornerRadius(t, "chip"), border: `2px solid ${t.color.border}`, background: t.color.surface })} />
                {d > 0 && <span style={abs(0, 0)}><CheckMark p={d} size={40} id={`ctl${i}`} /></span>}
              </span>
              <span style={{ fontSize: t.type[C.size], lineHeight: 1.25, color: t.color.text, ...textStyle(t, "label", { strong: d >= 1 }) }}>{c}</span>
            </div>
          );
        })}
      </div>
    </>
  );
};

/** Franja de onda con las marcas de pulso (107 por minuto = un pulso cada 16,82 cuadros; en la mezcla del video el pulso cae en el cuadro 800 de esta escena) y los marcadores de los sonidos de esta escena. */
const Musica: React.FC<{ f: number; lay: Lay }> = ({ f, lay }) => {
  const t = useTheme();
  const M = lay.mu.music;
  const p = kf(f, [878, 910], [0, 1]);
  const N = 142, bw = M.waveW / N;
  const t0 = 800, span = 250; // la franja muestra los últimos 250 cuadros de la escena
  const xOf = (fr: number) => ((fr - t0) / span) * M.waveW;
  const beats: number[] = [];
  for (let b = t0; b < t0 + span; b += BEAT) beats.push(b);
  const clics = [890, TICKS[0]! + 8, TICKS[1]! + 8, TICKS[2]! + 8]; // los sonidos de la escena (cues.json): golpe del 50 y tres tildes
  const head = xOf(f);
  const WH = M.waveH, pad = 12;
  return (
    <div style={{ ...abs(M.x, M.y), width: M.w, height: WH + 2 * pad + M.sy, opacity: op(p) }}>
      <div style={{ ...abs(0, M.labY), width: M.labW, fontSize: t.type[M.labSize], lineHeight: 1.25, whiteSpace: "nowrap", color: t.color.text, ...textStyle(t, "title") }}>Música al compás</div>
      <svg width={M.waveW} height={WH + 2 * pad} style={{ position: "absolute", left: M.sx, top: M.sy, overflow: "visible" }}>
        {beats.map((b, i) => <line key={`b${i}`} x1={xOf(b)} x2={xOf(b)} y1={pad} y2={WH + pad} stroke={t.color.accent} strokeOpacity={0.55} strokeWidth={5} />)}
        {Array.from({ length: N }, (_, i) => {
          const tt = t0 + (i / N) * span;
          const ph = (tt - t0) % BEAT;
          const env = Math.exp(-ph / 6);
          const h = Math.max(6, (0.18 + 0.5 * env + 0.3 * random(`wv${i}`)) * WH * kf(f, [878 + i * 0.2, 892 + i * 0.2], [0, 1]));
          const past = xOf(tt) <= head;
          return <rect key={i} x={i * bw + 1} y={pad + (WH - h) / 2} width={Math.max(2, bw - 3)} height={h} rx={cornerRadius(t, "bar") > 3 ? 3 : 0} fill={past ? t.color.accent : t.color.textMuted} opacity={past ? 1 : 0.55} />;
        })}
        {clics.map((c, i) => (
          <g key={`c${i}`}>
            <line x1={xOf(c)} x2={xOf(c)} y1={pad + 2} y2={WH + pad} stroke={t.color.accent2} strokeWidth={4} strokeDasharray="2 7" strokeLinecap="round" />
            <path d={`M${xOf(c)} -6 l14 14 l-14 14 l-14 -14 z`} fill={t.color.accent2} stroke={t.color.surface} strokeWidth={3} />
          </g>
        ))}
        <line x1={head} x2={head} y1={4} y2={WH + pad + 8} stroke={t.color.text} strokeWidth={3} />
      </svg>
    </div>
  );
};

export const Muro: React.FC<{ f: number }> = ({ f }) => {
  const lay = useLay();
  return (
    <div style={{ position: "absolute", left: lay.mu.wx, top: 0, width: lay.W, height: lay.H }}>
      <Baldosas f={f} lay={lay} />
      <Contador f={f} lay={lay} />
      <Musica f={f} lay={lay} />
    </div>
  );
};
export { withAlpha };
