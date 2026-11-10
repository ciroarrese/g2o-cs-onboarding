# Idea 2: Sincropresta, el módulo PrestaShop ↔ Flexxus renovado

**Período:** del 1/10 al 4/11/2026. **Fuente:** documento "Sincropresta: mejoras de octubre y noviembre 2026" (21 páginas).

**Hecho con:** Claude (desarrollo, specs, pruebas, relevamiento y documentación).

**Qué es:** el módulo que sincroniza las tiendas PrestaShop con el ERP Flexxus (catálogo, precios, stock, clientes y pedidos), más el módulo de cuenta corriente.

## Cifras clave

| Dato | Valor |
|---|---|
| Versiones del core | 2.1.17 → **2.7.13** (al menos una por semana; 10 en un solo día) |
| Commits | **~200** en 5 semanas, en un repo único |
| Specs | **15**, cada una con plan, implementación y verificación |
| Funciones nuevas en el core | **6**, que antes eran parches de un solo cliente |
| Bugs graves corregidos | **12**, entre ellos pedidos perdidos, catálogo apagado y packs vacíos |
| Clientes con mejoras en producción | **12** |
| Clientes nuevos | **5** (3 ya en marcha y 2 en curso) |
| Tiendas relevadas | Informe automático de salud de **68** tiendas |
| Monitor de sincros | **316** tiendas en un solo panel |

## Las ideas fuerza (para el video)

1. **Plataforma moderna.** Funciona en PrestaShop 9 y PHP 8, y sigue andando en PS 8.
2. **Se rompió un límite.** Antes, ningún mayorista podía estar en Hostinger porque la sincro se cortaba a los 120 s y se revertía entera. Ahora corre completa:
   - 611.865 descuentos en 148 s.
   - 4.139 artículos en 169 s.
3. **De parche a producto.** Las funciones hechas para un cliente pasaron al core y hoy se pueden ofrecer a toda la cartera, activándolas por parámetro:
   - control de crédito en el checkout
   - pre-venta por orden de compra
   - productos sustitutos
   - familias y artículos ocultos
4. **Precios sin apagones.** Las listas y los descuentos se procesan de forma incremental: solo lo que cambió. La tienda ya no se queda sin precios mientras corre la sincro.
5. **Cuenta corriente igual a Flexxus.** El cliente ve en la web sus saldos y vencimientos, y descarga el PDF con CAE, QR y el mismo diseño que la factura del ERP.
6. **Visibilidad total.** El Sincro Monitor muestra en un solo panel el estado de las sincros de 316 tiendas:

   | Estado | Tiendas |
   |---|---|
   | OK | 150 |
   | Error de servidor | 71 |
   | Error de sincro | 19 |
   | Advertencias | 12 |

7. **Todo con Claude.** Los ~200 commits, las 15 specs, el relevamiento de 68 tiendas y el monitor se hicieron con Claude. En el repo hay agentes especialistas (Firebird, PrestaShop, UX y backend), skills de diagnóstico, el orquestador `/caso` y una base de conocimiento de incidentes. Ningún cambio llega a producción sin probarse antes en un entorno de prueba.

## Próximos pasos (según el documento)

- Pedidos en tiempo real (versión 2.8.0, rama lista).
- Auto-remediación de los errores de sincro, con un plan en 3 niveles.
- Descuentos por cliente, fase 2.

## Ideas visuales para el video

- **Contador de versiones:** 2.1.17 avanza hasta 2.7.13, con una línea de tiempo que se llena.
- **Barra de 120 s:** primero se corta en rojo ("antes"); después la barra pasa de largo y llega a "completo" en 148 s.
- **Tarjetas que pasan del cliente al core:** seis fichas que vuelan a un núcleo central (se puede usar el PlatformHub del design system).
- **Tablero de 316 tiendas:** puntos que se van coloreando según su estado.
