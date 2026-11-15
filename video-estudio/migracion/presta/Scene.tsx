// Módulo Sincro Presta, migrada desde video/src/scenes/Sincropresta.tsx (Remotion): 1200 cuadros a 30 fps, tema 02 del video.
// Cinco zonas por las que vuela la cámara, sin voz:
//  A. una tienda PrestaShop (tema Classic) y el ERP Flexxus (grilla de Artículos) sincronizados en vivo;
//  B. versiones semanales armadas con pilas de "Mejora" y "Fix";
//  C. el límite de 2 minutos del hosting contra la sincro que corre dentro del servidor;
//  D. funciones de cada cliente que se funden en la pantalla de configuración del módulo;
//  E. la cuenta corriente: historial, detalle, factura PDF con su QR y la consulta de ARCA desde un teléfono.
// Todo es ficticio (tienda, clientes, cifras y comprobantes). Hoja de tiempos: guion.md.
//
// La escena no decide estética: cámara (inclinación y desenfoque), garabatos, viñeta, titular, velo, superficies, esquinas, pesos de letra,
// entradas y escalonado salen del design system del video (`theme.style`, ver ../theme.ts). Cada herramienta recreada (la tienda, el ERP, el
// visor del teléfono y la página de ARCA) es un design system anidado (./temas.ts) dentro de un `ThemeScope`. Distinto del original: no hay
// profundidad real (`preserve-3d`/`translateZ`): el mundo se inclina como un plano; la letra de las zonas B, C y D sube un escalón del tema para
// que se lea con la cámara en vista general (0,83 a 0,9) y el ancho de las pilas de la zona B se mide con la tipografía.
import React from "react";
import { useFormat, useFrame } from "video-estudio/engine";
import { Cursor, DoodleArrow, DoodleCircle, Stage, Vignette, Wash, World, hideFromScale, kf, useCameraAt, zoomThrough } from "video-estudio/kit";
import type { CameraKey } from "video-estudio/kit";
import { TopicHeadline, useTopic } from "video-estudio/stories";
import { ThemeProvider, cameraOptions, dark, editorial, neon, neutral, papel, useTheme } from "video-estudio/themes";
import { theme as marca } from "../theme";
import { DURACION, T, VIS, enVentana } from "./datos";
import { encuadre, useGeo } from "./geo";
import type { Geo } from "./geo";
import { ZoomCtx } from "./ui";
import { ZonaA } from "./zonaA";
import { ZonaB, ZonaC, medidasB } from "./zonaBC";
import { ZonaD, interruptor } from "./zonaD";
import { Cuenta, DESCARGA, Pdf, Telefono } from "./zonaE";

export { DURACION };

