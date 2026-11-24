// Configuración de la apertura, las vueltas y el cierre (misma copia y mismas etiquetas que Apertura.tsx del proyecto de Remotion).
import React from "react";
import type { StorySpec } from "video-estudio/stories";
import { Particulas } from "../../g2o/Particulas";

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
  // Firma vacía a propósito: la marca la pone el cierre de Grow2on (g2o/Cierre) que sigue a la historia; así el logo no aparece dos veces seguidas.
  signoff: { slot: <React.Fragment /> },
  // Apertura de 5 s (la intro de Grow2on ya dio el título), recapitulación de 9,5 s y revelación escenificada de 7 s.
  timing: { opening: 180, closing: 284, interludeReveal: 210 },
  // Partículas de marca en el FONDO de todos los bloques (sobre el color y las nubes, bajo el contenido); una sola población continua en todo el video.
  backdrop: Particulas,
  design: { reveal: "stage", closing: { bar: false } }, // la fila 05 entra con resorte, barrido de luz, miniatura que vuela y anillo en la tilde
  // Todo lo estético (cartel, lista, muro, nubes, pasos, atravesado, cierre, degradado) sale del design system de la marca (`theme.style`, ver ../theme.ts):
  // `design` solo lleva la revelación de la fila 05 (`reveal`).
};
