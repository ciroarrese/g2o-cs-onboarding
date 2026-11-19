// Partículas flotantes de marca (rosa, naranja y violeta) a la deriva lenta: la capa que acompaña a todo un video.
// Todo sale del cuadro: sin azar en ejecución (cada partícula se siembra por su índice), sin estado ni CSS animado.
//
// Pensada para montarse UNA sola vez, arriba del video entero, con el cuadro absoluto (el `useFrame()` de la raíz): así la posición de cada
// partícula es la misma antes y después de un corte de escena y no "salta". Va con `mix-blend-mode: multiply`: sobre el fondo claro se ve el
// color, sobre un texto oscuro lo oscurece (nunca le baja el contraste) y sobre una ventana oscura no se nota (queda "detrás" de la interfaz).
// Uso:   <Particulas />   (último hijo de la raíz del video, `pointer-events: none`)
import React from "react";
import { useFrame, useVideoConfig } from "video-estudio/engine";
import { useTheme } from "video-estudio/themes";

type Particula = { x: number; y: number; d: number; vy: number; vx: number; amp: number; per: number; fase: number; op: number; color: number; blur: number; pulso: number };

/** Pseudoazar determinista (LCG) por semilla: la misma lista siempre. */
function sembrar(semilla: number, cantidad: number, ancho: number, alto: number): Particula[] {
  let s = semilla % 233280;
  const rnd = () => (s = (s * 9301 + 49297) % 233280) / 233280;
  const out: Particula[] = [];
  for (let i = 0; i < cantidad; i++) {
    const z = rnd(); // profundidad: lo lejano es chico, borroso y lento
    out.push({
      x: rnd() * ancho,
      y: rnd() * alto,
      d: Math.round(4 + z * 11),
      vy: -(5 + z * 13), // px por segundo, hacia arriba
      vx: (rnd() - 0.5) * 6,
      amp: 16 + rnd() * 44,
      per: 9 + rnd() * 9, // segundos por vaivén
      fase: rnd() * Math.PI * 2,
      op: 0.35 + z * 0.4,
      color: rnd(),
      blur: z < 0.3 ? 2 : z < 0.55 ? 1 : 0,
      pulso: rnd() * Math.PI * 2,
    });
  }
  return out;
}

const hexRgb = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));

export type ParticulasProps = {
  /** Cuántas partículas (por defecto 64). */
  cantidad?: number;
  /** Opacidad general de la capa, de 0 a 1 (por defecto 0,5: tenue, sin competir con el contenido). */
  opacidad?: number;
  /** Semilla del reparto (por defecto 11). */
  semilla?: number;
  /** Cuadro con el que se calcula el movimiento; por defecto el del contexto (la raíz del video = cuadro absoluto). */
  frame?: number;
};

export function Particulas({ cantidad = 64, opacidad = 0.5, semilla = 11, frame }: ParticulasProps) {
  const cur = useFrame();
  const f = frame ?? cur;
  const { fps, width, height } = useVideoConfig();
  const t = useTheme();
  const T = f / fps;
  const margen = 40;
  const paradas = React.useMemo(() => [t.color.accent, t.color.accent2, t.data.violeta].map(hexRgb), [t]);
  const color = (m: number) => {
    const i = m < 0.5 ? 0 : 1;
    const l = m < 0.5 ? m * 2 : (m - 0.5) * 2;
    const A = paradas[i]!, B = paradas[i + 1]!;
    return `rgb(${A.map((v, k) => Math.round(v + (B[k]! - v) * l)).join(",")})`;
  };
  const lista = React.useMemo(() => sembrar(semilla, cantidad, width, height), [semilla, cantidad, width, height]);
  const vuelta = height + 2 * margen;
  return (
    // Capa decorativa de cuadro completo: no lleva texto; `covered` callado porque cruza todo el cuadro a propósito.
    <div data-qa-decor="partículas flotantes" data-qa-ignore="covered" style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 5000, mixBlendMode: "multiply", opacity: opacidad }}>
      {lista.map((p, i) => {
        // sube con módulo (sale por arriba, entra por abajo fuera del cuadro) y se mece de lado: posición enteros
        const yy = (((p.y + p.vy * T + margen) % vuelta) + vuelta) % vuelta - margen;
        const xx = p.x + p.vx * T + Math.sin((T / p.per) * Math.PI * 2 + p.fase) * p.amp;
        const o = p.op * (0.8 + 0.2 * Math.sin(T * 0.9 + p.pulso));
        return (
          <div
            key={i}
            style={{
              position: "absolute", left: 0, top: 0, width: p.d, height: p.d, borderRadius: "50%", background: color(p.color), opacity: +o.toFixed(3),
              transform: `translate(${Math.round(xx)}px, ${Math.round(yy)}px)`, ...(p.blur ? { filter: `blur(${p.blur}px)` } : {}),
            }}
          />
        );
      })}
    </div>
  );
}
