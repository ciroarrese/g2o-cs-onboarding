import React from "react";
import { AbsoluteFill, Audio, Series, staticFile } from "remotion";
import { Apertura } from "./scenes/Apertura";
import { AsistenteIA } from "./scenes/AsistenteIA";
import { Sincropresta } from "./scenes/Sincropresta";
import { SincroMonitorDemo } from "./scenes/SincroMonitorDemo";
import { HealthScore } from "./scenes/HealthScore";
import { Cierre } from "./scenes/Cierre";
import { AGENDA_FRAMES, Agenda } from "./scenes/Agenda";

/** The full video: six scenes with an agenda between projects, with the soundtrack built by scripts/build-soundtrack.sh. */
// Between projects the video returns to the agenda: the project just shown gets
// its check and the camera flies into the next one.
const A1 = () => <Agenda done={1} />;
const A2 = () => <Agenda done={2} />;
const A3 = () => <Agenda done={3} />;
const A4 = () => <Agenda done={4} />;
export const SCENES = [
  { id: "apertura", C: Apertura, frames: 300 },
  { id: "asistente-ia", C: AsistenteIA, frames: 840 },
  { id: "agenda-1", C: A1, frames: AGENDA_FRAMES },
  { id: "modulo-sincro-presta", C: Sincropresta, frames: 1200 },
  { id: "agenda-2", C: A2, frames: AGENDA_FRAMES },
  { id: "sincro-monitor", C: SincroMonitorDemo, frames: 1440 },
  { id: "agenda-3", C: A3, frames: AGENDA_FRAMES },
  { id: "health-score", C: HealthScore, frames: 1080 },
  { id: "agenda-4", C: A4, frames: AGENDA_FRAMES },
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
