// Video completo de la prueba: apertura (con spec) → Health Score → cierre, solo horizontal.
// El motor arma historias con `composeStory`, pero exige una escena por tema del spec (2 a 6) y el spec de la apertura tiene los
// cuatro proyectos: acá se compone a mano con las mismas piezas (Opening / Closing) y las escenas que sí se migraron.
import React from "react";
import { Fill, Sequence, defineVideo } from "video-estudio/engine";
import { Closing, Opening, closingFrames, openingFrames } from "video-estudio/stories";
import type { TopicScene } from "video-estudio/stories";
import { ThemeProvider } from "video-estudio/themes";
import { DURACION as HS, SceneVideo as HealthScene } from "../health/Scene";
import { theme } from "../theme";
import { spec } from "./spec";
import { MiniHealth } from "./thumbs";
import { Parche } from "../apertura/Parche";

const stub: React.FC = () => null; // los tres proyectos que no se migraron: solo ocupan su lugar en el cierre (miniatura por defecto)
const closingScenes: TopicScene[] = [
  { id: "asistente-ia", component: stub, durationInFrames: 1 },
  { id: "sincro-presta", component: stub, durationInFrames: 1 },
  { id: "sincro-monitor", component: stub, durationInFrames: 1 },
  { id: "health-score", component: stub, durationInFrames: HS, thumbnail: MiniHealth },
];

const A = openingFrames(spec), C = closingFrames(spec);
const Video: React.FC = () =>
  React.createElement(
    ThemeProvider,
    { theme },
    React.createElement(
      Fill,
      null,
      React.createElement(Sequence, { from: 0, durationInFrames: A, name: "opening" }, React.createElement(Parche, null, React.createElement(Opening, { spec }))),
      React.createElement(Sequence, { from: A, durationInFrames: HS, name: "health-score" }, React.createElement(HealthScene, { title: "Health Score" })),
      React.createElement(Sequence, { from: A + HS, durationInFrames: C, name: "closing" }, React.createElement(Closing, { spec, scenes: closingScenes })),
    ),
  );

export default defineVideo({ id: "migracion", component: Video, fps: 30, width: 1920, height: 1080, durationInFrames: A + HS + C });
