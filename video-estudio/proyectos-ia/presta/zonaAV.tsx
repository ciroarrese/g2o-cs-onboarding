// Zona A en vertical y cuadrado (disposición "apilada"): la tienda y el ERP con letra más grande, menos columnas y menos filas que en horizontal.
// En un cuadro angosto la ventana ocupa casi todo el ancho y la cámara no puede acercarse tanto como en horizontal: en lugar de mostrar la
// grilla completa con letra de 12 a 15 px, se muestra lo que cuenta la escena (el precio y el stock que cambian, la fila nueva del catálogo y el pedido
// que llega) con la letra de la herramienta escalada (`agrandar`). Mismos datos, mismos cuadros y mismas pastillas que en horizontal (zonaA.tsx).
import React from "react";
import { Easing } from "video-estudio/engine";
import { kf } from "video-estudio/kit";
import { xform } from "video-estudio/fx/core";
import { cornerRadius, entrance, readableOn, surfaceStyle, textStyle, useTheme, withAlpha } from "video-estudio/themes";
import { ART, PRODUCTS, T, TILE } from "./datos";
import { erpTheme, tiendaTheme } from "./temas";
import { BarraNavegador, Icon, Ventana, agrandar, inkOn, money } from "./ui";
import { useGeo } from "./geo";

const OUT = Easing.out;
const pulse = (f: number, at: number) => kf(f, [at, at + 6, at + 30], [0, 1, 0]);

/** Letra de cada herramienta en la disposición apilada. */
export const ERP_GRANDE = agrandar(erpTheme, 1.9);
export const TIENDA_GRANDE = agrandar(tiendaTheme, 1.55);

/** Productos que se muestran: el del precio, el del carrito, el del stock y el que llega del catálogo (índices de `PRODUCTS`). */
const IDX = [0, 1, 3, 5];
/** Filas del ERP: las cuatro primeras (precio y stock cambian en la 1 y la 4) y la nueva. */
const FILAS = [0, 1, 2, 3, 5];

