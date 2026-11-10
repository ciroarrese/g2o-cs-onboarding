import React from 'react';

const BASE={display:'inline-flex',alignItems:'center',justifyContent:'center',gap:8,height:52,padding:'0 28px',borderRadius:'var(--radius-pill)',fontFamily:'var(--font-family-base)',fontSize:'var(--text-body)',fontWeight:'var(--font-weight-semibold)',cursor:'pointer',border:'none',transition:'transform .15s ease,box-shadow .15s ease,background .15s ease,color .15s ease',whiteSpace:'nowrap',textDecoration:'none'};
const SM={height:44,padding:'0 22px',fontSize:'var(--text-body-sm)'};

export function Button({variant='primary',size='md',as,href,icon,iconRight,disabled,style,children,...rest}){
  const [hover,setHover]=React.useState(false);
  const v={
    primary:{background:'var(--g2o-pink)',color:'#fff',boxShadow:'var(--shadow-md)',transform:hover?'translateY(-1px)':'none'},
    pink:{background:'var(--g2o-pink)',color:'#fff',boxShadow:'var(--shadow-md)',transform:hover?'translateY(-1px)':'none'},
    outline:{background:hover?'var(--g2o-pink)':'transparent',color:hover?'#fff':'var(--g2o-pink)',border:'1.5px solid var(--g2o-pink)'},
    ghost:{background:'transparent',color:hover?'var(--g2o-pink)':'var(--color-text-primary)'}
  }[variant]||{};
  const Tag=as||(href?'a':'button');
  return React.createElement(Tag,{
    href,disabled,
    onMouseEnter:()=>setHover(true),onMouseLeave:()=>setHover(false),
    style:{...BASE,...(size==='sm'?SM:null),...v,...(disabled?{opacity:.45,pointerEvents:'none',boxShadow:'none'}:null),...style},
    ...rest
  },icon,children,iconRight);
}
