// Partículas flotantes de marca (rosa, naranja y violeta) a la deriva lenta: la capa que acompaña a todo un video.
// Todo sale del cuadro: sin azar en ejecución (cada partícula se siembra por su índice), sin estado ni CSS animado.
//
// Es la capa de FONDO global del video: va en la ranura `backdrop` de la historia (`spec.backdrop`) y, con `BackdropLayer`, bajo la intro, el cierre y los
// empalmes (`stories/backdrop.tsx`). Se dibuja sobre el color y las nubes y debajo de todo el contenido (interfaces, píldoras, titulares): ya no multiplica ni
// compite con el texto. Dentro de la capa `useFrame()` es el cuadro ABSOLUTO del video, así que cada partícula está en el mismo lugar antes y después de un
// corte: acá no se suma ningún desplazamiento propio (si no hay capa que lo ponga, se puede pasar `frame`).
// Uso:   backdrop: Particulas   (en el `StorySpec`)   o   <BackdropLayer>{Particulas}</BackdropLayer>
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
  /** Cuántas partículas (por defecto 64 por cada 1920 x 1080 px de cuadro: la misma densidad en cualquier formato). */
  cantidad?: number;
  /** Opacidad general de la capa, de 0 a 1 (por defecto OPAC: tenue pero visible sobre el fondo claro, sin competir con el contenido). */
  opacidad?: number;
  /** Semilla del reparto (por defecto 11). */
  semilla?: number;
  /** Cuadro con el que se calcula el movimiento; por defecto el del contexto (dentro de la capa de fondo = cuadro absoluto del video). */
  frame?: number;
};

/** Opacidad por defecto de la capa. */
const OPAC = 0.5;

export function Particulas({ cantidad: cantidadIn, opacidad = OPAC, semilla = 11, frame }: ParticulasProps) {
  const cur = useFrame();
  const f = frame ?? cur;
  const { fps, width, height } = useVideoConfig();
  // misma densidad en cada formato: 64 partículas en 1920 x 1080 (y en 1080 x 1920, que tiene la misma área); el cuadrado, de poco más de la mitad del área, lleva menos
  const cantidad = cantidadIn ?? Math.round((64 * width * height) / (1920 * 1080));
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
    // Las marcas de `qa` (decorado, `covered` y `vacio` callados) las pone la capa que la monta (`BackdropLayer`).
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      {lista.map((p, i) => {
        // sube con módulo (sale por arriba, entra por abajo fuera del cuadro) y se mece de lado: posición enteros
        const yy = (((p.y + p.vy * T + margen) % vuelta) + vuelta) % vuelta - margen;
        const xx = p.x + p.vx * T + Math.sin((T / p.per) * Math.PI * 2 + p.fase) * p.amp;
        const o = opacidad * p.op * (0.8 + 0.2 * Math.sin(T * 0.9 + p.pulso));
        // Las lejanas (`blur`) son un punto de borde suave hecho con degradado radial, no con `filter: blur`: un filtro fijo compone la partícula en capa propia y se
        // rasteriza según el historial (`--check` fallaba por 3 px). Un poco más grandes para que el borde suave no las vuelva más chicas.
        const w = p.blur ? Math.round(p.d * 1.7) : p.d, c = color(p.color), off = (w - p.d) / 2;
        return (
          <div
            key={i}
            style={{
              position: "absolute", left: 0, top: 0, width: w, height: w, borderRadius: "50%", opacity: +o.toFixed(3),
              background: p.blur ? `radial-gradient(circle, ${c} 0%, ${c} 38%, transparent 70%)` : c,
              transform: `translate(${Math.round(xx - off)}px, ${Math.round(yy - off)}px)`,
            }}
          />
        );
      })}
    </div>
  );
}
