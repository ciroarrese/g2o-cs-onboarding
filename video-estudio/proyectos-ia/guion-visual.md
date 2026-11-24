# Proyectos con IA: guion visual con el sistema de Grow2on

Texto, datos y orden de los temas son los aprobados (versión `migracion`). Esta nota fija solo el sistema visual (`docs/guia-escenas.md`, sección 16).

## Recursos de señalamiento y movimiento

- Carácter del design system: geométrico y sobrio, de marca vistosa (píldoras, rosa y naranja, nubes tenues).
- Señal: anillo rosa de `annotation.mark: "ring"` con `Callout`, sin rótulo (`Anillo` en `senal.tsx` es un envoltorio de `Callout` que conserva las coordenadas de los garabatos viejos). Sin excepciones forzadas con `variant`.
- Énfasis de palabras: degradado rosa a naranja (`type.highlight: gradient`) con `Highlight`; el degradado solo en el título de la intro y del cierre, en números destacados y en la palabra resaltada del título.
- Transición entre escenas: `wash` (velo) y salida de cámara `settle`; la intro termina en blanco y la apertura entra con un velo del color del fondo.
- Efectos que se usan: entradas que suben (`entrance: rise`, `sube`), píldoras con rebote corto (`Pildora`, `salta`), curvas de `g2o/movimiento`, motas de marca (`Motas`) en la apertura, nubes de fondo del tema.
- Efectos y recursos que NO se usan: flechas (todas las `DoodleArrow` salieron; la escena se entiende sin ellas), garabatos a mano (`DoodleCircle`, `MarkerDraw` fuera de la muestra de efectos de Video Studio), viñeta, mayúsculas en rótulos de la marca, degradado en texto corrido, logo en el pie del cierre de la historia (lo pone el cierre de Grow2on).
- Piezas a adaptar: las interfaces recreadas conservan su propia paleta (tablero oscuro, panel IA, terminal): son datos de la herramienta, no de la marca. Se derivan del tema g2o en `extension.ts`.

## Estructura

Intro de Grow2on (7 s) y apertura de la historia acortada a 6 s (el listado de temas), escenas y vueltas como antes, recapitulación acortada a 9,5 s con firma vacía y cierre de Grow2on (7 s). Solo horizontal: intro y cierre del sistema no existen en vertical ni cuadrado.
