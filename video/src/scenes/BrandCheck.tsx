import React from "react";
import { Img, staticFile } from "remotion";
import "../brand/fonts";
import {
  CountUp,
  Eyebrow,
  GradientText,
  Heading,
  Reveal,
  Stage,
  StatCard,
} from "../brand/primitives";
import { color, type } from "../brand/theme";

type Props = {
  readonly eyebrow: string;
  readonly title: string;
  readonly highlight: string;
  readonly statValue: number;
  readonly statLabel: string;
};

/** Smoke test of the Grow2on brand layer. Placeholder copy, not real data. */
export const BrandCheck: React.FC<Props> = ({
  eyebrow,
  title,
  highlight,
  statValue,
  statLabel,
}) => {
  return (
    <Stage>
      <Img src={staticFile("brand/logo-grow2on.png")} style={{ height: 64, alignSelf: "flex-start" }} />
      <div style={{ display: "flex", flex: 1, alignItems: "center", gap: 96 }}>
        <div style={{ flex: 1.3, display: "flex", flexDirection: "column", gap: 28 }}>
          <Reveal delay={6}>
            <Eyebrow>{eyebrow}</Eyebrow>
          </Reveal>
          <Reveal delay={12}>
            <Heading size={type.h1}>
              {title} <GradientText>{highlight}</GradientText>
            </Heading>
          </Reveal>
          <Reveal delay={22}>
            <div style={{ fontSize: type.body, lineHeight: 1.5, color: color.gray600 }}>
              Tokens, Geist y animaciones del sitio, renderizados en video.
            </div>
          </Reveal>
        </div>
        <Reveal delay={30} style={{ flex: 1 }}>
          <StatCard value={<CountUp to={statValue} delay={36} suffix="%" />} label={statLabel} />
        </Reveal>
      </div>
    </Stage>
  );
};
