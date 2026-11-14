// Zona E: la cuenta corriente dentro de la tienda (historial, detalle de un movimiento), la factura en PDF con su código QR (de dibujo, sin
// datos reales ni enlace posible) y el teléfono que lo escanea y abre la consulta de ARCA. Todo ficticio.
import React from "react";
import { Easing, random } from "video-estudio/engine";
import { kf } from "video-estudio/kit";
import { fade as op, xform } from "video-estudio/fx/core";
import { PhoneFrame } from "video-estudio/fx";
import { ThemeScope } from "video-estudio/kit";
import { cornerRadius, entrance, readableOn, surfaceStyle, textStyle, useTheme, withAlpha } from "video-estudio/themes";
import { DATOS_ARCA, LINEAS_FACTURA, MOVES, PDF, PHONE, QR, SE, T } from "./datos";
import { arcaTheme, camaraTheme, tiendaTheme } from "./temas";
import { theme as marca } from "../theme";
import { BarraNavegador, Icon, Ventana, inkOn, money, useZoomed } from "./ui";

const OUT = Easing.out;
const COLS = "84px 1fr 100px 100px 100px";

/** Centro de la fila `i` del historial, en el mundo (el cursor hace clic ahí). */
/** Botón "Descargar factura (PDF)" del detalle: posición fija dentro del panel (el cursor hace clic en su centro). */
export const DESCARGA = { top: 330, h: 46 };
export const filaMov = (i: number) => SE.y + 266 + 18 + 44 + i * 47 + 22;

