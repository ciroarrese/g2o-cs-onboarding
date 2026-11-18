import { defineVideo } from "video-estudio/engine";
import { DURACION, SceneVideo } from "./Scene";

// La escena sola (fuera de la historia), para iterar sobre ella: el titular sale del `fallback` de useTopic.
// Vertical y cuadrado: mismos cuadros y tiempos, otra maquetación y otra cámara (ver Scene.tsx, `LAY_V` y `KEYS_VERT`/`KEYS_CUAD`).
export default defineVideo({ id: "proyectos-ia-health", component: SceneVideo, fps: 30, width: 1920, height: 1080, durationInFrames: DURACION, formats: ["horizontal"] });
