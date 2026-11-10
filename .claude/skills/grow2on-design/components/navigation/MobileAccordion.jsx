import React from 'react';

export function MobileAccordion({label,children,defaultOpen=false,style}){
  const [open,setOpen]=React.useState(defaultOpen);
  return React.createElement('div',{style:{borderBottom:'1px solid var(--color-border-default)',...style}},
    React.createElement('button',{type:'button',onClick:()=>setOpen(!open),style:{width:'100%',display:'flex',alignItems:'center',justifyContent:'space-between',gap:8,background:'none',border:'none',padding:'12px 0',minHeight:44,fontFamily:'inherit',fontSize:15,color:'var(--color-text-primary)',cursor:'pointer',textAlign:'left'}},
      label,React.createElement('span',{style:{fontSize:12,color:'var(--g2o-pink)',transition:'transform .2s ease',transform:open?'rotate(180deg)':'none'}},'▾')),
    open&&React.createElement('div',{style:{display:'flex',flexDirection:'column',padding:'0 0 12px 16px',maxHeight:'60vh',overflowY:'auto'}},children)
  );
}