/** Cámara: cuadros clave [cuadro, foco x, foco y, escala]. Las vistas generales van a 0,88; los acercamientos rápidos (1,25 a 1,9) caen sobre la acción. */
const clavesHorizontal = (t: ReturnType<typeof useTheme>, g: Geo): CameraKey[] => {
  const { EW, SW, ZB, ZC, ZD, PHONE } = g;
  const b = medidasB(t, g);
  // la zona B es más ancha con la letra del tema: la vista general se achica lo justo para que entren las cinco columnas, y el acercamiento
  // a las últimas semanas se calcula con el ancho real
  const sB = Math.min(0.9, 1800 / b.total);
  // el original encuadraba tres columnas (semanas 3, 4 y 5): se centra en la 4 y la escala deja entrar las tres con margen
  const pitch = b.colW + b.gap;
  const zB = { x: Math.round(b.left + 3 * pitch + b.colW / 2), y: 590, s: Math.min(1.55, 1780 / (3 * pitch - b.gap)) };
  const ks: [number, number, number, number][] = [
    [0, 960, 520, 0.93], [28, 960, 520, 0.93],
    [40, EW.x + 640, EW.y + 240, 1.6], [62, EW.x + 640, EW.y + 240, 1.6], // el precio cambia en el ERP
    [76, SW.x + 300, SW.y + 300, 1.6], [104, SW.x + 300, SW.y + 300, 1.6], // y llega a la tienda
    [118, 960, 520, 0.93], [184, 960, 520, 0.93],
    [198, EW.x + 680, EW.y + 640, 1.9], [228, EW.x + 680, EW.y + 640, 1.9], // el pedido de la web llega al ERP
    [242, 2080, 540, 0.5], [258, ZB.x, 500, sB], [384, ZB.x, 500, sB],
    [396, zB.x, zB.y, zB.s], [434, zB.x, zB.y, zB.s], // una semana entera de arreglos y mejoras
    [446, ZB.x, 500, sB], [460, ZB.x, 1220, 0.5], [474, ZC.x, 1870, 0.88], [540, ZC.x, 1870, 0.88],
    [550, 3330, 1690, 1.55], [572, 3330, 1690, 1.55], // el muro corta la sincro
    [584, ZC.x, 1870, 0.88], [624, ZC.x, 1870, 0.88],
    [634, 3288, 2140, 1.6], [664, 3288, 2140, 1.6], // la corrida del servidor pasa los 2:00
    [676, ZC.x, 1870, 0.88], [716, ZC.x, 1870, 0.88],
    [730, 2080, 1900, 0.5], [744, ZD.x, 1880, 0.88], [858, ZD.x, 1880, 0.88],
    [866, 1600, 1740, 1.5], [904, 1600, 1740, 1.5], // se encienden los interruptores
    [912, 1640, 1960, 1.25], [926, 1640, 1960, 1.25],
    [940, ZD.x, 2550, 0.5], [954, 630, 3180, 0.88], [1000, 630, 3180, 0.88],
    [1010, 760, 3270, 1.35], [1042, 760, 3270, 1.35], // detalle del movimiento
    [1060, 1500, 3200, 0.95], [1086, 1500, 3200, 0.95],
    [1098, 1800, 3220, 0.95], [1116, 1800, 3220, 0.95],
    [1126, PHONE.x + 190, PHONE.y + 390, 1.3], [1166, PHONE.x + 190, PHONE.y + 390, 1.3], // ARCA en el teléfono
  ];
  return ks.map(([f, x, y, scale]) => ({ f, x, y, scale }));
};

/**
 * Cámara de vertical y cuadrado: los mismos momentos (mismos cuadros) sobre el mundo apilado. Las vistas generales encuadran cada zona entera
 * (en cuadrado, la zona A y la D muestran solo la franja donde pasa la acción) y los acercamientos caen sobre lo que cambia.
 */
