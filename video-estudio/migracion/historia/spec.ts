// Configuración de la apertura y del cierre (misma copia y mismas etiquetas que Apertura.tsx del proyecto de Remotion).
import type { StorySpec } from "video-estudio/stories";
// El logo vive en la carpeta externa; `?url` lo copia al bundle (así lo ven render, qa, sheet y privacy sin `--assets`).
import logo from "../../assets/brand/logo-grow2on.png?url";

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
  signoff: { logo, text: "Hecho con Claude" },
  timing: { opening: 300, closing: 450 },
};
