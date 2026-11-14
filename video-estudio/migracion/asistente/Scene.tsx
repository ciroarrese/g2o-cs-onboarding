// Asistente IA, migrada desde video/src/scenes/AsistenteIA.tsx (Remotion). Un ticket de la mesa de ayuda con el panel de IA al lado: el panel se
// levanta, dicta una respuesta por voz, la ordena con formato, busca errores de pedidos en CloudWatch y crea un ticket interno para Desarrollo que
// vuela al hilo de comentarios; la cámara atraviesa ese comentario. 840 cuadros a 30 fps. Cifras, empresa, personas y tickets, ficticios.
//
// La escena no decide estética: cámara (inclinación y desenfoque), garabatos, viñeta, titular, velo, superficies, radios, pesos de letra, entradas y
// el vuelo del ticket salen del design system y del kit. La mesa de ayuda va con la marca; el panel IA es oscuro y con su paleta, un design system anidado
// (./tema.ts) dentro de un `ThemeScope`. Distinto del original: el mundo no usa `preserve-3d` (el plano se inclina entero), la profundidad del panel
// y de la mesa es la `perspective()` propia de cada elemento, y el ticket que vuela deja la estela y el arco del kit en vez de la inclinación.
import React from "react";
import { random, useFormat, useFrame } from "video-estudio/engine";
import { Cursor, DoodleArrow, DoodleCircle, FlyingCard, Stage, Vignette, Wash, World, flight, hideFromScale, kf, textWidth, useCameraAt, zoomThrough } from "video-estudio/kit";
import { fade as op } from "video-estudio/fx/core";
import { TopicHeadline, useTopic } from "video-estudio/stories";
import { ThemeProvider, cornerRadius, dark, editorial, neon, neutral, papel, entrance, surfaceStyle, textStyle, useTheme } from "video-estudio/themes";
import { Easing } from "video-estudio/engine";
import { theme as brand } from "../theme";
import { C, COMMENT_Y, DURACION, EDITOR, KEYS, MAIN, NEW_TICKET, P, TILT_RX, TILT_RY, TILT_T, TOPIC } from "./datos";
import { Panel } from "./Panel";
import { ICON, Icon, TicketView } from "./Ticket";

export { DURACION };

const OUT = Easing.out;

/** Pastilla de voz que flota sobre el editor mientras se dicta. */
const Waveform: React.FC = () => {
  const f = useFrame();
  const t = useTheme();
  const a = kf(f, [C.dictar + 8, C.dictar + 20], [0, 1], OUT) * (1 - kf(f, [C.dictStop, C.dictStop + 10], [0, 1], Easing.linear));
  if (a <= 0) return null;
  return (
    <div
      style={{
        position: "absolute", left: MAIN.x + MAIN.w - 246, top: EDITOR.y + 4, width: 230, height: 30, boxSizing: "border-box", ...surfaceStyle(t, "chip", { on: true }),
        display: "flex", alignItems: "center", gap: 4, padding: "0 16px", opacity: op(a), zIndex: 30,
      }}
    >
      <Icon d={ICON.mic} c={t.color.accent} size={22} />
      {Array.from({ length: 20 }).map((_, i) => {
        const v = 0.25 + Math.abs(Math.sin(f / 3 + i * 0.9) * Math.sin(f / 7 + i * 0.4)) * 0.75 * (0.6 + random(`w${i}`) * 0.4);
        return <span key={i} style={{ width: 4, height: +(22 * v).toFixed(2), borderRadius: cornerRadius(t, "bar"), background: t.gradient.brand }} />;
      })}
    </div>
  );
};

/** El ticket interno que viaja de "Crear reporte" al hilo de comentarios: crece hasta el ancho del comentario donde aterriza. */
const FlyingTicket: React.FC = () => {
  const f = useFrame();
  const t = useTheme();
  const from = { x: P.x + 290 + 120, y: 690 + 35 };
  const to = { x: MAIN.x + MAIN.w / 2, y: COMMENT_Y + 35 };
  const { t: p } = flight(f, C.fly, from, to, {});
  // parte del ancho que necesita su contenido medido (el original partía de 240 px y lo dejaba cortado) y crece hasta el del comentario
  const need = Math.ceil(textWidth(t, `#${NEW_TICKET}`, { size: t.type.ui.sm, role: "title" }) + textWidth(t, "Ticket interno · Desarrollo", { size: t.type.ui.sm, role: "title" })) + 40 + 22 + 28 + 8;
  const w = Math.round(need + (MAIN.w - need) * p);
  return (
    <FlyingCard range={C.fly} from={from} to={to} arc={-300} width={MAIN.w} height={70} hideAfter>
      <div style={{ position: "absolute", left: Math.round((MAIN.w - w) / 2), top: 0, width: w, height: 70, boxSizing: "border-box", ...surfaceStyle(t, "card", { on: true, corner: "panel", level: "lg", glow: 0.6 }), display: "flex", alignItems: "center", gap: 14, padding: "0 20px", fontSize: t.type.ui.sm, lineHeight: 1.25, ...textStyle(t, "title"), color: t.color.accent, whiteSpace: "nowrap", overflow: "hidden" }}>
        <Icon d={ICON.tag} c={t.color.accent} />#{NEW_TICKET}
        <span style={{ color: t.color.text }}>Ticket interno · Desarrollo</span>
      </div>
    </FlyingCard>
  );
};

