import React from 'react';

export function BlogCard({title,excerpt,date,tag,image,href,style}){
  return React.createElement('a',{href:href||'#',style:{display:'flex',flexDirection:'column',gap:12,color:'inherit',...style}},
    React.createElement('div',{style:{aspectRatio:'16/9',borderRadius:'var(--radius-lg)',overflow:'hidden',background:'var(--gradient-thumb-3)',backgroundSize:'200% 200%',animation:'g2o-gradient-shift 6s ease-in-out infinite',display:'flex',alignItems:'center',justifyContent:'center'}},
      image&&React.createElement('img',{src:image,alt:'',style:{width:'100%',height:'100%',objectFit:'cover'}})),
    tag&&React.createElement('span',{style:{fontSize:12,fontWeight:700,letterSpacing:'var(--tracking-eyebrow)',textTransform:'uppercase',color:'var(--g2o-pink)'}},tag),
    React.createElement('h3',{style:{margin:0,fontSize:20,color:'var(--color-text-strong)',lineHeight:1.25}},title),
    excerpt&&React.createElement('p',{style:{margin:0,fontSize:'var(--text-body-sm)',lineHeight:'var(--leading-body)',color:'var(--color-text-secondary)'}},excerpt),
    date&&React.createElement('span',{style:{fontSize:'var(--text-caption)',color:'var(--color-text-muted)'}},date));
}