// ---------- la cuenta corriente de la tienda ----------
const CuentaInterior: React.FC<{ f: number }> = ({ f }) => {
  const t = useTheme();
  const detail = kf(f, [T.detail + 2, T.detail + 22], [0, 1], OUT);
  const acento = inkOn(t, t.color.accent);
  const ctl = cornerRadius(t, "control");
  let saldo = 0;
  const cut = useZoomed(0.9) ? "offscreen" : undefined; // la tabla es más ancha que el encuadre del zoom: las columnas del borde quedan cortadas a propósito
  return (
    <>
      <BarraNavegador url="tienda-07.ejemplo.com.ar/mi-cuenta/cuenta-corriente" />
      <div data-qa-decor style={{ height: 60, display: "flex", alignItems: "center", padding: "0 26px", borderBottom: `1px solid ${t.color.border}`, gap: 24, boxSizing: "border-box" }}>
        <div style={{ fontSize: t.type.caption, ...textStyle(t, "title"), lineHeight: 1.25 }}>
          hogar<span style={{ color: acento }}>nova</span>
        </div>
        <span style={{ marginLeft: "auto", fontSize: t.type.ui.sm, color: t.color.textMuted, lineHeight: 1.25 }}>Mayorista Sur · Cliente 004521</span>
      </div>
      <div data-qa-decor style={{ padding: "18px 26px 6px", fontSize: t.type.ui.sm, color: t.color.textMuted, lineHeight: 1.25 }}>Mi cuenta / Cuenta corriente</div>
      <div style={{ display: "flex", gap: 22, padding: "0 26px" }}>
        {[["Saldo", "$ 369.800", t.color.text], ["Vencido", "$ 0", t.data.stockOk!], ["Próximo vencimiento", "26/11/26", t.color.text]].map(([l, v, c]) => (
          <div key={l} data-qa-ignore={cut} style={{ flex: 1, padding: "14px 18px", background: t.color.surfaceAlt, borderRadius: ctl }}>
            <div data-qa-ignore="min-size" /* rótulo de la ficha: se lee en el acercamiento de 1010 a 1042, más de 24 cuadros después de que entra la ventana */ style={{ fontSize: t.type.ui.sm, color: t.color.textMuted, lineHeight: 1.25 }}>{l}</div>
            <div style={{ fontSize: t.type.body, ...textStyle(t, "label", { strong: true }), color: c, lineHeight: 1.25 }}>{v}</div>
          </div>
        ))}
      </div>
      <div style={{ margin: "18px 26px 0", width: detail > 0 ? 640 : SE.w - 52, fontSize: t.type.ui.sm }}>
        <div data-qa-ignore={cut ?? "min-size" /* encabezado de la tabla: se lee en el acercamiento de 1010 a 1042 */} style={{ display: "grid", gridTemplateColumns: COLS, padding: "10px 0", minHeight: 40, boxSizing: "border-box", alignItems: "center", color: t.color.textMuted, borderBottom: `2px solid ${t.color.border}`, lineHeight: 1.25 }}>
          <span>Fecha</span>
          <span>Comprobante</span>
          <span style={{ textAlign: "right" }}>Debe</span>
          <span style={{ textAlign: "right" }}>Haber</span>
          <span style={{ textAlign: "right" }}>Saldo</span>
        </div>
        {MOVES.map(([d, c, deb, hab], i) => {
          saldo += deb - hab;
          const a = kf(f, [T.rows + i * 5, T.rows + i * 5 + 12], [0, 1], OUT);
          const sel = i === 1 && detail > 0;
          return (
            <div key={c} data-qa-ignore={cut} style={{ display: "grid", gridTemplateColumns: COLS, padding: "12px 0", minHeight: 47, boxSizing: "border-box", borderBottom: `1px solid ${t.color.border}`, opacity: op(a), background: sel ? t.color.surfaceAlt : undefined, alignItems: "center", lineHeight: 1.25 }}>
              <span>{d}</span>
              <span style={{ color: acento, textDecoration: "underline", whiteSpace: "nowrap" }}>{c}</span>
              <span style={{ textAlign: "right" }}>{deb ? money(deb) : ""}</span>
              <span style={{ textAlign: "right" }}>{hab ? money(hab) : ""}</span>
              <span style={{ textAlign: "right", ...textStyle(t, "label", { strong: true }) }}>{money(saldo)}</span>
            </div>
          );
        })}
      </div>
      {/* detalle del movimiento */}
      <div data-qa-ignore={cut} style={{ position: "absolute", right: 0, top: 266, bottom: 0, width: 440, background: t.color.surface, borderLeft: `1px solid ${t.color.border}`, boxShadow: t.shadow.md, padding: "20px 24px", boxSizing: "border-box", ...entrance(t, detail, 0, { native: "slide", side: "right", distance: 460 }) }}>
        <div style={{ fontSize: t.type.ui.sm, color: t.color.textMuted, lineHeight: 1.25 }}>Detalle del movimiento</div>
        <div style={{ fontSize: t.type.eyebrow, ...textStyle(t, "title"), margin: "4px 0 14px", lineHeight: 1.25 }}>Factura A 0004-00012911</div>
        {LINEAS_FACTURA.map(([n, q, p]) => (
          <div key={n} style={{ display: "flex", justifyContent: "space-between", fontSize: t.type.ui.sm, padding: "9px 0", borderBottom: `1px solid ${t.color.border}`, lineHeight: 1.25 }}>
            <span>
              {q} × {n}
            </span>
            <span>{money(q * p)}</span>
          </div>
        ))}
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: t.type.ui.sm, padding: "9px 0", color: t.color.textMuted, lineHeight: 1.25 }}>
          <span>IVA 21 %</span>
          <span>$ 0</span>
        </div>
        <div data-qa-ignore={cut} style={{ display: "flex", justifyContent: "space-between", fontSize: t.type.ui.md, ...textStyle(t, "label", { strong: true }), padding: "10px 0", lineHeight: 1.25 }}>
          <span>Total</span>
          <span>{money(96200)}</span>
        </div>
        <div style={{ fontSize: t.type.ui.sm, color: t.color.textMuted, marginTop: 6, lineHeight: 1.25 }}>Vence 26/11/26 · CAE 76451238904512</div>
        <div style={{ position: "absolute", left: 24, right: 24, top: DESCARGA.top, minHeight: DESCARGA.h, boxSizing: "border-box", background: t.color.accent, color: readableOn(t, t.color.accent), fontSize: t.type.ui.md, ...textStyle(t, "label", { strong: true }), display: "flex", alignItems: "center", justifyContent: "center", gap: 10, lineHeight: 1.25, borderRadius: ctl, transform: xform({ scale: 1 - kf(f, [T.pdfClick - 3, T.pdfClick + 1, T.pdfClick + 8], [0, 0.08, 0]) }) }}>
          <Icon d="M12 4v11M7 10l5 5 5-5M5 20h14" c={readableOn(t, t.color.accent)} size={20} />
          DESCARGAR FACTURA (PDF)
        </div>
      </div>
    </>
  );
};

