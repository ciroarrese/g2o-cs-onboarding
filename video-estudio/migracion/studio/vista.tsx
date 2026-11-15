// La vista previa del estudio: una caja de 16:9 (y después vertical y cuadrada) que muestra otra escena montada de verdad, a escala.
//  - Primera parte: la escena Health Score real, congelada en `HEALTH_FRAME` (es lo que se ve en el cuadro 0, a pantalla completa).
//  - Tercera parte: una pieza que SÍ sigue al design system (título, lista, gráfico y aviso) envuelta en `ThemeScope` con cada sistema
//    y con el formato forzado por un `FrameProvider` propio (`useFormat()` y `useVideoConfig()` de la pieza ven ese formato).
// Todo lo de adentro es función pura del cuadro: el contenido recibe su cuadro local, nunca guarda nada.
import React from "react";
import { FrameProvider, useFormat, useFrame, useVideoConfig } from "video-estudio/engine";
import type { FormatName } from "video-estudio/engine";
import { Eyebrow, Highlight, Numeral, Stage, ThemeScope, kf } from "video-estudio/kit";
import { BarsGrow, NotificationStack } from "video-estudio/fx";
import { fade as op } from "video-estudio/fx/core";
import { TopicContext } from "video-estudio/stories";
import { cornerRadius, editorial, entrance, neon, papel, staggerFrames, surfaceStyle, textStyle, useTheme } from "video-estudio/themes";
import type { Theme } from "video-estudio/themes";
import { SceneBody as Health } from "../health/Scene";
import { theme as marca } from "../theme";
import { spec } from "../historia/spec";
import { HEALTH_FRAME } from "./datos";

const NATIVE: Record<FormatName, [number, number]> = { horizontal: [1920, 1080], vertical: [1080, 1920], cuadrado: [1080, 1080] };
const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

type Layer = { key: string; kind: "health" | "demo"; theme: Theme; fmt: FormatName; origin: number; at: number };
/** Capas de la vista previa en orden: cada una entra con un fundido corto (`at`) sobre la anterior; `origin` es su cuadro 0. */
const LAYERS: Layer[] = [
  { key: "health", kind: "health", theme: marca, fmt: "horizontal", origin: 0, at: -100000 },
  { key: "marca", kind: "demo", theme: marca, fmt: "horizontal", origin: 450, at: 446 },
  { key: "editorial", kind: "demo", theme: editorial as unknown as Theme, fmt: "horizontal", origin: 510, at: 506 },
  { key: "neon", kind: "demo", theme: neon as unknown as Theme, fmt: "horizontal", origin: 570, at: 566 },
  { key: "papel", kind: "demo", theme: papel as unknown as Theme, fmt: "horizontal", origin: 630, at: 626 },
  { key: "papel-v", kind: "demo", theme: papel as unknown as Theme, fmt: "vertical", origin: 630, at: 690 },
  { key: "papel-c", kind: "demo", theme: papel as unknown as Theme, fmt: "cuadrado", origin: 630, at: 735 },
];
const FADE = 10;

/** Medidas de la caja de la vista previa en el cuadro `f`: 800x450 hasta la tercera parte, después crece y cambia de forma con el formato. */
export function previewRect(f: number) {
  const w = kf(f, [446, 466, 690, 702, 735, 747], [800, 1067, 1067, 338, 338, 600]);
  const h = kf(f, [446, 466], [450, 600]);
  const top = kf(f, [446, 466], [338, 330]);
  return { w: Math.round(w), h: Math.round(h), top: Math.round(top) };
}

// ---------- contenido de la tercera parte ----------
const LISTA = spec.topics;
const BARRAS = ["Norte", "Centro", "Sur"];
const AVISOS = [
  { title: "Sincronización lista", body: "Los datos están al día.", time: "ahora" },
  { title: "Tema nuevo", body: "Entró un proyecto al video.", time: "recién" },
];

