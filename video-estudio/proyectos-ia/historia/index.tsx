// Video completo: apertura (anuncia cuatro temas), las tres primeras escenas con una vuelta al listado después de cada una, Health Score cortada en su
// cuadro 1032 y seguida directo por la escena sorpresa Video Studio (tema 05, `reveal: "late"`), la vuelta de revelación (la fila 05 entra y se tilda) y el
// cierre con las cinco miniaturas reales.
//
// Se arma con `composeStory` (lo mismo que hace `defineStory`) para agregar dos retoques de empalme, sin tocar las escenas ni el toolkit:
//  1. Cada bloque termina en un velo liso (el `Wash` del design system) y el siguiente empieza con las nubes ya puestas: en un cuadro el fondo
//     pasaba de liso a nubes. `EntradaSuave` es un velo del color del fondo que se levanta en 10 cuadros al empezar cada escena (menos la
//     primera) y cada vuelta: las nubes entran en lugar de aparecer de golpe.
//  2. La apertura termina atravesando el titular 01 (`handoff: "through"`) con solo las nubes; la primera escena arranca con su ventana y
//     su titular ya puestos. `AparecerContenido` hace entrar ese contenido en 10 cuadros sobre las mismas nubes.
import React from "react";
import { Audio, Fill, Sequence, asset, defineVideo, useFrame } from "video-estudio/engine";
import { VeilContent, kf } from "video-estudio/kit";
import { fade } from "video-estudio/fx/core";
import { BackdropLayer, StoryBackdropProvider, composeStory } from "video-estudio/stories";
import type { TopicScene } from "video-estudio/stories";
import { ThemeProvider, useTheme } from "video-estudio/themes";
import { DURACION as D_ASISTENTE, SceneBody as Asistente } from "../asistente/Scene";
import { MiniAsistente } from "../asistente/thumb";
import { DURACION as D_PRESTA, SceneBody as Presta } from "../presta/Scene";
import { MiniPresta } from "../presta/thumb";
import { DURACION as D_MONITOR, SceneBody as Monitor } from "../monitor/Scene";
import { MiniMonitor } from "../monitor/thumb";
import { DURACION as D_HEALTH, SceneBody as Health } from "../health/Scene";
import { temaVideo as theme } from "../extension";
import { spec } from "./spec";
import { MiniHealth } from "./thumbs";
import { DURACION as D_STUDIO, SceneBody as Studio } from "../studio/Scene";
import { HEALTH_FRAME } from "../studio/datos";
import { MiniStudio } from "../studio/thumb";
import { CIERRE_DURACION, Cierre } from "../../g2o/Cierre";
import { INTRO_DURACION, Intro } from "../../g2o/Intro";
import { Particulas } from "../../g2o/Particulas";
import { AperturaTemprana, CIERRE_ADELANTO, PUENTE1, PuenteIntroApertura, PuenteRecapCierre, cierrePildoraDesde } from "../puentes";

// La mezcla (`audio/audio-proyectos-ia.wav`: música con licencia y efectos; ver ../audio) no se versiona (regla del repo: ningún wav). Si no está, el video
// queda mudo en vez de fallar: se detecta al compilar (vite resuelve el glob en el build, igual que `g2o/Cierre`). El tipo del glob está en `../../g2o/vite-glob.d.ts`.
const HAY_AUDIO = Object.keys(import.meta.glob("../audio/audio-proyectos-ia.wav", { query: "?url", import: "default" })).length > 0;

const ENTRADA = 10; // cuadros que dura la entrada suave

/** Velo del color del fondo que se levanta en `ENTRADA` cuadros (se monta en la `Sequence` del bloque, cuadro 0 = primer cuadro del bloque). */
const EntradaSuave: React.FC = () => {
  const t = useTheme();
  const f = useFrame();
  const o = kf(f, [0, ENTRADA], [1, 0]);
  if (o <= 0) return null;
  // `VeilContent`: las partículas de fondo viajan dentro del velo (misma opacidad), así no desaparecen ni parpadean al levantarse.
  return <div data-qa-veil={o.toFixed(3)} data-qa-ignore="covered" style={{ position: "absolute", inset: 0, background: t.color.bg, opacity: fade(o), zIndex: 100, pointerEvents: "none" }}><VeilContent /></div>;
};

/** El contenido de la escena (no las nubes) entra en `ENTRADA` cuadros. */
const AparecerContenido: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const f = useFrame();
  const o = kf(f, [0, ENTRADA], [0, 1]);
  return <div style={{ position: "absolute", inset: 0, opacity: fade(o) }}>{children}</div>;
};
const PrimeraEscena: React.FC = () => (
  <AparecerContenido>
    <Asistente />
  </AparecerContenido>
);

