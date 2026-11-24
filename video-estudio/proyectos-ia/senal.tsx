// Señal de Grow2on para las escenas: el anillo rosa del tema (`style.annotation.mark: "ring"`) vía `Callout`, sin rótulo.
// Reemplaza a los garabatos del estilo anterior (`DoodleCircle`): mismas coordenadas de elipse (centro y radios) y mismo rango de cuadros,
// pero la forma, el color y el halo los pone el design system (esquinas del tema, acento, grosor de `style.line`). Sin flechas.
import React from "react";
import { Callout } from "video-estudio/kit";

export function Anillo({ cx, cy, rx, ry, start, end = 99999, id }: { cx: number; cy: number; rx: number; ry: number; start: number; end?: number; id: string }) {
  return <Callout target={{ x: cx - rx, y: cy - ry, w: 2 * rx, h: 2 * ry }} range={[start, end]} id={id} />;
}
