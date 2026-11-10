import React from 'react';

export function Badge({tone='neutral',style,children,...rest}){
  const tones={
    neutral:{background:'var(--color-border-default)',color:'var(--color-text-secondary)'},
    pink:{background:'var(--g2o-pink)',color:'#fff'},
    success:{background:'var(--g2o-success)',color:'#fff'},
    warning:{background:'var(--g2o-warning)',color:'var(--g2o-black)'},
    error:{background:'var(--g2o-error)',color:'#fff'}
  };
  return React.createElement('span',{style:{display:'inline-flex',alignItems:'center',justifyContent:'center',minWidth:20,height:20,padding:'0 6px',borderRadius:999,fontSize:11,fontWeight:700,lineHeight:1,...tones[tone],...style},...rest},children);
}
