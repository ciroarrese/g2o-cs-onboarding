// Cierre de Grow2on (7 s; horizontal 1920x1080, y vertical y cuadrado con otra disposición, ver ./formato.ts): entra el aro abierto girando y el logo, aparece la frase de cierre en el degradado
// de marca y la píldora con la URL; queda la pantalla final con el aro girando. Con la cortina sonora de marca.
// Portado de "G2O Mkt Design System/templates/youtube-cierre".
import React from "react";
import { Audio, Sequence, useFrame, useVideoConfig } from "video-estudio/engine";
import { GradientText, Stage } from "video-estudio/kit";
import { useTheme } from "video-estudio/themes";
import { G2O } from "./assets";
import { Imagen } from "./Imagen";
import { cierreGeom } from "./formato";
import { Motas } from "./Motas";
import { Pildora, entra, salta, sube } from "./movimiento";

// La cortina sonora (`assets/g2o/audio/cierre-musica.mp3`) no se versiona en el repo (regla: ningún mp3, wav ni mp4). Si el archivo no está,
// el render fallaría con "Audio file ... not found"; por eso se detecta al compilar el video (vite resuelve el glob en el build, así que es
// una constante y no rompe la pureza): con el archivo en su lugar el cierre suena, sin él queda mudo y no da error.
// El glob es de vite; su tipo se declara en `./vite-glob.d.ts`.
const HAY_CORTINA = Object.keys(import.meta.glob("../assets/g2o/audio/cierre-musica.mp3", { query: "?url", import: "default" })).length > 0;

/** Duración en cuadros a 30 fps: logo 2 s + mensaje 3 s + pantalla final 2 s. */
export const CIERRE_DURACION = 210;
const CUE = { mensaje: 2 };

export type CierreProps = {
  titulo?: string; url?: string;
  /** segundo en que entra la frase (por defecto 2: lo de siempre); la píldora entra 0,6 s después */ mensaje?: number;
  /** cuadro local desde el cual la píldora de la URL está puesta y quieta, sin entrada (otra capa la trajo hasta su lugar); antes de ese cuadro ocupa su lugar pero no se ve */ pildoraDesde?: number; /** false deja el cierre mudo; con true suena solo si el archivo `assets/g2o/audio/cierre-musica.mp3` está copiado (no se versiona) */ sonido?: boolean;
  /** capa de fondo propia (p. ej. `<BackdropLayer>{Particulas}</BackdropLayer>`): se dibuja sobre el blanco y bajo las motas, el aro y los textos; sin esto no hay capa */ capa?: React.ReactNode };

export function Cierre({ titulo = "¡Animate a crecer más!", url = "grow2on.com", sonido = true, mensaje = CUE.mensaje, pildoraDesde, capa }: CierreProps) {
  const f = useFrame();
  const { fps, width, height } = useVideoConfig();
  const t = useTheme();
  const G = cierreGeom(t, width, height);
  const horizontal = G.formato === "horizontal";
  const T = f / fps;

  const aro = entra(T, 0, 1.6);
  const aroGiro = T * (360 / 46);
  const logo = entra(T, 0.4, 1.3);
  const frase = entra(T, mensaje, mensaje + 0.9);
  const pildora = pildoraDesde === undefined ? salta(T, mensaje + 0.6, mensaje + 1.3) : 1;

  return (
    <Stage clouds={false}>
      {/* La cortina arranca 0,2 s después de que entra el mensaje, como en la plantilla. */}
      {sonido && HAY_CORTINA ? (
        <Sequence from={Math.round((mensaje + 0.2) * fps)}>
          <Audio src={G2O.audioCierre} />
        </Sequence>
      ) : null}
      <div style={{ position: "absolute", inset: 0, background: t.color.bg, color: t.color.text, overflow: "hidden" }}>
        {capa}
        <Motas semilla={7} borde={G.formato === "vertical" ? "abajo" : "derecha"} />
        <Imagen
          src={G2O.marca.aro}
          style={{ position: "absolute", left: G.aro.x, top: G.aro.y, width: G.aro.w, height: G.aro.w, opacity: aro, transform: `translateX(${Math.round((1 - aro) * 120)}px) scale(${(0.85 + 0.15 * aro).toFixed(5)}) rotate(${aroGiro.toFixed(4)}deg)` }}
        />
        <div style={{ position: "absolute", left: G.texto.x, width: G.texto.w, display: "flex", flexDirection: "column", alignItems: "flex-start", gap: G.gap, ...(horizontal ? { top: 0, bottom: 0, justifyContent: "center" } : { top: G.texto.y! }) }}>
          <Imagen src={G2O.marca.logo} alt="Grow2on" style={{ height: G.logoH, width: "auto", ...sube(logo) }} />
          <div style={{ fontSize: G.fraseSize, fontWeight: t.font.weights.semibold, letterSpacing: "-0.03em", lineHeight: 1.1, paddingBottom: 6, ...sube(frase) }}>
            <GradientText>{titulo}</GradientText>
          </div>
          <div style={{ display: "contents", ...(pildoraDesde !== undefined && f < pildoraDesde ? { visibility: "hidden" } : {}) }}>
            <Pildora p={pildora} size={t.type.caption * 1.125} padding="16px 44px">{url}</Pildora>
          </div>
        </div>
      </div>
    </Stage>
  );
}
