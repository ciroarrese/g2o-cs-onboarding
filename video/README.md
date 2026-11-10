# Video: avances con IA

Proyecto [Remotion](https://www.remotion.dev) que genera el video con el design system de Grow2on.

## Uso

```bash
cd video
npm install
npm run dev                                   # Remotion Studio (preview en vivo)
npx remotion render BrandCheck out/test.mp4   # render a MP4
```

## Estructura

- `src/brand/theme.ts`: tokens de color, tipografía, radios y sombras (copiados de `../.claude/skills/grow2on-design/tokens`).
- `src/brand/fonts.ts`: carga de Geist desde `public/fonts`.
- `src/brand/primitives.tsx`: `GradientText`, `CloudBackground`, `Stage`, `Reveal`, `CountUp` y `StatCard`. Las animaciones dependen del frame, no de CSS, para que el render sea determinista.
- `src/scenes/`: una escena por componente.
- `public/`: fuentes y assets de marca.

## Skills de agente (en la raíz del repo)

- `.claude/skills/remotion-*`: Agent Skills oficiales de Remotion (`npx remotion skills add`).
- `.claude/skills/grow2on-design`: el design system como skill.

Licencia: Remotion es gratis para uso individual y equipos de hasta 3 personas.
