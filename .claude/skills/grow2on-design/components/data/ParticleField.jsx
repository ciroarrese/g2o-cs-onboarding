import React from 'react';

const COLORS=['var(--g2o-pink)','var(--g2o-orange)','var(--g2o-purple)'];

export function ParticleField({count=90,seed=7,style,...rest}){
  const dots=React.useMemo(()=>{let s=seed;const rnd=()=>(s=(s*9301+49297)%233280)/233280;
    return Array.from({length:count},(_,i)=>({
      left:rnd()*100,top:rnd()*100,size:1.5+rnd()*2.5,
      color:COLORS[Math.floor(rnd()*3)],op:.25+rnd()*.6,dur:(2+rnd()*3).toFixed(2),delay:(rnd()*3).toFixed(2)
    }));},[count,seed]);
  return React.createElement('div',{style:{position:'absolute',inset:0,overflow:'hidden',pointerEvents:'none',...style},...rest},
    dots.map((d,i)=>React.createElement('span',{key:i,style:{position:'absolute',left:d.left+'%',top:d.top+'%',width:d.size,height:d.size,borderRadius:'50%',background:d.color,opacity:d.op,animation:`g2o-dot-pulse ${d.dur}s ease-in-out ${d.delay}s infinite`}}))
  );
}
