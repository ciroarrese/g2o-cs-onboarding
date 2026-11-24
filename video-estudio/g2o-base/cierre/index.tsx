// Cierre de Grow2on como video suelto: npm run render -- g2o-base-cierre
import React from "react";
import { defineVideo } from "video-estudio/engine";
import { ThemeProvider } from "video-estudio/themes";
import { CIERRE_DURACION, Cierre } from "../../g2o/Cierre";
import type { CierreProps } from "../../g2o/Cierre";
import { theme } from "../theme";

const Video: React.FC<CierreProps> = (props) => (
  <ThemeProvider theme={theme}>
    <Cierre {...props} />
  </ThemeProvider>
);

export default defineVideo({
  id: "g2o-base-cierre",
  component: Video,
  fps: 30,
  width: 1920,
  height: 1080,
  durationInFrames: CIERRE_DURACION,
  formats: ["horizontal", "vertical", "cuadrado"],
  defaultProps: { titulo: "¡Animate a crecer más!", url: "grow2on.com" },
});
