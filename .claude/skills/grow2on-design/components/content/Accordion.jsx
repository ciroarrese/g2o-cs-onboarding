import React from 'react';

export function Accordion({items=[],defaultOpen=-1,style}){
  const [open,setOpen]=React.useState(defaultOpen);
  return React.createElement('div',{style},
    items.map((it,i)=>React.createElement('div',{key:it.q,style:{background:'var(--color-surface-card)',border:'1px solid var(--color-border-default)',borderRadius:'var(--radius-md)',overflow:'hidden',marginBottom:12}},
      React.createElement('button',{type:'button',onClick:()=>setOpen(open===i?-1:i),style:{width:'100%',textAlign:'left',background:'none',border:'none',padding:'18px 20px',display:'flex',alignItems:'center',justifyContent:'space-between',gap:12,cursor:'pointer',fontFamily:'inherit',fontSize:'var(--text-body)',fontWeight:'var(--font-weight-medium)',color:'var(--g2o-pink)'}},
        it.q,React.createElement('span',{style:{fontSize:14,color:'var(--g2o-pink)',transition:'transform .15s ease',flexShrink:0,transform:open===i?'rotate(180deg)':'none'}},'▾')),
      open===i&&React.createElement('div',{style:{padding:'0 20px 18px',fontSize:'var(--text-body)',color:'var(--color-text-secondary)',lineHeight:'var(--leading-body)'}},it.a)))
  );
}
