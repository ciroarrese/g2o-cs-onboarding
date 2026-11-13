// Configuración de la apertura, las vueltas y el cierre (misma copia y mismas etiquetas que Apertura.tsx del proyecto de Remotion).
import type { StorySpec } from "video-estudio/stories";

export const spec: StorySpec = {
  title: { text: "Proyectos con IA", highlight: "con IA" },
  topics: [
    // Los tres primeros no tienen escena en esta prueba, pero en el video aprobado ya se vieron: `seen` los muestra tildados en las vueltas.
    { id: "asistente-ia", name: "Asistente IA", line: "responde, dicta y escala sin salir del ticket", seen: true },
    { id: "sincro-presta", name: "Módulo Sincro Presta", line: "la tienda y el ERP, siempre sincronizados", seen: true },
    { id: "sincro-monitor", name: "Sincro Monitor", line: "avisa antes de que el cliente reclame", seen: true },
    { id: "health-score", name: "Health Score", line: "a quién contactar primero" },
  ],
  labels: [
    "Solo corregir", "Seguir contexto", "Con formato", "Escalado desarrollo", "Dictar",
    "Crear reporte", "Errores de pedidos", "Precios incrementales", "Cuenta corriente",
    "Control de crédito", "Pre-venta", "Productos sustitutos", "Sincronizando productos",
    "Error en servidor", "Error sincro", "Crear ticket", "Asignar ticket", "Arreglos por aprobar",
    "Incidentes abiertos", "Sincro Monitor · novedades", "En crecimiento", "Maduro", "En caída",
    "Cola de atención", "En activación", "Cartera sana", "Severidad alta", "Oportunidades comerciales",
  ],
  // El original cierra con el logo y "Hecho con Claude" (Claude en negrita): sin texto grande.
  signoff: { logo: "brand/logo-grow2on.png", tagline: "Hecho con **Claude**" },
  timing: { closing: 450 },
  // Todo lo estético (cartel de vidrio, lista en un renglón, muro de 5 x 6, atravesado del titular, cierre blanco, degradado de 105 cuadros)
  // sale del design system de la marca (`theme.style`, ver ../theme.ts). Lo único que queda por video: el desenfoque de las nubes (56 px
  // del original), porque `theme.cloud` todavía no tiene `blur`.
  design: { clouds: { blur: 56 } },
};
