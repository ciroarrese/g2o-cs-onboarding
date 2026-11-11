# Contexto del proyecto: video "Avances con IA"

Este archivo es el traspaso entre sesiones. Leelo completo antes de hacer cualquier cosa.

## Objetivo

Hacer un **video personal de 2 minutos como máximo** que presente los proyectos que se hicieron con IA (Claude) en el área de trabajo (Customer Success / Integraciones en Grow2on). Tiene que tener animaciones con aspecto profesional, usando el design system de Grow2on.

El orden de trabajo es este:
1. **Fichas por proyecto:** juntar la información de cada uno. **En curso.**
2. **Informe:** un documento que resume todos los proyectos, en Claude Docs.
3. **Guion del video:** una tabla por escena con tiempo, narración, qué se ve y el dato que la respalda. El usuario lo aprueba antes de producir.
4. **Video:** con Remotion, renderizado a MP4.

## Reglas acordadas con el usuario (respetarlas siempre)

- **Contenido:**
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
| 4 | Health Score de clientes (tablero en Grafana, 7 estados por canal, 341 canales al pasar a producción) | `04-health-score.md` | **Borrador: faltan las cifras en vivo del tablero** |
| … | Otros proyectos que el usuario pase | | |

## Ficha 3 (Sincro Monitor): hecha el 10/11/2026

Notas para la próxima sesión:
- Las cifras de la ficha 3 son del panel en vivo (315 tiendas: 146 OK, 73 error de servidor, 17 error de sincro, 12 advertencias, 67 sin datos recientes). Difieren de las del PDF (316 / 150 / 71 / 19 / 12), que son de otro momento del mismo día. En el informe usar las del panel y citar la fecha.
- El panel no mide tickets evitados. No afirmar una cifra de "tickets anticipados" sin una fuente que el usuario apruebe.
- El panel tiene acciones que escriben (crear ticket, actualizar desde Cronicle, ejecutar sincro, relanzar). Al recorrerlo, solo lectura.
- Las capturas quedaron en el scratchpad de la sesión (muestran dominios de clientes, no van al repo).

## Intento del 11/11/2026: las dos herramientas quedaron bloqueadas

No se cambió la ficha 4 ni la escena. Nada se escribió en Grafana ni en la mesa.

- **Grafana:** `GRAFANA_URL` apunta a la ruta `/login`; hay que usar su origen. La API con Basic Auth y el formulario de login responden **401 "Invalid username or password"** (un solo intento por vía, para no bloquear la cuenta). El formato de las variables está bien (sin espacios ni comillas). **Falta que el usuario corrija `GRAFANA_USER` / `GRAFANA_PASS`** o confirme si el login es por SSO.
- **Mesa de tickets (`MESATICKET_*`):** es una SPA ("Service Desk") que redirige a `/auth/login`. En Chromium la pantalla queda en blanco porque los módulos de login (`Login-*.js`, `LockOutlined-*.js`, la fuente Arboria) responden 404, en 4 intentos seguidos. Con curl esos mismos archivos dan 200. No se llegó al formulario, así que no hay capturas ni estructura relevada. El clasificador de permisos bloqueó seguir probando encabezados contra el servidor; no insistir por esa vía sin autorización del usuario.
- **No usar el conector Mesa_Tickets como alternativa** sin que el usuario lo apruebe: devuelve tickets reales.
- Al depurar, un error de Playwright mostró la URL de la mesa en la salida. Para evitarlo, envolver los scripts con un filtro que reemplace los valores y hosts de las variables antes de imprimir.

## Tarea siguiente: completar la ficha 4 (Health Score)

- El borrador sale del documento "Health Score Grow2On: informe de funcionamiento" (v17 del tablero, 13/10/2026). Ese documento no está en el repo.
- **Acceso:** variables de entorno `GRAFANA_URL`, `GRAFANA_USER` y `GRAFANA_PASS`. **Nunca imprimas sus valores.** El dashboard es `/d/healthscore-g2o`.
- **Qué falta:** relevar en el tablero la distribución actual de canales por estado, la cola de atención, las transiciones de 30 días y los canales en activación. Solo cifras agregadas, sin nombres de clientes. Sacar capturas al scratchpad.
- No poner en la ficha las limitaciones ni los pendientes del documento, por la regla de no incluir riesgos.
- Solo lectura: no editar paneles, variables ni alertas.

### Después: recrear la mesa de tickets en el video

- El usuario agregó al entorno la URL, el usuario y la contraseña de la mesa de tickets. Buscá los nombres de esas variables con `env | cut -d= -f1`. **Nunca imprimas sus valores.**
- Es **solo una referencia visual**: recorrerla con Playwright en modo lectura, sacar capturas al scratchpad y copiar su estructura (columnas, estados, colores, rótulos) en la escena.
- **No crear, responder ni modificar tickets.** No sacar métricas de ahí: sigue vigente la regla de no usar la Mesa de Tickets para cifras.
- En el video no puede aparecer ningún cliente, agente ni ticket real: datos ficticios.
- Sirve también para el proyecto 1 (asistente IA dentro de cada ticket), que vive en esa mesa.

Después: informe en Claude Docs, guion y escenas de los demás proyectos.

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

- Formato del video: se asume 16:9 a 1920×1080, sin confirmar.
- Música: sin definir.
- Público del video.
- El zip del design system traía `uploads/Reporte Soporte y Onboarding (standalone).html` y 3 capturas. **No se usaron y no están en el repo.** Si son relevantes, hay que pedirle al usuario que los vuelva a subir.
