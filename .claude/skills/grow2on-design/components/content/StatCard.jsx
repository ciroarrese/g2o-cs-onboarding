import React from 'react';
import { GradientText } from '../core/GradientText.jsx';

export function StatCard({value,label,children,minHeight=198,style}){
  return React.createElement('div',{style:{background:'var(--color-surface-card)',border:'1px solid var(--color-border-default)',borderRadius:'var(--radius-lg)',padding:'24px 24px 0',textAlign:'left',display:'flex',flexDirection:'column',overflow:'hidden',position:'relative',minHeight,...style}},
    React.createElement(GradientText,{as:'div',style:{fontSize:'var(--text-stat)',fontWeight:700,lineHeight:1,position:'relative',zIndex:2}},value),
    React.createElement('div',{style:{fontSize:20,fontWeight:600,lineHeight:1.3,color:'var(--color-text-secondary)',marginTop:6,position:'relative',zIndex:2}},label),
    children&&React.createElement('div',{style:{flex:1,minHeight:110,marginTop:12,position:'relative'}},children)
  );
}
