import React from 'react';

const RADIUS_X=44, RADIUS_Y=34, CX=50.3, CY=50;

export function PlatformHub({center,nodes=[],startAngle=-100,background='linear-gradient(160deg,#f6f4fb 0%,#ffffff 45%,#f7f2f8 100%)',style,...rest}){
  const [hover,setHover]=React.useState(-1);
  const n=nodes.length||1;
  const placed=nodes.map((nd,i)=>{
    const a=(startAngle+(360/n)*i)*Math.PI/180;
    return {...nd,left:CX+RADIUS_X*Math.cos(a),top:CY+RADIUS_Y*Math.sin(a),delay:(i%6)*.4};
  });
  return React.createElement('div',{style:{position:'relative',width:'100%',maxWidth:1100,aspectRatio:'1350/881',margin:'0 auto',background,borderRadius:'var(--radius-lg)',overflow:'hidden',...style},...rest},
    React.createElement('svg',{style:{position:'absolute',inset:0,width:'100%',height:'100%',overflow:'visible',pointerEvents:'none'},viewBox:'0 0 100 100',preserveAspectRatio:'none'},
      placed.map((p,i)=>React.createElement('line',{key:i,x1:CX,y1:CY,x2:p.left,y2:p.top,stroke:'rgba(120,110,140,.28)',strokeWidth:.12}))),
    React.createElement('div',{style:{position:'absolute',left:CX+'%',top:CY+'%',width:'27.4%',aspectRatio:'1/1',transform:'translate(-50%,-50%)',borderRadius:'50%',animation:'orbit-center-glow 1.8s ease-in-out infinite',pointerEvents:'none'}}),
    center&&React.createElement('img',{src:center,alt:'Grow2on',style:{position:'absolute',left:CX+'%',top:CY+'%',width:'66.3%',aspectRatio:'1173/579',transform:'translate(-49.3%,-50.8%)',objectFit:'contain',pointerEvents:'none'}}),
    placed.map((p,i)=>React.createElement('a',{key:p.label||i,href:p.href||'#',
      onMouseEnter:()=>setHover(i),onMouseLeave:()=>setHover(-1),
      style:{position:'absolute',left:p.left+'%',top:p.top+'%',display:'block',width:'10.4%',aspectRatio:'1/1',transform:'translate(-50%,-50%)',zIndex:hover===i?4:2}},
      React.createElement('span',{style:{display:'block',width:'100%',height:'100%',animation:`orbit-float ${4+(i%3)}s ease-in-out ${p.delay}s infinite`}},
        React.createElement('span',{style:{display:'flex',width:'100%',height:'100%',borderRadius:'50%',background:'#fff',alignItems:'center',justifyContent:'center',padding:'18%',boxSizing:'border-box',cursor:'pointer',
          boxShadow:hover===i?'var(--shadow-node-hover)':'var(--shadow-node)',
          transform:hover===i?'scale(1.14) translateY(-4px)':'scale(1)',
          transition:'transform .3s cubic-bezier(.4,0,.2,1),box-shadow .3s ease'}},
          React.createElement('img',{src:p.src,alt:p.label||'',style:{maxWidth:'100%',maxHeight:'100%',objectFit:'contain',filter:hover===i?'grayscale(0) contrast(1.05)':'grayscale(.35) opacity(.9)',transition:'filter .3s ease'}}))),
      p.label&&React.createElement('span',{style:{position:'absolute',bottom:'100%',left:'50%',transform:'translate(-50%,-8px)',background:'#141826eb',color:'#fff',borderRadius:'var(--radius-md)',padding:'6px 12px',marginBottom:6,fontSize:12,fontWeight:600,whiteSpace:'nowrap',boxShadow:'var(--shadow-tooltip)',zIndex:5,pointerEvents:'none',opacity:hover===i?1:0,visibility:hover===i?'visible':'hidden',transition:'opacity .2s ease',display:'block'}},
        p.label,
        p.sub&&React.createElement('span',{style:{display:'flex',alignItems:'center',gap:5,fontSize:10.5,fontWeight:400,color:'#ffffffbf',marginTop:2}},
          React.createElement('i',{style:{width:5,height:5,borderRadius:'50%',background:'var(--gradient-brand)',display:'inline-block',animation:'chip-pulse 1.2s ease-in-out infinite',fontStyle:'normal'}}),p.sub))
    ))
  );
}
