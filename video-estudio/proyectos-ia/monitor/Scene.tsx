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
import { Cursor, Stage, Wash, World, cameraView, headlineStrip, hideFromScale, kf, useCameraAt, zoomThrough, cameraKeepClear } from "video-estudio/kit";
import type { CameraKey } from "video-estudio/kit";
import { TopicHeadline, useTopic } from "video-estudio/stories";
import { ThemeProvider, dark, editorial, neon, neutral, papel, useTheme } from "video-estudio/themes";
import { temaVideo as marca } from "../extension";
import { Aviso } from "./Aviso";
import { ChatWindow } from "./Chat";
import { MesaDeAyuda } from "./Mesa";
import { DotField, MonitorPanel } from "./Panel";
import { ChatWindowV } from "./ChatV";
import { MesaDeAyudaV } from "./MesaV";
import { DotFieldV, MonitorPanelV } from "./PanelV";
import { BTNV, CHV, ENVIAR_V, EDV, MEV, NEWCARD_V, PANEL_RECT, RESPONDER_V, chipV, enPanel, firstRowV, keysAngostas } from "./angosto";
import { BTN, CH, CW, DURACION, ED, KEYS, MESA, T, TABLE, TEAMS, TEAMS_CX, TICKET, TILT_F, TILT_RX, TILT_RY, TVX, chipX, firstRowY, CHIP, FOCUS_STATUS } from "./mundo";
import { Anillo } from "../senal";

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

function SceneBodyH() {
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
        <Anillo id="dc-fixes" start={TT.hi[0] + 4} end={1046} cx={TEAMS_CX + 20} cy={TEAMS.y + 810} rx={440} ry={100} />
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

/** Vertical y cuadrado: el mundo angosto (`angosto.ts`). Cada ventana se dibuja solo mientras la cámara la tiene a la vista (o pasa cerca): lo que
 *  queda fuera del cuadro no existe, así `qa` juzga el texto que se ve. */
function SceneBodyV() {
  const f = useFrame();
  const t = useTheme();
  const { width, height, format } = useFormat();
  const topic = useTopic({ name: "Sincro Monitor", line: "avisa antes de que el cliente reclame", index: 2 });
  const strip = headlineStrip(t, { width, height });
  // la vista de conjunto del panel (con el titular) cabe entera debajo de la franja del titular en vertical; en cuadrado se muestra la parte de arriba
  const keys = keysAngostas(format).map((k) => {
    if (format !== "vertical" || ![160, 190, 630, 644].includes(k.f)) return k;
    const c = cameraKeepClear(k, PANEL_RECT, { strip, format: { width, height }, margin: 10 });
    return c.fits ? { f: k.f, x: c.x, y: c.y, scale: k.scale } : k;
  });
  const c = useCameraAt(f, keys, {
    maxTilt: 9,
    map: (fr, cam) => zoomThrough(fr, T.through, cam, { x: EDV.x + EDV.w / 2, y: EDV.y + 70 }, 60),
    noBlurFrom: T.through[0],
  });
  // la inclinación en reposo del original se suaviza: en una ventana alta se nota más
  const cam = { ...c, rx: c.rx + kf(f, TILT_F, TILT_RX) * 0.5, ry: c.ry + kf(f, TILT_F, TILT_RY) * 0.5 };
  const filterOn = kf(f, [T.filterClick + 4, T.filterClick + 32], [0, 1], OUT);
  const view = cameraView(cam, { width, height });
  const m = 0.1; // la inclinación y el desenfoque corren un poco los bordes: se dibuja también lo que asoma un 10 % fuera de la vista
  const visible = (r: { x: number; y: number; w: number; h: number }) => r.x < view.x + view.w * (1 + m) && r.x + r.w > view.x - view.w * m && r.y < view.y + view.h * (1 + m) && r.y + r.h > view.y - view.h * m;
  // la ventana donde está el foco de la cámara es el sujeto; las vecinas que asoman por el borde se marcan (`peek`, como en horizontal)
  const within = (r: { x: number; y: number; w: number; h: number }) => cam.x >= r.x && cam.x <= r.x + r.w && cam.y >= r.y && cam.y <= r.y + r.h;
  const peek = (r: { x: number; y: number; w: number; h: number }) => !within(r);
  // cuadrado: en la vista final con las tres ventanas juntas (escala 0,4) la ventana del chat sube hasta la franja del titular: este se aparta
  const hide = Math.max(hideFromScale(cam.scale, 1, 0.08), kf(f, [744, 770, 1050, 1070], [0, 1, 1, 0]), format === "cuadrado" ? kf(f, [1336, 1352], [0, 1]) : 0);
  return (
    <>
      <World camera={cam} width={width} height={height} perspective={2400}>
        {/* cada ventana tiene su lugar fijo entre los hijos (aunque no se dibuje): `qa` identifica un texto entre cuadros por su ruta */}
        {/* entre los cuadros 736 y 800 la cámara hace el latigazo del panel a la campanita: el panel sale por el borde izquierdo a propósito, aunque el foco todavía esté sobre él */}
        <div>{visible(PANEL_RECT) && <MonitorPanelV filterOn={filterOn} peek={peek(PANEL_RECT) || (f >= 736 && f <= 800)} />}</div>
        <Cursor
          show={[182, 490]}
          clicks={[T.filterClick, T.rowClick, T.ticketClick]}
          keys={[[182, enPanel(600, 760).x, enPanel(600, 760).y], [214, chipV(1).x, chipV(1).y], [262, chipV(1).x, chipV(1).y], [296, firstRowV.x, firstRowV.y], [404, firstRowV.x, firstRowV.y], [T.ticketClick - 4, BTNV.x, BTNV.y], [470, BTNV.x, BTNV.y], [500, BTNV.x + 200, BTNV.y + 120]]}
        />
        <div>{visible(MEV) && <MesaDeAyudaV peek={peek(MEV)} />}</div>
        <div>{visible(CHV) && <ChatWindowV peek={peek(CHV)} />}</div>
        <Aviso />
        {/* los arreglos por aprobar: el círculo los agrupa */}
        <Anillo id="dc-fixes" start={TT.hi[0] + 4} end={1046} cx={CHV.x + CHV.w / 2} cy={CHV.y + 917} rx={385} ry={112} />
        <Cursor
          show={[1094, 1296]}
          clicks={[T.openRow, T.responder, T.send]}
          keys={[[1094, MEV.x + MEV.w + 40, NEWCARD_V.y + 140], [T.openRow - 8, NEWCARD_V.x, NEWCARD_V.y], [T.responder - 10, RESPONDER_V.x, RESPONDER_V.y], [T.typeFrom, RESPONDER_V.x, RESPONDER_V.y], [T.send - 10, ENVIAR_V.x, ENVIAR_V.y], [1296, MEV.x + MEV.w + 40, ENVIAR_V.y + 80]]}
        />
      </World>
      <DotFieldV s={cam.scale} />
      <TopicHeadline title={topic.name} number={topic.index + 1} subtitle={topic.line} start={150} hide={hide} />
      <Wash range={[T.through[1] - 14, T.through[1]]} />
    </>
  );
}

export function SceneBody() {
  return useFormat().format === "horizontal" ? <SceneBodyH /> : <SceneBodyV />;
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