const clavesApiladas = (t: ReturnType<typeof useTheme>, g: Geo, W: number, H: number): CameraKey[] => {
  const { EW, SW, ZB, ZC, ZD, CFG, SE, PDF, PHONE, cajaC } = g;
  const v = g.formato === "vertical";
  const R = v ? 250 : 215; // franja del titular
  const lejos = v ? 0.45 : 0.4; // escala de los vuelos entre zonas
  const b = medidasB(t, g);
  const k = (f: number, x: number, y: number, scale: number): CameraKey => ({ f, x: Math.round(x), y: Math.round(y), scale: +scale.toFixed(3) });
  const kk = (f: number, e: { x: number; y: number; s: number }): CameraKey => k(f, e.x, e.y, e.s);
  // zona A: en vertical toda la pila (ERP, módulo y tienda); en cuadrado la franja entre las filas del ERP y los productos de la tienda
  const overA = v ? encuadre({ x: EW.x, y: EW.y, w: EW.w, h: SW.y + SW.h - EW.y }, W, H, { top: R, max: 1 }) : { x: g.HUB.x, y: 905, s: 0.72 };
  // la letra del ERP (12 a 15 px) y de la tienda (13 a 18 px) se lee a partir de 1,5: el acercamiento recorta los costados y deja entera la parte que cambia
  const precio = { x: EW.x + 500, y: EW.y + 250, s: 1.6 };
  const tienda = { x: SW.x + 380, y: SW.y + 300, s: 1.5 };
  const pedido = { x: EW.x + 560, y: EW.y + EW.h - 90, s: 1.6 };
  // zona B: la grilla de semanas entera; el acercamiento va a las últimas (filas de abajo)
  const overB = encuadre({ x: ZB.x - b.ancho / 2, y: b.top, w: b.ancho, h: b.bottom - b.top }, W, H, { top: R, max: 0.98 });
  const ultimas = [3, 4].map((w) => b.pos[w]!);
  const topUlt = Math.min(...ultimas.map((p) => p.base)) - 5 * (b.chipH + b.chipGap);
  const zonaUlt = v
    ? overB // en vertical la grilla ya llena el ancho: no hay acercamiento que valga
    : encuadre({ x: Math.min(...ultimas.map((p) => p.x)), y: topUlt, w: 2 * b.colW + b.gap, h: b.bottom - topUlt }, W, H, { top: 70, max: 1.45 });
  // zona C: las dos cajas; el acercamiento va a cada caja
  const cajasC = encuadre({ x: cajaC.x, y: cajaC.top, w: cajaC.w, h: cajaC.bot + cajaC.h - cajaC.top }, W, H, { top: R });
  const zC = v ? 1.2 : 1.25;
  const muro = { x: cajaC.x + cajaC.w / 2, y: cajaC.top + 262, s: zC };
  const srv = { x: cajaC.x + cajaC.w / 2, y: cajaC.bot + 262, s: zC };
  // zona D: tarjetas arriba y pantalla de configuración abajo (en cuadrado la cámara baja de una a otra mientras se funden)
  const cw = 390;
  const tarj = encuadre({ x: ZD.x - cw - 20, y: g.tarjeta(0, cw).y, w: 2 * cw + 40, h: 650 }, W, H, { top: R, max: 1.15 });
  const ventana = encuadre({ x: CFG.x, y: CFG.y, w: CFG.w, h: CFG.h }, W, H, { top: R, max: 1.15 });
  const overD = v ? encuadre({ x: CFG.x, y: ZD.y - 800, w: CFG.w, h: CFG.y + CFG.h - (ZD.y - 800) }, W, H, { top: R, max: 1 }) : null;
  const zD = v ? 1.35 : 1.3;
  const interr = { x: CFG.x + CFG.w / 2, y: CFG.y + 334, s: zD };
  const guardar = { x: CFG.x + CFG.w / 2, y: CFG.y + 600, s: zD };
  // zona E: la cuenta corriente, y debajo la factura con el teléfono
  const cuenta = encuadre({ x: SE.x, y: SE.y, w: SE.w, h: SE.h }, W, H, { top: R });
  const detalle = v ? { x: SE.x + SE.w / 2, y: SE.y + 560, s: 1.1 } : { x: SE.x + SE.w / 2, y: SE.y + 600, s: 1.08 };
  const fila = encuadre({ x: PDF.x, y: PDF.y, w: PHONE.x + PHONE.w - PDF.x, h: PDF.h }, W, H, { top: R });
  const telefono = { x: PHONE.x + PHONE.w / 2, y: PHONE.y + 390, s: v ? 1.75 : 1.2 };
  const ks: CameraKey[] = [
    kk(0, overA), kk(28, overA),
    kk(40, precio), kk(62, precio), // el precio cambia en el ERP
    kk(76, tienda), kk(104, tienda), // y llega a la tienda
    kk(118, overA), kk(184, overA),
    kk(198, pedido), kk(228, pedido), // el pedido de la web llega al ERP
    k(242, (EW.x + EW.w / 2 + ZB.x) / 2, 900, lejos), kk(258, overB), kk(384, overB),
    kk(396, zonaUlt), kk(434, zonaUlt), // una semana entera de arreglos y mejoras
    kk(446, overB), k(460, ZB.x, (b.bottom + cajaC.top) / 2, lejos), kk(474, cajasC), kk(540, cajasC),
    kk(550, muro), kk(572, muro), // el muro corta la sincro
    kk(584, cajasC), kk(624, cajasC),
    kk(634, srv), kk(664, srv), // la corrida del servidor pasa los 2:00
    kk(676, cajasC), kk(716, cajasC),
    k(730, (ZC.x + ZD.x) / 2, ZC.y, lejos),
    ...(v ? [kk(744, overD!), kk(858, overD!)] : [kk(744, tarj), kk(782, tarj), kk(858, ventana)]),
    kk(866, interr), kk(904, interr), // se encienden los interruptores
    kk(912, guardar), kk(926, guardar),
    k(940, (ZD.x + SE.x + SE.w / 2) / 2, (ZD.y + CFG.h + SE.y) / 2, lejos), kk(954, cuenta), kk(1000, cuenta),
    kk(1010, detalle), kk(1042, detalle), // detalle del movimiento
    kk(1060, fila), kk(1086, fila),
    kk(1098, fila), kk(1116, fila),
    kk(1126, telefono), kk(1166, telefono), // ARCA en el teléfono
  ];
  return ks;
};

