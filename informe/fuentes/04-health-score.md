# Idea 4: Health Score de clientes

**Fecha:** versión 17 del tablero. **Fuentes:** documento "Health Score Grow2On: informe de funcionamiento" (10/11/2026) y el tablero en vivo, relevado el 11/11/2026 con la base de producción. Las cifras están calculadas al **07/10/2026**, el último día con pedidos cargados en esa base.

**Hecho con:** Claude.

**Qué es:** un tablero en Grafana que pone una nota de salud a cada integración de la cartera (cliente, cuenta y canal) y la clasifica en uno de siete estados. Se calcula solo, sobre datos de producción, cada vez que se abre.

**Objetivo:** saber a quién contactar, a quién revisar técnicamente y a quién ofrecerle crecer, sin revisar cliente por cliente.

## Qué permite

- **Responder cuatro preguntas de un vistazo:**
  - ¿Quién está creciendo? Oportunidad comercial.
  - ¿Quién está maduro? Base a proteger.
  - ¿Quién está estancado? Potencial sin explotar.
  - ¿Quién está en caída o inactivo? Contacto prioritario.
- **Comparar cada canal contra su propio pasado:** no contra otros clientes. Mira pedidos, publicaciones actualizadas y productos vendidos.
- **Tener una cola de atención ordenada:** los canales en caída, inactivos o con la operación detenida, ordenados por severidad.
- **Acompañar el onboarding:** los canales nuevos tienen su propio índice de activación y la lista de hitos que les faltan.
- **Ver la evolución:** qué canales cambiaron de estado en los últimos 30 días y la tendencia semana a semana de cada cliente.
- **Mirar un cliente puntual:** un filtro convierte todo el tablero en una vista individual.

## Los siete estados

| Estado | Qué hacer |
|---|---|
| En activación | Seguimiento de onboarding |
| Inactivo | Contacto urgente |
| Operación detenida | Revisión técnica |
| En caída | Contacto prioritario |
| En crecimiento | Oportunidad comercial |
| Maduro | Monitoreo |
| Estancado | Entender el techo |

## Cifras clave

Tablero en vivo, base de producción, fecha de referencia 07/10/2026, base de 2 meses (la de la especificación).

| Dato | Valor |
|---|---|
| Canales evaluados | **341** |
| Estados posibles por canal | **7** |
| Secciones del tablero | **7** (vista general, cola de atención, cartera sana, oportunidades y estancados, en activación, vista por cliente, detalle completo) |
| Canales sanos (maduros + en crecimiento) | **92** |
| Canales en activación (menos de 90 días) | **44** |
| Canales que cambiaron de estado en 30 días | **147** |
| Canales en la cola de atención (inactivos + en caída + operación detenida) | **196** |

### Distribución por estado

| Estado | Canales | % |
|---|---|---|
| Inactivo | 173 | 51 % |
| En crecimiento | 58 | 17 % |
| En activación | 44 | 13 % |
| Maduro | 34 | 10 % |
| En caída | 23 | 7 % |
| Estancado | 9 | 3 % |
| Operación detenida | 0 | 0 % |

### Cola de atención

| Panel | Canales |
|---|---|
| Inactivos (contacto urgente) | 173 |
| En caída (contacto prioritario) | 23 |
| Operación detenida (revisión técnica) | 0 |
| Severidad alta | 141 |

### Transiciones de 30 días (07/09 → 07/10/2026)

| Hace 30 días ↓ / hoy → | Inactivo | En caída | En activación | Estancado | Maduro | En crecimiento |
|---|---|---|---|---|---|---|
| Inactivo (166) | 157 | 0 | 9 | 0 | 0 | 0 |
| En activación (173) | 16 | 23 | 35 | 9 | 32 | 58 |
| Maduro (2) | 0 | 0 | 0 | 0 | 2 | 0 |

- De los 173 canales que estaban en activación, **122 pasaron a un estado operativo** (58 en crecimiento, 32 maduros, 23 en caída, 9 estancados).
- **9 canales inactivos volvieron a activarse.**

### Filtros del tablero

Base de datos (DEV / Prod), Cliente, Meses de base (2, 3, 6, 12), Semanas de los gráficos (12, 26, 52, 104) y Fecha de referencia (cualquier día de los últimos 2 años). Las cifras de esta ficha usan 2 meses de base, el valor de la especificación.

## Qué se logró

- **De la intuición a una regla común:** todo el equipo lee la cartera con el mismo criterio y los mismos colores.
- **Prioridades claras:** la cola de atención dice a quién llamar primero.
- **Customer Success, Comercial y Onboarding en un mismo tablero:** cada área encuentra su lista.

**Mensaje:** toda la cartera con una nota de salud. Sabemos a quién llamar antes de que sea tarde.

## Ideas visuales para el video

- **Semáforo de cartera:** 341 puntos que se acomodan en la dona de estados (173 / 58 / 44 / 34 / 23 / 9).
- **Cuatro preguntas, cuatro respuestas:** cada pregunta aparece y se ilumina el grupo de canales que la responde.
- **Hace 30 días y hoy:** 173 puntos azules de "en activación" que se reparten en verde, amarillo y rojo; 122 se gradúan a un estado operativo.
