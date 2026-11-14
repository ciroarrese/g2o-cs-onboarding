// Video completo: apertura, las cuatro escenas con una vuelta al listado entre temas y después de la última, y el cierre con las cuatro miniaturas reales.
// Orden y duraciones como en el video aprobado (apertura 300, 840, vuelta 120, 1200, 120, 1440, 120, 1080, 120, cierre 450 = 5790 cuadros, 3:13 a 30 fps).
//
// Se arma con `composeStory` (lo mismo que hace `defineStory`) para agregar dos retoques de empalme, sin tocar las escenas ni el toolkit:
//  1. Cada bloque termina en un velo liso (el `Wash` del design system) y el siguiente empieza con las nubes ya puestas: en un cuadro el fondo
//     pasaba de liso a nubes. `EntradaSuave` es un velo del color del fondo que se levanta en 10 cuadros al empezar cada escena (menos la
//     primera) y cada vuelta: las nubes entran en lugar de aparecer de golpe.
//  2. La apertura termina atravesando el titular 01 (`handoff: "through"`) con solo las nubes; la primera escena arranca con su ventana y
//     su titular ya puestos. `AparecerContenido` hace entrar ese contenido en 10 cuadros sobre las mismas nubes.
import React from "react";
import { Fill, Sequence, defineVideo, useFrame } from "video-estudio/engine";
import { kf } from "video-estudio/kit";
import { fade } from "video-estudio/fx/core";
import { composeStory } from "video-estudio/stories";
import type { TopicScene } from "video-estudio/stories";
import { ThemeProvider, useTheme } from "video-estudio/themes";
import { DURACION as D_ASISTENTE, SceneBody as Asistente } from "../asistente/Scene";
import { MiniAsistente } from "../asistente/thumb";
import { DURACION as D_PRESTA, SceneBody as Presta } from "../presta/Scene";
import { MiniPresta } from "../presta/thumb";
import { DURACION as D_MONITOR, SceneBody as Monitor } from "../monitor/Scene";
import { MiniMonitor } from "../monitor/thumb";
import { DURACION as D_HEALTH, SceneBody as Health } from "../health/Scene";
import { theme } from "../theme";
import { spec } from "./spec";
import { MiniHealth } from "./thumbs";

const ENTRADA = 10; // cuadros que dura la entrada suave

/** Velo del color del fondo que se levanta en `ENTRADA` cuadros (se monta en la `Sequence` del bloque, cuadro 0 = primer cuadro del bloque). */
const EntradaSuave: React.FC = () => {
  const t = useTheme();
  const f = useFrame();
  const o = kf(f, [0, ENTRADA], [1, 0]);
  if (o <= 0) return null;
  return <div data-qa-veil={o.toFixed(3)} data-qa-ignore="covered" style={{ position: "absolute", inset: 0, background: t.color.bg, opacity: fade(o), zIndex: 100, pointerEvents: "none" }} />;
};

/** El contenido de la escena (no las nubes) entra en `ENTRADA` cuadros. */
const AparecerContenido: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const f = useFrame();
  const o = kf(f, [0, ENTRADA], [0, 1]);
  return <div style={{ position: "absolute", inset: 0, opacity: fade(o) }}>{children}</div>;
};
const PrimeraEscena: React.FC = () => (
  <AparecerContenido>
    <Asistente />
  </AparecerContenido>
);

const scenes: TopicScene[] = [
  { id: "asistente-ia", component: PrimeraEscena, durationInFrames: D_ASISTENTE, thumbnail: MiniAsistente },
  { id: "sincro-presta", component: Presta, durationInFrames: D_PRESTA, thumbnail: MiniPresta },
  { id: "sincro-monitor", component: Monitor, durationInFrames: D_MONITOR, thumbnail: MiniMonitor },
  { id: "health-score", component: Health, durationInFrames: D_HEALTH, thumbnail: MiniHealth },
];

const { component: Story, durationInFrames, timeline } = composeStory(spec, scenes, { audio: { src: "audio-migracion.wav" } }); // la mezcla vive en migracion/audio/ (ignorada por git: lleva la pista con licencia)
// bloques que empiezan después de un velo liso: todas las vueltas y las escenas salvo la primera
const conVelo = timeline.filter((e) => e.kind === "interlude" || (e.kind === "topic" && e.id !== scenes[0]!.id));

const Video: React.FC = () => (
  <ThemeProvider theme={theme}>
    <Fill>
      <Story />
      {conVelo.map((e) => (
        <Sequence key={e.id} from={e.from} durationInFrames={ENTRADA}>
          <EntradaSuave />
        </Sequence>
      ))}
    </Fill>
  </ThemeProvider>
);

export default defineVideo({
  id: "migracion", component: Video, fps: 30, width: 1920, height: 1080, durationInFrames,
  scenes: timeline.map((e) => ({ id: e.id, name: e.kind === "topic" && e.topic !== undefined ? spec.topics[e.topic]?.name : undefined, from: e.from, durationInFrames: e.durationInFrames })),
});