export const Cuenta: React.FC<{ f: number }> = ({ f }) => {
  const winIn = kf(f, [T.rows - 20, T.rows], [0, 1], OUT);
  return (
    <div style={{ opacity: op(winIn) }}>
      <Ventana tool={tiendaTheme} x={SE.x} y={SE.y} w={SE.w} h={SE.h}>
        <CuentaInterior f={f} />
      </Ventana>
    </div>
  );
};

// ---------- el código QR (dibujo: sin datos, sin patrones de alineación ni de formato; no se puede leer) ----------
export const QrCode: React.FC<{ size: number; ink: string; seed?: string }> = ({ size, ink, seed = "qr" }) => {
  const n = 25;
  const cell = size / n;
  const cells: React.ReactNode[] = [];
  const finder = (r: number, c: number) => {
    for (const [R, C] of [[0, 0], [0, n - 7], [n - 7, 0]] as const) {
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
      if (fv === -1 ? random(`${seed}${r}-${c}`) > 0.52 : fv === 1) cells.push(<rect key={`${r}-${c}`} x={c * cell} y={r * cell} width={cell + 0.3} height={cell + 0.3} fill={ink} />);
    }
  return (
    <svg width={size} height={size} style={{ display: "block" }}>
      {cells}
    </svg>
  );
};

// ---------- la factura en PDF ----------
export const Pdf: React.FC<{ f: number }> = ({ f }) => {
  const pdfIn = kf(f, [T.pdfFly[0], T.pdfFly[1]], [0, 1], Easing.bezier(0.3, 0, 0.2, 1));
  const scan = kf(f, [T.scan[0], T.scan[1]], [0, 1], Easing.linear);
  if (pdfIn <= 0) return null;
  const sc = +(0.4 + pdfIn * 0.6).toFixed(4);
  return (
    <div data-qa-fixed-scale style={{ position: "absolute", left: Math.round(PDF.x + (1 - pdfIn) * -300), top: Math.round(PDF.y + (1 - pdfIn) * 220), width: PDF.w, height: PDF.h, transform: sc === 1 ? undefined : `scale(${sc})`, opacity: op(pdfIn), zIndex: 10 }}>
      {/* la hoja es papel blanco con tinta de la marca, sea cual sea el design system del video */}
      <ThemeScope theme={marca} paint style={{ position: "absolute", inset: 0, ...surfaceStyle(marca, "card", { corner: "control", level: "lg" }), padding: "34px 38px", boxSizing: "border-box" }}>
        <PdfHoja />
      </ThemeScope>
      <div style={{ position: "absolute", left: PDF.w - 176, top: PDF.h - 196 }}>
        <QrCode size={QR.size} ink={marca.color.text} />
      </div>
      {/* línea de barrido */}
      {scan > 0 && scan < 1 && <div style={{ position: "absolute", left: PDF.w - 186, top: PDF.h - 196 + scan * 136, width: 156, height: 4, background: marca.color.accent, boxShadow: `0 0 16px 4px ${withAlpha(marca.color.accent, 0.53)}` }} />}
    </div>
  );
};

const PdfHoja: React.FC = () => {
  const t = useTheme();
  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontSize: t.type.ui.md, ...textStyle(t, "title"), lineHeight: 1.25 }}>Distribuidora Ejemplo S.A.</div>
          <div data-qa-ignore="min-size" /* línea chica de la factura: se lee de cerca con el teléfono (1126 en adelante) */ style={{ fontSize: t.type.ui.sm, color: t.color.textMuted, marginTop: 4, lineHeight: 1.25 }}>CUIT 30-71234567-8 · IVA Responsable Inscripto</div>
        </div>
        <div style={{ width: 64, height: 64, border: `2px solid ${t.color.text}`, fontSize: t.type.display.sm * 0.85, ...textStyle(t, "title", { strong: true }), display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1 }}>A</div>
      </div>
      <div style={{ fontSize: t.type.ui.md, ...textStyle(t, "title"), marginTop: 18, lineHeight: 1.25 }}>Factura N° 0004-00012911</div>
      <div data-qa-ignore="min-size" /* ídem: línea chica de la factura */ style={{ fontSize: t.type.ui.sm, color: t.color.textMuted, lineHeight: 1.25 }}>Fecha 12/11/2026 · Cliente: Mayorista Sur (004521)</div>
      <div style={{ height: 1, background: t.color.border, margin: "16px 0 8px" }} />
      {LINEAS_FACTURA.map(([n, q, p]) => (
        <div key={n} style={{ display: "grid", gridTemplateColumns: "40px 1fr 140px", fontSize: t.type.ui.md, padding: "8px 0", borderBottom: `1px solid ${t.color.surfaceAlt}`, lineHeight: 1.25 }}>
          <span>{q}</span>
          <span>{n}</span>
          <span style={{ textAlign: "right" }}>{money(q * p)}</span>
        </div>
      ))}
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: t.type.ui.md, ...textStyle(t, "title"), padding: "16px 0", borderTop: `2px solid ${t.color.text}`, marginTop: 10, lineHeight: 1.25 }}>
        <span>Total</span>
        <span>{money(96200)}</span>
      </div>
      <div data-qa-ignore="min-size" /* letra chica del pie de la factura (CAE y vencimiento): detalle de papel, el CAE se lee grande en la página de ARCA */ style={{ position: "absolute", left: 38, bottom: 44, fontSize: t.type.ui.xs, lineHeight: 1.7 }}>
        <div style={{ ...textStyle(t, "title"), fontSize: t.type.ui.sm }}>Comprobante autorizado</div>
        CAE N°: 76451238904512
        <br />
        Fecha de Vto. de CAE: 22/11/2026
      </div>
    </>
  );
};

