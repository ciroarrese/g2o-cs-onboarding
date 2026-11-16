// Configuración de la apertura, las vueltas y el cierre (misma copia y mismas etiquetas que Apertura.tsx del proyecto de Remotion).
import type { StorySpec } from "video-estudio/stories";

export const spec: StorySpec = {
  title: { text: "Proyectos con IA", highlight: "con IA" },
  topics: [
    { id: "asistente-ia", name: "Asistente IA", line: "responde, dicta y escala sin salir del ticket" },
    { id: "sincro-presta", name: "Módulo Sincro Presta", line: "la tienda y el ERP, siempre sincronizados" },
    { id: "sincro-monitor", name: "Sincro Monitor", line: "avisa antes de que el cliente reclame" },
    { id: "health-score", name: "Health Score", line: "a quién contactar primero" },
    // Tema sorpresa: la apertura y las vueltas anteriores anuncian cuatro; este aparece recién después de Health Score (sin vuelta al listado).
    { id: "video-studio", name: "Video Studio", line: "videos a partir de contexto y un design system", reveal: "late" },
  ],
  labels: [
    "Solo corregir", "Seguir contexto", "Con formato", "Escalado desarrollo", "Dictar",
    "Crear reporte", "Errores de pedidos", "Precios incrementales", "Cuenta corriente",
    "Control de crédito", "Pre-venta", "Productos sustitutos", "Sincronizando productos",
    "Error en servidor", "Error sincro", "Crear ticket", "Asignar ticket", "Arreglos por aprobar",
    "Incidentes abiertos", "Sincro Monitor · novedades", "En crecimiento", "Maduro", "En caída",
    "Cola de atención", "En activación", "Cartera sana", "Severidad alta", "Oportunidades comerciales",
  ],
  // Cierre solo con el logo: el dueño pidió quitar la leyenda del final.
  signoff: { logo: "brand/logo-grow2on.png" },
  timing: { closing: 457, interludeReveal: 210 }, // revelación escenificada (referencia 200, escalada a 210); el cierre suma 7 cuadros para que el total sea 6889 y la música con final real termine con el video
  design: { reveal: "stage" }, // la fila 05 entra con resorte, barrido de luz, miniatura que vuela y anillo en la tilde
  // Todo lo estético (cartel, lista, muro, nubes, pasos, atravesado, cierre, degradado) sale del design system de la marca (`theme.style`, ver ../theme.ts):
  // `design` solo lleva la revelación de la fila 05 (`reveal`).
};
