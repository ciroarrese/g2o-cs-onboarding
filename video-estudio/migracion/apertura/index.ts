// La apertura sola, manejada por el spec: el muro de etiquetas, el título, las cuatro cabeceras y el atravesado de la primera.
import React from "react";
import { defineVideo } from "video-estudio/engine";
import { Opening, openingFrames } from "video-estudio/stories";
import { ThemeProvider } from "video-estudio/themes";
import { theme } from "../theme";
import { spec } from "../historia/spec";
import { Parche } from "./Parche";

const Apertura: React.FC = () => React.createElement(ThemeProvider, { theme }, React.createElement(Parche, null, React.createElement(Opening, { spec })));

export default defineVideo({ id: "migracion-apertura", component: Apertura, fps: 30, width: 1920, height: 1080, durationInFrames: openingFrames(spec) });
