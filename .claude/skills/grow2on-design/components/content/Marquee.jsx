import React from 'react';

export function Marquee({logos=[],speed='26s',grayscale=true,height=36,gap=56,style}){
  const loop=[...logos,...logos];
  return React.createElement('div',{style:{width:'100%',minWidth:0,overflow:'hidden',WebkitMaskImage:'linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent)',maskImage:'linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent)',...style}},
    React.createElement('div',{style:{display:'flex',alignItems:'center',gap,width:'max-content',animation:`g2o-marquee ${speed} linear infinite`}},
      loop.map((l,i)=>React.createElement('img',{key:i,src:l.src||l,alt:l.alt||'',style:{height,width:'auto',maxWidth:170,objectFit:'contain',filter:grayscale?'grayscale(1)':'none',opacity:grayscale?.6:1,flexShrink:0}})))
  );
}
