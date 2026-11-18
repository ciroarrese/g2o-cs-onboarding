// Imagen que frena la captura hasta que carga (regla "los recursos externos se esperan").
import React, { useLayoutEffect, useRef } from "react";
import { holdRender, releaseRender } from "video-estudio/engine";

export function Imagen({ src, style, alt = "" }: { src: string; style?: React.CSSProperties; alt?: string }) {
  const ref = useRef<HTMLImageElement>(null);
  useLayoutEffect(() => {
    const img = ref.current;
    if (!img || (img.complete && img.naturalWidth > 0)) return;
    const id = holdRender(`Imagen: ${src}`);
    const listo = () => releaseRender(id);
    img.addEventListener("load", listo, { once: true });
    img.addEventListener("error", listo, { once: true });
    return () => {
      img.removeEventListener("load", listo);
      img.removeEventListener("error", listo);
      releaseRender(id);
    };
  }, [src]);
  return <img ref={ref} src={src} alt={alt} style={{ display: "block", ...style }} />;
}
