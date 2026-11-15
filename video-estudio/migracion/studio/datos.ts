// Constantes de la escena Video Studio (tema 05): tiempos, cajas del estudio y datos ficticios. Una sola tabla para que el guion y el código se lean juntos.
export const DURACION = 1050;

/** Cuadro de Health Score (de su propia línea de tiempo) con el que arranca esta escena: la cámara de Health ya está quieta y alejada
 *  (claves 1020 a 1044), el tablero y la ventana de transiciones se leen enteros y el titular "04 Health Score" está puesto. El orquestador
 *  corta Health en este cuadro (cualquiera entre 1020 y 1043 da la misma imagen) y la escena sigue sin salto. */
export const HEALTH_FRAME = 1032;

export const T = {
  pull: [6, 96] as [number, number], // la cámara se aleja del cuadro completo hasta ver el estudio
  headline: 90,
  b2: 180,
  b3: 450,
  b4: 780,
  travel: [780, 850] as [number, number],
  wash: [1034, 1048] as [number, number],
};

/** Mundo: el estudio ocupa el lienzo de 1920x1080 y el muro de efectos está a la derecha, a `WALL_X`. */
export const WALL_X = 2300;

/** Ventana del estudio y vista previa (coordenadas del mundo). */
export const WIN = { x: 60, y: 262, w: 1800, h: 786, bar: 52 };
// 1008x567 es 16:9 (56 % del ancho de la ventana): a escala 1920/1008 llena el cuadro en el cuadro 0, igual que Health Score a pantalla completa.
export const PREVIEW = { cx: 960, w: 1008, h: 567, top: 330, pad: 10 };

/** Lo que se ve en la vista previa en la tercera parte: 4 sistemas de diseño (cada uno entra en `at` y su contenido arranca en `from`) y 3 formatos. */
export const SISTEMAS = [
  { id: "marca", label: "marca", at: 446 },
  { id: "editorial", label: "editorial", at: 506 },
  { id: "neon", label: "neón", at: 566 },
  { id: "papel", label: "papel", at: 626 },
] as const;
export const FORMATOS = [
  { id: "horizontal", at: 626 },
  { id: "vertical", at: 690 },
  { id: "cuadrado", at: 735 },
] as const;
/** Los 5 design systems de ejemplo del toolkit (`themes/`). */
export const CINCO = ["neutral", "dark", "editorial", "neon", "papel"] as const;
/** Efectos y animaciones del catálogo (filas de las tablas de docs/animaciones.md: 8 + 16 + 6 + 9 + 11). */
export const EFECTOS = 50;

export const BLOQUES = [
  { id: "apertura", label: "Apertura", w: 150 },
  { id: "01", label: "01", w: 280 },
  { id: "02", label: "02", w: 400 },
  { id: "03", label: "03", w: 480 },
  { id: "04", label: "04", w: 360 },
] as const;
