import React from 'react';

export function Card({variant='base',padding,hoverLift=false,style,children,...rest}){
  const [hover,setHover]=React.useState(false);
  const variants={
    base:{padding:'28px 24px',boxShadow:'var(--shadow-sm)'},
    simple:{padding:'28px 24px',boxShadow:'var(--shadow-sm)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:10,textAlign:'center',minHeight:130,fontSize:18,fontWeight:'var(--font-weight-semibold)',color:'var(--color-text-primary)'},
    visual:{padding:24,boxShadow:'var(--shadow-sm)',display:'flex',flexDirection:'column',overflow:'hidden'},
    fx:{padding:24,boxShadow:'var(--shadow-sm)',display:'flex',flexDirection:'column'},
    tile:{padding:20,display:'flex',alignItems:'center',justifyContent:'center',aspectRatio:'1/1',boxShadow:'var(--shadow-card-soft)',overflow:'hidden'}
  };
  return React.createElement('div',{
    onMouseEnter:()=>setHover(true),onMouseLeave:()=>setHover(false),
    style:{background:'var(--color-surface-card)',border:'1px solid var(--color-border-default)',borderRadius:'var(--radius-lg)',position:'relative',transition:'box-shadow .35s ease,transform .25s ease',...variants[variant],...(padding!==undefined?{padding}:null),...(hoverLift&&hover?{transform:'translateY(-3px)',boxShadow:'var(--shadow-card-hover)'}:null),...style},
    ...rest},children);
}

/** Full-bleed gradient-aurora footer for a "visual" Card — holds a product screenshot. */
export function CardVisual({src,alt='',style,...rest}){
  const [hover,setHover]=React.useState(false);
  return React.createElement('div',{onMouseEnter:()=>setHover(true),onMouseLeave:()=>setHover(false),style:{position:'relative',margin:'16px -24px -24px',borderRadius:'0 0 var(--radius-lg) var(--radius-lg)',overflow:'hidden',padding:22,flex:1,display:'flex',alignItems:'center',...style},...rest},
    React.createElement('div',{style:{content:'""',position:'absolute',left:'-20%',right:'-20%',bottom:-40,top:'40%',zIndex:0,filter:'var(--blur-aurora)',opacity:.46,pointerEvents:'none',background:'var(--gradient-aurora)'}}),
    React.createElement('img',{src,alt,style:{position:'relative',zIndex:1,width:'100%',height:'auto',filter:'drop-shadow(0 8px 20px rgba(20,20,40,.18))',transition:'transform .35s ease',transform:hover?'scale(1.04)':'none'}})
  );
}
