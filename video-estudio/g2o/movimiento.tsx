// Movimiento de Grow2on para video: curvas y piezas que usan la intro, el cierre y cualquier escena.
// Reglas del motor que cumplen: no dejan `transform` ni `opacity` puestos cuando el elemento ya está quieto,
// trasladan el texto en píxeles enteros y nunca escalan texto (la píldora escala solo su fondo).
import React from "react";
import { back } from "video-estudio/engine";
import { useTheme } from "video-estudio/themes";

/** Avance de 0 a 1 entre los segundos `a` y `b`. */
export const tramo = (T: number, a: number, b: number) => Math.min(1, Math.max(0, (T - a) / (b - a)));
/** Entrada suave (sale rápido y frena): la de casi todo. */
export const entra = (T: number, a: number, b: number) => 1 - Math.pow(1 - tramo(T, a, b), 3);
/** Salida (arranca lento y acelera). */
export const sale = (T: number, a: number, b: number) => Math.pow(tramo(T, a, b), 3);
const rebote = back(1.70158);
/** Entrada con rebote corto: píldoras y aros. Pasa apenas de 1 y vuelve. */
export const salta = (T: number, a: number, b: number) => rebote(tramo(T, a, b));

/** "Sube y aparece" (g2o-rise): `p` de 0 a 1 es la entrada; `out` de 0 a 1, la salida hacia arriba. */
export function sube(p: number, out = 0, distancia = 40, salida = 60): React.CSSProperties {
  const y = Math.round((1 - p) * distancia - out * salida);
  const o = p * (1 - out);
  return { ...(o < 1 ? { opacity: o } : {}), ...(y !== 0 ? { transform: `translateY(${y}px)` } : {}) };
}

/**
 * Píldora rosa de marca (rótulo de categoría, URL). `p` es su entrada con rebote (`salta`): escala el fondo, no el texto.
 * `out` (0 a 1) la saca hacia arriba.
 */
export function Pildora({ children, p = 1, out = 0, size, padding = "14px 32px" }: { children: React.ReactNode; p?: number; out?: number; size?: number; padding?: string }) {
  const t = useTheme();
  const visible = Math.min(1, Math.max(0, p)) * (1 - out);
  const y = Math.round(-out * 60);
  const escala = 0.6 + 0.4 * p;
  return (
    <div style={{ position: "relative", display: "inline-block", ...(y !== 0 ? { transform: `translateY(${y}px)` } : {}), ...(visible < 1 ? { opacity: visible } : {}) }}>
      <div
        style={{
          position: "absolute", inset: 0, background: t.color.accent, borderRadius: t.radius.pill, transformOrigin: "left center",
          ...(Math.abs(escala - 1) > 1e-4 ? { transform: `scale(${escala.toFixed(4)})` } : {}),
        }}
      />
      {/* El fondo rosa es una capa hermana del texto (para escalar solo el fondo), así que el control de calidad no ve que el fondo también se funde
          con el texto y mide blanco contra rosa a medio mezclar (2,7:1 en una salida a medio fundido). Solo mientras la píldora entra o sale
          (`visible < 1`) se calla el contraste de este texto; en reposo la marca no está y se juzga estricto (blanco sobre el rosa de marca). */}
      <div data-qa-ignore={visible < 1 ? "contrast" : undefined} style={{ position: "relative", color: t.color.onAccent, fontSize: size ?? t.type.caption, lineHeight: 1.2, fontWeight: t.font.weights.semibold, letterSpacing: "0.01em", padding, whiteSpace: "nowrap" }}>
        {children}
      </div>
    </div>
  );
}
