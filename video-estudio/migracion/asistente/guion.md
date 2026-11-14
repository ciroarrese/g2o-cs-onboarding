# Asistente IA: guion de la escena (840 cuadros, 30 fps, tema 01 de 4)

Un ticket de la mesa de ayuda con el panel de IA del userscript al lado. Todo lo que se ve es ficticio (empresa "Tienda 18", ticket 48190, ticket interno 48231).
La cámara es la del original: foco (x, y) y escala por cuadro clave. Las coordenadas son del mundo (1 unidad = 1 px a escala 1).

| Cuadros | Qué pasa | Cámara | Qué tiene que leer quien mira |
|---|---|---|---|
| 0 a 110 | Vista general: la mesa de ayuda con el ticket "Pedidos que no bajan al ERP"; el panel "Sugerencia IA - Ticket 48190" minimizado en el rincón de abajo a la derecha. Titular "01 Asistente IA" ya puesto. | (980, 560) a escala 0,86 con inclinación de entrada (8°, -12°) que se aplana | Dónde estamos: un ticket de soporte, y una barra oscura de IA abajo |
| 110 a 190 | El panel se levanta de la esquina, viaja a la derecha de la mesa y se abre (botones: Solo corregir, Seguir contexto, Con formato, Escalado desarrollo, Dictar; secciones CloudWatch y Reportar plegadas). La mesa se aleja un poco. | (960, 560) 0,9 a 0,88 | El panel es una herramienta aparte, pegada al ticket |
| 190 a 240 | Acercamiento al panel; aparece el cursor. Clic en Dictar (232): el botón pasa a rojo "Detener dictado", estado "Escuchando...". | (1600, 330) a 1,45 | Se empieza a dictar por voz |
| 232 a 342 | Se abre el editor de respuesta y la cámara baja a él; sobre el editor flota la pastilla de voz y el texto dictado se escribe sin puntuación ("hola cómo estás revisamos los pedidos..."). | (560, 640) a 1,4 | El dictado llega al ticket, crudo |
| 342 | Clic en Detener dictado. | vuelve al panel (1600, 300) 1,45 | Se corta el dictado |
| 384 a 414 | Clic en Con formato: garabato (círculo) sobre el botón, botones en "...", estado de carga. | panel 1,45, y desde el 392 vuelve al editor | La IA ordena el texto |
| 412 a 496 | El texto aparece formateado línea por línea (título en negrita, dos viñetas con negritas, cierre); estado "Insertado en el editor." | editor (560, 640) 1,4 | El resultado: texto limpio con estructura. Resultado clave: golpe suave en el 412 |
| 496 a 520 | La cámara se abre al panel entero. | (1560, 470) 1,2 | Hay más funciones en el panel |
| 520 a 640 | Clic en CloudWatch (520): se abre la búsqueda. Clic en Buscar errores (556). Desde el 576 llegan cuatro grupos de errores (Producto / item pedido x14, Parametros Flexxus / cliente x9, Cliente / alta cliente x6, Origen marketplace / payload x3) y el contador llega a 32 eventos. Garabato sobre los grupos. Clic en CloudWatch (620): se pliega. | (1560, 520) a 1,2 | Diagnóstico de pedidos: los errores salen agrupados |
| 646 a 730 | Clic en Reportar (646): se escribe el título "Tienda 18 \| Pedidos que no bajan al ERP"; clic en Crear reporte (708); el aviso verde "Reporte creado" con el número del ticket interno 48231 (730). | (1560, 500) a 1,2, luego (1580, 520) | Escalado a Desarrollo en un clic. Golpe suave en el 730 |
| 736 a 776 | El ticket interno #48231 vuela con arco del panel al hilo de comentarios y crece hasta el ancho del comentario; el contador pasa de 4 a 5. Estela del kit. | viaja a la vista general (960, 560) 0,9 (760) y 0,95 (798) | El ticket interno queda enlazado en el original. Golpe suave en el 776 |
| 778 a 806 | Flecha a mano del comentario al ticket de arriba. | vista general | Quedan vinculados los dos tickets |
| 806 a 840 | Atravesado del comentario "Ticket interno creado para Desarrollo: #48231" (escala x40) con viñeta y velo hacia la escena siguiente. | foco (MAIN.x + 230, COMMENT_Y + 48) | Cierre de tema |

Sonido (`cues.json`): clic en cada clic del cursor (232, 342, 384, 520, 556, 620, 646, 708), barrido al levantarse el panel (110) y al atravesar (806), golpe suave en el resultado del formato (412), en el ticket creado (730) y en el aterrizaje del ticket (776).
