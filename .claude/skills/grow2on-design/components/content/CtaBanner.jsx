import React from 'react';
import { Button } from '../core/Button.jsx';
import { CloudBackground } from '../core/CloudBackground.jsx';

export function CtaBanner({title,body,ctaLabel,ctaHref,clouds=true,style}){
  return React.createElement('div',{style:{position:'relative',padding:'64px 40px',textAlign:'center',background:'var(--color-surface-card)',border:'1px solid var(--color-border-default)',borderRadius:'var(--radius-lg)',overflow:'hidden',...style}},
    clouds&&React.createElement(CloudBackground,{opacity:.35}),
    React.createElement('h2',{style:{position:'relative',zIndex:1,margin:'0 0 12px',fontSize:'var(--text-h2)',color:'var(--color-text-strong)'}},title),
    body&&React.createElement('p',{style:{position:'relative',zIndex:1,color:'var(--color-text-secondary)',maxWidth:520,margin:'0 auto 28px'}},body),
    ctaLabel&&React.createElement(Button,{variant:'pink',href:ctaHref,style:{position:'relative',zIndex:1}},ctaLabel));
}
