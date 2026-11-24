// Intro de Grow2on (7 s; horizontal 1920x1080, y vertical y cuadrado con otra disposición, ver ./formato.ts): entra el aro 3D con las motas y el logo, llega la píldora de categoría y el título
// en dos líneas (la segunda en el degradado de marca), y todo sale hacia arriba dejando blanco para cortar a lo que sigue.
// Portada de "G2O Mkt Design System/templates/youtube-intro". Uso:
//   <Sequence from={0} durationInFrames={INTRO_DURACION}><Intro eyebrow="Funcionalidades" titulo1="Conocé" titulo2="..." /></Sequence>
import React from "react";
import { useFrame, useVideoConfig } from "video-estudio/engine";
import { GradientText, Stage } from "video-estudio/kit";
import { useTheme } from "video-estudio/themes";
import { G2O } from "./assets";
import { Imagen } from "./Imagen";
import { introGeom } from "./formato";
import { Motas } from "./Motas";
import { Pildora, entra, sale, salta, sube as subeBase } from "./movimiento";

/** Duración en cuadros a 30 fps: entrada 2 s + título 3,5 s + salida 1,5 s. */
export const INTRO_DURACION = 210;
const CUE = { titulo: 2, salida: 5.5 };

export type IntroProps = { eyebrow?: string; titulo1?: string; titulo2?: string; /** achica el título cuando un renglón no entra (1 = tamaño de la plantilla) */ escala?: number;
  /** segundo en que empieza la salida de aro, logo y motas (por defecto 5,5: lo de siempre; dura 1 s) */ salida?: number;
  /** cuadro local desde el cual la intro deja de dibujar la píldora y el título (los toma otra capa que los transforma); sin esto, se dibujan siempre */ traspaso?: number;
  /** salida del aro con movimiento: `dx` px extra hacia la derecha y `escala` final (1 = sin achicar); sin esto, la salida es la de siempre */ aroSalida?: { dx?: number; escala?: number };
  /** capa de fondo propia (p. ej. `<BackdropLayer>{Particulas}</BackdropLayer>`): se dibuja sobre el blanco y bajo las motas, el aro y los textos; sin esto no hay capa */ capa?: React.ReactNode };

export function Intro({ eyebrow = "Funcionalidades", titulo1 = "Conocé", titulo2 = "nombre de funcionalidad", escala = 1, salida = CUE.salida, traspaso, aroSalida, capa }: IntroProps) {
  const f = useFrame();
  const { fps, width, height } = useVideoConfig();
  const t = useTheme();
  const G = introGeom(t, width, height, { escala, titulo1, titulo2 });
  const T = f / fps;
  const out = sale(T, salida, salida + 1);
  const textos = traspaso === undefined || f < traspaso;

  const aro = salta(T, 0.1, 1.5);
  const aroEscala = (0.6 + 0.4 * aro + 0.05 * (T / 8)) * (aroSalida?.escala !== undefined ? 1 - (1 - aroSalida.escala) * out : 1);
  const aroGiro = -40 * (1 - aro) + 6 * T;
  const logo = entra(T, 0.3, 1.1);
  const pildora = salta(T, CUE.titulo - 0.6, CUE.titulo + 0.1);
  const l1 = entra(T, CUE.titulo - 0.2, CUE.titulo + 0.6);
  const l2 = entra(T, CUE.titulo + 0.1, CUE.titulo + 0.9);
  const sube = (p: number) => subeBase(p, out);
  const titulo: React.CSSProperties = { fontSize: G.titulo, fontWeight: t.font.weights.semibold, lineHeight: 1.04, letterSpacing: "-0.03em" };

  return (
    <Stage clouds={false}>
      <div style={{ position: "absolute", inset: 0, background: t.color.bg, color: t.color.text, overflow: "hidden" }}>
        {capa}
        <Motas semilla={3} salida={out} borde={G.motas} />
        <Imagen
          src={G2O.marca.aroFuncionalidades}
          style={{ position: "absolute", left: G.aro.x, top: G.aro.y, width: G.aro.w, height: G.aro.w, opacity: aro * (1 - out), transform: `translate(${Math.round(out * (160 + (aroSalida?.dx ?? 0)) * G.salida.x)}px, ${Math.round(out * (160 + (aroSalida?.dx ?? 0)) * G.salida.y)}px) scale(${aroEscala.toFixed(5)}) rotate(${aroGiro.toFixed(4)}deg)` }}
        />
        <Imagen src={G2O.marca.logo} alt="Grow2on" style={{ position: "absolute", left: G.logo.x, top: G.logo.y, height: G.logo.h, width: "auto", ...sube(logo) }} />
        {textos && <div style={{ position: "absolute", left: G.texto.x, top: G.texto.y, width: G.texto.w, display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 36 }}>
          <Pildora p={pildora} out={out} size={t.type.caption * 0.94}>{eyebrow}</Pildora>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <div style={{ ...titulo, ...sube(l1) }}>{titulo1}</div>
            <div style={{ ...titulo, paddingBottom: 8, ...sube(l2) }}><GradientText>{titulo2}</GradientText></div>
          </div>
        </div>}
      </div>
    </Stage>
  );
}
