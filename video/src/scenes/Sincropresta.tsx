import React from "react";
import { AbsoluteFill, Easing, random, useCurrentFrame } from "remotion";
import "../brand/fonts";
import { CloudBackground, GradientText } from "../brand/primitives";
import { color, font, gradient, radius } from "../brand/theme";
import { Cursor, DoodleArrow, DoodleCircle, OUT, Vignette, k } from "../brand/motion";
import { DockedHeadline } from "./Apertura";

/**
 * Scene 3: Módulo Sincro Presta (PrestaShop <-> ERP Flexxus). Five zones the
 * camera flies through, each with a subtitle (no voice):
 *  A. a home-goods PrestaShop store (Classic theme look) and the Flexxus ERP
 *     "Artículos" grid, synced live;
 *  B. weekly versions built from stacked "Mejora" / "Fix" items;
 *  C. the 2-minute hosting limit vs. the sync running inside the server;
 *  D. client features merging into the module's configuration screen;
 *  E. the account statement: history, movement detail, PDF invoice whose QR
 *     (with the CAE) opens the ARCA verification.
 * Every store, client, number and document is fictional.
 * 1200 frames at 30 fps.
 */

const NAME = "Módulo Sincro Presta";

// ---------- zones (world centres) ----------
const ZB = { x: 3200, y: 540 };
const ZC = { x: 3200, y: 1900 };
const ZD = { x: 960, y: 1900 };

// ---------- timing ----------
const T = {
  // A
  erpPrice: 34, chipPrice: [46, 86] as const,
  erpStock: 72, chipStock: [86, 126] as const,
  erpNew: 104, chipCat: [118, 158] as const,
  cart: 146, chipOrder: [152, 188] as const,
  // B
  weeks: 268,
  // C
  web: [482, 546] as const, fail: 546, move: [574, 604] as const, srv: [606, 690] as const,
  // D
  cards: 748, merge: 782, click1: 872, click2: 896, save: 918,
  // E
  rows: 960, detail: 1004, pdfClick: 1046, pdfFly: [1050, 1078] as const, scan: [1098, 1114] as const, arca: 1116,
  through: [1166, 1200] as const,
};

// ---------- camera ----------
// Keyframes [frame, focusX, focusY, scale]. Overviews sit at 0.88; the
// Digital Zoom moments snap in (1.3–1.7) on the action that matters.
const camKeys = (): [number, number, number, number][] => [
  [0, 960, 520, 0.93], [28, 960, 520, 0.93],
  [40, EW.x + 640, EW.y + 240, 1.6], [62, EW.x + 640, EW.y + 240, 1.6], // ERP price edit
  [76, SW.x + 300, SW.y + 300, 1.6], [104, SW.x + 300, SW.y + 300, 1.6], // price lands in the store
  [118, 960, 520, 0.93], [184, 960, 520, 0.93],
  [198, EW.x + 680, EW.y + 640, 1.9], [228, EW.x + 680, EW.y + 640, 1.9], // web order reaches the ERP
  [242, 2080, 540, 0.5], [258, ZB.x, 500, 0.9], [384, ZB.x, 500, 0.9],
  [396, 3564, 590, 1.55], [434, 3564, 590, 1.55], // a full week of fixes and improvements
  [446, ZB.x, 500, 0.9], [460, ZB.x, 1220, 0.5], [474, ZC.x, 1870, 0.88], [540, ZC.x, 1870, 0.88],
  [550, 3330, 1690, 1.55], [572, 3330, 1690, 1.55], // the wall cuts the sync
  [584, ZC.x, 1870, 0.88], [624, ZC.x, 1870, 0.88],
  [634, 3288, 2140, 1.6], [664, 3288, 2140, 1.6], // the server run passes 2:00
  [676, ZC.x, 1870, 0.88], [716, ZC.x, 1870, 0.88],
  [730, 2080, 1900, 0.5], [744, ZD.x, 1880, 0.88], [858, ZD.x, 1880, 0.88],
  [866, 1600, 1740, 1.5], [904, 1600, 1740, 1.5], // switches turned on
  [912, 1640, 1960, 1.25], [926, 1640, 1960, 1.25],
  [940, ZD.x, 2550, 0.5], [954, 630, 3180, 0.88], [1000, 630, 3180, 0.88],
  [1010, 980, 3300, 1.35], [1042, 980, 3300, 1.35], // movement detail
  [1060, 1500, 3200, 0.95], [1086, 1500, 3200, 0.95],
  [1098, 1800, 3220, 0.95], [1116, 1800, 3220, 0.95],
  [1126, PHONE.x + 190, PHONE.y + 390, 1.3], [1166, PHONE.x + 190, PHONE.y + 390, 1.3], // ARCA on the phone
];

const camera = (f: number) => {
  const K = camKeys();
  const t = K.map((q) => q[0]);
  let cam = { fx: k(f, t, K.map((q) => q[1])), fy: k(f, t, K.map((q) => q[2])), s: k(f, t, K.map((q) => q[3])) };
  const p = k(f, [T.through[0], T.through[1]], [0, 1], Easing.bezier(0.7, 0, 0.84, 0));
  if (p > 0) {
    cam = {
      fx: k(f, [T.through[0], T.through[0] + 10], [cam.fx, PHONE.x + 190]),
      fy: k(f, [T.through[0], T.through[0] + 10], [cam.fy, PHONE.y + 300]),
      s: cam.s * Math.pow(40, p),
    };
  }
  const tt = [0, 226, 258, 474, 744, 954, 1080, 1124, 1166];
  return {
    ...cam,
    rx: k(f, tt, [5, 3, 4, 3, 4, 3, 2, 3, 0]),
    ry: k(f, tt, [-8, 3, -5, 4, -5, 4, -3, 3, 0]) + Math.sin(f / 40) * 1.2,
  };
};

