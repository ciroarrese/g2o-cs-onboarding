import React from 'react';

export function Pill({active=false,icon,onClick,style,children,...rest}){
  return React.createElement('button',{type:'button',onClick,style:{display:'inline-flex',alignItems:'center',justifyContent:'center',gap:10,height:44,padding:'8px 16px',background:active?'var(--tint-pink-8)':'var(--color-surface-card)',border:'1px solid '+(active?'var(--g2o-pink)':'var(--color-border-default)'),borderRadius:20,fontFamily:'inherit',fontSize:'var(--text-body-sm)',fontWeight:'var(--font-weight-medium)',color:'var(--color-text-primary)',cursor:'pointer',transition:'border-color .2s ease,background .2s ease',...style},...rest},icon,children);
}
