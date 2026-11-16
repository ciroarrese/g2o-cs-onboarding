# Sincro monitor: guion de cuadros (migración a video-estudio)

Escena sin narración, 1440 cuadros a 30 fps (48 s), tema 3 de 4 de la historia. Se cuenta con la herramienta misma (sus rótulos), los datos y el movimiento. Cifras emuladas, tiendas con dominios de ejemplo, tickets del rango 48190 a 48213, empresas "Tienda NN" y equipo "Soporte sincro". Tres herramientas recreadas en un mismo mundo: el panel en el centro (x 0 a 1640), el **chat del equipo a la izquierda** (x -1180 a -240) y la **mesa de ayuda a la derecha** (x 1800 a 3120). Lo que sale hacia un lado vuelve por el mismo eje.

Cámara: foco (x, y) y escala. Titular "03 Sincro Monitor" desde el cuadro 150; se aparta con el zoom (escala mayor que 1,08) y mientras la cámara está en el chat (744 a 1070).

| Cuadros | Qué pasa | Cámara | Qué tiene que leer quien mira |
|---|---|---|---|
| 0 a 112 | Una nube de puntos (uno por tienda, 280) aparece en una cuadrícula, los puntos se encienden por estado (OK, error en servidor, error sincro, advertencia, sin datos) y se juntan en el aro de una dona | sobre la dona, escala 2,4, quieta | cada punto es una tienda y el color es el estado |
| 100 a 150 | La dona se dibuja con "280 tiendas" al centro; el panel "Sincro Monitor" se arma por capas (ventana, encabezado, filtros, cifras que cuentan, tabla) | vuelo a la vista general (160 a 190: foco 820, 410, escala 1; inclinación de 12 y -10 grados que se asienta) | el panel completo, con datos, bajo el titular |
| 150 | Entra el titular "03 Sincro Monitor · avisa antes de que el cliente reclame" | | de qué tema es |
| 190 a 270 | Acercamiento suave a los filtros y las cifras | foco 760, 400, escala 1,12 | los cuatro filtros de estado y las cinco cifras |
| 182 a 218 | Entra el cursor y viaja al filtro "Error en servidor"; **clic en 218** | | la acción: filtrar por error en servidor |
| 218 a 250 | El filtro se enciende, "Mostrando 63 tiendas" (era 280), las cifras de los otros estados se atenúan, la dona destaca el sector de 61 y muestra "61 error en servidor", la tabla deja 4 filas | | que el filtro dejó 61 tiendas con problema de servidor |
| 262 a 300 | El cursor baja a la fila de tienda-07; **clic en 300** | acercamiento a la tabla (305 a 470: foco 1060, 545, escala 1,4) | la fila elegida |
| 305 a 395 | La fila se abre: "Error del log" (terminal con 3 renglones que se escriben: job, "Timeout: la tienda no respondió en 120 s", "Reintento programado") y "Últimas etapas ejecutadas" (4 tildes verdes y una cruz roja en "Sincronizando productos") | quieta | qué falló y en qué etapa |
| 395 a 440 | Aparece el botón "Crear ticket"; el cursor va; **clic en 440** | | la acción que crea el ticket |
| 440 a 466 | El botón gira ("Creando…") y queda "Ticket #48213" con tilde verde | | el ticket quedó creado |
| 468 a 504 | Entra la mesa de ayuda (vista "No asignados", 4 tickets) desde la derecha | | |
| 480 a 546 | El ticket sale del botón, crece hasta el ancho de una fila y **vuela a la derecha con arco** hasta la primera fila de la mesa | la cámara lo sigue: foco 1700, 470, escala 0,7 y llega a 2460, 420, escala 1 | el ticket del monitor aterriza en la mesa |
| 546 a 600 | Aterriza arriba como "Error en servidor", prioridad Alta; los contadores pasan de 4 a 5; destello diagonal | acercamiento a la fila nueva: foco 2400, 350, escala 1,55 | la mesa ahora tiene 5 tickets y el nuevo es el del monitor |
| 600 a 644 | Vuelta de latigazo al panel | foco 820, 410, escala 1 | |
| 642 | **Alerta**: la campana del encabezado suena con un globo "1" y cae el aviso "Nuevo incidente · prioridad alta · tienda-07 · Error en servidor · Avisando al equipo en Teams…" (el texto de las tarjetas que cubre se apaga) | foco 1340, 220, escala 1,7 | el monitor avisa solo |
| 700 a 730 | El aviso se pliega en una campanita redonda | | |
| 732 a 790 | La campanita **vuela a la izquierda** con estela y arco, hasta el chat del equipo; al llegar suelta dos ondas | la cámara la sigue: 300, 260, escala 0,7 y llega al chat, escala 0,98 | el aviso viaja hacia el chat, a la izquierda del panel |
| 744 a 796 | Entra la ventana "Sincro Presta Monitor" (chat, rótulo "Teams · chat del equipo"); el avatar late; indicador de escritura | quieta en el chat | |
| 818 a 1010 | Se arma la tarjeta "Sincro Monitor · novedades": resumen (sitios afectados 3, incidentes abiertos 6, prioridad alta 1, arreglos por aprobar 3, resueltos 0, más antiguo), "A. Incidentes abiertos" con tienda-07 (el mismo del ticket) y "B. Arreglos por aprobar" con 3 arreglos que se iluminan de a uno | quieta; a 1012 se acerca a los arreglos (escala 1,45) | el detalle del problema y las posibles soluciones |
| 978 a 1046 | Garabato rodea los arreglos por aprobar | | las posibles soluciones |
| 1068 a 1092 | Vuelo a la derecha, a la mesa | foco 900, 420, escala 0,4 y llega a 2460, 420 | |
| 1092 a 1118 | El cursor baja a la fila nueva; **clic en 1112**; el ticket crece desde su fila hasta cubrir la ventana | acercamiento a 2400, 381, escala 1,3 | |
| 1118 a 1150 | Ticket abierto: mensaje inicial del monitor (timeout, arreglo sugerido), columna derecha (empresa asociada, participantes, categorización, SLA); botón "Responder" (**clic en 1144**) | foco 2460, 460, escala 1 | |
| 1144 a 1260 | Se abre el editor y se escribe la respuesta, letra por letra | acercamiento al editor (escala 1,6) | la respuesta al cliente |
| 1262 a 1290 | **Clic en "Enviar" (1272)**: el editor se reemplaza por la respuesta enviada, "Enviado" con tilde; el estado pasa a "Esperando al cliente" | vuelve a escala 1 | el ticket quedó respondido |
| 1320 a 1404 | Vista general de las tres ventanas, de izquierda a derecha (chat, panel, mesa) | foco 970, 440, escala 0,43 | toda la historia en una imagen |
| 1404 a 1440 | Se atraviesa la respuesta enviada y entra el velo hacia la escena siguiente | `zoomThrough` a la respuesta, `Wash` de 1426 a 1440 | |

## Qué toma de cada pieza del toolkit

- Cámara: `useCameraAt` con la misma ruta del original (claves en `mundo.ts`); las claves de vista general que dejaban el panel bajo el titular se corrieron con `cameraKeepClear`. La inclinación en reposo del original se suma a la de la velocidad.
- Titular: `TopicHeadline` con `title`, `number` y la línea del tema (sola o dentro de la historia).
- Cursor: `Cursor` (dos recorridos); garabato: `DoodleCircle`; velo y atravesado: `Wash` y `zoomThrough`.
- Vuelos con estela: `FlyingCard` (la campanita al chat y el ticket a la mesa).
- Texto que se escribe: `Typewriter` (la respuesta); terminal del log: `typed`.
- Contadores: `CountUp`.
- Cada herramienta, en su design system anidado (`temas.ts`) con `ThemeScope` y `data-qa-fixed-scale`.
