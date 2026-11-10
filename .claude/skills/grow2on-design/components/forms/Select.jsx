import React from 'react';

const Chevron=({open})=>React.createElement('svg',{width:16,height:16,viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:2,style:{flexShrink:0,color:'var(--g2o-pink)',transition:'transform .15s ease',transform:open?'rotate(180deg)':'none'}},React.createElement('path',{d:'M6 9l6 6 6-6'}));

export function Select({label,required,options=[],value,placeholder='Seleccioná una opción',onChange,style}){
  const [open,setOpen]=React.useState(false);
  const [internal,setInternal]=React.useState(value);
  const current=value!==undefined?value:internal;
  const pick=v=>{setInternal(v);setOpen(false);onChange&&onChange(v)};
  return React.createElement('div',{style:{display:'flex',flexDirection:'column',gap:6,...style}},
    label&&React.createElement('label',{style:{fontSize:'var(--text-body-sm)',fontWeight:'var(--font-weight-medium)',color:'var(--color-text-primary)'}},label,required&&React.createElement('span',{style:{color:'var(--g2o-pink)'}},' *')),
    React.createElement('div',{style:{position:'relative'}},
      React.createElement('button',{type:'button',onClick:()=>setOpen(!open),style:{width:'100%',boxSizing:'border-box',display:'flex',alignItems:'center',justifyContent:'space-between',gap:8,fontFamily:'inherit',fontSize:'var(--text-body)',padding:'12px 14px',borderRadius:'var(--radius-sm)',border:'1.5px solid '+(open?'var(--g2o-pink)':'var(--color-border-default)'),outline:'none',background:'var(--color-surface-card)',color:current?'var(--color-text-primary)':'var(--color-text-muted)',cursor:'pointer',textAlign:'left'}},
        React.createElement('span',null,current||placeholder),React.createElement(Chevron,{open})),
      open&&React.createElement('div',{style:{position:'absolute',top:'calc(100% + 6px)',left:0,right:0,maxHeight:240,overflowY:'auto',background:'var(--color-surface-card)',border:'1.5px solid var(--color-border-default)',borderRadius:'var(--radius-sm)',boxShadow:'var(--shadow-lg)',zIndex:20}},
        options.map(o=>React.createElement('button',{key:o,type:'button',onClick:()=>pick(o),style:{display:'block',width:'100%',textAlign:'left',padding:'10px 14px',fontFamily:'inherit',fontSize:'var(--text-body-sm)',background:o===current?'var(--color-surface-subtle)':'none',border:'none',cursor:'pointer',color:o===current?'var(--g2o-pink)':'var(--color-text-primary)'}},o)))
    )
  );
}
