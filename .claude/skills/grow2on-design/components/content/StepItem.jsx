import React from 'react';

export function StepItem({number,title,body,arrow='assets/brand/flecha-pasos.png',showArrow=true,style}){
  return React.createElement('div',{style:{display:'flex',flexDirection:'column',gap:6,...style}},
    React.createElement('div',{style:{fontSize:'var(--text-stat)',fontWeight:700,lineHeight:1,color:'var(--g2o-pink)'}},number),
    showArrow&&React.createElement('img',{src:arrow,alt:'',style:{width:72,height:72,objectFit:'contain',margin:'0 0 8px -8px',display:'block',position:'relative',zIndex:1}}),
    React.createElement('h3',{style:{margin:0,fontSize:'var(--text-h3)',color:'var(--color-text-strong)'}},title),
    React.createElement('p',{style:{margin:0,fontSize:'var(--text-body-sm)',lineHeight:'var(--leading-body)',color:'var(--color-text-secondary)'}},body));
}
