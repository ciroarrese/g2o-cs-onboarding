# Idea 4: Health Score de clientes

**Fecha:** versión del tablero del 13/10/2026. **Fuente:** documento "Health Score Grow2On: informe de funcionamiento" (10/11/2026). Las cifras del tablero en vivo están **pendientes** de relevar.

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

| Dato | Valor |
|---|---|
| Canales activos evaluados al pasar a producción | **341** |
| Estados posibles por canal | **7** |
| Secciones del tablero | **7** |
| Distribución actual por estado | *Pendiente: relevar en el tablero* |

## Qué se logró

- **De la intuición a una regla común:** todo el equipo lee la cartera con el mismo criterio y los mismos colores.
- **Prioridades claras:** la cola de atención dice a quién llamar primero.
- **Customer Success, Comercial y Onboarding en un mismo tablero:** cada área encuentra su lista.

**Mensaje:** toda la cartera con una nota de salud. Sabemos a quién llamar antes de que sea tarde.

## Ideas visuales para el video

- **Semáforo de cartera:** 341 puntos que se acomodan en siete columnas de color, de inactivo a en crecimiento.
- **Cuatro preguntas, cuatro respuestas:** cada pregunta aparece y se ilumina el grupo de canales que la responde.
- **Antes y hace 30 días:** puntos que cambian de color y de columna para mostrar las transiciones de estado.
