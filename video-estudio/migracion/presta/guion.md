# Módulo Sincro Presta: hoja de tiempos (tema 02, 1200 cuadros a 30 fps)

Fuente: `video/src/scenes/Sincropresta.tsx` (escena 3 del video aprobado). Cinco zonas por las que vuela la cámara, sin voz. Todo emulado: tienda "hogarnova", clientes y facturas ficticios.
Mundo de 1920 x 1080 por pantalla; zonas en el mundo: A (0..1920, 0..1080), B (3200, 540), C (3200, 1900), D (960, 1900), E (60..2360, 2760..3640).

| Cuadros | Zona | Qué pasa | Cámara (foco, escala) | Qué tiene que leer quien mira |
|---|---|---|---|---|
| 0 a 26 | A | La tienda (PrestaShop, tema Classic) a la izquierda y el ERP (Flexxus, grilla de Artículos) a la derecha entran con fundido; arriba, la píldora "Módulo Sincro Presta" con el ícono de sincronización girando. | vista general (960, 520) x0,93, sostenida hasta el 28 | Hay dos sistemas y el módulo en el medio. |
| 34 a 86 | A | En el ERP cambia el precio del set de ollas ($ 48.900 a $ 51.200, celda resaltada). Sale la pastilla "Precios" del ERP, pasa por el módulo y cae en la tarjeta del set de ollas de la tienda (precio en color de acento, halo). | zoom rápido al precio del ERP (1640, 410) x1,6 de 40 a 62; viaje a la tienda (360, 430) x1,6 de 76 a 104 | El precio nuevo llega a la tienda. |
| 72 a 126 | A | Stock del toallón: 0 a 6 en el ERP; pastilla "Stock"; en la tienda pasa de "Sin stock" a "En stock" y el botón se enciende. | vista general desde el 118 | El stock se refleja. |
| 104 a 158 | A | Artículo nuevo (lámpara de pie nórdica) en el ERP; pastilla "Catálogo"; aparece en la tienda con la cinta NUEVO. | vista general (960, 520) x0,93 hasta el 184 | El catálogo se actualiza. |
| 146 a 200 | A | Alguien compra en la tienda (carrito 0 a 1, botón de la cafetera se aprieta); pastilla "Pedidos" sale de la tienda hacia el ERP y aparece el aviso "Pedido web #3104 recibido". | zoom al aviso del ERP (1680, 810) x1,9 de 198 a 228 | El pedido vuelve al ERP: la sincro va en los dos sentidos. |
| 242 a 258 | A a B | Viaje y alejamiento. | (2080, 540) x0,5 y llegada a (3200, 500) x0,9 | |
| 258 a 474 | B | Versiones semanales: cinco columnas "Semana 1..5"; cada semana cae una pila de tarjetas "Mejora" / "Fix" (3, 3, 4, 5, 3) y al completarse se enciende su versión (v2.1, v2.3, v2.5, v2.7, v2.9). Arriba, la versión actual grande con degradado. | pan de lectura (3200, 500) x0,9; acercamiento de 396 a 434 a la semana 4 y 5 (3564, 590) x1,55 | Cada semana se entrega algo. |
| 446 a 474 | B a C | Viaje hacia abajo. | (3200, 1220) x0,5 y (3200, 1870) x0,88 | |
| 482 a 604 | C | "Antes: dentro de la página web". La barra de "Sincronizando descuentos" avanza hasta el muro "Límite del hosting 2:00" (reloj 0:00 a 2:00). En el 546 se corta: tiembla, se pone en rojo, se revierte, texto "Se corta y se revierte todo"; garabato circular sobre el muro. | (3200, 1870) x0,88; acercamiento a (3330, 1690) x1,55 de 550 a 572 | El límite del hosting corta la sincro. |
| 574 a 606 | C | La pastilla "Sincro de descuentos" baja de la caja de arriba a la de abajo; flecha a mano. | (3200, 1870) x0,88 | La sincro pasa al servidor. |
| 606 a 744 | C | "Ahora: proceso interno en el servidor". Barra y reloj hasta 4:10, contador de 0 a 486.250 descuentos, "Completo" en verde; línea punteada "2:00 · sin límite" con garabato circular. | acercamiento a (3288, 2140) x1,6 de 634 a 664; vuelta a vista general; viaje a D (2080, 1900) x0,5 de 730 a 744 | Pasa de los 2 minutos sin cortarse. |
| 744 a 866 | D | Seis tarjetas de funciones (Control de crédito, Pre-venta por orden de compra, Productos sustitutos, Familias y artículos ocultos, Precios incrementales, Cuenta corriente) entran en grilla ("Hecha para Tienda NN") y se funden, de a una, en las filas de la pantalla de configuración del módulo (back office de PrestaShop, pestaña "Funciones", interruptores SÍ / NO). | vista general (960, 1880) x0,88 | Funciones hechas para cada cliente terminan dentro del módulo. |
| 852 a 930 | D | Cursor: clic en el interruptor de Pre-venta (872, pasa a SÍ), clic en el de Familias y artículos ocultos (896, pasa a SÍ) con garabato, clic en "Guardar" (918): "Configuración guardada". | (1600, 1740) x1,5 de 866 a 904; (1640, 1960) x1,25 de 912 a 926 | Se activan a gusto del cliente. |
| 940 a 958 | D a E | Viaje hacia la cuenta corriente. | (960, 2550) x0,5; (630, 3180) x0,88 | |
| 954 a 1062 | E | Tienda, "Mi cuenta / Cuenta corriente" (Mayorista Sur): saldo, vencido, próximo vencimiento y cinco movimientos con saldo corrido. Clic en la factura A 0004-00012911 (1004): se abre el detalle (3 renglones, IVA, total, CAE) y la tabla se angosta. Clic en "Descargar factura (PDF)" (1046). | (630, 3180) x0,88; (980, 3300) x1,35 de 1010 a 1042 | Todo el estado de cuenta está en la tienda. |
| 1050 a 1116 | E | La factura PDF (Distribuidora Ejemplo S.A., factura A, CAE y un código QR de dibujo) vuela a la derecha; el código se barre (1098 a 1114); garabato en el QR y flecha al teléfono. | (1500, 3200) x0,95; (1800, 3220) x0,95 | La factura trae su QR. |
| 1086 a 1166 | E | El teléfono entra inclinado, apunta al QR (visor con cuadro y línea de barrido), muestra el enlace y abre la consulta de ARCA ("Comprobante autorizado" y siete datos, CAE incluido). | (2170, 3230) x1,3 de 1126 a 1166 | El comprobante se verifica con el teléfono. |
| 1166 a 1200 | E | Se atraviesa el teléfono (escala x40) y velo hacia la escena siguiente. | foco al teléfono, escala x40 | |

Titular (fijo, fuera del mundo): "02 Módulo Sincro Presta · la tienda y el ERP, siempre sincronizados"; entra en el -30 y se aparta cuando la escala pasa de 1.
Garabatos: muro (550), flecha del traslado (568), 2:00 sin límite (640), interruptor (906), QR (1088), flecha al teléfono (1090).
Vignette: crece con el zoom y se apaga en el atravesado.
