// Intro de Grow2on como video suelto: npm run render -- g2o-base-intro --props '{"titulo2":"Sincronización de stock"}'
import React from "react";
import { defineVideo } from "video-estudio/engine";
import { ThemeProvider } from "video-estudio/themes";
import { INTRO_DURACION, Intro } from "../../g2o/Intro";
import type { IntroProps } from "../../g2o/Intro";
import { theme } from "../theme";

const Video: React.FC<IntroProps> = (props) => (
  <ThemeProvider theme={theme}>
    <Intro {...props} />
  </ThemeProvider>
);

export default defineVideo({
  id: "g2o-base-intro",
  component: Video,
  fps: 30,
  width: 1920,
  height: 1080,
  durationInFrames: INTRO_DURACION,
  defaultProps: { eyebrow: "Funcionalidades", titulo1: "Conocé", titulo2: "nombre de funcionalidad" },
});