// ---------- el teléfono: cámara que escanea el QR y página móvil de ARCA ----------
export const Telefono: React.FC<{ f: number }> = ({ f }) => {
  const inP = kf(f, [T.pdfFly[1] + 8, T.scan[0]], [0, 1], OUT);
  if (inP <= 0) return null;
  const rot = +(-6 + inP * 4).toFixed(3);
  return (
    <div style={{ position: "absolute", left: Math.round(PHONE.x + (1 - inP) * 260), top: Math.round(PHONE.y + (1 - inP) * 120), width: PHONE.w, height: PHONE.h, transform: `rotate(${rot}deg)`, opacity: op(inP), zIndex: 12 }}>
      <PhoneFrame start={T.pdfFly[1] + 8} width={PHONE.w} height={PHONE.h} bezel={12}>
        <PantallaTelefono f={f} />
      </PhoneFrame>
    </div>
  );
};

const PantallaTelefono: React.FC<{ f: number }> = ({ f }) => {
  const W = PHONE.w - 24;
  const scan = kf(f, [T.scan[0], T.scan[1]], [0, 1], Easing.linear);
  const found = f >= T.scan[1] - 2;
  const toArca = kf(f, [T.arca, T.arca + 12], [0, 1], OUT);
  const ok = kf(f, [T.arca + 16, T.arca + 26], [0, 1], OUT);
  const link = kf(f, [T.scan[1] - 2, T.scan[1] + 6], [0, 1], OUT) * (1 - toArca);
  return (
    <>
      {/* visor de la cámara */}
      <ThemeScope theme={camaraTheme} paint style={{ position: "absolute", inset: 0, opacity: op(1 - toArca) }}>
        <Visor W={W} scan={scan} found={found} link={link} />
      </ThemeScope>
      {/* página móvil de ARCA */}
      <ThemeScope theme={arcaTheme} paint style={{ position: "absolute", inset: 0, opacity: op(toArca), transform: toArca >= 1 ? undefined : `translateY(${Math.round((1 - toArca) * 40)}px)` }}>
        <PaginaArca f={f} ok={ok} />
      </ThemeScope>
    </>
  );
};

