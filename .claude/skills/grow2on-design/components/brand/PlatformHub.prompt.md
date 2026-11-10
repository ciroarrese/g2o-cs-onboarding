The hero graphic of the "Conectá con las plataformas que ya usás" section — use it whenever the story is "everything connects to Grow2on". One per page.

```jsx
<PlatformHub
  center="assets/brand/platform-hub-center.png"
  nodes={[
    {src:'assets/platforms/platform-mercadolibre.png',label:'Mercado Libre',sub:'Sincronización en tiempo real'},
    {src:'assets/platforms/platform-shopify.png',label:'Shopify',sub:'Sincronización en tiempo real'}
  ]}
/>
```

Logos rest at `grayscale(.35) opacity(.9)` and go full colour on hover, where the circle also scales 1.14 and gains the pink-tinted node glow. Each circle drifts on its own `orbit-float` loop. Backplate is a very pale lilac wash, never white and never a strong gradient.
