// Parche para un defecto del toolkit (ver el informe): la tarjeta del título de <Opening> queda con `transform: translateY(0px) scale(1)` (el código escribe `scale(1.0000)`; el navegador lo normaliza)
// en reposo (cuadros ~16 a 78), un residuo que Chromium rasteriza según el historial y que hace fallar `render --check` en esos cuadros.
// Se anula SOLO ese transform residual dentro de la apertura; no toca el movimiento (mientras anima la escala no es 1.0000).
import React from "react";

export const Parche: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <div className="parche-apertura" style={{ position: "absolute", inset: 0 }}>
    <style>{`.parche-apertura [style*="translateY(0px) scale(1)"]{transform:none !important}`}</style>
    {children}
  </div>
);
