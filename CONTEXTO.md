# Contexto del proyecto: video "Avances con IA"

Este archivo es el traspaso entre sesiones. Leelo completo antes de hacer cualquier cosa.

## Objetivo

Hacer un **video personal de 2 minutos como máximo** que presente los proyectos que se hicieron con IA (Claude) en el área de trabajo (Customer Success / Integraciones en Grow2on). Tiene que tener animaciones con aspecto profesional, usando el design system de Grow2on.

El orden de trabajo es este:
1. **Fichas por proyecto:** juntar la información de cada uno. **En curso.**
2. **Informe:** un documento que resume todos los proyectos, en Claude Docs. **Borrador hecho el 11/11/2026**: [Avances con IA en Customer Success](https://claude.ai/artifact/Gwj7dETevNk8uakUin5N49).
3. **Guion del video:** una tabla por escena con tiempo, narración, qué se ve y el dato que la respalda. El usuario lo aprueba antes de producir. **Borrador del 11/11/2026, esperando aprobación:** [Guion del video: Avances con IA](https://claude.ai/artifact/7WLNKbRP3RFRb8gNQdZPdF).
4. **Video:** con Remotion, renderizado a MP4.

## Reglas acordadas con el usuario (respetarlas siempre)

- **Contenido:**
  - **Video: números emulados** (inventados), no cifras reales. **Informe: sin cifras.**
  - Es una presentación de **todas las ideas o proyectos, sin entrar en detalle**. Va un resumen de alto nivel, no análisis técnicos.
  - **No se muestran montos ni nombres de clientes.** Solo cifras agregadas, por ejemplo "12 clientes con mejoras".
  - **Todo se hizo con Claude.** Se puede afirmar en el informe y en el video.
  - No se incluyen riesgos ni deudas técnicas en el informe.
- **Fuentes de datos:** no se usa la Mesa de Tickets (conector) para sacar métricas.
- **Estilo:**
  - Copy en español rioplatense con voseo, sin emojis y en sentence case, siguiendo `.claude/skills/grow2on-design/README.md`.
  - Preferencias de respuesta del usuario: empezar por fallos y riesgos cuando pide opinión, y no cambiar de postura sin un argumento nuevo.
- **Licencia:** el video es personal, así que Remotion se usa con la licencia gratuita.

## Estado de las fichas (`informe/fuentes/`)

| # | Proyecto | Archivo | Estado |
|---|---|---|---|
| 1 | Asistente IA dentro de cada ticket (userscript de Violentmonkey en la mesa de soporte): redacción con IA en 4 modos, dictado por voz, diagnóstico de pedidos y escalado en un clic | `01-panel-ia-tickets.md` | Listo |
| 2 | Sincropresta, el módulo PrestaShop ↔ Flexxus renovado (PS 9, Hostinger, 6 funciones al core, precios incrementales, cuenta corriente, ~200 commits) | `02-sincropresta.md` | Listo |
| 3 | Sincro Monitor: panel de monitoreo de las sincros PrestaShop (315 tiendas, más de 1,2 M de corridas clasificadas, control de salud en piloto) | `03-sincro-monitor.md` | Listo |
| 4 | Health Score de clientes (tablero en Grafana, 7 estados por canal, 341 canales, 92 sanos, 147 cambios de estado en 30 días) | `04-health-score.md` | Listo |
| … | Otros proyectos que el usuario pase | | |

## Ficha 3 (Sincro Monitor): hecha el 10/11/2026

Notas para la próxima sesión:
- Las cifras de la ficha 3 son del panel en vivo (315 tiendas: 146 OK, 73 error de servidor, 17 error de sincro, 12 advertencias, 67 sin datos recientes). Difieren de las del PDF (316 / 150 / 71 / 19 / 12), que son de otro momento del mismo día. En el informe usar las del panel y citar la fecha.
- El panel no mide tickets evitados. No afirmar una cifra de "tickets anticipados" sin una fuente que el usuario apruebe.
- El panel tiene acciones que escriben (crear ticket, actualizar desde Cronicle, ejecutar sincro, relanzar). Al recorrerlo, solo lectura.
- Las capturas quedaron en el scratchpad de la sesión (muestran dominios de clientes, no van al repo).

## Ficha 4 (Health Score): hecha el 11/11/2026

Cómo se relevó, para repetirlo:
- `GRAFANA_URL` apunta a `/login`: usar su origen. Login por formulario con Playwright (`input[name=user]`, `input[name=password]`); la API acepta Basic Auth. El email de `GRAFANA_USER` estaba mal y el usuario lo corrigió.
- **El tablero guardado abre con la base "DB DEV"** (datos de prueba: 9 canales, último pedido el 02/09/2026). Las cifras reales salen de **"DB Prod"**: pasar `&var-ds=DB%20Prod` en la URL. No se guardó nada.
- **En producción el último pedido cargado es del 07/10/2026.** Con la fecha de referencia "Hoy", 319 de 341 canales salen como inactivos por el corte de datos, no por la cartera. Por eso la ficha usa `&var-fecha_ref=2026-10-07`. **Avisarle al usuario si quiere cifras con datos al día:** hay que revisar la carga de pedidos en la base de producción.
- La base de 2 meses es la de la especificación. Con 3, 6 o 12 meses la distribución cambia bastante (por ejemplo, en caída pasa de 23 a 53), así que no afirmar que el cálculo es estable.
- Las capturas quedaron en el scratchpad (muestran nombres de clientes).

## Mesa de tickets: estructura relevada el 11/11/2026

Se recorrió con Playwright en solo lectura (bandeja propia, pestañas, No asignados, Mi equipo y la vista de un ticket). No se abrieron Indicadores, Nuevo ticket ni Alta de usuarios, y no se tocó ningún botón de acción. La primera carga puede quedar en blanco (los módulos del login a veces dan 404 en el navegador): reintentar.

- **Barra superior:** logo, buscador "Buscar por ticket o empresa", íconos de nuevo ticket (+), avisos (!) y campana.
- **Barra lateral oscura:** indicadores, tickets, no asignados (con contador rojo), mi equipo y alta de usuarios. El ítem activo va en un cuadro de color.
- **Cabecera de la bandeja:** nombre del agente o "No asignados", subtítulo "Agente responsable / <equipo>" en color de enlace. En la bandeja propia, a la derecha, tres tarjetas de métricas (puntuación, asignados, cerrados): **no van en el video**.
- **Aviso** en franja celeste: "Revisión de prioridad en la primera respuesta".
- **Pestañas con contador:** Asignados, Pendientes, Solucionados, Derivados, Cerrados, Internos, Observados (en No asignados hay una sola pestaña). Debajo, "Total de tickets: N".
- **Cada ticket es una tarjeta en fila:** "# número" | ícono de tipo (triángulo rojo = incidente, engranaje verde = consulta) + asunto subrayado + equipo debajo | ícono de empresa + empresa subrayada + nivel de soporte debajo | calendario + fecha dd/mm/aa | dos pastillas de SLA en % (primera respuesta y resolución; verde, amarillo o rojo, con tilde o cruz) | estado con punto de color ("Esperando al agente" rojo, "Esperando al cliente" verde) o, en No asignados, el botón "Asignar Ticket" | selector de prioridad (Baja, Media) con borde, gris si está deshabilitado. Una tarjeta destacada lleva una barra de color a la izquierda.
- **Vista de un ticket:** título con ícono de etiqueta; migas "Tickets / <agente> / #número" + punto de estado; arriba a la derecha "Reasignar Ticket" y una tarjeta "Prioridad". Columna principal: mensaje inicial en tarjeta (avatar, autor, rol > equipo, fecha, número en pestaña), "Más opciones", "Derivar", botón "Responder"; sección "Comentarios" con "Total de comentarios" y respuestas encadenadas ("En respuesta al comentario #N"). Columna derecha: Empresa asociada, Participantes (agente responsable y agente), Observadores con buscador y "Agregar observador", SLA con dos barras (1° respuesta y resolución, con vencimiento), Categorización. Rail derecho con íconos. Sirve para la escena del proyecto 1.
- Las capturas están en el scratchpad y muestran clientes y agentes reales: no van al repo.

## Escena SincroMonitorDemo: mesa reemplazada el 11/11/2026

- La maqueta genérica se reemplazó por la estructura de "No asignados" en el estilo de Grow2on (Geist, rosa como acento, rail negro, ítem activo con el degradé de la marca). Datos ficticios: tickets # 48190–48213, empresas "Tienda NN", equipo "Soporte sincro", nivel "Nivel 03".
- El ticket que vuela entra arriba como "Error en servidor", prioridad Alta, y los contadores pasan de 4 a 5.
- La ventana de la mesa pasó a 1320 px de ancho; la cámara se ajustó (centro 2460, vista general 1560 con escala 0,56). Los tiempos aprobados no cambiaron (840 frames).
- El usuario aprobó la parte del ticket ("lo del ticket está bien").

## Escena SincroMonitorDemo: aviso en Teams agregado el 11/11/2026

- **Pedido del usuario:** mostrar que el monitor manda a Teams un mensaje con el inconveniente, el detalle del problema y las posibles soluciones. Ya está en la escena y en la ficha 3.
- **Referencia:** una captura del chat "Sincro Presta Monitor" que pasó el usuario. Remitente "Flujos de trabajo"; tarjeta "Sincro Monitor · novedades" con fecha y hora AR, resumen en pares rótulo / valor (sitios afectados, incidentes abiertos, prioridad alta, arreglos por aprobar, resueltos desde el último aviso, más antiguo), "A. Incidentes abiertos" con un punto de color por tienda e incidente (número, persistente, horas, detalle, arreglos por aprobar) y botón "Abrir Sincro Monitor". La captura tiene clientes reales: no va al repo.
- **En la escena:** tercera ventana a la derecha de la mesa (x 3220, 940 × 1000) en el estilo de Grow2on, sin logo ni colores de Microsoft; un rótulo "Teams · chat del equipo" la identifica. Una señal sale del encabezado del monitor y aterriza en el chat. Después aparece el indicador de escritura y se arma la tarjeta: resumen con contadores, incidente de tienda-07 (el mismo del ticket # 48213) y "B. Arreglos por aprobar" con 3 arreglos que se iluminan. Cierra con una vista general de las tres ventanas.
- La sección "B. Arreglos por aprobar" es un agregado para mostrar las soluciones; en la tarjeta real los arreglos aparecen dentro de cada incidente. Si el usuario quiere una copia más literal, se saca.
- Ahora dura **1170 frames (39 s)**. Lo aprobado hasta el frame 700 no cambió.
- **Pendiente: que el usuario apruebe el tramo de Teams.**

## Informe en Claude Docs: borrador del 11/11/2026

- Link: https://claude.ai/artifact/Gwj7dETevNk8uakUin5N49 (doc `811d3281-8d96-4c22-9073-b4d7c80618fa`, una sola pestaña).
- Secciones: resumen, una por proyecto (1 a 4) y fuentes.
- **Decisión del usuario (11/11/2026): el informe es informativo, sin cifras, porcentajes ni gráficos.** Se sacaron las tablas de datos, los números y los dos gráficos (sus widgets quedan en el doc sin mostrarse; la herramienta no permite borrarlos). Las cifras siguen en las fichas.
- Sin riesgos, montos ni clientes.
- Si el usuario edita el doc, leer con `sinceRev` antes de tocarlo (la última revisión escrita por Claude es la 13).
- **Decisión del usuario (11/11/2026): el video usa números emulados**, no las cifras reales. Hoy la escena del Sincro Monitor todavía muestra las cifras reales del panel (315 tiendas: 146 / 73 / 17 / 12 / 67, en el tablero y en los 315 puntos de la dona). Hay que cambiarlas por valores inventados al armar el guion final. Los números de la tarjeta de Teams y de la mesa ya son ficticios.

## Guion: actualizado con lo producido el 12/11/2026

- El doc "Guion del video: Proyectos con IA" ya refleja el video aprobado (estructura con tiempos, efectos, vuelta al listado, escenas 1–6, decisiones). Última revisión escrita por Claude: 458. Las secciones "Preguntas abiertas" y "Para empezar a producir" quedan con las respuestas del usuario como sugerencias suyas (solo él puede aceptarlas o rechazarlas).

### Borrador original del 11/11/2026

- Link: https://claude.ai/artifact/7WLNKbRP3RFRb8gNQdZPdF (doc `34af5645-5049-4f34-8c98-ffc108001dae`). Última revisión escrita por Claude: 10.
- **Efectos pedidos por el usuario:** Zoom Through, UI World (interfaces flotantes), Headline Wall, Chart Grow, Doodle Boil con la estética del design system y Digital Zoom. Se sumaron cursor con clic, vuelo con estela y morph de forma. El guion tiene una tabla que dice qué efecto va en cada escena.
- 6 escenas, unos 2 min 25 s: apertura con muro de rótulos (0:00–0:10), asistente IA en el ticket (0:10–0:38), Sincropresta (0:38–1:06), Sincro Monitor y Teams (1:06–1:45, la escena aprobada con números emulados), Health Score (1:45–2:13) y cierre con "Hecho con Claude" (2:13–2:25). Una sola cámara que viaja entre escenas con Zoom Through.
- Sin voz: la columna "narración" se reemplazó por "texto en pantalla", con rótulos propios de las herramientas.
- Última revisión escrita por Claude: 289. El usuario respondió las preguntas como sugerencias en el doc; esas las acepta él, Claude no puede.
- **Decisiones del usuario (11/11/2026):** título "Proyectos con IA"; cierre con "Hecho con Claude" aprobado; el panel de IA se recrea desde el panel real; la duración puede pasar de 2 min 25 s si hace falta (lo que importa es que se vea profesional y atractivo); música lo-fi suave de fondo; 16:9 a 1920 × 1080; público general: que se entienda qué hace cada proyecto, sin entrar en cómo.
- **Comentarios del 11/11/2026 (tarde):** el usuario pasó el código del panel de IA (userscript). **No va al repo: tiene nombres e ids reales del equipo.** Pidió música lo-fi de uso libre y que la apertura muestre los titulares de todos los proyectos para después entrar a cada uno. Claude dejó 4 sugerencias en el guion (apertura con titulares, regla de titular por escena, escena 2 con rótulos reales, música); esperan que el usuario las acepte.
- **Estructura del panel de IA (del código):** panel flotante oscuro abajo a la derecha, arranca minimizado. Barra de título "Sugerencia IA - Ticket <id>" con botón minimizar/restaurar. Cuerpo: grilla de 2 columnas con "Solo corregir" (gris), "Seguir contexto" (azul), "Con formato" (violeta, ancho completo), "Escalado desarrollo" (ámbar, texto oscuro), "Dictar" (verde; al grabar pasa a rojo "Detener dictado"). Línea de estado ("Escuchando...", "Insertado en el editor."). Sección plegable "▸ CloudWatch" con "Pantalla completa": "Errores de pedidos (CloudWatch)" (serviceId opcional, horas, "Buscar errores", filtro, "N eventos, x/y grupos", tarjetas con borde izquierdo de color por familia: "Producto / item pedido" azul, "Parametros Flexxus / cliente" violeta, "Cliente / alta cliente" ámbar, "Defecto codigo" rojo, "Origen marketplace / payload" verde agua, "Otros" gris; título "Familia (xN)", "Cliente: …", mensaje, "Ver detalle (N)"), "Buscar por correlationId" ("Buscar trace", eventos con nivel ERROR/WARN/INFO en color) y "Buscar Venta" (ID de venta, fechas, "Buscar", "Trazar"). Sección plegable "▸ Reportar": tres botones de destino "Desarrollo", "Integraciones", "Soporte Sincro" (el elegido en azul), "Titulo del reporte", selector de asignado, descripción editable en blanco, "Cargar datos del ticket" y "Crear reporte" (azul) → "Reporte creado (ticket #N)." y deja un comentario interno con el link en el ticket original. Los modos de IA son corregir, seguir contexto, con formato y escalado a desarrollo.
- **Música:** "Lo-Fi 04" de Mixkit (id 766, 164 s) recomendada; alternativa "Sleepy Cat" (id 135, 119 s). Licencia Mixkit Stock Music Free: permite videos en web y redes, comerciales o no, sin atribución; no permite TV, radio, CD/DVD, videojuegos ni remezclas. **Elegida por el usuario: "Lo-Fi 04"**, desde "la parte de melodía con percusión, más o menos a la mitad". Análisis del tema: intro casi muda 0:00–0:08, base sin percusión aguda 0:08–0:44, percusión 0:44–2:34 (más llena desde 1:20), final 2:34–2:44. **Problema:** desde 1:20 quedan unos 82 s y el video dura unos 145 s. Se le mandaron dos muestras (desde 0:40 y desde 1:16) para que confirme el punto de arranque y elija entre arrancar en 0:44 y repetir un tramo, o arrancar en 1:20 y repetir más.
- **Decisiones del 11/11/2026 (noche):** música "Lo-Fi 04" desde 0:44 con un tramo de unos 27 s repetido al compás; titulares aprobados, con "Health Score · a quién contactar primero"; **producción escena por escena, el usuario aprueba cada una antes de seguir.** Claude aceptó en el guion, por pedido del usuario, sus sugerencias de la apertura y la música. Siguen abiertas la de la regla de titular por escena y la de la escena 2.

## Producción

| Escena | Composición | Archivo | Estado |
|---|---|---|---|
| 1. Apertura (10 s, 300 frames) | `Apertura` (carpeta "Video") | `video/src/scenes/Apertura.tsx` | **Aprobada** (11/11/2026) |
| 2. Asistente IA (28 s, 840 frames) | `AsistenteIA` | `video/src/scenes/AsistenteIA.tsx` | **Aprobada** (11/11/2026) |
| 3. Módulo Sincro Presta (40 s, 1200 frames) | `Sincropresta` | `video/src/scenes/Sincropresta.tsx` | **Aprobada** (12/11/2026) |
| 4. Sincro Monitor y Teams (48 s, 1440 frames) | `SincroMonitor` (carpeta "Video"; usa `SincroMonitorDemo`) | `video/src/scenes/SincroMonitorDemo.tsx` | **Aprobada** (12/11/2026) |
| 5. Health Score (36 s, 1080 frames) | `HealthScore` | `video/src/scenes/HealthScore.tsx` | **Aprobada** (12/11/2026) |
| 6. Cierre (15 s, 450 frames) | `Cierre` | `video/src/scenes/Cierre.tsx` | **Aprobada** (12/11/2026) |
| Agenda entre proyectos (4 s, 120 frames, ×4) | `Agenda` (prop `done`) | `video/src/scenes/Agenda.tsx` | Nueva (12/11, pedido del usuario) |
| **Video completo** (3:13, 5790 frames) | `ProyectosConIA` (raíz) | `video/src/ProyectosConIA.tsx` | **Aprobado** (12/11/2026) |

- `Apertura.tsx` exporta `PROJECTS` (los 4 titulares) y `DockedHeadline`, el titular chico arriba a la izquierda que usa cada escena de proyecto.
- `video/src/brand/motion.tsx`: helpers compartidos (`k`, `OUT`, `IN_OUT`, `typed`, `Cursor`, `DoodleCircle`, `DoodleArrow` con efecto boil cada 3 frames, `Vignette`).
- Escena 2: ticket ficticio #48190 de "Tienda 18", ticket interno #48231; el panel IA es oscuro como el real (colores de botones reales), con Dictar → texto dictado sin puntuación → "Con formato" lo ordena → CloudWatch con 4 familias (cantidades emuladas) → Reportar a Desarrollo → el ticket interno vuela al ticket original y una flecha a mano los une. Personas genéricas: "Agente de soporte", "Agente de guardia", "Guardia de Desarrollo".
- Escena 3: mundo de 5 zonas que la cámara recorre en vuelo (A sincro en vivo tienda ↔ ERP, B versiones v2.0.0 → v2.9.4 y commits por semana, C barra de descuentos que antes se cortaba en el límite de 2:00 y ahora completa, D seis funciones de clientes al core con sus parámetros activados, E PDF de cuenta corriente con CAE y QR, que la cámara atraviesa). Todos los números son emulados. No se usó `platform-hub-center.png` porque es el logo de Grow2on, no de Sincropresta.
- **Correcciones del usuario a la escena 3 (12/11/2026):** (1) el nombre es **"Módulo Sincro Presta"**, no "Sincropresta" (cambiado en el video, en la ficha 2, en el informe y en el guion el 12/11; el documento fuente conserva su título original "Sincropresta: mejoras…"); (2) tienda que se entienda: se emuló una tienda de hogar con el tema Classic de PrestaShop (franja superior, logo "hogarnova", menú de categorías, buscador "Buscar en nuestro catálogo", filtros, grilla con "AÑADIR AL CARRITO" celeste #24b9d7); (3) ERP: se emuló Flexxus 4.0 según el mockup oficial de flexxus.com.ar (barra roja "-Flexxus-", pestañas Inicio/Archivos/Ventas/…, cinta con Artículos, Características…, barra lateral oscura) con la grilla "Artículos" (Código, Descripción, Rubro, Precio L1, Stock); (4) **subtítulos sin voz**: componente `Subtitles` en `motion.tsx`, franja oscura abajo; la cámara deja 70 px abajo para que no tapen; (5) versiones: cada semana es una pila de ítems "Mejora"/"Fix" con títulos que caen y forman la barra, y la versión v2.1…v2.9 se enciende al completar la semana; (6) límite: "Antes · dentro de la página web" con una pared en 2:00 que corta y revierte, y "Ahora · proceso interno en el servidor", donde la sincro baja al servidor y pasa las 2:00 sin pared; (7) funciones: seis tarjetas con nombre y descripción que vuelan y se fusionan en filas de la pantalla de configuración del módulo (estilo back office de PrestaShop, switches SÍ/NO, "Guardar"); (8) cuenta corriente: historial en "Mi cuenta / Cuenta corriente" de la tienda, detalle del movimiento, "DESCARGAR FACTURA (PDF)", factura A con CAE y QR, escaneo y página de ARCA "Consulta de comprobante" con "Comprobante autorizado".
- La página de ARCA es una emulación: las páginas oficiales del QR respondieron 503 y no se pudo verificar su diseño. El link usa el formato público `afip.gob.ar/fe/qr/?p=…`.
- **Correcciones del 12/11/2026 (2.ª vuelta):** el usuario pidió **sacar los subtítulos** (el componente `Subtitles` queda en `motion.tsx` sin uso); el titular de arriba pisaba contenido: ahora `DockedHeadline` recibe `hide` y se oculta solo cuando la cámara se acerca (escenas 2 y 3), y las vistas generales usan escala 0,88–0,93; el escaneo del QR ahora es **un celular** que lo escanea y abre la consulta de ARCA en el navegador del teléfono; se sumaron **acercamientos rápidos (Digital Zoom)** en: precio editado en el ERP, precio que llega a la tienda, pedido web que llega al ERP, una semana completa de mejoras y fixes, la pared que corta la sincro, la sincro del servidor pasando las 2:00, los interruptores de funciones, el detalle del movimiento y la consulta de ARCA en el celular.
- Música por escena: apertura 0:44, escena 2 0:54, escena 3 1:22 (40 s), escena 4 2:02 (39 s, llega al final del tema). La escena 5 y el cierre necesitan el tramo repetido: definir el corte al compás al armar la composición final.
- **Escena 4, flujo pedido por el usuario (12/11/2026):** ticket creado en el panel → vuela a la derecha a la mesa (acercamiento a la fila nueva) → barrido de vuelta al panel → la campanita del encabezado suena y baja la alerta "Nuevo incidente · prioridad alta" → la alerta se pliega en una campanita que vuela con estela a Teams (ventana **a la izquierda del panel**, pedido del usuario; `TEAMS` en x -1180, y -40) → se arma la tarjeta de novedades (acercamiento con garabato a los arreglos por aprobar) → vuelo a la mesa → clic en el ticket, que se abre creciendo desde su fila → "Responder", se escribe la respuesta, "Enviar" → aparece "Enviado ✓" y el estado pasa a "Esperando al cliente" → vista general de las tres ventanas → salida atravesando la respuesta. La cámara usa keyframes (`KEYS`) y desenfoque de movimiento según su velocidad. Para la vista previa la música se empalma: 2:02–2:34 y vuelve a 0:58.
- Escena 6, versión 2 (pedido del usuario: "estos avances forman parte de un todo más grande"): los paneles se pliegan y quedan solo sus títulos, que se vuelven píldoras y viajan al centro del muro de rótulos (2×2 reservado en una grilla de 6×6); el muro sale del desenfoque, se enciende completo y la cámara se aleja hasta mostrar un anillo exterior de rótulos más tenues. El traspaso calcula la proyección en pantalla de cada título y de su lugar en el muro (`cardProject`, `wallProject`). Versión 1: las cuatro herramientas en miniatura flotan con su titular, vuelve el muro de rótulos de la apertura detrás (atenuado y desenfocado), fundido a blanco con `public/brand/logo-grow2on.png` y "Hecho con Claude". La vista previa usa el final real del tema (2:30–2:44).
- Escena 5: tablero de Grafana recreado en oscuro (como el real) con tipografía Geist. 300 canales emulados (inactivo 96, en crecimiento 64, maduro 52, en activación 48, en caída 22, estancado 14, operación detenida 4) caen en 7 columnas → se reacomodan en la dona → el tablero se arma por capas (filtros, Vista general, Cola de atención, Cartera sana) → cuatro preguntas con acercamiento y respuesta ("Oportunidad comercial", "Base a proteger", "Entender el techo", "Contacto prioritario") → la tabla "En caída — contacto prioritario" se ordena por severidad → transiciones de 30 días: 120 canales en activación vuelan a su estado de hoy → vista general y salida por la dona. Clientes ficticios "Tienda NN".
- Escena 4: cifras emuladas, 280 tiendas (128 sin problemas, 61 error en servidor, 23 error sincro, 14 advertencias, 54 sin datos); titular "03 Sincro Monitor" que se aparta en los acercamientos (`hide={(cam.s - 1) / 0.08}`, igual en las escenas 2 y 3).
- **Video completo:** `ProyectosConIA` encadena las 6 escenas con `<Series>` y pone la pista `public/music/soundtrack.m4a`. Para armar la pista: `cd video && ./scripts/build-soundtrack.sh` (baja "Lo-Fi 04" de Mixkit si falta). **La música no se sube al repo** (`public/music/` está en `.gitignore`): la licencia de Mixkit no permite redistribuir el tema suelto. Tempo ~107,1 BPM (compás 2,24 s): arranca en 0:44, donde empieza la segunda agenda (1:22 del video) vuelve 36 compases atrás con un cruce de 1 s, y llega al final del tema sobre el cierre.
- **Agenda entre proyectos (pedido del usuario, 12/11):** después de cada proyecto se vuelve al listado de los cuatro titulares (mismo lugar que en la apertura); el número del proyecto visto se transforma en un tilde con pulso y la fila se atenúa; el subrayado de la marca pasa al siguiente y la cámara lo atraviesa, dejando su titular arriba a la izquierda. Tras el cuarto, quedan los cuatro tildados y se funde al cierre. Render: `npx remotion render ProyectosConIA out/ProyectosConIA.mp4`.
- Para mostrar avances: render mudo con Remotion y mezcla de la música con ffmpeg (`-ss 44` sobre `music/766.mp3` del scratchpad). El audio definitivo se arma en la composición final.

Después: aprobación del guion y producción de las escenas.

### Referencia de la tarea anterior (ficha 3)

- **Objetivo del panel, según el usuario:** monitorear las integraciones para **reaccionar antes de que el cliente abra un ticket**.
- **Acceso:**
  - Hay que leer las variables de entorno `PANEL_URL`, `PANEL_USER` y `PANEL_PASS`. **Nunca imprimas sus valores.**
  - La URL usa `#all` y la autenticación es HTTP Basic (realm "Sincro Monitor").
  - Para recorrerlo con Playwright, usá `browser.newContext({ httpCredentials: { username: process.env.PANEL_USER, password: process.env.PANEL_PASS } })`.
- **Qué hacer:**
  - Mapear todas las vistas, filtros y estados.
  - Sacar capturas de referencia en el scratchpad. No las subas al repo si muestran nombres de clientes.
  - Escribir la ficha con el mismo formato que las fichas 1 y 2: qué es, qué permite, cifras agregadas, mensaje e ideas visuales.
- **Lo que ya se sabe del PDF de Sincropresta:**
  - Lee el historial de Cronicle por API, clasifica cada log de `sincro.php` y `sincro-pedidos` y lo guarda en una base propia.
  - No instala nada en las tiendas.
  - Al 10/11/2026 mostraba 316 tiendas: 150 OK, 71 con error de servidor, 19 con error de sincro y 12 con advertencias.
  - El siguiente paso planeado es la auto-remediación en 3 niveles.

## Proyecto de video (`video/`)

- **Versión:** Remotion 4.0.542, creado con el scaffold oficial (`create-video --blank`).
- **Comandos:**
  - `cd video && npm install && npm run dev`: abre Remotion Studio.
  - `npx remotion render <Id> out/x.mp4`: renderiza un MP4.
- **Archivos principales:**
  - `src/brand/theme.ts`: los tokens de Grow2on traducidos a video. La escala de texto está agrandada para 1920×1080: títulos de 96–120 px, cuerpo de 44 px. El área segura es de 140 × 110 px.
  - `src/brand/fonts.ts`: carga Geist desde `public/fonts`.
  - `src/brand/primitives.tsx`: `GradientText`, `CloudBackground`, `Stage`, `Reveal`, `Eyebrow`, `Heading`, `CountUp` y `StatCard`. **Las animaciones dependen del frame, no de CSS**, para que el render sea determinista. La opacidad de las nubes por defecto es 0.22, porque más fuerte compite con el texto.
  - `src/scenes/BrandCheck.tsx`: una composición de prueba con texto de ejemplo. El render de prueba funcionó.
- **Entorno:** el contenedor tiene Node 22 y FFmpeg, y Chromium viene preinstalado para Playwright.

## Skills disponibles en el repo

- `.claude/skills/grow2on-design`: el design system completo, con tokens, componentes React de referencia, assets, fuentes y guías. Su README es la fuente de verdad de la marca.
- `.claude/skills/remotion-*`: las Agent Skills oficiales de Remotion. Están enlazadas a `.agents/skills/`. Empezá por `remotion-best-practices`.
- Para el informe usá la skill `docs` (Claude Docs). Para gráficos, la skill `dataviz`.

## Decisiones de video ya tomadas (11/11/2026)

- **Sin voz en off ni textos explicativos.** Todo se cuenta con imágenes y movimiento ("mostrar, no decir").
- **Los textos propios de cada herramienta sí van** (rótulos, filtros, columnas, botones), recreados con datos ficticios: dominios `tienda-NN.ejemplo.com.ar`, sin clientes reales.
- **Las herramientas se recrean en el estilo de Grow2on**, manteniendo la estructura reconocible. No se usan capturas ni grabaciones.
- **El video puede pasar de 2 minutos** si hace falta.
- **Escena aprobada por el usuario ("está perfecto"):** `video/src/scenes/SincroMonitorDemo.tsx`, composición `SincroMonitorDemo`, 840 frames a 30 fps (28 s). Recorrido:
  1. 315 puntos que se juntan en una dona.
  2. La cámara se abre al tablero completo.
  3. Clic en el filtro "Error en servidor".
  4. Se abre una fila con el log y las etapas.
  5. Clic en "Crear ticket": el ticket vuela a la mesa de ayuda y entra como "Nuevo".
- **Ese enfoque es la base para los demás proyectos:** cámara virtual, inclinación 3D, cursor con clics, contadores, estelas y brillos. Todo depende del frame.
- **La mesa de ayuda de esa escena es una maqueta genérica.** Hay que reemplazarla por una copia fiel de la mesa real (ver la tarea siguiente).
- Para mostrarle avances al usuario: renderizar el MP4 al scratchpad y mandarlo, porque no ve Remotion Studio.

## Decisiones abiertas (preguntarle al usuario cuando llegue el momento)

- Formato del video: 16:9 a 1920×1080 (confirmado el 11/11/2026).
- Música: lo-fi suave de fondo (decidido el 11/11/2026; falta la pista).
- Público del video: presentación general (11/11/2026).
- El zip del design system traía `uploads/Reporte Soporte y Onboarding (standalone).html` y 3 capturas. **No se usaron y no están en el repo.** Si son relevantes, hay que pedirle al usuario que los vuelva a subir.
