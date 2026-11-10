import React from 'react';

const DEFAULT=[
  {color:'var(--g2o-pink)',size:'46%',left:'6%',top:'8%',anim:'g2o-cloud-a 18s ease-in-out infinite'},
  {color:'var(--g2o-orange)',size:'38%',right:'10%',top:'22%',anim:'g2o-cloud-b 22s ease-in-out infinite'},
  {color:'var(--g2o-purple)',size:'34%',left:'42%',bottom:'0%',anim:'g2o-cloud-a 26s ease-in-out infinite'}
];

export function CloudBackground({blobs=DEFAULT,opacity=.5,style,...rest}){
  return React.createElement('div',{style:{position:'absolute',inset:'-10%',pointerEvents:'none',filter:'var(--blur-cloud)',opacity,zIndex:0,...style},...rest},
    blobs.map((b,i)=>React.createElement('span',{key:i,style:{position:'absolute',borderRadius:'50%',background:b.color,width:b.size,height:b.size,left:b.left,right:b.right,top:b.top,bottom:b.bottom,animation:b.anim}}))
  );
}
