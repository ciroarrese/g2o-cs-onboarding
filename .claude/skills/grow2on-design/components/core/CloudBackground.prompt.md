Ambient background wash. 56px blur, 50% opacity, absolutely positioned inside a `position:relative` section; content above it needs `position:relative;z-index:1`.

```jsx
<Section style={{overflow:'hidden'}}><CloudBackground /><Container style={{position:'relative',zIndex:1}}>…</Container></Section>
```
