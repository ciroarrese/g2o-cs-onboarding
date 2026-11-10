Edge decoration for wide sections whose content is centred and narrower than the viewport. Static — unlike `ParticleField` these dots never pulse, because they sit next to reading copy.

```jsx
<Section style={{position:'relative',overflow:'hidden'}}>
  <SpeckleEdge edges={['left','right']} count={200} spread={22} />
  <Container style={{position:'relative',zIndex:1}}>…</Container>
</Section>
```

Keep `spread` low enough that no dot lands behind text. Never place it over a coloured surface — it only reads on white.