const Visor: React.FC<{ W: number; scan: number; found: boolean; link: number }> = ({ W, scan, found, link }) => {
  const t = useTheme();
  const ctl = cornerRadius(t, "control");
  return (
    <>
      <div style={{ position: "absolute", left: 40, top: 150, width: W - 80, height: 420, background: t.data.papel, borderRadius: ctl, transform: "rotate(3deg)", filter: "blur(0.4px)" }} />
      <div style={{ position: "absolute", left: (W - 180) / 2, top: 270 }}>
        <QrCode size={180} ink={t.data.tinta!} />
      </div>
      {[[0, 0], [1, 0], [0, 1], [1, 1]].map(([cx, cy]) => (
        <div key={`${cx}${cy}`} style={{ position: "absolute", left: (W - 230) / 2 + cx! * 186, top: 245 + cy! * 186, width: 44, height: 44, borderColor: found ? t.color.success : t.data.aviso, borderStyle: "solid", borderWidth: `${cy ? 0 : 5}px ${cx ? 5 : 0}px ${cy ? 5 : 0}px ${cx ? 0 : 5}px`, borderRadius: ctl * 2, boxSizing: "border-box" }} />
      ))}
      {scan > 0 && scan < 1 && <div style={{ position: "absolute", left: (W - 200) / 2, top: 262 + scan * 196, width: 200, height: 3, background: t.color.accent, boxShadow: `0 0 14px 4px ${withAlpha(t.color.accent, 0.53)}` }} />}
      <div style={{ position: "absolute", left: 18, right: 18, top: 60, padding: "12px 16px", borderRadius: cornerRadius(t, "card"), background: t.data.aviso, color: t.data.tinta, fontSize: t.type.eyebrow, opacity: op(link), transform: link < 1 ? `translateY(${Math.round((1 - link) * -20)}px)` : undefined, lineHeight: 1.25 }}>
        <b style={textStyle(t, "label", { strong: true })}>afip.gob.ar</b>
        <div style={{ color: t.data.avisoMudo, fontSize: t.type.eyebrow, lineHeight: 1.25 }}>Abrir el enlace del código QR</div>
      </div>
      <div style={{ position: "absolute", bottom: 36, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <span style={{ width: 64, height: 64, borderRadius: "50%", border: `4px solid ${t.data.aviso}`, boxSizing: "border-box" }} />
      </div>
    </>
  );
};

const PaginaArca: React.FC<{ f: number; ok: number }> = ({ f, ok }) => {
  const t = useTheme();
  const ctl = cornerRadius(t, "control");
  return (
    <>
      <div style={{ height: 50 }} />
      <div data-qa-decor style={{ margin: "0 16px 10px", height: 32, borderRadius: ctl * 2, background: t.color.surfaceAlt, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontSize: t.type.ui.xs, color: t.color.textMuted, lineHeight: 1.25 }}>
        <Icon d="M7 11V8a5 5 0 0 1 10 0v3M6 11h12v9H6z" size={13} />
        afip.gob.ar/fe/qr/?p=eyJ2ZXIiOjEs…
      </div>
      <div style={{ height: 52, background: t.data.azulOrganismo, color: readableOn(t, t.data.azulOrganismo!), display: "flex", alignItems: "center", padding: "0 20px", fontSize: t.type.eyebrow, ...textStyle(t, "label", { strong: true }), letterSpacing: "0.04em" }}>ARCA</div>
      <div style={{ padding: "18px 20px" }}>
        <div style={{ fontSize: t.type.caption, ...textStyle(t, "title"), lineHeight: 1.25 }}>Consulta de comprobante</div>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 12, padding: "8px 14px", borderRadius: ctl * 2, background: t.color.surfaceAlt, color: inkOn(t, t.color.success), fontSize: t.type.ui.md, ...textStyle(t, "label", { strong: true }), lineHeight: 1.25, opacity: op(ok), transform: ok < 1 ? `scale(${(0.9 + ok * 0.1).toFixed(3)})` : undefined }}>
          <Icon d="M5 12l4 4 10-10" c={inkOn(t, t.color.success)} size={18} w={2.6} />
          Comprobante autorizado
        </div>
        <div style={{ marginTop: 16 }}>
          {DATOS_ARCA.map(([l, v], i) => {
            const a = kf(f, [T.arca + 14 + i * 3, T.arca + 24 + i * 3], [0, 1], OUT);
            return (
              <div key={l} style={{ padding: "8px 0", borderBottom: `1px solid ${t.color.surfaceAlt}`, opacity: op(a) }}>
                <div style={{ fontSize: t.type.ui.xs, color: t.color.textMuted, lineHeight: 1.25 }}>{l}</div>
                <div style={{ fontSize: t.type.ui.sm, ...textStyle(t, "label"), lineHeight: 1.25 }}>{v}</div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};