const claves = (t: ReturnType<typeof useTheme>, g: Geo, W: number, H: number): CameraKey[] => (g.apilada ? clavesApiladas(t, g, W, H) : clavesHorizontal(t, g));

/** Inclinación del plano por tramos (grados; el original la tenía en cuadros clave) y el vaivén lento que se le sumaba. */
const TT = [0, 226, 258, 474, 744, 954, 1080, 1124, 1166];
const RX = [5, 3, 4, 3, 4, 3, 2, 3, 0];
const RY = [-8, 3, -5, 4, -5, 4, -3, 3, 0];

const useCamera = (f: number, g: Geo, W: number, H: number) => {
  const t = useTheme();
  const keys = claves(t, g, W, H);
  // sin inclinación por velocidad: la del original es solo la de los cuadros clave, que el design system escala (`motion.cameraTilt`)
  const c = useCameraAt(f, keys, {
    tiltGain: 0,
    map: (fr, cam) => zoomThrough(fr, T.through, cam, { x: g.PHONE.x + 190, y: g.PHONE.y + 300 }, 40),
    noBlurFrom: T.through[0],
  });
  const tk = (cameraOptions(t).tiltGain ?? 0.05) / 0.05;
  return { ...c, rx: (kf(f, TT, RX) * tk), ry: (kf(f, TT, RY) + Math.sin(f / 40) * 1.2) * tk };
};

