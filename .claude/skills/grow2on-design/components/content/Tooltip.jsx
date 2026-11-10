import React from 'react';

export function Tooltip({label,sub,children,style}){
  const [hover,setHover]=React.useState(false);
  return React.createElement('span',{onMouseEnter:()=>setHover(true),onMouseLeave:()=>setHover(false),style:{position:'relative',display:'inline-flex',...style}},
    children,
    React.createElement('span',{style:{position:'absolute',bottom:'100%',left:'50%',transform:'translate(-50%,-8px)',background:'#141826eb',color:'#fff',borderRadius:'var(--radius-md)',padding:'6px 12px',marginBottom:6,fontSize:12,fontWeight:600,whiteSpace:'nowrap',boxShadow:'var(--shadow-tooltip)',zIndex:5,pointerEvents:'none',opacity:hover?1:0,visibility:hover?'visible':'hidden',transition:'opacity .2s ease',display:'block'}},
      label,
      sub&&React.createElement('span',{style:{display:'flex',alignItems:'center',gap:5,fontSize:10.5,fontWeight:400,color:'#ffffffbf',marginTop:2}},
        React.createElement('i',{style:{width:5,height:5,borderRadius:'50%',background:'var(--gradient-brand)',display:'inline-block',animation:'chip-pulse 1.2s ease-in-out infinite',fontStyle:'normal'}}),sub)));
}
