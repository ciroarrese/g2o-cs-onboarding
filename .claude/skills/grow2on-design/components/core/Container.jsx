import React from 'react';

export function Container({style,children,...rest}){
  return React.createElement('div',{style:{maxWidth:'var(--container-max)',margin:'0 auto',padding:'0 var(--section-pad-x)',...style},...rest},children);
}

export function Section({tight=false,background,style,children,...rest}){
  return React.createElement('section',{style:{padding:tight?'32px 0 0':'64px 0',background,position:'relative',...style},...rest},children);
}