export function SceneBody() {
  const f = useFrame();
  const { width, height } = useFormat();
  const topic = useTopic({ name: TOPIC.name, line: TOPIC.line, index: 0 });
  const cam0 = useCameraAt(f, KEYS, {
    map: (fr, c) => zoomThrough(fr, C.through, c, { x: MAIN.x + 230, y: COMMENT_Y + 48 }, 40),
    noBlurFrom: C.through[0],
  });
  // la inclinación de base del original (por cuadro) se suma a la que el design system da por velocidad
  const cam = { ...cam0, rx: cam0.rx + kf(f, TILT_T, TILT_RX), ry: cam0.ry + kf(f, TILT_T, TILT_RY) };
  const zoomed = cam.scale > 1.05; // la cámara encuadra el panel o el editor y deja cortado el resto de la mesa
  const zoomIn = Math.max(0, Math.min(1, (cam.scale - 1.1) / 0.3));
  const recede = kf(f, [C.lift[0], C.lift[1]], [0, 1], Easing.inOut);
  return (
    <>
      <World camera={cam} width={width} height={height} perspective={2200}>
        <TicketView zoomed={zoomed} recede={recede} />
        <Waveform />
        <Panel />
        <FlyingTicket />
        <DoodleCircle start={C.formato + 6} end={C.formatoDone + 4} cx={P.x + 270} cy={P.y + 60 + 68} rx={282} ry={36} id="dc-formato" />
        <DoodleCircle start={C.cards + 26} end={C.cwClose - 4} cx={P.x + 150} cy={P.y + 274 + 158} rx={150} ry={26} id="dc-cards" />
        <DoodleArrow start={C.fly[1] + 2} end={C.through[0] + 10} x1={MAIN.x + 470} y1={COMMENT_Y + 50} x2={MAIN.x + 470} y2={300} bend={-0.35} id="da-link" />
        <Cursor
          show={[205, 790]}
          clicks={[C.dictar, C.dictStop, C.formato, C.cw, C.buscar, C.cwClose, C.reportar, C.crear]}
          keys={[
            [205, 1250, 700],
            [226, 1729, 346],
            [C.dictStop - 8, 1729, 346],
            [C.formato - 8, 1600, 300],
            [C.cw - 8, 1416, P.y + 254],
            [C.buscar - 8, 1600, P.y + 274 + 87],
            [C.cwClose - 8, 1416, P.y + 254],
            [C.reportar - 8, 1416, P.y + 294],
            [C.crear - 8, 1729, P.y + 274 + 40 + 233],
            [C.creado + 4, 1729, P.y + 274 + 40 + 233],
            [770, 1500, 900],
          ]}
        />
      </World>
      <Vignette amount={zoomIn * (1 - kf(f, [C.through[0], C.through[1]], [0, 1], Easing.linear))} />
      <TopicHeadline title={topic.name} number={topic.index + 1} subtitle={topic.line} start={-30} hide={hideFromScale(cam.scale, 1, 0.08)} />
      <Wash range={[C.through[1] - 14, C.through[1]]} />
    </>
  );
}

/** Design systems con nombre para probar la escena con otro: `--props '{"theme":"editorial"}'` (también "neon", "papel", "dark", "neutral"). */
const NOMBRADOS = { neutral, dark, editorial, neon, papel };

/** Escena sola (fuera de la historia): tema de marca y sus nubes (o el que se pida por nombre en `--props`). */
export const SceneVideo: React.FC<{ theme?: keyof typeof NOMBRADOS }> = ({ theme }) => (
  <ThemeProvider theme={theme ? NOMBRADOS[theme] : brand}>
    <Stage>
      <SceneBody />
    </Stage>
  </ThemeProvider>
);
