import React from 'react';

export function HoverCard({front,back,style}){
  const [hover,setHover]=React.useState(false);
  return React.createElement('div',{onMouseEnter:()=>setHover(true),onMouseLeave:()=>setHover(false),
    style:{position:'relative',background:'var(--color-surface-card)',border:'1px solid var(--color-border-default)',borderRadius:'var(--radius-lg)',boxShadow:'var(--shadow-sm)',padding:'28px 24px',minHeight:180,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',textAlign:'center',overflow:'hidden',...style}},
    React.createElement('div',{style:{opacity:hover?0:1,transition:'opacity .2s ease'}},front),
    React.createElement('div',{style:{position:'absolute',inset:0,margin:0,padding:'28px 22px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'var(--text-body-sm)',lineHeight:'var(--leading-body)',color:'var(--color-text-secondary)',background:'var(--color-surface-card)',opacity:hover?1:0,transition:'opacity .2s ease',pointerEvents:'none'}},back));
}
