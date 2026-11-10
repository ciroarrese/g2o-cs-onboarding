import React from 'react';
import { Button } from '../core/Button.jsx';

const Caret=()=>React.createElement('svg',{width:10,height:10,viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:3,style:{flexShrink:0}},React.createElement('path',{d:'M6 9l6 6 6-6'}));

export function Header({logo='assets/brand/logo-grow2on.png',logoHref='/',links=[],loginLabel='Log in',ctaLabel='Hablemos',onCta,sticky=true,style}){
  const [open,setOpen]=React.useState(null);
  return React.createElement('header',{style:{position:sticky?'sticky':'relative',top:0,zIndex:50,background:'var(--color-surface-page)',borderBottom:'1px solid var(--color-border-default)',...style}},
    React.createElement('div',{style:{display:'flex',alignItems:'center',justifyContent:'space-between',gap:16,padding:'14px var(--section-pad-x)',maxWidth:'var(--container-max)',margin:'0 auto'}},
      React.createElement('a',{href:logoHref},React.createElement('img',{src:logo,alt:'Grow2on',style:{height:38,width:'auto'}})),
      React.createElement('nav',{style:{display:'flex',alignItems:'center',gap:28}},
        links.map(l=>React.createElement('div',{key:l.label,style:{position:'relative'},onMouseEnter:()=>setOpen(l.items?l.label:null),onMouseLeave:()=>setOpen(null)},
          React.createElement('a',{href:l.href||'#',style:{display:'inline-flex',alignItems:'center',gap:5,color:open===l.label?'var(--g2o-pink)':'var(--color-text-primary)',fontSize:'var(--text-body-sm)'}},l.label,l.items&&React.createElement(Caret)),
          l.items&&open===l.label&&React.createElement('div',{style:{position:'absolute',top:'100%',left:0,marginTop:8,minWidth:220,background:'var(--color-surface-page)',border:'1px solid var(--color-border-default)',borderRadius:'var(--radius-md)',boxShadow:'var(--shadow-lg)',padding:12,zIndex:30}},
            l.items.map(it=>React.createElement('a',{key:it.label,href:it.href||'#',style:{display:'block',padding:'8px 10px',borderRadius:'var(--radius-sm)',color:'var(--color-text-primary)',fontSize:'var(--text-body-sm)'}},it.label)))
        ))),
      React.createElement('div',{style:{display:'flex',alignItems:'center',gap:12}},
        React.createElement('a',{href:'#',style:{fontSize:'var(--text-body-sm)',color:'var(--color-text-primary)'}},loginLabel),
        React.createElement(Button,{size:'sm',variant:'primary',onClick:onCta},ctaLabel))
    )
  );
}
