import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

const weights = [
  ["Regular", "400"],
  ["Medium", "500"],
  ["SemiBold", "600"],
  ["Bold", "700"],
] as const;

export const fontsReady = Promise.all(
  weights.map(([name, weight]) =>
    loadFont({
      family: "Geist",
      url: staticFile(`fonts/Geist-${name}.otf`),
      weight,
      display: "block",
    }),
  ),
);