export function SceneBody() {
  const f = useFrame();
  const { width, height } = useFormat();
  const g = useGeo();
  const { CFG, SE, QR, PHONE, cajaC } = g;
  const topic = useTopic({ name: "Módulo Sincro Presta", line: "la tienda y el ERP, siempre sincronizados", index: 1 });
  const cam = useCamera(f, g, width, height);
  const zoomIn = Math.max(0, Math.min(1, (cam.scale - 1.05) / 0.4));
  const cfgCursor = (i: number) => interruptor(i, g);
  // centro del carril de la caja (la barra) y medidas de los garabatos de la zona C
  const barY = (y0: number) => y0 + (cajaC.v ? 328 : 198);
  const muroX = cajaC.x + cajaC.trackX + cajaC.trackW * cajaC.limite;
  const nolimX = cajaC.x + cajaC.trackX + cajaC.trackW * 0.48;
  const dm = cajaC.v ? { rx: 70, ry: 100, rx2: 80 } : { rx: 64, ry: 84, rx2: 72 };
  return (
    <>
      <World camera={cam} width={width} height={height} perspective={2400}>
        {/* el mundo es mucho más grande que el cuadro y la cámara lo recorre: lo que queda cortado por el borde no está a la vista */}
        <ZoomCtx.Provider value={cam.scale}>
          {enVentana(f, VIS.A) && <ZonaA f={f} />}
          {enVentana(f, VIS.B) && <ZonaB f={f} />}
          {enVentana(f, VIS.C) && <ZonaC f={f} />}
          {enVentana(f, VIS.D) && <ZonaD f={f} />}
          {enVentana(f, VIS.E) && (
            <>
              {f <= 1132 && <Cuenta f={f} />}
              <Pdf f={f} />
              <Telefono f={f} />
            </>
          )}
        </ZoomCtx.Provider>
        {/* garabatos */}
        <DoodleCircle start={T.fail + 4} end={T.move[0]} cx={muroX} cy={barY(cajaC.top)} rx={dm.rx} ry={dm.ry} id="dc-wall" />
        {cajaC.v
          ? <DoodleArrow start={T.move[0] - 6} end={T.srv[0] + 16} x1={cajaC.x + 850} y1={g.ZC.y - 160} x2={cajaC.x + 850} y2={g.ZC.y + 100} bend={0.35} id="da-move" />
          : <DoodleArrow start={T.move[0] - 6} end={T.srv[0] + 16} x1={cajaC.x + 250} y1={g.ZC.y - 120} x2={cajaC.x + 250} y2={g.ZC.y + 150} bend={0.35} id="da-move" />}
        <DoodleCircle start={T.srv[0] + 34} end={T.srv[1] + 20} cx={nolimX} cy={barY(cajaC.bot)} rx={dm.rx2} ry={dm.ry} id="dc-nolimit" />
        <DoodleCircle start={T.click2 + 10} end={T.save + 20} cx={CFG.x + CFG.w - 130} cy={cfgCursor(3).y} rx={90} ry={34} id="dc-switch" />
        <DoodleCircle start={T.scan[0] - 10} end={T.arca + 20} cx={QR.x + QR.size / 2} cy={QR.y + QR.size / 2} rx={98} ry={98} id="dc-qr" />
        <DoodleArrow start={T.scan[0] - 8} end={T.arca + 10} x1={QR.x + QR.size + 24} y1={QR.y + 40} x2={PHONE.x - 16} y2={PHONE.y + 330} bend={-0.2} id="da-phone" />
        {/* clics: configuración del módulo (interruptores y Guardar) y cuenta corriente (detalle y descarga del PDF) */}
        <Cursor
          show={[852, 930]}
          clicks={[T.click1, T.click2, T.save]}
          keys={[
            [852, CFG.x + 500, CFG.y + 700],
            [T.click1 - 8, cfgCursor(1).x, cfgCursor(1).y],
            [T.click2 - 8, cfgCursor(3).x, cfgCursor(3).y],
            [T.save - 8, CFG.x + CFG.w - 110, CFG.y + CFG.h - 46],
            [930, CFG.x + CFG.w - 110, CFG.y + CFG.h - 46],
          ]}
        />
        <Cursor
          show={[968, 1062]}
          clicks={[T.detail, T.pdfClick]}
          keys={[
            [968, SE.x + 500, SE.y + 760],
            [T.detail - 8, SE.x + 26 + 84 + 120, g.filaMov(1)],
            [T.pdfClick - 10, SE.x + SE.w - g.detalle.w / 2, SE.y + g.detalle.top + g.detalle.descTop + DESCARGA.h / 2],
            [1062, SE.x + SE.w - g.detalle.w / 2, SE.y + g.detalle.top + g.detalle.descTop + DESCARGA.h / 2],
          ]}
        />
      </World>
      <Vignette amount={zoomIn * (1 - kf(f, [T.through[0], T.through[0] + 10], [0, 1]))} />
      <TopicHeadline title={topic.name} number={topic.index + 1} subtitle={topic.line} start={-30} hide={hideFromScale(cam.scale, 1.02, 0.02)} />
      <Wash range={[T.through[1] - 14, T.through[1]]} />
    </>
  );
}

/** Design systems con nombre para probar la escena con otro: `--props '{"theme":"editorial"}'` (también "neon", "papel", "dark", "neutral"; "marca" es el del video). */
const NOMBRADOS = { marca, neutral, dark, editorial, neon, papel };

/** Escena sola (fuera de la historia): el design system de la marca (o el pedido por nombre) y sus nubes. */
export const SceneVideo: React.FC<{ theme?: keyof typeof NOMBRADOS }> = ({ theme }) => (
  <ThemeProvider theme={theme ? NOMBRADOS[theme] : marca}>
    <Stage>
      <SceneBody />
    </Stage>
  </ThemeProvider>
);
