# Idea 3: Sincro Monitor, el tablero de las sincros PrestaShop

**Fecha del relevamiento:** 10/11/2026, recorrido del panel en vivo. **Fuente:** el propio panel (vistas, filtros y datos agregados).

**Hecho con:** Claude.

**Qué es:** un panel web que reúne en un solo lugar el estado de las sincronizaciones de todas las tiendas PrestaShop con su ERP. Lee el historial de las corridas automáticas, clasifica cada resultado y lo muestra por tienda. No instala nada en las tiendas.

**Objetivo:** enterarse de los problemas de las integraciones y reaccionar **antes de que el cliente abra un ticket**.

## Qué permite

- **Ver todo de un vistazo:** cuántas tiendas están bien, cuántas con error de servidor, con error de sincro o con advertencias, separado entre la sincro de productos y la de pedidos.
- **Filtrar en segundos:** por tipo de sincro (todas, productos o pedidos), por estado, por tipo de error (servidor o sincro) y con un buscador.
- **Entender la causa sin entrar a la tienda:** cada error se puede abrir para ver el resumen, el mensaje y las últimas etapas que corrió la sincro. Los fallos de servidor se agrupan por causa (URL rota, DNS, certificado, timeout).
- **Controlar la salud de los datos:** un control diario compara cada tienda con su ERP (conexión, sincros atrasadas, pedidos sin enviar, productos a $0, stock y catálogo distintos). Un problema se confirma solo si aparece dos veces seguidas o si es grave, para no generar falsas alarmas.
- **Seguir cada incidente de punta a punta:** desde que se detecta hasta que se resuelve, con un diagnóstico probable y la acción sugerida.
- **Escalar en un clic:** desde la fila de la tienda se crea el ticket interno en la mesa de ayuda.

## Cifras clave (al 10/11/2026)

| Dato | Valor |
|---|---|
| Tiendas activas monitoreadas | **315** (215 en la sincro de productos y 100 en la de pedidos) |
| Integraciones registradas en total | **486** |
| Corridas de sincro clasificadas | **más de 1,2 millones** (acumulado) |
| Pedidos seguidos en las sincros | **más de 40.000** |
| Actualización | automática, cada 60 segundos |

**Foto del día:**

| Estado | Tiendas |
|---|---|
| Sin problemas | 146 |
| Error de servidor | 73 |
| Error de sincro | 17 |
| Advertencia | 12 |
| Sin datos recientes | 67 |

En total, **102 tiendas con algo para atender**, detectadas por el equipo sin esperar el reclamo del cliente.

## Qué se logró

- **De reactivo a proactivo:** antes, un problema de sincro se conocía cuando el cliente lo reportaba. Ahora el equipo ve primero las 315 tiendas, sabe cuáles fallan y por qué.
- **Un solo lugar en vez de revisar tienda por tienda:** más de 1,2 millones de corridas ya clasificadas por estado y causa.
- **Del error al diagnóstico:** el panel no solo avisa, también sugiere la causa probable y el siguiente paso, y permite crear el ticket interno al instante.

## Estado actual y próximo paso

- El control de salud de datos y el seguimiento de incidentes están en **piloto**, con 2 tiendas de prueba. Ahí ya se registraron 7 incidentes, 4 de ellos resueltos.
- **Próximo paso:** la auto-remediación en 3 niveles. El panel ya propone y simula las acciones (por ejemplo, relanzar una sincro) y el objetivo es que resuelva solo los casos conocidos.

**Mensaje:** 315 tiendas en un solo tablero. Nos enteramos antes que el cliente.

## Ideas visuales para el video

- **Mosaico de 315 puntos:** empiezan grises y se van coloreando por estado (verde, rojo, naranja y amarillo); después se agrupan en las cifras de la foto del día.
- **Contador de corridas:** un número que sube hasta 1,2 millones mientras pasan líneas de log que se ordenan solas en categorías.
- **Antes y después:** a la izquierda, un cliente que escribe "no me sincroniza"; a la derecha, la alerta que aparece en el panel antes de ese mensaje.
- **Del aviso a la acción:** una alerta que se abre, muestra el diagnóstico y termina en el botón "Crear ticket".