const scenes: TopicScene[] = [
  { id: "asistente-ia", component: PrimeraEscena, durationInFrames: D_ASISTENTE, thumbnail: MiniAsistente },
  { id: "sincro-presta", component: Presta, durationInFrames: D_PRESTA, thumbnail: MiniPresta },
  { id: "sincro-monitor", component: Monitor, durationInFrames: D_MONITOR, thumbnail: MiniMonitor },
  // Health Score se corta en `HEALTH_FRAME` (antes de su salida): la escena que sigue arranca con ese mismo cuadro congelado en su vista previa.
  { id: "health-score", component: Health, durationInFrames: HEALTH_FRAME, thumbnail: MiniHealth },
  { id: "video-studio", component: Studio, durationInFrames: D_STUDIO, thumbnail: MiniStudio },
];
void D_HEALTH;

const { component: Story, durationInFrames, timeline } = composeStory(spec, scenes, {});
// bloques que empiezan después de un velo liso: (la apertura NO: la intro se transforma en ella con el velo propio de `PuenteIntroApertura`), todas las vueltas y las escenas salvo la primera y la sorpresa (esa sigue a Health Score sin nada en medio)
const conVelo = timeline.filter((e) => e.kind === "interlude" || (e.kind === "topic" && e.id !== scenes[0]!.id && e.id !== "video-studio"));

// Línea de tiempo del video: intro de Grow2on, la historia (apertura corta, escenas, vueltas, recapitulación) y el cierre de Grow2on.
const HISTORIA_DESDE = INTRO_DURACION;
const CIERRE_DESDE = HISTORIA_DESDE + durationInFrames;
const TOTAL = CIERRE_DESDE + CIERRE_DURACION;

const CAPA = <BackdropLayer>{Particulas}</BackdropLayer>;

const Video: React.FC = () => (
  <ThemeProvider theme={theme}>
    {/* Capa de fondo global (partículas): las del video entero salen de acá. La historia la dibuja por `spec.backdrop`; la intro y el cierre por su prop `capa`;
        los velos propios de este archivo y de los empalmes la llevan adentro (`VeilContent`). Todas con el cuadro absoluto: una sola población continua. */}
    <StoryBackdropProvider backdrop={Particulas}>
    <Fill>
      {HAY_AUDIO ? <Audio src={asset("audio-proyectos-ia.wav")} /> : null}
      <Sequence from={0} durationInFrames={INTRO_DURACION}>
        <Intro eyebrow="Novedades" titulo1="Proyectos" titulo2="con IA" capa={CAPA} salida={4.7} traspaso={PUENTE1.toma} aroSalida={{ dx: 520, escala: 0.55 }} />
      </Sequence>
      {/* La apertura, quieta en su cuadro 0, antes de que empiece de verdad: el muro y las nubes aparecen mientras el título todavía viaja. */}
      <AperturaTemprana />
      <Sequence from={HISTORIA_DESDE} durationInFrames={durationInFrames}>
        <Fill>
          <Story />
          {conVelo.map((e) => (
            <Sequence key={e.id} from={e.from} durationInFrames={ENTRADA}>
              <EntradaSuave />
            </Sequence>
          ))}
        </Fill>
      </Sequence>
      {/* El cierre arranca `CIERRE_ADELANTO` cuadros antes (sobre la recapitulación): logo, frase y aro entran mientras viaja la píldora; termina en el mismo cuadro. */}
      <Sequence from={CIERRE_DESDE - CIERRE_ADELANTO} durationInFrames={CIERRE_DURACION + CIERRE_ADELANTO}>
        {/* z-index propio: el telón de la recapitulación (zIndex 500 y 600 de la historia) quedaría por encima del cierre mientras se solapan */}
        <div style={{ position: "absolute", inset: 0, zIndex: 3000 }}>
          <Cierre capa={CAPA} sonido={false} mensaje={0.7} pildoraDesde={cierrePildoraDesde(HISTORIA_DESDE + timeline.find((e) => e.kind === "closing")!.from, CIERRE_DESDE - CIERRE_ADELANTO)} />
        </div>
      </Sequence>
      {/* Empalmes con un elemento que se transforma (cuadro absoluto, encima de todo) y partículas de marca continuas durante todo el video. */}
      <PuenteIntroApertura />
      <PuenteRecapCierre recapDesde={HISTORIA_DESDE + timeline.find((e) => e.kind === "closing")!.from} />
    </Fill>
    </StoryBackdropProvider>
  </ThemeProvider>
);

export default defineVideo({
  id: "proyectos-ia", component: Video, fps: 30, width: 1920, height: 1080, durationInFrames: TOTAL,
  // Intro y cierre de Grow2on solo existen en horizontal (1920x1080): no se promete vertical ni cuadrado.
  formats: ["horizontal"],
  scenes: [
    { id: "intro", name: "Intro de Grow2on", from: 0, durationInFrames: INTRO_DURACION },
    ...timeline.map((e) => ({ id: e.id, name: e.kind === "topic" && e.topic !== undefined ? spec.topics[e.topic]?.name : undefined, from: HISTORIA_DESDE + e.from, durationInFrames: e.durationInFrames })),
    { id: "cierre-marca", name: "Cierre de Grow2on", from: CIERRE_DESDE - CIERRE_ADELANTO, durationInFrames: CIERRE_DURACION + CIERRE_ADELANTO },
  ],
});