/** Título, lista de temas, gráfico y aviso: todo sale del tema del ámbito (superficies, números, resaltado, entradas, gráficos). */
export const Demo: React.FC = () => {
  const t = useTheme();
  const f = useFrame();
  const { pick } = useFormat();
  const m = pick({ horizontal: 110, vertical: 80, cuadrado: 80 });
  const colW = pick({ horizontal: 780, vertical: 920, cuadrado: 440 });
  const p = (i: number) => kf(f, [staggerFrames(t, i, { base: 6 }), staggerFrames(t, i, { base: 6 }) + 22], [0, 1]);
  const title = (
    <div style={{ ...entrance(t, p(0), 0), opacity: op(p(0)) }}>
      <Eyebrow>Video de la semana</Eyebrow>
      <div style={{ fontSize: t.type.h1, lineHeight: 1.15, color: t.color.text, ...textStyle(t, "title") }}>
        Proyectos <Highlight frame={f}>con IA</Highlight>
      </div>
    </div>
  );
  const lista = (
    <div style={{ width: colW, display: "flex", flexDirection: "column", gap: 14 }}>
      {LISTA.map((tp, i) => (
        <div key={tp.id} style={{ minHeight: 84, boxSizing: "border-box", display: "flex", alignItems: "center", gap: 22, padding: "10px 26px", ...surfaceStyle(t, "card", { level: "sm" }), ...entrance(t, p(i + 1), i + 1), opacity: op(p(i + 1)) }}>
          <span style={{ fontSize: t.type.body, lineHeight: 1.2 }}><Numeral frame={f}>{`0${i + 1}`}</Numeral></span>
          <span style={{ fontSize: t.type.caption, lineHeight: 1.25, color: t.color.text, whiteSpace: "nowrap", ...textStyle(t, "label") }}>{tp.name}</span>
        </div>
      ))}
    </div>
  );
  const chartH = pick({ horizontal: 400, vertical: 440, cuadrado: 340 });
  const chart = (
    <div style={{ width: colW, boxSizing: "border-box", padding: 14, ...surfaceStyle(t, "card"), ...entrance(t, p(5), 5), opacity: op(p(5)) }}>
      <BarsGrow frame={f} start={26} duration={50} width={colW - 28} height={chartH - 28} data={[40, 64, 52]} labels={BARRAS} format={() => ""} />
    </div>
  );
  const avisos = <NotificationStack frame={f} start={44} duration={50} width={colW} height={pick({ horizontal: 260, vertical: 260, cuadrado: 250 })} items={AVISOS} />;
  const body = pick({
    horizontal: (
      <div style={{ position: "absolute", left: m, top: 110, display: "flex", gap: 80 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 44 }}>{title}{lista}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 40, paddingTop: 20 }}>{chart}{avisos}</div>
      </div>
    ),
    vertical: (
      <div style={{ position: "absolute", left: m, top: 150, display: "flex", flexDirection: "column", gap: 40 }}>{title}{lista}{chart}{avisos}</div>
    ),
    cuadrado: (
      <div style={{ position: "absolute", left: m, top: 70, display: "flex", gap: 60 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 34, width: colW }}>{title}{lista}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 34, paddingTop: 110 }}>{chart}{avisos}</div>
      </div>
    ),
  });
  return <>{body}</>;
};

// ---------- capas ----------
const LayerView: React.FC<{ layer: Layer; f: number; rect: { w: number; h: number }; opacity: number }> = ({ layer, f, rect, opacity }) => {
  const cfg = useVideoConfig();
  const [nw, nh] = NATIVE[layer.fmt];
  const s = Math.min(rect.w / nw, rect.h / nh);
  const left = Math.round((rect.w - nw * s) / 2);
  const top = Math.round((rect.h - nh * s) / 2);
  const local = layer.kind === "health" ? HEALTH_FRAME : f - layer.origin;
  return (
    <div style={{ position: "absolute", left, top, width: nw, height: nh, transformOrigin: "0 0", transform: `scale(${s.toFixed(5)})`, opacity: op(opacity) }}>
      <FrameProvider frame={local} config={{ ...cfg, width: nw, height: nh, format: layer.fmt }}>
        {/* cada capa fija su design system: la escena de Health Score y la pieza de ejemplo no cambian con el sistema del video */}
        <ThemeScope theme={layer.theme} paint style={{ position: "absolute", left: 0, top: 0, width: nw, height: nh, overflow: "hidden" }}>
          <Stage>
            {layer.kind === "health" ? (
              // la escena real de Health Score: el titular sale del tema, así que se le da el suyo (en la historia el contexto sería el de esta escena)
              <TopicContext.Provider value={{ index: 3, name: "Health Score", line: "a quién contactar primero" }}>
                <Health />
              </TopicContext.Provider>
            ) : (
              <Demo />
            )}
          </Stage>
        </ThemeScope>
      </FrameProvider>
    </div>
  );
};

/**
 * La caja de la vista previa (centrada en `cx`, arriba en `rect.top`). `pulse` (0 a 1) enciende el filo de acento; `bezel` (0 a 1) dibuja el marco del monitor.
 * El texto de adentro es la escena de otro video recreada a escala: es adorno (`data-qa-decor`) y queda fuera del estrés de tipografía (`data-qa-fixed-scale`).
 */
export const Preview: React.FC<{ f: number; cx: number; rect: { w: number; h: number; top: number }; bezel: number; radius: number; pulse: number }> = ({ f, cx, rect, bezel, radius, pulse }) => {
  const t = useTheme();
  let k = 0;
  LAYERS.forEach((l, i) => { if (l.at <= f) k = i; });
  const pk = k === 0 ? 1 : clamp01((f - LAYERS[k]!.at) / FADE);
  const shown = pk >= 1 ? [k] : [k - 1, k];
  const left = Math.round(cx - rect.w / 2);
  const pad = 10;
  return (
    <>
      <div style={{ position: "absolute", left: left - pad, top: rect.top - pad, width: rect.w + 2 * pad, height: rect.h + 2 * pad, boxSizing: "border-box", ...surfaceStyle(t, "panel"), opacity: op(bezel), boxShadow: pulse > 0 ? `0 0 0 ${Math.round(pulse * 7)}px ${t.color.accent}` : undefined }} />
      <div data-qa-decor data-qa-fixed-scale style={{ position: "absolute", left, top: rect.top, width: rect.w, height: rect.h, overflow: "hidden", borderRadius: radius, background: t.color.surfaceAlt, textRendering: "geometricPrecision" }}>
        {shown.map((i) => (
          <LayerView key={LAYERS[i]!.key} layer={LAYERS[i]!} f={f} rect={rect} opacity={i === k ? pk : 1} />
        ))}
      </div>
    </>
  );
};
export { cornerRadius };
