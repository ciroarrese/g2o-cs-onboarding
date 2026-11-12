import { Composition, Folder } from "remotion";
import { BrandCheck } from "./scenes/BrandCheck";
import { SincroMonitorDemo } from "./scenes/SincroMonitorDemo";
import { Apertura } from "./scenes/Apertura";
import { AsistenteIA } from "./scenes/AsistenteIA";
import { Sincropresta } from "./scenes/Sincropresta";

export const RemotionRoot: React.FC = () => {
  return (
    <>
    <Folder name="Video">
      <Composition id="Apertura" component={Apertura} durationInFrames={300} fps={30} width={1920} height={1080} />
      <Composition id="AsistenteIA" component={AsistenteIA} durationInFrames={840} fps={30} width={1920} height={1080} />
      <Composition id="Sincropresta" component={Sincropresta} durationInFrames={1200} fps={30} width={1920} height={1080} />
      <Composition id="SincroMonitor" component={SincroMonitorDemo} durationInFrames={1440} fps={30} width={1920} height={1080} />
    </Folder>
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
      <Composition
        id="SincroMonitorDemo"
        component={SincroMonitorDemo}
        durationInFrames={1440}
        fps={30}
        width={1920}
        height={1080}
      />
    </Folder>
    </>
  );
};
