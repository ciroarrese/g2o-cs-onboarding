import React from 'react';

export function IntegrationTile({src,alt,href,style,...rest}){
  const [hover,setHover]=React.useState(false);
  return React.createElement(href?'a':'div',{href,onMouseEnter:()=>setHover(true),onMouseLeave:()=>setHover(false),
    style:{position:'relative',background:'var(--color-surface-card)',border:'1px solid var(--color-border-default)',borderRadius:'var(--radius-lg)',padding:20,display:'flex',alignItems:'center',justifyContent:'center',aspectRatio:'1/1',boxShadow:hover?'var(--shadow-card-hover)':'var(--shadow-card-soft)',transform:hover?'translateY(-3px)':'none',transition:'box-shadow .35s ease,transform .25s ease',overflow:'hidden',...style},...rest},
    React.createElement('img',{src,alt:alt||'',style:{maxWidth:'80%',maxHeight:60,objectFit:'contain'}}));
}

export function IntegrationPill({src,alt,label,href,style,...rest}){
  const [hover,setHover]=React.useState(false);
  return React.createElement(href?'a':'div',{href,onMouseEnter:()=>setHover(true),onMouseLeave:()=>setHover(false),
    style:{display:'flex',alignItems:'center',justifyContent:'center',gap:10,height:44,padding:'8px 12px',background:'var(--color-surface-card)',border:'1px solid '+(hover?'var(--g2o-pink)':'var(--color-border-default)'),borderRadius:20,transition:'border-color .2s ease',...style},...rest},
    React.createElement('img',{src,alt:alt||'',style:{maxWidth:label?'38%':'100%',maxHeight:'100%',objectFit:'contain'}}),
    label&&React.createElement('span',{style:{fontSize:'var(--text-body-sm)',color:'var(--color-text-primary)'}},label));
}
