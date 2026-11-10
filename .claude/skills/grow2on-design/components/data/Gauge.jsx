import React from 'react';

export function Gauge({value=99.9,max=100,size=200,thickness=22,animate=true,style,...rest}){
  const id=React.useId?React.useId().replace(/:/g,''):'g2ogauge';
  const r=(size-thickness)/2, c=Math.PI*r, pct=Math.min(value/max,1);
  return React.createElement('svg',{width:size,height:size/2+thickness/2,viewBox:`0 0 ${size} ${size/2+thickness/2}`,style:{display:'block',overflow:'visible',...style},...rest},
    React.createElement('defs',null,
      React.createElement('linearGradient',{id:'gr'+id,x1:'0',y1:'0',x2:'1',y2:'0'},
        React.createElement('stop',{offset:'0%',stopColor:'var(--g2o-pink)'}),
        React.createElement('stop',{offset:'100%',stopColor:'var(--g2o-purple)'}))),
    React.createElement('path',{d:`M ${thickness/2} ${size/2} A ${r} ${r} 0 0 1 ${size-thickness/2} ${size/2}`,fill:'none',stroke:'var(--g2o-gray-100)',strokeWidth:thickness,strokeLinecap:'round'}),
    React.createElement('path',{d:`M ${thickness/2} ${size/2} A ${r} ${r} 0 0 1 ${size-thickness/2} ${size/2}`,fill:'none',stroke:`url(#gr${id})`,strokeWidth:thickness,strokeLinecap:'round',strokeDasharray:c,strokeDashoffset:c*(1-pct),style:animate?{transition:'stroke-dashoffset 1.2s cubic-bezier(.4,0,.2,1)'}:undefined})
  );
}
