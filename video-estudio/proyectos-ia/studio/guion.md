# Video Studio: guion de la escena (1050 cuadros, 30 fps, tema 05)

Rompe la cuarta pared: el video que se está viendo también lo armó un agente con esta herramienta. Viene justo después de Health Score, sin volver al listado.
Todo es ficticio. No se nombra ninguna marca ni modelo: el autor es "un agente". El producto se llama "Video Studio".

Empalme: el cuadro 0 es la escena real de Health Score congelada en su cuadro 1032 (cámara quieta y alejada, tablero y ventana de transiciones enteros, titular "04 Health Score" puesto). El orquestador corta Health en ese cuadro (sirve cualquiera entre 1020 y 1043) y esta escena sigue sin salto. El titular de esta escena ("05 Video Studio") entra recién cuando el estudio ya se ve (cuadro 90).

| Cuadros | Parte | Qué pasa | Texto en pantalla |
|---|---|---|---|
| 0 a 96 | La ruptura | La imagen a pantalla completa es la vista previa de una ventana: la cámara se aleja (de escala 2,4 a 1) y aparece el estudio: monitor en el medio, línea de tiempo abajo con Apertura, 01, 02, 03 y 04 (miniaturas reales) y el cabezal parado casi al final del 04. Golpe suave en el 84 | "Este video también lo armó un agente" (76 a 184) |
| 180 a 450 | De qué sale | Tres tarjetas entran desde la izquierda (Capturas, Design system, Guion) y vuelan a la vista previa, que se enciende cuando llega cada una. A la derecha, el agente pregunta y la persona responde; cuatro etapas se llenan: Cuestionario, Guion, Escenas, Controles | "Contexto + design system" (190), "Paso a paso, con aprobación" (324) |
| 450 a 780 | Versatilidad | La vista previa crece y muestra una pieza que sí sigue al design system (título con palabra resaltada, lista de temas, gráfico y aviso). Cambia en vivo, con un fundido corto, a marca, editorial, neón y papel (60 cuadros cada uno; un rótulo nombra el actual). Después la caja cambia de forma: horizontal, vertical (690) y cuadrado (735), y el contenido se vuelve a maquetar | "Mismo video, otro design system" (454), "5 sistemas de diseño" (566), "3 formatos" (698) |
| 780 a 1050 | Caja de herramientas | La cámara se abre a un muro de 12 efectos del catálogo corriendo a la vez; el contador rueda hasta 50 "efectos y animaciones" (golpe suave en el 890); tres controles se tildan uno tras otro (tilde en 940, 974 y 1008); franja de onda con marcas de compás y marcadores de sonido, "Música al compás". El muro queda sostenido unos 16 cuadros y un velo cierra la escena (1034 a 1048) | "efectos y animaciones", "Mismo resultado en cada render", "Calidad", "Privacidad", "Música al compás" |

Cifras reales (verificadas): 50 efectos y animaciones (filas de las tablas de `docs/animaciones.md`: 8 texto + 16 3D + 6 datos + 9 interfaz + 11 arte); 5 sistemas de diseño (neutral, dark, editorial, neon, papel); 3 formatos (horizontal, vertical, cuadrado). El gráfico de ejemplo no muestra valores y el anillo de la baldosa dice 5 (los sistemas). No hay otras cifras.

Qué muestra la vista previa en la tercera parte: no es Health Score (es una herramienta oscura con su propio sistema anidado y no cambiaría): es una pieza propia con el título del video, la lista de temas del propio video (con su numeración), un gráfico de barras sin valores y un aviso, armada con las ayudas del design system. Cada formato es el real: la caja se monta con un `FrameProvider` de ese formato y la pieza lee `useFormat()`.

Muro (12 baldosas): MaskedRise, Globe, ParticleSphere, CardFlip, BarsGrow, OrbitRings, DonutRing, NotificationStack, ChatThread, TileGrid, MarkerDraw, ScrambleDecode.

Sonido (`cues.json`): sin barrido; golpe suave en la frase (84) y en el aterrizaje del 50 (890); tilde en cada uno de los tres controles (940, 974, 1008). No hay cursor ni clic.
