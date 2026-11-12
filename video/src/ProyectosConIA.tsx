import React from "react";
import { AbsoluteFill, Audio, Series, staticFile } from "remotion";
import { Apertura } from "./scenes/Apertura";
import { AsistenteIA } from "./scenes/AsistenteIA";
import { Sincropresta } from "./scenes/Sincropresta";
import { SincroMonitorDemo } from "./scenes/SincroMonitorDemo";
import { HealthScore } from "./scenes/HealthScore";
import { Cierre } from "./scenes/Cierre";

/** The full video: six scenes back to back, with the soundtrack built by scripts/build-soundtrack.sh. */
export const SCENES = [
  { id: "apertura", C: Apertura, frames: 300 },
  { id: "asistente-ia", C: AsistenteIA, frames: 840 },
  { id: "modulo-sincro-presta", C: Sincropresta, frames: 1200 },
  { id: "sincro-monitor", C: SincroMonitorDemo, frames: 1440 },
  { id: "health-score", C: HealthScore, frames: 1080 },
  { id: "cierre", C: Cierre, frames: 450 },
] as const;
export const TOTAL_FRAMES = SCENES.reduce((a, s) => a + s.frames, 0);

export const ProyectosConIA: React.FC = () => (
  <AbsoluteFill>
    <Series>
      {SCENES.map(({ id, C, frames }) => (
        <Series.Sequence key={id} durationInFrames={frames}>
          <C />
        </Series.Sequence>
      ))}
    </Series>
    <Audio src={staticFile("music/soundtrack.m4a")} />
  </AbsoluteFill>
);
