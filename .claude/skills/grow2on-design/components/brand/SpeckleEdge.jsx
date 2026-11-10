import React from 'react';

const COLORS=['#e7007e','#770ce9','#f56406','#b8005f','#9a45f2'];

export function SpeckleEdge({edges=['left','right'],count=160,spread=26,seed=3,style,...rest}){
  const dots=React.useMemo(()=>{
    let s=seed;const rnd=()=>(s=(s*9301+49297)%233280)/233280;
    const out=[];
    for(let i=0;i<count;i++){
      const edge=edges[i%edges.length];
      // bias inward: dense at the edge, sparse toward the middle
      const d=Math.pow(rnd(),2.1)*spread;
      const along=rnd()*100;
      const pos=edge==='left'?{left:d+'%',top:along+'%'}
        :edge==='right'?{right:d+'%',top:along+'%'}
        :edge==='top'?{top:d+'%',left:along+'%'}
        :{bottom:d+'%',left:along+'%'};
      out.push({...pos,size:(1+rnd()*3).toFixed(1),color:COLORS[Math.floor(rnd()*COLORS.length)],op:(.25+rnd()*.65).toFixed(2)});
    }
    return out;
  },[edges.join(),count,spread,seed]);
  return React.createElement('div',{'aria-hidden':'true',style:{position:'absolute',inset:0,overflow:'hidden',pointerEvents:'none',zIndex:0,...style},...rest},
    dots.map((d,i)=>React.createElement('span',{key:i,style:{position:'absolute',left:d.left,right:d.right,top:d.top,bottom:d.bottom,width:d.size+'px',height:d.size+'px',borderRadius:'50%',background:d.color,opacity:d.op}}))
  );
}
