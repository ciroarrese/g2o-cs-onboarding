import { defineVideo } from "video-estudio/engine";
import { DURACION, SceneVideo } from "./Scene";

export default defineVideo({ id: "migracion-health", component: SceneVideo, fps: 30, width: 1920, height: 1080, durationInFrames: DURACION, defaultProps: { title: "Health Score" } });
