// Zona A: la tienda (PrestaShop, tema Classic) y el ERP (Flexxus, grilla de Artículos) que el módulo mantiene sincronizados, y las cuatro pastillas
// que viajan entre ellos (Precios, Stock, Catálogo, Pedidos). Cada herramienta lleva su design system anidado (./temas.ts).
import React from "react";
import { Easing } from "video-estudio/engine";
import { kf } from "video-estudio/kit";
import { fade as op, xform } from "video-estudio/fx/core"; // opacidad y transform solo mientras cambian (en reposo no se emiten: residuos que rompen --check)
import { cornerRadius, entrance, readableOn, surfaceStyle, textStyle, useTheme, withAlpha } from "video-estudio/themes";
import { ART, EW, HUB, NAME, PRODUCTS, SW, T, TILE } from "./datos";
import { erpTheme, tiendaTheme } from "./temas";
import { BarraNavegador, Chip, Icon, Ventana, inkOn, money, useZoomed } from "./ui";

const OUT = Easing.out;
/** Destello que sube y baja alrededor del cuadro `at`. */
const pulse = (f: number, at: number) => kf(f, [at, at + 6, at + 30], [0, 1, 0]);

// ---------- la tienda ----------
const TiendaInterior: React.FC<{ f: number }> = ({ f }) => {
  const t = useTheme();
  const priceOk = f >= T.chipPrice[1];
  const stockOk = f >= T.chipStock[1];
  const newIn = kf(f, [T.chipCat[1], T.chipCat[1] + 14], [0, 1], OUT);
  const cartN = f >= T.cart ? 1 : 0;
  const ctl = cornerRadius(t, "control");
  const acento = inkOn(t, t.color.accent); // el acento celeste como texto no llega al contraste: su tono oscuro
  const solo = "min-size"; // detalle de la tienda que en la vista general no se lee (letra chica) y que la cámara no acerca: lo cuenta la pastilla que viaja
  return (
    <>
      <BarraNavegador url="tienda-07.ejemplo.com.ar/cocina" />
      {/* Classic: barra superior; el carrito es lo único que cambia (0 a 1) */}
      <div style={{ height: 32, background: t.color.surfaceAlt, display: "flex", alignItems: "center", padding: "0 22px", fontSize: t.type.ui.xs, color: t.color.textMuted, gap: 18, lineHeight: 1.25 }}>
        <span data-qa-decor>Contáctenos</span>
        <span data-qa-decor style={{ marginLeft: "auto" }}>Iniciar sesión</span>
        <span data-qa-ignore={solo} style={{ color: t.color.text, ...textStyle(t, "label"), display: "flex", alignItems: "center", gap: 6 }}>
          <Icon d="M3 4h2l2 12h11l2-8H6M9 20h.1M17 20h.1" size={16} c={t.color.text} />
          Carrito ({cartN})
          {cartN > 0 && <span style={{ width: 8, height: 8, borderRadius: 4, background: t.color.accent, transform: xform({ scale: 1 + pulse(f, T.cart) * 0.8 }) }} />}
        </span>
      </div>
      {/* Classic: logo, menú y buscador (marco de la tienda) */}
      <div data-qa-decor style={{ height: 64, display: "flex", alignItems: "center", padding: "0 22px", gap: 26, borderBottom: `1px solid ${t.color.border}`, boxSizing: "border-box" }}>
        <div style={{ fontSize: t.type.caption, ...textStyle(t, "title"), letterSpacing: "-0.02em", lineHeight: 1.25 }}>
          hogar<span style={{ color: acento }}>nova</span>
        </div>
        {["COCINA", "BAÑO", "DORMITORIO", "DECORACIÓN", "ILUMINACIÓN"].map((m, i) => (
          <span key={m} style={{ fontSize: t.type.ui.xs, ...textStyle(t, "label", { strong: true }), color: i === 0 ? acento : t.color.text }}>{m}</span>
        ))}
        <div style={{ marginLeft: "auto", width: 190, height: 32, borderRadius: ctl, background: t.color.surfaceAlt, fontSize: t.type.ui.xs, color: t.color.textMuted, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 10px" }}>
          Buscar en nuestro catálogo
          <Icon d="M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM20 20l-4-4" size={15} />
        </div>
      </div>
      <div data-qa-decor style={{ padding: "10px 22px", fontSize: t.type.ui.xs, color: t.color.textMuted, lineHeight: 1.25 }}>Inicio / Cocina</div>
      <div style={{ display: "flex", gap: 18, padding: "0 22px" }}>
        {/* filtros (marco) */}
        <div data-qa-decor style={{ width: 150, fontSize: t.type.ui.xs, lineHeight: 1.25 }}>
          <div style={{ ...textStyle(t, "label", { strong: true }), marginBottom: 10, fontSize: t.type.ui.sm }}>Filtrar por</div>
          <div style={{ color: t.color.textMuted, marginBottom: 6 }}>Categorías</div>
          {["Cocina", "Baño", "Dormitorio", "Decoración"].map((c, i) => (
            <div key={c} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <span style={{ width: 13, height: 13, border: `1px solid ${t.color.textMuted}`, borderRadius: ctl, background: i === 0 ? t.color.accent : "transparent", boxSizing: "border-box" }} />
              {c}
            </div>
          ))}
          <div style={{ color: t.color.textMuted, margin: "14px 0 6px" }}>Precio</div>
          <div style={{ height: 4, borderRadius: 2, background: t.color.border, position: "relative" }}>
            <div style={{ position: "absolute", left: "10%", right: "25%", height: 4, background: t.color.accent }} />
          </div>
        </div>
        {/* grilla de productos: lo que cambia con la sincro */}
        <div style={{ flex: 1, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
          {PRODUCTS.map((pr, i) => {
            const isNew = i === 5;
            const vis = isNew ? newIn : 1;
            const price = i === 0 && priceOk ? pr.p[1] : pr.p[0];
            const stock = i === 3 && stockOk ? pr.s[1] : pr.s[0];
            const glow = i === 0 ? pulse(f, T.chipPrice[1]) : i === 3 ? pulse(f, T.chipStock[1]) : isNew ? pulse(f, T.chipCat[1]) : i === 1 ? pulse(f, T.cart) : 0;
            const press = i === 1 ? kf(f, [T.cart - 3, T.cart + 1, T.cart + 8], [0, 0.1, 0]) : 0;
            const boton = stock > 0 ? t.color.accent : t.data.botonApagado!;
            const q = i >= 3 || (i === 0 && !priceOk) ? solo : undefined; // fila de abajo del catálogo (la cámara no baja hasta ahí) y precio de antes del cambio
            return (
              <div key={pr.id} style={{ ...entrance(t, vis, 0, { native: "scale", from: 0.9 }), background: t.color.surface, boxShadow: `${t.shadow.sm}, 0 0 0 ${+(glow * 5).toFixed(2)}px ${withAlpha(t.color.accent, 0.33)}`, position: "relative" }}>
                <div style={{ height: 150, background: t.data[TILE[i]!], display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon d={ART[pr.id]!} size={78} c={withAlpha(t.color.text, 0.33)} w={1.4} />
                </div>
                {isNew && <span data-qa-ignore={solo} style={{ position: "absolute", left: 0, top: 10, background: t.color.accent, color: readableOn(t, t.color.accent), fontSize: t.type.ui.xs, ...textStyle(t, "label", { strong: true }), padding: "3px 8px", lineHeight: 1.25 }}>NUEVO</span>}
                <div style={{ padding: "10px 10px 12px", textAlign: "center" }}>
                  <div data-qa-ignore={q} style={{ fontSize: t.type.ui.sm, minHeight: 36, lineHeight: 1.25 }}>{pr.n}</div>
                  <div data-qa-ignore={q} style={{ fontSize: t.type.ui.md, ...textStyle(t, "label", { strong: true }), lineHeight: 1.25, color: i === 0 && priceOk ? acento : t.color.text }}>{money(price)}</div>
                  <div data-qa-ignore={q} style={{ fontSize: t.type.ui.xs, color: stock > 0 ? t.data.stockOk : t.data.stockNo, margin: "4px 0 8px", lineHeight: 1.25 }}>{stock > 0 ? "En stock" : "Sin stock"}</div>
                  <div data-qa-ignore={q} style={{ minHeight: 30, background: boton, color: readableOn(t, boton), fontSize: t.type.ui.xs, ...textStyle(t, "label", { strong: true }), display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1.25, transform: xform({ scale: 1 - press }) }}>
                    AÑADIR AL CARRITO
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export const Tienda: React.FC<{ f: number }> = ({ f }) => (
  <Ventana tool={tiendaTheme} x={SW.x} y={SW.y} w={SW.w} h={SW.h}>
    <TiendaInterior f={f} />
  </Ventana>
);

// ---------- el ERP ----------
const CINTA: [string, string][] = [
  ["Artículos", "M3 7l9-4 9 4-9 4zM3 7v10l9 4 9-4V7"],
  ["Características", "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z"],
  ["Listas de precios", "M12 3v18M17 7H9.5a3 3 0 0 0 0 6h5a3 3 0 0 1 0 6H6"],
  ["Clientes", "M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0"],
  ["Proveedores", "M3 7h13v9H3zM16 10h4l1 3v3h-5M7 19h.1M17 19h.1"],
  ["Depósitos", "M3 21V9l9-5 9 5v12M8 21v-6h8v6"],
];
const COLS = "90px 1fr 110px 110px 70px";

const ErpInterior: React.FC<{ f: number }> = ({ f }) => {
  const t = useTheme();
  const flash = (at: number) => kf(f, [at, at + 4, at + 34], [0, 1, 0]);
  const rows = PRODUCTS.filter((_, i) => i !== 5 || f >= T.erpNew);
  const toast = kf(f, [T.chipOrder[1], T.chipOrder[1] + 12], [0, 1], OUT);
  const tabs = ["Inicio", "Archivos", "Ventas", "Compras", "Fondos", "Contabilidad", "Stock", "Informes"];
  const ctl = cornerRadius(t, "control");
  const zoomed = useZoomed();
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div data-qa-decor style={{ height: 34, background: t.color.accent, color: t.color.onAccent, fontSize: t.type.ui.md, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", flexShrink: 0 }}>
        -Flexxus-
        <span style={{ position: "absolute", right: 16, letterSpacing: 14, fontSize: t.type.ui.sm }}>— ▢ ✕</span>
      </div>
      <div data-qa-decor style={{ display: "flex", gap: 26, padding: "8px 22px 0", fontSize: t.type.ui.sm, flexShrink: 0, lineHeight: 1.25 }}>
        {tabs.map((s) => (
          <span key={s} style={{ paddingBottom: 6, ...(s === "Archivos" ? textStyle(t, "label", { strong: true }) : {}), borderBottom: `2px solid ${s === "Archivos" ? t.color.accent : "transparent"}` }}>{s}</span>
        ))}
      </div>
      <div data-qa-decor style={{ display: "flex", gap: 26, padding: "10px 22px", borderBottom: `1px solid ${t.color.border}`, fontSize: t.type.ui.xs, flexShrink: 0, lineHeight: 1.25 }}>
        {CINTA.map(([l, d], i) => (
          <div key={l} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "4px 8px", borderRadius: ctl, background: i === 0 ? t.data.cintaActiva : "transparent" }}>
            <Icon d={d} size={24} c={i === 0 ? t.color.accent : t.data.iconoCinta} w={1.5} />
            {l}
          </div>
        ))}
      </div>
      <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
        <div data-qa-decor style={{ width: 40, background: t.data.riel, display: "flex", flexDirection: "column", alignItems: "center", gap: 14, paddingTop: 12, flexShrink: 0 }}>
          <Icon d="M4 6h16M4 12h16M4 18h16" c={t.color.surface} size={18} />
          <Icon d="M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM20 20l-4-4" c={t.color.surface} size={18} />
        </div>
        <div style={{ flex: 1, padding: "14px 18px", background: t.color.bg, position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <span style={{ fontSize: t.type.eyebrow, ...textStyle(t, "title"), lineHeight: 1.25 }}>Artículos</span>
            {["Nuevo", "Modificar", "Buscar", "Exportar"].map((b) => (
              <span key={b} data-qa-decor style={{ fontSize: t.type.ui.xs, padding: "5px 12px", border: `1px solid ${t.color.border}`, borderRadius: ctl, background: t.color.surface, lineHeight: 1.25 }}>{b}</span>
            ))}
          </div>
          <div style={{ border: `1px solid ${t.color.border}`, background: t.color.surface, fontSize: t.type.ui.sm, lineHeight: 1.25 }}>
            <div style={{ display: "grid", gridTemplateColumns: COLS, background: t.color.surfaceAlt, ...textStyle(t, "label", { strong: true }), padding: "8px 10px", minHeight: 32, alignItems: "center", boxSizing: "border-box", borderBottom: `1px solid ${t.color.border}` }}>
              <span>Código</span>
              <span>Descripción</span>
              <span>Rubro</span>
              <span>Precio L1</span>
              <span>Stock</span>
            </div>
            {rows.map((pr) => {
              const i = PRODUCTS.indexOf(pr);
              const pf = i === 0 ? flash(T.erpPrice) : 0;
              const sf = i === 3 ? flash(T.erpStock) : 0;
              const nf = i === 5 ? flash(T.erpNew) : 0;
              const price = i === 0 && f >= T.erpPrice ? pr.p[1] : pr.p[0];
              const antes = i === 0 && f < T.erpPrice; // precio de antes del cambio: el zoom llega cuando ya cambió
              const stock = i === 3 && f >= T.erpStock ? pr.s[1] : pr.s[0];
              return (
                <div key={pr.id} data-qa-ignore={zoomed ? "offscreen" : undefined /* la grilla es más ancha que lo que encuadra el zoom: las celdas del borde quedan cortadas a propósito */} style={{ display: "grid", gridTemplateColumns: COLS, padding: "9px 10px", minHeight: 35, alignItems: "center", boxSizing: "border-box", borderBottom: `1px solid ${t.color.surfaceAlt}`, background: nf > 0 ? withAlpha(t.data.resaltado!, nf * 0.6) : undefined }}>
                  <span data-qa-ignore={i === 5 ? "min-size" : undefined /* fila nueva: aparece en la vista general */}>{pr.code}</span>
                  <span>{pr.n}</span>
                  <span>{pr.rubro}</span>
                  <span data-qa-ignore={antes ? "min-size" : undefined} style={{ background: pf > 0 ? withAlpha(t.data.resaltado!, pf * 0.8) : undefined }}>{money(price)}</span>
                  <span data-qa-ignore={i === 3 && f >= T.erpStock ? "min-size" : undefined /* el stock nuevo se cuenta en la vista general */} style={{ background: sf > 0 ? withAlpha(t.data.resaltado!, sf * 0.8) : undefined }}>{stock}</span>
                </div>
              );
            })}
          </div>
          <div data-qa-ignore={f >= T.erpNew ? "min-size" : undefined /* el conteo nuevo (6) aparece en la vista general */} style={{ fontSize: t.type.ui.xs, color: t.color.textMuted, marginTop: 8, lineHeight: 1.25 }}>{rows.length} registros</div>
          {/* aviso del pedido que llega de la tienda */}
          <div style={{ position: "absolute", right: 18, bottom: 18, width: 330, padding: "12px 16px", boxSizing: "border-box", background: t.color.surface, borderLeft: `4px solid ${t.color.success}`, borderRadius: ctl, boxShadow: t.shadow.md, fontSize: t.type.ui.md, lineHeight: 1.3, ...entrance(t, toast, 0, { native: "slide", side: "right", distance: 40 }) }}>
            <b style={textStyle(t, "label", { strong: true })}>Pedido web #3104</b> recibido
            <div style={{ color: t.color.textMuted, fontSize: t.type.ui.xs }}>Cafetera de filtro · 1 unidad</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Erp: React.FC<{ f: number }> = ({ f }) => (
  <Ventana tool={erpTheme} x={EW.x} y={EW.y} w={EW.w} h={EW.h}>
    <ErpInterior f={f} />
  </Ventana>
);

// ---------- el módulo en el medio y las pastillas que viajan ----------
const LANES = (t: ReturnType<typeof useTheme>) => [
  { label: "Precios", c: t.color.accent, r: T.chipPrice, from: [EW.x + 600, EW.y + 210], to: [SW.x + 260, SW.y + 300] },
  { label: "Stock", c: t.color.accent2, r: T.chipStock, from: [EW.x + 760, EW.y + 300], to: [SW.x + 700, SW.y + 560] },
  { label: "Catálogo", c: t.color.chart[2]!, r: T.chipCat, from: [EW.x + 300, EW.y + 360], to: [SW.x + 700, SW.y + 560] },
  { label: "Pedidos", c: t.color.success, r: T.chipOrder, from: [SW.x + 480, SW.y + 320], to: [EW.x + 680, EW.y + 620] },
];

export const Modulo: React.FC<{ f: number }> = ({ f }) => {
  const t = useTheme();
  return (
    <>
      <div style={{ position: "absolute", left: HUB.x - 190, top: HUB.y - 34, width: 380, height: 68, ...surfaceStyle(t, "card", { corner: "chip", level: "lg" }), boxShadow: `0 18px 40px -14px ${withAlpha(t.color.accent, 0.5)}`, display: "flex", alignItems: "center", justifyContent: "center", gap: 12, boxSizing: "border-box" }}>
        <svg width={34} height={34} viewBox="0 0 24 24" style={{ transform: `rotate(${(f * 4) % 360}deg)` }}>
          <defs>
            <linearGradient id="presta-hub" x1="0" x2="1">
              <stop offset="0" stopColor={t.color.accent} />
              <stop offset="1" stopColor={t.color.accent2} />
            </linearGradient>
          </defs>
          <path d="M20 12a8 8 0 0 1-14 5.3M4 12a8 8 0 0 1 14-5.3M18 3v4h-4M6 21v-4h4" fill="none" stroke="url(#presta-hub)" strokeWidth={2.4} strokeLinecap="round" />
        </svg>
        <span style={{ fontSize: t.type.eyebrow, ...textStyle(t, "title"), whiteSpace: "nowrap", lineHeight: 1.25 }}>{NAME}</span>
      </div>
      {LANES(t).map((l) => {
        if (f < l.r[0] || f > l.r[1] + 2) return null;
        const q = kf(f, [l.r[0], l.r[1]], [0, 1], Easing.bezier(0.45, 0, 0.25, 1));
        const [sx, sy] = l.from as [number, number];
        const [ex, ey] = l.to as [number, number];
        // curva cuadrática que pasa por el módulo
        const x = (1 - q) * (1 - q) * sx + 2 * (1 - q) * q * HUB.x + q * q * ex;
        const y = (1 - q) * (1 - q) * sy + 2 * (1 - q) * q * (HUB.y + 40) + q * q * ey;
        return (
          <div key={l.label} style={{ position: "absolute", left: 0, top: 0, transform: `translate(${Math.round(x)}px, ${Math.round(y)}px) translate(-50%, -50%)`, opacity: op(kf(f, [l.r[1] - 8, l.r[1]], [1, 0])), zIndex: 30 }}>
            <Chip c={l.c}>{l.label}</Chip>
          </div>
        );
      })}
    </>
  );
};

export const ZonaA: React.FC<{ f: number }> = ({ f }) => {
  const appear = kf(f, [0, 26], [0, 1], OUT);
  return (
    <div key={appear < 1 ? "entra" : "quieta"} style={{ opacity: op(appear) }}>
      <Tienda f={f} />
      <Erp f={f} />
      <Modulo f={f} />
    </div>
  );
};