// ---------- shared ----------
const money = (v: number) => "$ " + v.toLocaleString("es-AR");
const Icon: React.FC<{ d: string; c?: string; size?: number; w?: number }> = ({ d, c = color.gray600, size = 20, w = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
    <path d={d} fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const Tag: React.FC<{ children: React.ReactNode; c: string; style?: React.CSSProperties }> = ({ children, c, style }) => (
  <span style={{ padding: "3px 10px", borderRadius: radius.pill, background: `${c}1f`, color: c, fontSize: 14, fontWeight: font.semibold, whiteSpace: "nowrap", ...style }}>{children}</span>
);
const Chip: React.FC<{ children: React.ReactNode; c: string }> = ({ children, c }) => (
  <span style={{ padding: "9px 18px", borderRadius: radius.pill, background: color.white, border: `2px solid ${c}`, color: c, fontSize: 19, fontWeight: font.semibold, whiteSpace: "nowrap", boxShadow: `0 12px 26px -10px ${c}aa` }}>{children}</span>
);

// PrestaShop Classic theme accent
const PS = { accent: "#24b9d7", text: "#232323", muted: "#7a7a7a", line: "#e5e5e5", bg: "#f6f6f6" };
// Flexxus ERP 4.0 accent
const FX = { red: "#e5313d", rail: "#3a3a3d", grid: "#f3f3f3", line: "#dcdcdc" };

// ---------- product art (simple line icons on pastel tiles) ----------
const ART: Record<string, string> = {
  ollas: "M4 10h16v6a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4zM2 10h2M20 10h2M9 6h6M12 6V4",
  cafetera: "M7 4h10l-1 5H8zM8 9h8v9a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2zM16 12h2a2 2 0 0 1 0 4h-2",
  sabanas: "M3 8h18v10H3zM3 12h18M7 8V6h10v2",
  toallon: "M6 3h12v14H6zM6 17l2 4M18 17l-2 4M6 7h12",
  lampara: "M8 3h8l3 8H5zM12 11v9M8 20h8",
  almohadon: "M4 6c3 1 13 1 16 0-1 4-1 8 0 12-3-1-13-1-16 0 1-4 1-8 0-12z",
};
const TILE = ["#fde7f1", "#fff0e2", "#ece6ff", "#e3f4ff", "#fff6d9", "#e6f7ee"];
const PRODUCTS = [
  { id: "ollas", n: "Set de ollas 5 piezas", code: "HG-1021", rubro: "Cocina", p: [48900, 51200], s: [12, 12] },
  { id: "cafetera", n: "Cafetera de filtro", code: "HG-1034", rubro: "Cocina", p: [36500, 36500], s: [4, 4] },
  { id: "sabanas", n: "Juego de sábanas 2 plazas", code: "HG-2010", rubro: "Dormitorio", p: [29800, 29800], s: [20, 20] },
  { id: "toallon", n: "Toallón de algodón", code: "HG-3005", rubro: "Baño", p: [12700, 12700], s: [0, 6] },
  { id: "almohadon", n: "Almohadón decorativo", code: "HG-4120", rubro: "Decoración", p: [9800, 9800], s: [30, 30] },
  { id: "lampara", n: "Lámpara de pie nórdica", code: "HG-5002", rubro: "Iluminación", p: [64500, 64500], s: [8, 8] },
];

// ---------- zone A: store + ERP ----------
const SW = { x: 60, y: 130, w: 860, h: 800 };
const EW = { x: 1000, y: 170, w: 860, h: 700 };
const HUB = { x: 960, y: 90 };

const Store: React.FC<{ f: number }> = ({ f }) => {
  const priceOk = f >= T.chipPrice[1];
  const stockOk = f >= T.chipStock[1];
  const newIn = k(f, [T.chipCat[1], T.chipCat[1] + 14], [0, 1], OUT);
  const pulse = (at: number) => k(f, [at, at + 6, at + 30], [0, 1, 0]);
  const cartN = f >= T.cart ? 1 : 0;
  return (
    <div style={{ position: "absolute", left: SW.x, top: SW.y, width: SW.w, height: SW.h, borderRadius: 18, background: color.white, boxShadow: "0 40px 90px -30px rgba(26,26,28,.4)", overflow: "hidden", transform: "translateZ(40px)", fontFamily: font.family, color: PS.text }}>
      {/* browser bar */}
      <div style={{ height: 40, background: "#eceef1", display: "flex", alignItems: "center", gap: 8, padding: "0 16px" }}>
        {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
          <span key={c} style={{ width: 11, height: 11, borderRadius: 6, background: c }} />
        ))}
        <div style={{ marginLeft: 14, flex: 1, height: 26, borderRadius: 8, background: color.white, fontSize: 14, color: PS.muted, display: "flex", alignItems: "center", padding: "0 12px" }}>tienda-07.ejemplo.com.ar/cocina</div>
      </div>
      {/* Classic: top nav */}
      <div style={{ height: 32, background: PS.bg, display: "flex", alignItems: "center", padding: "0 22px", fontSize: 13, color: PS.muted, gap: 18 }}>
        <span>Contáctenos</span>
        <span style={{ marginLeft: "auto" }}>Iniciar sesión</span>
        <span style={{ color: PS.text, fontWeight: font.medium, display: "flex", alignItems: "center", gap: 6 }}>
          <Icon d="M3 4h2l2 12h11l2-8H6M9 20h.1M17 20h.1" size={16} c={PS.text} />
          Carrito ({cartN})
          {cartN > 0 && <span style={{ width: 8, height: 8, borderRadius: 4, background: PS.accent, scale: String(1 + pulse(T.cart) * 0.8) }} />}
        </span>
      </div>
      {/* Classic: header with logo, menu, search */}
      <div style={{ height: 64, display: "flex", alignItems: "center", padding: "0 22px", gap: 26, borderBottom: `1px solid ${PS.line}` }}>
        <div style={{ fontSize: 24, fontWeight: font.semibold, letterSpacing: "-0.02em" }}>
          hogar<span style={{ color: PS.accent }}>nova</span>
        </div>
        {["COCINA", "BAÑO", "DORMITORIO", "DECORACIÓN", "ILUMINACIÓN"].map((m, i) => (
          <span key={m} style={{ fontSize: 13, fontWeight: font.semibold, color: i === 0 ? PS.accent : PS.text }}>{m}</span>
        ))}
        <div style={{ marginLeft: "auto", width: 190, height: 32, borderRadius: 4, background: PS.bg, fontSize: 12, color: PS.muted, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 10px" }}>
          Buscar en nuestro catálogo
          <Icon d="M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM20 20l-4-4" size={15} />
        </div>
      </div>
      <div style={{ padding: "10px 22px", fontSize: 13, color: PS.muted }}>Inicio / Cocina</div>
      <div style={{ display: "flex", gap: 18, padding: "0 22px" }}>
        {/* filters */}
        <div style={{ width: 150, fontSize: 13 }}>
          <div style={{ fontWeight: font.semibold, marginBottom: 10, fontSize: 14 }}>Filtrar por</div>
          <div style={{ color: PS.muted, marginBottom: 6 }}>Categorías</div>
          {["Cocina", "Baño", "Dormitorio", "Decoración"].map((c, i) => (
            <div key={c} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <span style={{ width: 13, height: 13, border: `1px solid ${PS.muted}`, borderRadius: 2, background: i === 0 ? PS.accent : "transparent" }} />
              {c}
            </div>
          ))}
          <div style={{ color: PS.muted, margin: "14px 0 6px" }}>Precio</div>
          <div style={{ height: 4, borderRadius: 2, background: PS.line, position: "relative" }}>
            <div style={{ position: "absolute", left: "10%", right: "25%", height: 4, background: PS.accent }} />
          </div>
        </div>
        {/* product grid */}
        <div style={{ flex: 1, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
          {PRODUCTS.map((pr, i) => {
            const isNew = i === 5;
            const vis = isNew ? newIn : 1;
            const price = i === 0 && priceOk ? pr.p[1] : pr.p[0];
            const stock = i === 3 && stockOk ? pr.s[1] : pr.s[0];
            const glow = i === 0 ? pulse(T.chipPrice[1]) : i === 3 ? pulse(T.chipStock[1]) : isNew ? pulse(T.chipCat[1]) : i === 1 ? pulse(T.cart) : 0;
            return (
              <div key={pr.id} style={{ opacity: vis, scale: String(0.9 + vis * 0.1), background: color.white, boxShadow: `0 2px 6px rgba(0,0,0,.08), 0 0 0 ${glow * 5}px ${PS.accent}55`, position: "relative" }}>
                <div style={{ height: 150, background: TILE[i], display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon d={ART[pr.id]} size={78} c="#00000055" w={1.4} />
                </div>
                {isNew && <span style={{ position: "absolute", left: 0, top: 10, background: PS.accent, color: "#fff", fontSize: 11, fontWeight: font.semibold, padding: "3px 8px" }}>NUEVO</span>}
                <div style={{ padding: "10px 10px 12px", textAlign: "center" }}>
                  <div style={{ fontSize: 14, height: 36, lineHeight: 1.25 }}>{pr.n}</div>
                  <div style={{ fontSize: 18, fontWeight: font.semibold, color: i === 0 && priceOk ? PS.accent : PS.text }}>{money(price)}</div>
                  <div style={{ fontSize: 11, color: stock > 0 ? "#4cbb6c" : "#ff4c4c", margin: "4px 0 8px" }}>{stock > 0 ? "En stock" : "Sin stock"}</div>
                  <div style={{ height: 30, background: stock > 0 ? PS.accent : "#cfd6d9", color: "#fff", fontSize: 12, fontWeight: font.semibold, display: "flex", alignItems: "center", justifyContent: "center", scale: String(1 - (i === 1 ? k(f, [T.cart - 3, T.cart + 1, T.cart + 8], [0, 0.1, 0]) : 0)) }}>
                    AÑADIR AL CARRITO
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const ERP: React.FC<{ f: number }> = ({ f }) => {
  const flash = (at: number) => k(f, [at, at + 4, at + 34], [0, 1, 0]);
  const rows = PRODUCTS.filter((_, i) => i !== 5 || f >= T.erpNew);
  const toast = k(f, [T.chipOrder[1], T.chipOrder[1] + 12], [0, 1], OUT);
  const tabs = ["Inicio", "Archivos", "Ventas", "Compras", "Fondos", "Contabilidad", "Stock", "Informes"];
  const ribbon = [
    ["Artículos", "M3 7l9-4 9 4-9 4zM3 7v10l9 4 9-4V7"],
    ["Características", "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z"],
    ["Listas de precios", "M12 3v18M17 7H9.5a3 3 0 0 0 0 6h5a3 3 0 0 1 0 6H6"],
    ["Clientes", "M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0"],
    ["Proveedores", "M3 7h13v9H3zM16 10h4l1 3v3h-5M7 19h.1M17 19h.1"],
    ["Depósitos", "M3 21V9l9-5 9 5v12M8 21v-6h8v6"],
  ];
  return (
    <div style={{ position: "absolute", left: EW.x, top: EW.y, width: EW.w, height: EW.h, borderRadius: 14, background: color.white, boxShadow: "0 40px 90px -30px rgba(26,26,28,.4)", overflow: "hidden", transform: "translateZ(40px)", fontFamily: font.family, color: "#333" }}>
      <div style={{ height: 34, background: FX.red, color: "#fff", fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
        -Flexxus-
        <span style={{ position: "absolute", right: 16, letterSpacing: 14, fontSize: 14 }}>— ▢ ✕</span>
      </div>
      <div style={{ display: "flex", gap: 26, padding: "8px 22px 0", fontSize: 13 }}>
        {tabs.map((t) => (
          <span key={t} style={{ paddingBottom: 6, fontWeight: t === "Archivos" ? font.semibold : font.regular, borderBottom: t === "Archivos" ? `2px solid ${FX.red}` : "2px solid transparent" }}>{t}</span>
        ))}
      </div>
      <div style={{ display: "flex", gap: 26, padding: "10px 22px 10px", borderBottom: `1px solid ${FX.line}`, fontSize: 12 }}>
        {ribbon.map(([l, d], i) => (
          <div key={l} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "4px 8px", borderRadius: 6, background: i === 0 ? "#fde8e9" : "transparent" }}>
            <Icon d={d} size={24} c={i === 0 ? FX.red : "#555"} w={1.5} />
            {l}
          </div>
        ))}
      </div>
      <div style={{ display: "flex", height: EW.h - 34 - 34 - 70 }}>
        <div style={{ width: 40, background: FX.rail, display: "flex", flexDirection: "column", alignItems: "center", gap: 14, paddingTop: 12 }}>
          <Icon d="M4 6h16M4 12h16M4 18h16" c="#fff" size={18} />
          <Icon d="M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM20 20l-4-4" c="#fff" size={18} />
        </div>
        <div style={{ flex: 1, padding: "14px 18px", background: "#fafafa", position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <span style={{ fontSize: 18, fontWeight: font.semibold }}>Artículos</span>
            {["Nuevo", "Modificar", "Buscar", "Exportar"].map((b) => (
              <span key={b} style={{ fontSize: 12, padding: "5px 12px", border: `1px solid ${FX.line}`, borderRadius: 4, background: "#fff" }}>{b}</span>
            ))}
          </div>
          <div style={{ border: `1px solid ${FX.line}`, background: "#fff", fontSize: 13 }}>
            <div style={{ display: "grid", gridTemplateColumns: "90px 1fr 110px 110px 70px", background: FX.grid, fontWeight: font.semibold, padding: "8px 10px", borderBottom: `1px solid ${FX.line}` }}>
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
              const stock = i === 3 && f >= T.erpStock ? pr.s[1] : pr.s[0];
              return (
                <div key={pr.id} style={{ display: "grid", gridTemplateColumns: "90px 1fr 110px 110px 70px", padding: "9px 10px", borderBottom: `1px solid ${FX.grid}`, background: nf > 0 ? `rgba(255,214,102,${nf * 0.6})` : "transparent" }}>
                  <span>{pr.code}</span>
                  <span>{pr.n}</span>
                  <span>{pr.rubro}</span>
                  <span style={{ background: pf > 0 ? `rgba(255,214,102,${pf * 0.8})` : "transparent" }}>{money(price)}</span>
                  <span style={{ background: sf > 0 ? `rgba(255,214,102,${sf * 0.8})` : "transparent" }}>{stock}</span>
                </div>
              );
            })}
          </div>
          <div style={{ fontSize: 12, color: "#888", marginTop: 8 }}>{rows.length} registros</div>
          <div style={{ position: "absolute", right: 18, bottom: 18, width: 330, padding: "12px 16px", background: "#fff", borderLeft: `4px solid ${color.success}`, boxShadow: "0 10px 26px -10px rgba(0,0,0,.3)", fontSize: 14, opacity: toast, translate: `${(1 - toast) * 40}px 0` }}>
            <b>Pedido web #3104</b> recibido
            <div style={{ color: "#888", fontSize: 12 }}>Cafetera de filtro · 1 unidad</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const LANES = [
  { label: "Precios", c: color.pink, t: T.chipPrice, from: [EW.x + 600, EW.y + 210], to: [SW.x + 260, SW.y + 300] },
  { label: "Stock", c: color.orange, t: T.chipStock, from: [EW.x + 760, EW.y + 300], to: [SW.x + 700, SW.y + 560] },
  { label: "Catálogo", c: color.purple, t: T.chipCat, from: [EW.x + 300, EW.y + 360], to: [SW.x + 700, SW.y + 560] },
  { label: "Pedidos", c: color.success, t: T.chipOrder, from: [SW.x + 480, SW.y + 320], to: [EW.x + 680, EW.y + 620] },
];

const ZoneA: React.FC<{ f: number }> = ({ f }) => {
  const appear = k(f, [0, 26], [0, 1], OUT);
  return (
    <div style={{ opacity: appear }}>
      <Store f={f} />
      <ERP f={f} />
      <div style={{ position: "absolute", left: HUB.x - 190, top: HUB.y - 34, width: 380, height: 68, borderRadius: radius.pill, background: color.white, boxShadow: "0 18px 40px -14px rgba(231,0,126,.5)", display: "flex", alignItems: "center", justifyContent: "center", gap: 12, transform: "translateZ(120px)" }}>
        <svg width={34} height={34} viewBox="0 0 24 24" style={{ rotate: `${f * 4}deg` }}>
          <defs>
            <linearGradient id="hubg" x1="0" x2="1">
              <stop offset="0" stopColor={color.pink} />
              <stop offset="1" stopColor={color.orange} />
            </linearGradient>
          </defs>
          <path d="M20 12a8 8 0 0 1-14 5.3M4 12a8 8 0 0 1 14-5.3M18 3v4h-4M6 21v-4h4" fill="none" stroke="url(#hubg)" strokeWidth={2.4} strokeLinecap="round" />
        </svg>
        <span style={{ fontSize: 22, fontWeight: font.semibold, color: color.black }}>{NAME}</span>
      </div>
      {LANES.map((l) => {
        const q = k(f, [l.t[0], l.t[1]], [0, 1], Easing.bezier(0.45, 0, 0.25, 1));
        if (f < l.t[0] || f > l.t[1] + 2) return null;
        const [sx, sy] = l.from;
        const [ex, ey] = l.to;
        const x = (1 - q) * (1 - q) * sx + 2 * (1 - q) * q * HUB.x + q * q * ex;
        const y = (1 - q) * (1 - q) * sy + 2 * (1 - q) * q * (HUB.y + 40) + q * q * ey;
        return (
          <div key={l.label} style={{ position: "absolute", left: x, top: y, translate: "-50% -50%", transform: "translateZ(160px)" }}>
            <Chip c={l.c}>{l.label}</Chip>
          </div>
        );
      })}
    </div>
  );
};

// ---------- zone B: versions built from improvements and fixes ----------
type Item = [("Mejora" | "Fix"), string];
const WEEKS: Item[][] = [
  [["Mejora", "Compatible con PrestaShop 9"], ["Fix", "Packs sin productos"], ["Mejora", "Soporte PHP 8"]],
  [["Mejora", "Precios incrementales"], ["Fix", "Pedidos perdidos"], ["Mejora", "Logs de cada sincro"]],
  [["Mejora", "Control de crédito"], ["Fix", "Catálogo apagado"], ["Mejora", "Pre-venta por OC"], ["Fix", "Descuentos duplicados"]],
  [["Mejora", "Cuenta corriente"], ["Mejora", "Productos sustitutos"], ["Fix", "Stock negativo"], ["Mejora", "Familias ocultas"], ["Fix", "Corte en Hostinger"]],
  [["Mejora", "Sincro interna en servidor"], ["Fix", "Imágenes repetidas"], ["Mejora", "PDF con CAE y QR"]],
];
const VERS = ["v2.1", "v2.3", "v2.5", "v2.7", "v2.9"];
const ZoneB: React.FC<{ f: number }> = ({ f }) => {
  const colW = 340, gap = 24, chipH = 50, chipGap = 8;
  const total = WEEKS.length * colW + (WEEKS.length - 1) * gap;
  const left = ZB.x - total / 2;
  const base = ZB.y + 200;
  const landed = WEEKS.map((items, w) => items.filter((_, j) => f >= T.weeks + w * 30 + j * 7 + 14).length);
  const lastWeek = landed.reduce((a, n, i) => (n > 0 ? i : a), -1);
  return (
    <>
      <div style={{ position: "absolute", left: ZB.x - 600, top: ZB.y - 420, width: 1200, textAlign: "center" }}>
        <div style={{ fontSize: 26, color: color.gray600, fontWeight: font.medium }}>{NAME}</div>
        <div style={{ fontSize: 150, fontWeight: font.stat, letterSpacing: "-0.03em", lineHeight: 1.05 }}>
          <GradientText>{lastWeek >= 0 ? VERS[lastWeek] : "v2.0"}</GradientText>
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 18, marginTop: 4 }}>
          <Tag c={color.success} style={{ fontSize: 18 }}>Mejora</Tag>
          <Tag c={color.orange} style={{ fontSize: 18 }}>Fix</Tag>
        </div>
      </div>
      {WEEKS.map((items, w) => {
        const x = left + w * (colW + gap);
        const done = landed[w] === items.length;
        return (
          <React.Fragment key={w}>
            {items.map(([kind, title], j) => {
              const s = T.weeks + w * 30 + j * 7;
              const p = k(f, [s, s + 16], [0, 1], Easing.bezier(0.3, 0, 0.2, 1.2));
              if (p <= 0) return null;
              const y = base - (j + 1) * (chipH + chipGap);
              const c = kind === "Mejora" ? color.success : color.orange;
              return (
                <div key={title} style={{ position: "absolute", left: x, top: y - (1 - p) * 420, width: colW, height: chipH, borderRadius: 12, background: color.white, border: `1.5px solid ${c}55`, boxShadow: `inset 5px 0 0 ${c}, 0 8px 18px -10px rgba(0,0,0,.25)`, display: "flex", alignItems: "center", gap: 10, padding: "0 12px 0 16px", opacity: Math.min(1, p * 2), fontSize: 17, color: color.black, whiteSpace: "nowrap", overflow: "hidden", boxSizing: "border-box" }}>
                  <Tag c={c}>{kind}</Tag>
                  {title}
                </div>
              );
            })}
            <div style={{ position: "absolute", left: x, top: base + 12, width: colW, textAlign: "center" }}>
              <div style={{ fontSize: 20, color: color.gray600 }}>Semana {w + 1}</div>
              <div style={{ marginTop: 8, opacity: done ? 1 : 0.2, scale: String(done ? 1 : 0.85) }}>
                <span style={{ padding: "6px 16px", borderRadius: radius.pill, background: done ? gradient.brand : color.gray200, color: "#fff", fontSize: 18, fontWeight: font.semibold }}>{VERS[w]}</span>
              </div>
            </div>
          </React.Fragment>
        );
      })}
    </>
  );
};

// ---------- zone C: the hosting limit vs. the server ----------
const ZoneC: React.FC<{ f: number }> = ({ f }) => {
  const L = { x: ZC.x - 760, w: 1520 };
  const top = ZC.y - 420, bot = ZC.y + 40;
  const trackX = 330, trackW = 1080, LIMIT = 0.42;
  const p1 = k(f, [T.web[0], T.web[1]], [0, LIMIT], Easing.linear);
  const failed = f >= T.fail;
  const revert = k(f, [T.fail + 8, T.fail + 26], [0, 1], Easing.bezier(0.5, 0, 0.2, 1));
  const shake = failed && f < T.fail + 12 ? Math.sin(f * 2.4) * 7 * (1 - (f - T.fail) / 12) : 0;
  const webSecs = Math.min(120, Math.round((p1 / LIMIT) * 120));
  const srvP = k(f, [T.srv[0], T.srv[1]], [0, 1], Easing.bezier(0.3, 0, 0.35, 1));
  const srvSecs = Math.round(srvP * 250);
  const done = f >= T.srv[1];
  const mmss = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  const move = k(f, [T.move[0], T.move[1]], [0, 1], Easing.bezier(0.5, 0, 0.2, 1));
  const srvOn = k(f, [T.move[0] - 10, T.move[0] + 10], [0, 1], OUT);
  const Box: React.FC<{ y: number; children: React.ReactNode; tone: string; dim?: number }> = ({ y, children, tone, dim = 1 }) => (
    <div style={{ position: "absolute", left: L.x, top: y, width: L.w, height: 330, borderRadius: 28, background: color.white, border: `1.5px solid ${tone}44`, boxShadow: "0 30px 70px -30px rgba(26,26,28,.35)", opacity: dim }}>{children}</div>
  );
  const icon = (d: string, c: string) => (
    <div style={{ position: "absolute", left: 50, top: 110, width: 210, height: 150, borderRadius: 22, background: `${c}14`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
      <Icon d={d} c={c} size={64} w={1.4} />
    </div>
  );
  return (
    <>
      {/* before: inside the web request */}
      <div style={{ translate: `${shake}px 0` }}>
        <Box y={top} tone={failed ? color.error : color.gray300}>
          <div style={{ position: "absolute", left: 50, top: 34, display: "flex", alignItems: "center", gap: 14 }}>
            <Tag c={color.gray600} style={{ fontSize: 18 }}>Antes</Tag>
            <span style={{ fontSize: 30, fontWeight: font.semibold, color: color.black }}>Dentro de la página web</span>
          </div>
          {icon("M3 5h18v14H3zM3 9h18M7 7h.1M10 7h.1", color.gray600)}
          <div style={{ position: "absolute", left: 60, top: 270, width: 190, textAlign: "center", fontSize: 16, color: color.gray600 }}>Petición del navegador</div>
          <div style={{ position: "absolute", right: 50, top: 30, fontSize: 48, fontWeight: font.stat, color: failed ? color.error : color.black, fontVariantNumeric: "tabular-nums" }}>{mmss(webSecs)}</div>
          <div style={{ position: "absolute", left: trackX, top: 140, fontSize: 20, color: color.gray600 }}>Sincronizando descuentos</div>
          <div style={{ position: "absolute", left: trackX, top: 176, width: trackW, height: 44, borderRadius: 22, background: color.gray100, overflow: "hidden" }}>
            <div style={{ width: `${p1 * (1 - revert) * 100}%`, height: "100%", borderRadius: 22, background: failed ? color.error : gradient.brand }} />
          </div>
          {/* the wall */}
          <div style={{ position: "absolute", left: trackX + trackW * LIMIT - 6, top: 150, width: 12, height: 96, borderRadius: 4, background: color.black, boxShadow: failed ? `0 0 0 ${k(f, [T.fail, T.fail + 6, T.fail + 30], [0, 10, 0])}px ${color.error}44` : "none" }} />
          <div style={{ position: "absolute", left: trackX + trackW * LIMIT - 160, top: 254, width: 320, textAlign: "center", fontSize: 19, color: color.black, fontWeight: font.medium }}>Límite del hosting · 2:00</div>
          {failed && <div style={{ position: "absolute", right: 50, top: 270, fontSize: 24, fontWeight: font.semibold, color: color.error, opacity: k(f, [T.fail, T.fail + 8], [0, 1]) }}>Se corta y se revierte todo</div>}
        </Box>
      </div>

      {/* now: an internal process on the server */}
      <Box y={bot} tone={done ? color.success : color.purple} dim={0.35 + srvOn * 0.65}>
        <div style={{ position: "absolute", left: 50, top: 34, display: "flex", alignItems: "center", gap: 14 }}>
          <Tag c={color.success} style={{ fontSize: 18 }}>Ahora</Tag>
          <span style={{ fontSize: 30, fontWeight: font.semibold, color: color.black }}>Proceso interno en el servidor</span>
        </div>
        {icon("M4 4h16v6H4zM4 14h16v6H4zM8 7h.1M8 17h.1M12 7h5M12 17h5", color.purple)}
        <div style={{ position: "absolute", left: 60, top: 270, width: 190, textAlign: "center", fontSize: 16, color: color.gray600 }}>Servidor</div>
        <div style={{ position: "absolute", right: 50, top: 30, fontSize: 48, fontWeight: font.stat, color: done ? color.success : color.black, fontVariantNumeric: "tabular-nums" }}>{mmss(srvSecs)}</div>
        <div style={{ position: "absolute", left: trackX, top: 140, fontSize: 20, color: color.gray600 }}>
          Sincronizando descuentos · {Math.round(srvP * 486250).toLocaleString("es-AR")}
        </div>
        <div style={{ position: "absolute", left: trackX, top: 176, width: trackW, height: 44, borderRadius: 22, background: color.gray100, overflow: "hidden" }}>
          <div style={{ width: `${srvP * 100}%`, height: "100%", borderRadius: 22, background: done ? color.success : gradient.brand }} />
        </div>
        {/* ghost of the old limit: no wall any more */}
        <div style={{ position: "absolute", left: trackX + trackW * 0.48 - 2, top: 150, width: 4, height: 96, borderLeft: `3px dashed ${color.gray300}` }} />
        <div style={{ position: "absolute", left: trackX + trackW * 0.48 - 160, top: 108, width: 320, textAlign: "center", fontSize: 19, color: color.gray600, fontWeight: font.medium }}>2:00 · sin límite</div>
        {done && <div style={{ position: "absolute", right: 50, top: 270, fontSize: 26, fontWeight: font.semibold, color: color.success, opacity: k(f, [T.srv[1], T.srv[1] + 8], [0, 1]) }}>Completo</div>}
      </Box>

      {/* the job moves from the web request into the server */}
      {f >= T.move[0] - 4 && f <= T.srv[0] + 4 && (
        <div style={{ position: "absolute", left: L.x + trackX + 40, top: top + 198 + move * (bot - top), translate: "-50% -50%", scale: String(1 + Math.sin(move * Math.PI) * 0.15) }}>
          <Chip c={color.purple}>Sincro de descuentos</Chip>
        </div>
      )}
    </>
  );
};

// ---------- zone D: features merge into the configuration screen ----------
const FEATURES: [string, string, boolean][] = [
  ["Control de crédito", "Valida el crédito del cliente en el checkout", true],
  ["Pre-venta por orden de compra", "Toma pedidos de productos sin stock", false],
  ["Productos sustitutos", "Ofrece un reemplazo cuando no hay stock", true],
  ["Familias y artículos ocultos", "Oculta líneas enteras de la tienda", false],
  ["Precios incrementales", "Actualiza solo los precios que cambiaron", true],
  ["Cuenta corriente", "Saldos, vencimientos y facturas en la tienda", true],
];
const CFG = { x: ZD.x + 40, y: ZD.y - 400, w: 820, rowY: 150, rowH: 96 };
const ZoneD: React.FC<{ f: number }> = ({ f }) => {
  const winIn = k(f, [T.cards - 6, T.cards + 20], [0, 1], OUT);
  const toggledOn = (i: number) => (i === 1 ? f >= T.click1 + 2 : i === 3 ? f >= T.click2 + 2 : FEATURES[i][2]);
  const saved = f >= T.save + 2;
  return (
    <>
      {/* configuration window (PrestaShop back office module page look) */}
      <div style={{ position: "absolute", left: CFG.x, top: CFG.y, width: CFG.w, height: 800, borderRadius: 18, background: color.white, boxShadow: "0 40px 90px -30px rgba(26,26,28,.4)", overflow: "hidden", opacity: winIn, transform: "translateZ(30px)" }}>
        <div style={{ height: 56, background: "#363a41", color: "#fff", display: "flex", alignItems: "center", padding: "0 22px", fontSize: 16, gap: 10 }}>
          <span style={{ color: "#bbcdd2" }}>Módulos /</span> {NAME}
          <span style={{ marginLeft: "auto", fontSize: 13, padding: "4px 10px", borderRadius: 4, background: "#25b9d7" }}>Configurar</span>
        </div>
        <div style={{ display: "flex", gap: 26, padding: "16px 26px 0", fontSize: 15, borderBottom: `1px solid ${PS.line}` }}>
          {["General", "Precios", "Pedidos", "Funciones"].map((t) => (
            <span key={t} style={{ paddingBottom: 10, fontWeight: t === "Funciones" ? font.semibold : font.regular, color: t === "Funciones" ? "#25b9d7" : PS.text, borderBottom: t === "Funciones" ? "3px solid #25b9d7" : "3px solid transparent" }}>{t}</span>
          ))}
        </div>
        {FEATURES.map(([name, desc], i) => {
          const s = T.merge + i * 14;
          const rowIn = k(f, [s + 14, s + 24], [0, 1], OUT);
          const on = toggledOn(i);
          const flip = i === 1 ? k(f, [T.click1, T.click1 + 8], [0, 1]) : i === 3 ? k(f, [T.click2, T.click2 + 8], [0, 1]) : 1;
          return (
            <div key={name} style={{ position: "absolute", left: 26, top: CFG.rowY + i * CFG.rowH - 50, width: CFG.w - 52, height: CFG.rowH - 12, display: "flex", alignItems: "center", gap: 16, borderBottom: `1px solid ${PS.line}`, opacity: rowIn }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 21, fontWeight: font.semibold, color: PS.text }}>{name}</div>
                <div style={{ fontSize: 15, color: PS.muted, marginTop: 4 }}>{desc}</div>
              </div>
              {/* PrestaShop "SÍ / NO" switch */}
              <div style={{ display: "flex", borderRadius: 4, overflow: "hidden", border: `1px solid ${PS.line}`, fontSize: 14, fontWeight: font.semibold, scale: String(1 + (i === 1 || i === 3 ? Math.sin(flip * Math.PI) * 0.12 : 0)) }}>
                <span style={{ padding: "7px 16px", background: on ? color.success : "#fff", color: on ? "#fff" : PS.muted }}>SÍ</span>
                <span style={{ padding: "7px 16px", background: !on ? "#e04f5f" : "#fff", color: !on ? "#fff" : PS.muted }}>NO</span>
              </div>
            </div>
          );
        })}
        <div style={{ position: "absolute", right: 26, bottom: 24, padding: "11px 26px", borderRadius: 4, background: saved ? color.success : "#25b9d7", color: "#fff", fontSize: 16, fontWeight: font.semibold, scale: String(1 - k(f, [T.save - 3, T.save + 1, T.save + 8], [0, 0.08, 0])) }}>
          {saved ? "Configuración guardada" : "Guardar"}
        </div>
      </div>

      {/* feature cards that fly in and merge into their row */}
      {FEATURES.map(([name, desc], i) => {
        const appear = k(f, [T.cards + i * 4, T.cards + i * 4 + 14], [0, 1], OUT);
        const s = T.merge + i * 14;
        const m = k(f, [s, s + 20], [0, 1], Easing.bezier(0.5, 0, 0.2, 1));
        if (m >= 1) return null;
        const sx = ZD.x - 820 + (i % 2) * 380;
        const sy = ZD.y - 330 + Math.floor(i / 2) * 230;
        const tx = CFG.x + 26;
        const ty = CFG.y + CFG.rowY + i * CFG.rowH - 50;
        const x = sx + (tx - sx) * m;
        const y = sy + (ty - sy) * m - Math.sin(m * Math.PI) * 60;
        const w = 340 + (CFG.w - 52 - 340) * m;
        return (
          <div key={name} style={{ position: "absolute", left: x, top: y, width: w, height: 150 - m * 66, borderRadius: 18 - m * 10, background: color.white, border: `2px solid ${color.pink}${m > 0.6 ? "00" : "88"}`, boxShadow: `0 20px 40px -14px rgba(231,0,126,${0.45 * (1 - m)})`, padding: "16px 20px", boxSizing: "border-box", opacity: appear * (1 - Math.max(0, m - 0.7) / 0.3), transform: `translateZ(${120 - m * 90}px)` }}>
            <div style={{ fontSize: 22, fontWeight: font.semibold, color: color.black }}>{name}</div>
            <div style={{ fontSize: 16, color: color.gray600, marginTop: 6, opacity: 1 - m }}>{desc}</div>
            <div style={{ fontSize: 13, color: color.pink, marginTop: 8, opacity: 1 - m }}>Hecha para Tienda {String(3 + i * 7).padStart(2, "0")}</div>
          </div>
        );
      })}
    </>
  );
};

// ---------- zone E: account statement, detail, PDF, QR, ARCA ----------
const SE = { x: 60, y: 2760, w: 1140, h: 880 };
const PDF = { x: 1290, y: 2780, w: 560, h: 840 };
const QR = { x: PDF.x + PDF.w - 176, y: PDF.y + PDF.h - 196, size: 136 };
const PHONE = { x: 1980, y: 2840, w: 380, h: 780 };
const MOVES = [
  ["05/11/26", "Factura A 0004-00012873", 184500, 0],
  ["12/11/26", "Factura A 0004-00012911", 96200, 0],
  ["14/11/26", "Recibo 0002-00004410", 0, 150000],
  ["19/11/26", "Factura A 0004-00012960", 251900, 0],
  ["21/11/26", "Nota de crédito A 0004-00000318", 0, 12800],
] as const;

const QrCode: React.FC<{ x: number; y: number; size: number }> = ({ x, y, size }) => {
  const n = 25;
  const cell = size / n;
  const cells: React.ReactNode[] = [];
  const finder = (r: number, c: number) => {
    for (const [R, C] of [[0, 0], [0, n - 7], [n - 7, 0]]) {
      if (r >= R && r < R + 7 && c >= C && c < C + 7) {
        const rr = r - R, cc = c - C;
        return rr === 0 || rr === 6 || cc === 0 || cc === 6 || (rr >= 2 && rr <= 4 && cc >= 2 && cc <= 4) ? 1 : 0;
      }
    }
    return -1;
  };
  for (let r = 0; r < n; r++)
    for (let c = 0; c < n; c++) {
      const fv = finder(r, c);
      if (fv === -1 ? random(`qr${r}-${c}`) > 0.52 : fv === 1) cells.push(<rect key={`${r}-${c}`} x={c * cell} y={r * cell} width={cell + 0.3} height={cell + 0.3} fill={color.black} />);
    }
  return (
    <svg style={{ position: "absolute", left: x, top: y }} width={size} height={size}>
      {cells}
    </svg>
  );
};

// A phone scans the QR printed on the PDF and opens the ARCA verification.
const Phone: React.FC<{ f: number }> = ({ f }) => {
  const inP = k(f, [T.pdfFly[1] + 8, T.scan[0]], [0, 1], OUT);
  if (inP <= 0) return null;
  const scan = k(f, [T.scan[0], T.scan[1]], [0, 1], Easing.linear);
  const found = f >= T.scan[1] - 2;
  const toArca = k(f, [T.arca, T.arca + 12], [0, 1], OUT);
  const ok = k(f, [T.arca + 16, T.arca + 26], [0, 1], OUT);
  const link = k(f, [T.scan[1] - 2, T.scan[1] + 6], [0, 1], OUT) * (1 - toArca);
  const W = PHONE.w - 24, H = PHONE.h - 24;
  return (
    <div style={{ position: "absolute", left: PHONE.x + (1 - inP) * 260, top: PHONE.y + (1 - inP) * 120, width: PHONE.w, height: PHONE.h, borderRadius: 58, background: "#111", boxShadow: "0 50px 90px -30px rgba(0,0,0,.55)", padding: 12, boxSizing: "border-box", opacity: inP, rotate: `${-6 + inP * 4}deg`, transform: "translateZ(120px)" }}>
      <div style={{ position: "relative", width: W, height: H, borderRadius: 46, overflow: "hidden", background: "#1d1d1f" }}>
        {/* camera viewfinder */}
        <div style={{ position: "absolute", inset: 0, opacity: 1 - toArca }}>
          <div style={{ position: "absolute", left: 40, top: 150, width: W - 80, height: 420, background: "#f2f2f2", borderRadius: 6, rotate: "3deg", filter: "blur(0.4px)" }} />
          <QrCode x={(W - 180) / 2} y={270} size={180} />
          {[[0, 0], [1, 0], [0, 1], [1, 1]].map(([cx, cy]) => (
            <div key={`${cx}${cy}`} style={{ position: "absolute", left: (W - 230) / 2 + cx * 186, top: 245 + cy * 186, width: 44, height: 44, borderColor: found ? color.success : "#fff", borderStyle: "solid", borderWidth: `${cy ? 0 : 5}px ${cx ? 5 : 0}px ${cy ? 5 : 0}px ${cx ? 0 : 5}px`, borderRadius: 8 }} />
          ))}
          {scan > 0 && scan < 1 && <div style={{ position: "absolute", left: (W - 200) / 2, top: 262 + scan * 196, width: 200, height: 3, background: color.pink, boxShadow: `0 0 14px 4px ${color.pink}88` }} />}
          <div style={{ position: "absolute", left: 18, right: 18, top: 60, padding: "12px 16px", borderRadius: 16, background: "rgba(255,255,255,.92)", fontSize: 15, color: color.black, opacity: link, translate: `0 ${(1 - link) * -20}px` }}>
            <b>afip.gob.ar</b>
            <div style={{ color: color.gray600, fontSize: 13 }}>Abrir el enlace del código QR</div>
          </div>
          <div style={{ position: "absolute", bottom: 36, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
            <span style={{ width: 64, height: 64, borderRadius: 32, border: "4px solid #fff" }} />
          </div>
        </div>
        {/* ARCA verification page, mobile */}
        <div style={{ position: "absolute", inset: 0, background: color.white, opacity: toArca, translate: `0 ${(1 - toArca) * 40}px` }}>
          <div style={{ height: 50 }} />
          <div style={{ margin: "0 16px 10px", height: 32, borderRadius: 10, background: color.gray100, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontSize: 13, color: color.gray600 }}>
            <Icon d="M7 11V8a5 5 0 0 1 10 0v3M6 11h12v9H6z" size={13} />
            afip.gob.ar/fe/qr/?p=eyJ2ZXIiOjEs…
          </div>
          <div style={{ height: 52, background: "#0d3a6b", color: "#fff", display: "flex", alignItems: "center", padding: "0 20px", fontSize: 19, fontWeight: font.semibold, letterSpacing: "0.04em" }}>ARCA</div>
          <div style={{ padding: "18px 20px" }}>
            <div style={{ fontSize: 22, fontWeight: font.semibold, color: color.black }}>Consulta de comprobante</div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 12, padding: "8px 14px", borderRadius: 10, background: `${color.success}1a`, color: color.success, fontSize: 17, fontWeight: font.semibold, opacity: ok, scale: String(0.9 + ok * 0.1) }}>
              <Icon d="M5 12l4 4 10-10" c={color.success} size={18} w={2.6} />
              Comprobante autorizado
            </div>
            <div style={{ marginTop: 16 }}>
              {[
                ["CUIT emisor", "30-71234567-8"],
                ["Tipo de comprobante", "Factura A"],
                ["Punto de venta", "0004"],
                ["Número", "00012911"],
                ["Fecha de emisión", "12/11/2026"],
                ["Importe total", money(96200)],
                ["CAE", "76451238904512"],
              ].map(([l, v], i) => {
                const a = k(f, [T.arca + 14 + i * 3, T.arca + 24 + i * 3], [0, 1], OUT);
                return (
                  <div key={l} style={{ padding: "8px 0", borderBottom: `1px solid ${color.gray100}`, opacity: a }}>
                    <div style={{ fontSize: 12, color: color.gray600 }}>{l}</div>
                    <div style={{ fontSize: 16, color: color.black, fontWeight: font.medium }}>{v}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div style={{ position: "absolute", top: 10, left: (W - 110) / 2, width: 110, height: 30, borderRadius: 16, background: "#000" }} />
      </div>
    </div>
  );
};

const ZoneE: React.FC<{ f: number }> = ({ f }) => {
  const winIn = k(f, [T.rows - 20, T.rows], [0, 1], OUT);
  const detail = k(f, [T.detail + 2, T.detail + 22], [0, 1], OUT);
  const pdfIn = k(f, [T.pdfFly[0], T.pdfFly[1]], [0, 1], Easing.bezier(0.3, 0, 0.2, 1));
  const scan = k(f, [T.scan[0], T.scan[1]], [0, 1], Easing.linear);
  let saldo = 0;
  return (
    <>
      {/* store: Mi cuenta > Cuenta corriente */}
      <div style={{ position: "absolute", left: SE.x, top: SE.y, width: SE.w, height: SE.h, borderRadius: 18, background: color.white, boxShadow: "0 40px 90px -30px rgba(26,26,28,.4)", overflow: "hidden", opacity: winIn, transform: "translateZ(30px)", color: PS.text }}>
        <div style={{ height: 40, background: "#eceef1", display: "flex", alignItems: "center", gap: 8, padding: "0 16px" }}>
          {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
            <span key={c} style={{ width: 11, height: 11, borderRadius: 6, background: c }} />
          ))}
          <div style={{ marginLeft: 14, flex: 1, height: 26, borderRadius: 8, background: color.white, fontSize: 14, color: PS.muted, display: "flex", alignItems: "center", padding: "0 12px" }}>tienda-07.ejemplo.com.ar/mi-cuenta/cuenta-corriente</div>
        </div>
        <div style={{ height: 60, display: "flex", alignItems: "center", padding: "0 26px", borderBottom: `1px solid ${PS.line}`, gap: 24 }}>
          <div style={{ fontSize: 24, fontWeight: font.semibold }}>
            hogar<span style={{ color: PS.accent }}>nova</span>
          </div>
          <span style={{ marginLeft: "auto", fontSize: 14, color: PS.muted }}>Mayorista Sur · Cliente 004521</span>
        </div>
        <div style={{ padding: "18px 26px 6px", fontSize: 14, color: PS.muted }}>Mi cuenta / Cuenta corriente</div>
        <div style={{ display: "flex", gap: 22, padding: "0 26px" }}>
          {[["Saldo", "$ 369.800", PS.text], ["Vencido", "$ 0", "#4cbb6c"], ["Próximo vencimiento", "26/11/26", PS.text]].map(([l, v, c]) => (
            <div key={l} style={{ flex: 1, padding: "14px 18px", background: PS.bg, borderRadius: 6 }}>
              <div style={{ fontSize: 13, color: PS.muted }}>{l}</div>
              <div style={{ fontSize: 26, fontWeight: font.semibold, color: c }}>{v}</div>
            </div>
          ))}
        </div>
        <div style={{ margin: "18px 26px 0", width: detail > 0 ? 640 : SE.w - 52, fontSize: 15 }}>
          <div style={{ display: "grid", gridTemplateColumns: "84px 1fr 100px 100px 100px", padding: "10px 0", color: PS.muted, borderBottom: `2px solid ${PS.line}` }}>
            <span>Fecha</span>
            <span>Comprobante</span>
            <span style={{ textAlign: "right" }}>Debe</span>
            <span style={{ textAlign: "right" }}>Haber</span>
            <span style={{ textAlign: "right" }}>Saldo</span>
          </div>
          {MOVES.map(([d, c, deb, hab], i) => {
            saldo += deb - hab;
            const a = k(f, [T.rows + i * 5, T.rows + i * 5 + 12], [0, 1], OUT);
            const sel = i === 1 && detail > 0;
            return (
              <div key={c} style={{ display: "grid", gridTemplateColumns: "84px 1fr 100px 100px 100px", padding: "12px 0", borderBottom: `1px solid ${PS.line}`, opacity: a, background: sel ? `${PS.accent}18` : "transparent", alignItems: "center" }}>
                <span>{d}</span>
                <span style={{ color: PS.accent, textDecoration: "underline", whiteSpace: "nowrap", overflow: "hidden" }}>{c}</span>
                <span style={{ textAlign: "right" }}>{deb ? money(deb) : ""}</span>
                <span style={{ textAlign: "right" }}>{hab ? money(hab) : ""}</span>
                <span style={{ textAlign: "right", fontWeight: font.semibold }}>{money(saldo)}</span>
              </div>
            );
          })}
        </div>
        {/* movement detail */}
        <div style={{ position: "absolute", right: 0, top: 266, bottom: 0, width: 440, background: color.white, borderLeft: `1px solid ${PS.line}`, boxShadow: "-20px 0 40px -20px rgba(0,0,0,.25)", padding: "20px 24px", boxSizing: "border-box", translate: `${(1 - detail) * 460}px 0` }}>
          <div style={{ fontSize: 13, color: PS.muted }}>Detalle del movimiento</div>
          <div style={{ fontSize: 21, fontWeight: font.semibold, margin: "4px 0 14px" }}>Factura A 0004-00012911</div>
          {[["Cafetera de filtro", 2, 36500], ["Toallón de algodón", 1, 12700], ["Almohadón decorativo", 1, 9800]].map(([n, q, p]) => (
            <div key={n as string} style={{ display: "flex", justifyContent: "space-between", fontSize: 15, padding: "9px 0", borderBottom: `1px solid ${PS.line}` }}>
              <span>
                {q as number} × {n as string}
              </span>
              <span>{money((q as number) * (p as number))}</span>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 15, padding: "9px 0", color: PS.muted }}>
            <span>IVA 21 %</span>
            <span>$ 0</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 19, fontWeight: font.semibold, padding: "10px 0" }}>
            <span>Total</span>
            <span>{money(96200)}</span>
          </div>
          <div style={{ fontSize: 14, color: PS.muted, marginTop: 6 }}>Vence 26/11/26 · CAE 76451238904512</div>
          <div style={{ marginTop: 22, height: 46, background: PS.accent, color: "#fff", fontSize: 16, fontWeight: font.semibold, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, scale: String(1 - k(f, [T.pdfClick - 3, T.pdfClick + 1, T.pdfClick + 8], [0, 0.08, 0])) }}>
            <Icon d="M12 4v11M7 10l5 5 5-5M5 20h14" c="#fff" size={20} />
            DESCARGAR FACTURA (PDF)
          </div>
        </div>
      </div>

      {/* the PDF invoice */}
      {pdfIn > 0 && (
        <div style={{ position: "absolute", left: PDF.x + (1 - pdfIn) * -300, top: PDF.y + (1 - pdfIn) * 220, width: PDF.w, height: PDF.h, scale: String(0.4 + pdfIn * 0.6), opacity: pdfIn, transform: "translateZ(80px)" }}>
          <div style={{ position: "absolute", inset: 0, background: color.white, borderRadius: 8, boxShadow: "0 50px 100px -30px rgba(26,26,28,.45)", padding: "34px 38px", boxSizing: "border-box", color: color.black }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: 22, fontWeight: font.semibold }}>Distribuidora Ejemplo S.A.</div>
                <div style={{ fontSize: 13, color: color.gray600, marginTop: 4 }}>CUIT 30-71234567-8 · IVA Responsable Inscripto</div>
              </div>
              <div style={{ width: 64, height: 64, border: `2px solid ${color.black}`, fontSize: 40, fontWeight: font.stat, display: "flex", alignItems: "center", justifyContent: "center" }}>A</div>
            </div>
            <div style={{ fontSize: 20, fontWeight: font.semibold, marginTop: 18 }}>Factura N° 0004-00012911</div>
            <div style={{ fontSize: 14, color: color.gray600 }}>Fecha 12/11/2026 · Cliente: Mayorista Sur (004521)</div>
            <div style={{ height: 1, background: color.gray200, margin: "16px 0 8px" }} />
            {[["Cafetera de filtro", 2, 36500], ["Toallón de algodón", 1, 12700], ["Almohadón decorativo", 1, 9800]].map(([n, q, p]) => (
              <div key={n as string} style={{ display: "grid", gridTemplateColumns: "40px 1fr 110px", fontSize: 15, padding: "8px 0", borderBottom: `1px solid ${color.gray100}` }}>
                <span>{q as number}</span>
                <span>{n as string}</span>
                <span style={{ textAlign: "right" }}>{money((q as number) * (p as number))}</span>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, fontWeight: font.semibold, padding: "16px 0", borderTop: `2px solid ${color.black}`, marginTop: 10 }}>
              <span>Total</span>
              <span>{money(96200)}</span>
            </div>
            <div style={{ position: "absolute", left: 38, bottom: 44, fontSize: 14, lineHeight: 1.7 }}>
              <div style={{ fontWeight: font.semibold, fontSize: 16 }}>Comprobante autorizado</div>
              CAE N°: 76451238904512
              <br />
              Fecha de Vto. de CAE: 22/11/2026
            </div>
          </div>
          <QrCode x={PDF.w - 176} y={PDF.h - 196} size={136} />
          {/* scan line */}
          {scan > 0 && scan < 1 && <div style={{ position: "absolute", left: PDF.w - 186, top: PDF.h - 196 + scan * 136, width: 156, height: 4, background: color.pink, boxShadow: `0 0 16px 4px ${color.pink}88` }} />}
        </div>
      )}

      <Phone f={f} />
    </>
  );
};

export const Sincropresta: React.FC = () => {
  const f = useCurrentFrame();
  const cam = camera(f);
  const zoomIn = Math.max(0, Math.min(1, (cam.s - 1.05) / 0.4));
  const wash = k(f, [T.through[1] - 14, T.through[1]], [0, 1], Easing.linear);
  const rowY = (i: number) => SE.y + 266 + 18 + 44 + i * 47 + 22;
  return (
    <AbsoluteFill style={{ background: color.gray50, fontFamily: font.family, overflow: "hidden" }}>
      <CloudBackground opacity={0.22} />
      <AbsoluteFill style={{ perspective: 2400 }}>
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: 1,
            height: 1,
            transformOrigin: "0 0",
            transformStyle: "preserve-3d",
            transform: `translate(960px, 540px) rotateX(${cam.rx}deg) rotateY(${cam.ry}deg) scale(${cam.s}) translate(${-cam.fx}px, ${-cam.fy}px)`,
          }}
        >
          <ZoneA f={f} />
          <ZoneB f={f} />
          <ZoneC f={f} />
          <ZoneD f={f} />
          <ZoneE f={f} />
          {/* doodles */}
          <DoodleCircle f={f} start={T.fail + 4} end={T.move[0]} cx={ZC.x - 760 + 330 + 1080 * 0.42} cy={ZC.y - 420 + 198} rx={64} ry={84} id="dc-wall" />
          <DoodleArrow f={f} start={T.move[0] - 6} end={T.srv[0] + 16} x1={ZC.x - 760 + 250} y1={ZC.y - 120} x2={ZC.x - 760 + 250} y2={ZC.y + 150} bend={0.35} id="da-move" />
          <DoodleCircle f={f} start={T.srv[0] + 34} end={T.srv[1] + 20} cx={ZC.x - 760 + 330 + 1080 * 0.48} cy={ZC.y + 40 + 198} rx={72} ry={84} id="dc-nolimit" />
          <DoodleCircle f={f} start={T.click2 + 10} end={T.save + 20} cx={CFG.x + CFG.w - 130} cy={CFG.y + CFG.rowY + 3 * CFG.rowH - 50 + 42} rx={90} ry={34} id="dc-switch" />
          <DoodleCircle f={f} start={T.scan[0] - 10} end={T.arca + 20} cx={QR.x + QR.size / 2} cy={QR.y + QR.size / 2} rx={98} ry={98} id="dc-qr" />
          <DoodleArrow f={f} start={T.scan[0] - 8} end={T.arca + 10} x1={QR.x + QR.size + 24} y1={QR.y + 40} x2={PHONE.x - 16} y2={PHONE.y + 330} bend={-0.2} id="da-phone" />
          <Cursor
            f={f}
            show={[852, 930]}
            clicks={[T.click1, T.click2, T.save]}
            keys={[
              [852, CFG.x + 500, CFG.y + 700],
              [T.click1 - 8, CFG.x + CFG.w - 70, CFG.y + CFG.rowY + 1 * CFG.rowH - 50 + 42],
              [T.click2 - 8, CFG.x + CFG.w - 70, CFG.y + CFG.rowY + 3 * CFG.rowH - 50 + 42],
              [T.save - 8, CFG.x + CFG.w - 110, CFG.y + 800 - 46],
              [930, CFG.x + CFG.w - 110, CFG.y + 800 - 46],
            ]}
          />
          <Cursor
            f={f}
            show={[968, 1062]}
            clicks={[T.detail, T.pdfClick]}
            keys={[
              [968, SE.x + 500, SE.y + 760],
              [T.detail - 8, SE.x + 26 + 84 + 120, rowY(1)],
              [T.pdfClick - 10, SE.x + SE.w - 220, SE.y + 266 + 452],
              [1062, SE.x + SE.w - 220, SE.y + 266 + 452],
            ]}
          />
        </div>
      </AbsoluteFill>
      <Vignette amount={zoomIn * (1 - k(f, [T.through[0], T.through[0] + 10], [0, 1]))} />
      <DockedHeadline i={1} f={f} start={-30} hide={(cam.s - 1.0) / 0.08} />
      <AbsoluteFill style={{ background: color.gray50, opacity: wash }} />
    </AbsoluteFill>
  );
};