// ---------- la tienda ----------
export const TiendaInteriorA: React.FC<{ f: number }> = ({ f }) => {
  const t = useTheme();
  const priceOk = f >= T.chipPrice[1];
  const stockOk = f >= T.chipStock[1];
  const newIn = kf(f, [T.chipCat[1], T.chipCat[1] + 14], [0, 1], OUT);
  const cartN = f >= T.cart ? 1 : 0;
  const acento = inkOn(t, t.color.accent);
  return (
    <div data-qa-ignore="offscreen" /* con la cámara en el ERP la tienda asoma cortada por el borde de abajo: es contexto, no mensaje */ style={{ display: "contents" }}>
      <BarraNavegador url="tienda-07.ejemplo.com.ar/cocina" />
      <div style={{ minHeight: 44, boxSizing: "border-box", background: t.color.surfaceAlt, display: "flex", alignItems: "center", padding: "0 22px", fontSize: t.type.ui.xs, color: t.color.textMuted, gap: 18, lineHeight: 1.25 }}>
        <span data-qa-decor>Iniciar sesión</span>
        <span style={{ marginLeft: "auto", color: t.color.text, ...textStyle(t, "label"), display: "flex", alignItems: "center", gap: 8 }}>
          <Icon d="M3 4h2l2 12h11l2-8H6M9 20h.1M17 20h.1" size={22} c={t.color.text} />
          Carrito ({cartN})
          {cartN > 0 && <span style={{ width: 10, height: 10, borderRadius: 5, background: t.color.accent, transform: xform({ scale: 1 + pulse(f, T.cart) * 0.8 }) }} />}
        </span>
      </div>
      <div data-qa-decor style={{ minHeight: 76, boxSizing: "border-box", display: "flex", alignItems: "center", padding: "0 22px", gap: 28, borderBottom: `1px solid ${t.color.border}` }}>
        <div style={{ fontSize: t.type.caption, ...textStyle(t, "title"), letterSpacing: "-0.02em", lineHeight: 1.25 }}>
          hogar<span style={{ color: acento }}>nova</span>
        </div>
        {["COCINA", "BAÑO", "DORMITORIO"].map((m, i) => (
          <span key={m} style={{ fontSize: t.type.ui.xs, ...textStyle(t, "label", { strong: true }), color: i === 0 ? acento : t.color.text }}>{m}</span>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, padding: "18px 22px" }}>
        {IDX.map((i) => {
          const pr = PRODUCTS[i]!;
          const isNew = i === 5;
          const vis = isNew ? newIn : 1;
          const price = i === 0 && priceOk ? pr.p[1] : pr.p[0];
          const stock = i === 3 && stockOk ? pr.s[1] : pr.s[0];
          const glow = i === 0 ? pulse(f, T.chipPrice[1]) : i === 3 ? pulse(f, T.chipStock[1]) : isNew ? pulse(f, T.chipCat[1]) : i === 1 ? pulse(f, T.cart) : 0;
          const press = i === 1 ? kf(f, [T.cart - 3, T.cart + 1, T.cart + 8], [0, 0.1, 0]) : 0;
          const boton = stock > 0 ? t.color.accent : t.data.botonApagado!;
          return (
            <div key={pr.id} style={{ ...entrance(t, vis, 0, { native: "scale", from: 0.9 }), background: t.color.surface, boxShadow: `${t.shadow.sm}, 0 0 0 ${+(glow * 5).toFixed(2)}px ${withAlpha(t.color.accent, 0.33)}`, position: "relative" }}>
              <div style={{ height: 96, background: t.data[TILE[i]!], display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon d={ART[pr.id]!} size={64} c={withAlpha(t.color.text, 0.33)} w={1.4} />
              </div>
              {isNew && <span style={{ position: "absolute", left: 0, top: 10, background: t.color.accent, color: readableOn(t, t.color.accent), fontSize: t.type.ui.xs, ...textStyle(t, "label", { strong: true }), padding: "3px 10px", lineHeight: 1.25 }}>NUEVO</span>}
              <div style={{ padding: "10px 10px 12px", textAlign: "center" }}>
                <div style={{ fontSize: t.type.ui.sm, minHeight: 30, lineHeight: 1.25 }}>{pr.n}</div>
                <div style={{ fontSize: t.type.ui.md, ...textStyle(t, "label", { strong: true }), lineHeight: 1.25, color: i === 0 && priceOk ? acento : t.color.text }}>{money(price)}</div>
                <div style={{ fontSize: t.type.ui.xs, color: stock > 0 ? t.data.stockOk : t.data.stockNo, margin: "4px 0 8px", lineHeight: 1.25 }}>{stock > 0 ? "En stock" : "Sin stock"}</div>
                <div style={{ minHeight: 40, background: boton, color: readableOn(t, boton), fontSize: t.type.ui.xs, ...textStyle(t, "label", { strong: true }), display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1.25, transform: xform({ scale: 1 - press }) }}>
                  AÑADIR AL CARRITO
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const TiendaA: React.FC<{ f: number }> = ({ f }) => {
  const { SW } = useGeo();
  return (
    <Ventana tool={TIENDA_GRANDE} x={SW.x} y={SW.y} w={SW.w} h={SW.h}>
      <TiendaInteriorA f={f} />
    </Ventana>
  );
};

// ---------- el ERP ----------
const CINTA: [string, string][] = [
  ["Artículos", "M3 7l9-4 9 4-9 4zM3 7v10l9 4 9-4V7"],
  ["Listas de precios", "M12 3v18M17 7H9.5a3 3 0 0 0 0 6h5a3 3 0 0 1 0 6H6"],
  ["Clientes", "M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0"],
];
const COLS = "1fr 170px 100px";

export const ErpInteriorA: React.FC<{ f: number }> = ({ f }) => {
  const t = useTheme();
  const flash = (at: number) => kf(f, [at, at + 4, at + 34], [0, 1, 0]);
  const rows = FILAS.filter((i) => i !== 5 || f >= T.erpNew);
  const toast = kf(f, [T.chipOrder[1], T.chipOrder[1] + 12], [0, 1], OUT);
  const ctl = cornerRadius(t, "control");
  return (
    <div data-qa-ignore="offscreen" /* la cámara mira a la tienda o a las pastillas y esta ventana asoma cortada por el borde de arriba: es contexto, no mensaje */ style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* el marco queda bajo la píldora del titular en la vista general: no es mensaje */}
      <div data-qa-ignore="overlap covered" style={{ display: "contents" }}>
        <div data-qa-decor style={{ minHeight: 46, background: t.color.accent, color: t.color.onAccent, fontSize: t.type.ui.md, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", flexShrink: 0, lineHeight: 1.25 }}>
          -Flexxus-
          <span style={{ position: "absolute", right: 16, letterSpacing: 14, fontSize: t.type.ui.sm }}>— ▢ ✕</span>
        </div>
        <div data-qa-decor style={{ display: "flex", gap: 28, padding: "10px 22px 0", fontSize: t.type.ui.sm, flexShrink: 0, lineHeight: 1.25 }}>
          {["Archivos", "Ventas", "Compras", "Stock"].map((s) => (
            <span key={s} style={{ paddingBottom: 6, ...(s === "Archivos" ? textStyle(t, "label", { strong: true }) : {}), borderBottom: `3px solid ${s === "Archivos" ? t.color.accent : "transparent"}` }}>{s}</span>
          ))}
        </div>
        <div data-qa-decor style={{ display: "flex", gap: 22, padding: "10px 22px", borderBottom: `1px solid ${t.color.border}`, fontSize: t.type.ui.xs, flexShrink: 0, lineHeight: 1.25 }}>
          {CINTA.map(([l, d], i) => (
            <div key={l} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "4px 10px", borderRadius: ctl, background: i === 0 ? t.data.cintaActiva : "transparent" }}>
              <Icon d={d} size={30} c={i === 0 ? t.color.accent : t.data.iconoCinta} w={1.5} />
              {l}
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
        <div data-qa-decor style={{ width: 40, background: t.data.riel, display: "flex", flexDirection: "column", alignItems: "center", gap: 14, paddingTop: 12, flexShrink: 0 }}>
          <Icon d="M4 6h16M4 12h16M4 18h16" c={t.color.surface} size={20} />
          <Icon d="M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM20 20l-4-4" c={t.color.surface} size={20} />
        </div>
        <div style={{ flex: 1, padding: "14px 18px", background: t.color.bg, position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 10 }}>
            <span style={{ fontSize: t.type.eyebrow, ...textStyle(t, "title"), lineHeight: 1.25 }}>Artículos</span>
            {["Nuevo", "Buscar"].map((b) => (
              <span key={b} data-qa-decor style={{ fontSize: t.type.ui.xs, padding: "5px 14px", border: `1px solid ${t.color.border}`, borderRadius: ctl, background: t.color.surface, lineHeight: 1.25 }}>{b}</span>
            ))}
          </div>
          <div style={{ border: `1px solid ${t.color.border}`, background: t.color.surface, fontSize: t.type.ui.sm, lineHeight: 1.25 }}>
            <div style={{ display: "grid", gridTemplateColumns: COLS, background: t.color.surfaceAlt, ...textStyle(t, "label", { strong: true }), padding: "8px 10px", minHeight: 44, alignItems: "center", boxSizing: "border-box", borderBottom: `1px solid ${t.color.border}` }}>
              <span>Descripción</span>
              <span>Precio L1</span>
              <span>Stock</span>
            </div>
            {rows.map((i) => {
              const pr = PRODUCTS[i]!;
              const pf = i === 0 ? flash(T.erpPrice) : 0;
              const sf = i === 3 ? flash(T.erpStock) : 0;
              const nf = i === 5 ? flash(T.erpNew) : 0;
              const price = i === 0 && f >= T.erpPrice ? pr.p[1] : pr.p[0];
              const stock = i === 3 && f >= T.erpStock ? pr.s[1] : pr.s[0];
              return (
                <div key={pr.id} style={{ display: "grid", gridTemplateColumns: COLS, padding: "9px 10px", minHeight: 52, alignItems: "center", boxSizing: "border-box", borderBottom: `1px solid ${t.color.surfaceAlt}`, background: nf > 0 ? withAlpha(t.data.resaltado!, nf * 0.6) : undefined }}>
                  <span>{pr.n}</span>
                  <span style={{ background: pf > 0 ? withAlpha(t.data.resaltado!, pf * 0.8) : undefined }}>{money(price)}</span>
                  <span style={{ background: sf > 0 ? withAlpha(t.data.resaltado!, sf * 0.8) : undefined }}>{stock}</span>
                </div>
              );
            })}
          </div>
          <div style={{ fontSize: t.type.ui.xs, color: t.color.textMuted, marginTop: 8, lineHeight: 1.25 }}>{rows.length} registros</div>
          {/* aviso del pedido que llega de la tienda */}
          <div style={{ position: "absolute", right: 18, bottom: 16, width: 430, padding: "12px 16px", boxSizing: "border-box", background: t.color.surface, borderLeft: `4px solid ${t.color.success}`, borderRadius: ctl, boxShadow: t.shadow.md, fontSize: t.type.ui.md, lineHeight: 1.3, ...entrance(t, toast, 0, { native: "slide", side: "right", distance: 40 }) }}>
            <b style={textStyle(t, "label", { strong: true })}>Pedido web #3104</b> recibido
            <div style={{ color: t.color.textMuted, fontSize: t.type.ui.xs }}>Cafetera de filtro · 1 unidad</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ErpA: React.FC<{ f: number }> = ({ f }) => {
  const { EW } = useGeo();
  return (
    <Ventana tool={ERP_GRANDE} x={EW.x} y={EW.y} w={EW.w} h={EW.h}>
      <ErpInteriorA f={f} />
    </Ventana>
  );
};
