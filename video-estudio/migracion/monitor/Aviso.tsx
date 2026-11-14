// El aviso del monitor: cae de la campana del encabezado, se pliega en una campanita redonda y vuela hacia la IZQUIERDA, al chat del equipo.
// El vuelo y la estela son de `FlyingCard`; el aviso se dibuja con el tema del panel (`monitorTheme`).
import React from "react";
import { Easing, useFrame } from "video-estudio/engine";
import { FlyingCard, ThemeScope, kf } from "video-estudio/kit";
import { fade as op } from "video-estudio/fx/core";
import { cornerRadius, surfaceStyle, textStyle, useTheme, withAlpha } from "video-estudio/themes";
import { ICON, appear } from "./piezas";
import { ALERT, BELL_LAND, STORE, T } from "./mundo";
import { monitorTheme } from "./temas";

const SIGNAL = T.teams.signal;
const ALERT_C = { x: ALERT.x + ALERT.w / 2, y: ALERT.y + ALERT.h / 2 };

/** El aviso de incidente: cae desde la campana y después se pliega en un círculo con una campana. */
const AlertToast: React.FC<{ f: number }> = ({ f }) => {
  const t = useTheme();
  if (f < T.alert || f > T.fold[1] + 2) return null;
  const drop = appear(f, T.alert, T.alert + 16);
  const fold = kf(f, T.fold, [0, 1], Easing.bezier(0.6, 0, 0.3, 1));
  const w = ALERT.w + (96 - ALERT.w) * fold;
  const h = ALERT.h + (96 - ALERT.h) * fold;
  const surf = surfaceStyle(t, "card", { level: "lg" });
  return (
    <div style={{ position: "absolute", left: Math.round(ALERT_C.x - w / 2), top: Math.round(ALERT_C.y - h / 2 - (1 - drop) * 70), width: Math.round(w), height: Math.round(h), boxSizing: "border-box", ...surf, borderRadius: cornerRadius(t, "card") + fold * 30, background: fold > 0.6 ? t.gradient.brand : t.color.surface, border: `1.5px solid ${withAlpha(t.color.accent, 0.33)}`, boxShadow: `inset ${6 * (1 - fold)}px 0 0 ${t.color.danger}, ${t.shadow.lg}`, opacity: op(drop), overflow: "hidden", zIndex: 30 }}>
      {/* el texto se apaga antes de que el borde en pliegue lo corte: a media transición ya casi no se ve */}
      <div style={{ padding: "16px 22px", opacity: op(1 - fold * 2), display: "flex", gap: 14 }}>
        <div style={{ width: 44, height: 44, borderRadius: 22, background: withAlpha(t.color.danger, 0.09), display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <svg width={24} height={24} viewBox="0 0 24 24"><path d={ICON.bell} fill="none" stroke={t.color.danger} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
        <div style={{ whiteSpace: "nowrap" }}>
          <div style={{ fontSize: t.type.ui.md, ...textStyle(t, "title"), color: t.color.text, lineHeight: 1.25 }}>Nuevo incidente · prioridad alta</div>
          <div style={{ fontSize: t.type.ui.sm, color: t.color.textMuted, marginTop: 2, lineHeight: 1.25 }}>{STORE} · Error en servidor</div>
          <div style={{ fontSize: t.type.ui.xs, color: t.color.accent, marginTop: 6, lineHeight: 1.25 }}>Avisando al equipo en Teams…</div>
        </div>
      </div>
      <svg width={40} height={40} viewBox="0 0 24 24" style={{ position: "absolute", left: Math.round(w / 2 - 20), top: Math.round(h / 2 - 20), opacity: op(Math.max(0, fold * 2 - 1)) }}>
        <path d={ICON.bell} fill="none" stroke={t.color.onAccent} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
};

/** La campanita vuela con estela del panel al chat (hacia la izquierda, con arco hacia arriba) y al llegar suelta dos ondas. */
const BellFlight: React.FC<{ f: number }> = ({ f }) => {
  const t = useTheme();
  const [a, b] = SIGNAL;
  if (f < a - 2 || f > b + 26) return null;
  const p = kf(f, [a, b], [0, 1], Easing.inOut);
  const size = 96 - p * 44;
  const landed = f >= b;
  const ping = appear(f, b, b + 24);
  return (
    <>
      <FlyingCard range={[a, b]} from={ALERT_C} to={BELL_LAND} arc={185} width={96} height={96} trail={5} trailLag={3} hideAfter>
        <div style={{ width: 96, height: 96, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: Math.round(size), height: Math.round(size), borderRadius: size, background: t.gradient.brand, boxShadow: `0 0 40px 10px ${withAlpha(t.color.accent, 0.33)}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width={size * 0.45} height={size * 0.45} viewBox="0 0 24 24" style={{ transform: `rotate(${(Math.sin(f * 0.8) * 16).toFixed(2)}deg)` }}>
              <path d={ICON.bell} fill="none" stroke={t.color.onAccent} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </FlyingCard>
      {landed &&
        [0, 1].map((r) => (
          <div key={r} style={{ position: "absolute", left: BELL_LAND.x - 40, top: BELL_LAND.y - 40, width: 80, height: 80, borderRadius: 40, border: `3px solid ${t.color.accent}`, transform: `scale(${(0.6 + (ping + r * 0.3) * 1.6).toFixed(3)})`, opacity: Math.max(0, +(1 - ping - r * 0.3).toFixed(3)), zIndex: 32 }} />
        ))}
    </>
  );
};

/** El aviso y la campanita que viaja, en el ámbito del panel. */
export const Aviso: React.FC = () => {
  const f = useFrame();
  return (
    <ThemeScope theme={monitorTheme}>
      <AlertToast f={f} />
      <BellFlight f={f} />
    </ThemeScope>
  );
};
