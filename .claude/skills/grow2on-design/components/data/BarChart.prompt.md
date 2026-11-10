Ambient metric bars — decorative texture behind a headline number, never a chart with axes, labels or a legend.

```jsx
<StatCard value="4.2M" label="de ventas promedio por mes">
  <BarChart values={[3,5,4,7,6,9,5,8,6,10,7,9,6,11,8,10,7,12]} />
</StatCard>
```

Bars are violet (#770ce9 → #9a45f2), flat-bottomed, 3px top radius. Never pink — pink is reserved for the number itself.
