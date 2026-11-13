// Configuración de la apertura, las vueltas y el cierre (misma copia y mismas etiquetas que Apertura.tsx del proyecto de Remotion).
import type { StorySpec } from "video-estudio/stories";

export const spec: StorySpec = {
  title: { text: "Proyectos con IA", highlight: "con IA" },
  topics: [
    { id: "asistente-ia", name: "Asistente IA", line: "responde, dicta y escala sin salir del ticket" },
    { id: "sincro-presta", name: "Módulo Sincro Presta", line: "la tienda y el ERP, siempre sincronizados" },
    { id: "sincro-monitor", name: "Sincro Monitor", line: "avisa antes de que el cliente reclame" },
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
  // Lo más parecido al original: cartel de vidrio, lista en un renglón, titular acoplado, muro de 5 × 6 sin desenfoque de distancia,
  // nubes con el desenfoque del original (las manchas, colores y opacidad salen de los tokens `--cloud-*` del tema).
  design: { titleCard: "glass", list: "inline", handoff: "dock", wall: { columns: 5, rows: 6, blur: false }, clouds: { blur: 56 } },
};
