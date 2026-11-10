import React from 'react';

export function ValueChip({icon,children,style,...rest}){
  return React.createElement('span',{style:{display:'inline-flex',alignItems:'center',gap:6,padding:'4px 9px',background:'#fff',border:'1px solid var(--color-border-default)',borderRadius:'var(--radius-sm)',boxShadow:'var(--shadow-md)',fontSize:11,fontWeight:600,color:'var(--g2o-black)',whiteSpace:'nowrap',...style},...rest},
    icon,children);
}
