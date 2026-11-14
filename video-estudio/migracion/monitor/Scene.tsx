// Sincro Monitor, migrada desde video/src/scenes/SincroMonitorDemo.tsx (Remotion). Tres herramientas recreadas en un mismo mundo, con la cámara
// recorriéndolas: el panel de monitoreo en el centro, el chat del equipo a la IZQUIERDA y la mesa de ayuda a la DERECHA.
// Un punto por tienda se junta en la dona; el filtro "Error en servidor" deja 4 filas; la fila se abre con el log y el botón "Crear ticket"
// manda un ticket volando a la derecha (a la mesa). De vuelta en el panel, el aviso cae de la campana, se pliega en una campanita y vuela a la
// izquierda, al chat, donde se arma la tarjeta con el incidente y los arreglos por aprobar. Después la cámara vuelve a la derecha, abre el
// ticket y se escribe y envía la respuesta. Lo que sale hacia un lado vuelve por el mismo eje. 1440 cuadros a 30 fps, sin narración.
// Cifras emuladas y nombres ficticios. Cada herramienta tiene su design system anidado (`temas.ts`); la escena no decide estética: la cámara,
// el titular, los garabatos, el cursor, el velo y las entradas salen del design system de la marca por las piezas del kit.
import React from "react";
import { Easing, useFormat, useFrame } from "video-estudio/engine";
import { Cursor, DoodleCircle, Stage, Wash, World, headlineStrip, hideFromScale, kf, useCameraAt, zoomThrough, cameraKeepClear } from "video-estudio/kit";
import type { CameraKey } from "video-estudio/kit";
import { TopicHeadline, useTopic } from "video-estudio/stories";
import { ThemeProvider, dark, editorial, neon, neutral, papel, useTheme } from "video-estudio/themes";
import { theme as marca } from "../theme";
import { Aviso } from "./Aviso";
import { ChatWindow } from "./Chat";
import { MesaDeAyuda } from "./Mesa";
import { DotField, MonitorPanel } from "./Panel";
import { BTN, CH, CW, DURACION, ED, KEYS, MESA, T, TABLE, TEAMS, TEAMS_CX, TICKET, TILT_F, TILT_RX, TILT_RY, TVX, chipX, firstRowY, CHIP, FOCUS_STATUS } from "./mundo";

export { DURACION };

const OUT = Easing.out;
const TT = T.teams;

/** Claves del original; las de vista general (escala 1, titular a la vista) se corren lo mínimo para que el sujeto quede bajo la franja del titular. */
const clearKeys = (strip: { x: number; y: number; w: number; h: number }, width: number, height: number): CameraKey[] => {
  const panel = { x: 0, y: 0, w: CW, h: 880 }; // el panel sin su margen inferior
  const mesa = { x: MESA.x, y: MESA.y, w: MESA.w, h: MESA.h };
  const subject: Record<number, typeof panel> = { 160: panel, 190: panel, 630: panel, 644: panel, 546: mesa, 560: mesa, 1092: mesa, 1140: mesa, 1150: mesa, 1292: mesa, 1320: mesa };
  return KEYS.map((k) => {
    const s = subject[k.f];
    if (!s) return k;
    const c = cameraKeepClear(k, s, { strip, format: { width, height }, margin: 10 });
    return { f: k.f, x: c.fits ? c.x : k.x, y: c.fits ? c.y : k.y, scale: k.scale };
  });
};

export function SceneBody() {
  const f = useFrame();
  const t = useTheme();
  const { width, height } = useFormat();
  const topic = useTopic({ name: "Sincro Monitor", line: "avisa antes de que el cliente reclame", index: 2 });
  const strip = headlineStrip(t, { width, height });
  const keys = clearKeys(strip, width, height);
  // la cámara recorre el mismo camino del original; la inclinación en reposo (al llegar de la apertura y al seguir al ticket) se suma a la de la velocidad
  const c = useCameraAt(f, keys, {
    maxTilt: 9,
    map: (fr, cam) => zoomThrough(fr, T.through, cam, { x: ED.x + 330, y: ED.y + 70 }, 60),
    noBlurFrom: T.through[0],
  });
  const cam = { ...c, rx: c.rx + kf(f, TILT_F, TILT_RX), ry: c.ry + kf(f, TILT_F, TILT_RY) };
  const filterOn = kf(f, [T.filterClick + 4, T.filterClick + 32], [0, 1], OUT);
  const chip = { x: chipX(FOCUS_STATUS) + CHIP.w[FOCUS_STATUS]! / 2, y: CHIP.y + CHIP.h / 2 };
  const row = { x: TABLE.x + 420, y: firstRowY };
  // el titular se aparta con el zoom y mientras la cámara está en el chat
  // la ventana donde está el foco de la cámara es el sujeto; las otras asoman por el borde a propósito (el control no las juzga por "fuera del cuadro")
  const within = (r: { x: number; y: number; w: number; h: number }) => cam.x >= r.x && cam.x <= r.x + r.w && cam.y >= r.y && cam.y <= r.y + r.h;
  const hide = Math.max(hideFromScale(cam.scale, 1, 0.08), kf(f, [744, 770, 1050, 1070], [0, 1, 1, 0]));
  return (
    <>
      <World camera={cam} width={width} height={height} perspective={2400}>
        <MonitorPanel filterOn={filterOn} peek={!within({ x: 0, y: 0, w: CW, h: CH })} />
        <Cursor
          show={[182, 490]}
          clicks={[T.filterClick, T.rowClick, T.ticketClick]}
          keys={[[182, 1250, 880], [214, chip.x, chip.y], [262, chip.x, chip.y], [296, row.x, row.y], [404, row.x, row.y], [T.ticketClick - 4, BTN.x, BTN.y], [470, BTN.x, BTN.y], [500, BTN.x + 300, BTN.y + 200]]}
        />
        <MesaDeAyuda peek={!within(MESA)} />
        <ChatWindow peek={!within(TEAMS)} />
        <Aviso />
        {/* los arreglos por aprobar: el círculo los agrupa */}
        <DoodleCircle id="dc-fixes" start={TT.hi[0] + 4} end={1046} cx={TEAMS_CX + 20} cy={TEAMS.y + 810} rx={440} ry={100} />
        <Cursor
          show={[1094, 1296]}
          clicks={[T.openRow, T.responder, T.send]}
          keys={[[1094, 2700, 700], [T.openRow - 8, 2420, 381], [T.responder - 10, TVX + 720 - 60, 508], [T.typeFrom, TVX + 720 - 60, 508], [T.send - 10, ED.x + ED.w - 70, ED.y + 220 - 26], [1296, 2700, 800]]}
        />
      </World>
      <DotField s={cam.scale} />
      <TopicHeadline title={topic.name} number={topic.index + 1} subtitle={topic.line} start={150} hide={hide} />
      <Wash range={[T.through[1] - 14, T.through[1]]} />
    </>
  );
}

/** Design systems con nombre para probar la escena con otro (`--props '{"theme":"editorial"}'`, también neon, papel, dark, neutral): cambia lo de afuera de las herramientas. */
const NOMBRADOS = { neutral, dark, editorial, neon, papel };

/** Escena sola (fuera de la historia): tema de marca (o el que se pida por nombre) y las nubes del original. */
export const SceneVideo: React.FC<{ theme?: keyof typeof NOMBRADOS }> = ({ theme }) => (
  <ThemeProvider theme={theme ? NOMBRADOS[theme] : marca}>
    <Stage>
      <SceneBody />
    </Stage>
  </ThemeProvider>
);
