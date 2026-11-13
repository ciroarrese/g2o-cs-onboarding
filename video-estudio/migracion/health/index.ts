import { defineVideo } from "video-estudio/engine";
import { DURACION, SceneVideo } from "./Scene";

// La escena sola (fuera de la historia), para iterar sobre ella: el titular sale del `fallback` de useTopic.
export default defineVideo({ id: "migracion-health", component: SceneVideo, fps: 30, width: 1920, height: 1080, durationInFrames: DURACION });
