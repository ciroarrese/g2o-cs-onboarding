import { Composition, Folder } from "remotion";
import { BrandCheck } from "./scenes/BrandCheck";

export const RemotionRoot: React.FC = () => {
  return (
    <Folder name="Pruebas">
      <Composition
        id="BrandCheck"
        component={BrandCheck}
        durationInFrames={180}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          eyebrow: "Prueba de marca",
          title: "Design system listo.",
          highlight: "Ahora, los datos.",
          statValue: 80,
          statLabel: "Valor de ejemplo",
        }}
      />
    </Folder>
  );
};
