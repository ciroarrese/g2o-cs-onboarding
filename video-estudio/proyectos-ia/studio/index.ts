import { defineVideo } from "video-estudio/engine";
import { DURACION, SceneVideo } from "./Scene";

// La escena sola (fuera de la historia), para iterar sobre ella: el titular sale de `title` y `number`.
export default defineVideo({ id: "proyectos-ia-studio", component: SceneVideo, fps: 30, width: 1920, height: 1080, durationInFrames: DURACION, formats: ["horizontal", "vertical", "cuadrado"] });
