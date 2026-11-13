// Video completo de la prueba: historia parcial. Los cuatro temas salen en la apertura, las vueltas y el cierre; solo Health Score tiene escena.
import { defineStory } from "video-estudio/stories";
import type { TopicScene } from "video-estudio/stories";
import { DURACION, SceneBody } from "../health/Scene";
import { theme } from "../theme";
import { spec } from "./spec";
import { MiniHealth } from "./thumbs";

const health: TopicScene = { id: "health-score", component: SceneBody, durationInFrames: DURACION, thumbnail: MiniHealth };

export default defineStory({ id: "migracion", spec, theme, scenes: [null, null, null, health] });
