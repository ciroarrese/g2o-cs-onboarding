// Video Studio (tema 05): el video que se está viendo también lo armó un agente con esta herramienta. 1050 cuadros a 30 fps.
// Primera parte: la escena arranca idéntica a Health Score a pantalla completa (la escena real, congelada en `HEALTH_FRAME`) y la cámara se aleja
// hasta mostrar que era la vista previa de un estudio. Segunda: tres tarjetas de contexto vuelan a la vista previa y el agente avanza por etapas.
// Tercera: la misma pieza cambia de design system y de formato en vivo. Cuarta: muro de efectos del catálogo, contador, controles y música al compás.
// La escena no decide estética: todo sale del design system del video (`theme.style`) por las ayudas del toolkit.
import React from "react";
import { Easing, useFormat, useFrame } from "video-estudio/engine";
import { Stage, Wash, World, hideFromScale, kf, useCameraAt } from "video-estudio/kit";
import type { CameraKey } from "video-estudio/kit";
import { TopicHeadline, useTopicOrNull } from "video-estudio/stories";
import { ThemeProvider, dark, editorial, neon, neutral, papel } from "video-estudio/themes";
import type { Theme } from "video-estudio/themes";
import { theme as brand } from "../theme";
import { DURACION, PREVIEW, T, WALL_X } from "./datos";
import { Muro } from "./muro";
import { Preview, previewRect } from "./vista";
import { Banda, Conversacion, Etapas, LineaDeTiempo, RielesTercera, Tarjetas, Ventana, pulso } from "./ventana";

export { DURACION };

const KEYS: CameraKey[] = [
  // arranca con la vista previa llenando el cuadro (1008x567 a escala 1,9) y se aleja hasta ver el estudio entero
  { f: 0, x: PREVIEW.cx, y: PREVIEW.top + PREVIEW.h / 2, scale: 1920 / PREVIEW.w },
  { f: T.pull[0], x: PREVIEW.cx, y: PREVIEW.top + PREVIEW.h / 2, scale: 1920 / PREVIEW.w },
  { f: T.pull[1], x: 960, y: 540, scale: 1 },
  { f: T.b4, x: 960, y: 540, scale: 1 },
  { f: T.travel[1], x: WALL_X + 960, y: 540, scale: 1 },
  { f: DURACION - 1, x: WALL_X + 960, y: 540, scale: 1 },
];

export function SceneBody() {
  const f = useFrame();
  const { width, height } = useFormat();
  // En la historia: llega de la escena anterior (Health Score cortada en su cuadro `HEALTH_FRAME`, sin velo de entrada: el cuadro 0 es el suyo)
  // y entrega al listado (cierra con el velo de siempre). Fuera de la historia (`handoff` indefinido) cierra igual.
  const topic = useTopicOrNull();
  const cierraConVelo = topic?.handoff !== "next-scene" && topic?.handoff !== "closing";
  // el viaje al muro se aleja a mitad de camino sin detenerse (una escala de 0,5 quieta dejaría la letra del estudio chica y quieta)
  // (la escala baja según el avance de la posición: la letra solo es chica cuando la cámara va rápido)
  const cam = useCameraAt(f, KEYS, { map: (fr, c) => ({ ...c, scale: c.scale * (1 - 0.5 * Math.sin(Math.PI * kf(fr, [T.travel[0], T.travel[1]], [0, 1], Easing.inOut))) }) });
  const rect = previewRect(f);
  const radius = Math.round(kf(f, [T.pull[0], T.pull[0] + 40], [0, 14]));
  const studio = f < T.travel[1] + 10;
  return (
    <>
      <World camera={cam} width={width} height={height}>
        {studio && (
          <>
            <Ventana f={f} />
            <LineaDeTiempo f={f} />
            <Preview f={f} cx={PREVIEW.cx} rect={rect} bezel={kf(f, [30, 70], [0, 1])} radius={radius} pulse={pulso(f)} />
            <Banda f={f} />
            {f >= 170 && f < 452 && (
              <>
                <Tarjetas f={f} />
                <Etapas f={f} />
                <Conversacion f={f} />
              </>
            )}
            <RielesTercera f={f} />
          </>
        )}
        {f >= T.travel[0] && <Muro f={f} />}
      </World>
      <TopicHeadline title="Video Studio" number={5} start={T.headline} hide={hideFromScale(cam.scale)} />
      {cierraConVelo && <Wash range={T.wash} />}
    </>
  );
}

/** Escena sola (fuera de la historia): tema de marca y sus nubes. */
const NOMBRADOS: Record<string, Theme> = { neutral, dark, editorial, neon, papel } as unknown as Record<string, Theme>;

/** `--props '{"theme":"editorial"}'` prueba la escena con otro design system (también neon, papel, dark, neutral). */
export const SceneVideo: React.FC<{ theme?: string }> = ({ theme }) => (
  <ThemeProvider theme={theme && NOMBRADOS[theme] ? NOMBRADOS[theme]! : brand}>
    <Stage>
      <SceneBody />
    </Stage>
  </ThemeProvider>
);
