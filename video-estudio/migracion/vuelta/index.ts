// SOLO PARA MEDIR (no forma parte del video final): historia con una escena vacía antes de Health Score, para ver la vuelta al listado
// "entre dos temas" (hecho el tercero, sigue el cuarto) con la misma configuración que el video completo.
import React from "react";
import { defineStory } from "video-estudio/stories";
import type { TopicScene } from "video-estudio/stories";
import { DURACION, SceneBody } from "../health/Scene";
import { spec } from "../historia/spec";
import { theme } from "../theme";

const vacia: React.FC = () => null;
const escenas: (TopicScene | null)[] = [null, null, { id: "sincro-monitor", component: vacia, durationInFrames: 1 }, { id: "health-score", component: SceneBody, durationInFrames: DURACION }];

export default defineStory({ id: "migracion-vuelta", spec, theme, scenes: escenas });
