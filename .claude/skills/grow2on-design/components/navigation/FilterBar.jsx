import React from 'react';
import { Badge } from '../core/Badge.jsx';

export function FilterBar({options=[],value,onChange,style}){
  const [internal,setInternal]=React.useState(value||(options[0]&&options[0].label));
  const current=value!==undefined?value:internal;
  const pick=v=>{setInternal(v);onChange&&onChange(v)};
  return React.createElement('div',{style:{textAlign:'center',...style}},
    React.createElement('div',{style:{display:'inline-flex',alignItems:'center',gap:4,background:'var(--color-surface-subtle)',border:'1px solid var(--color-border-default)',borderRadius:999,padding:6,flexWrap:'wrap',justifyContent:'center',maxWidth:'100%'}},
      options.map(o=>{const on=o.label===current;
        return React.createElement('button',{key:o.label,type:'button',onClick:()=>pick(o.label),style:{display:'inline-flex',alignItems:'center',gap:8,height:38,padding:'0 16px',borderRadius:999,border:'none',background:on?'#fff':'transparent',color:on?'var(--g2o-black)':'var(--color-text-secondary)',boxShadow:on?'var(--shadow-sm)':'none',fontFamily:'inherit',fontSize:14,fontWeight:600,cursor:'pointer',whiteSpace:'nowrap',transition:'background .15s ease,color .15s ease'}},
          o.label,o.count!==undefined&&React.createElement(Badge,{tone:on?'pink':'neutral'},o.count));
      }))
  );
}
