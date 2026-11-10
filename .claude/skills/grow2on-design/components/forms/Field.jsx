import React from 'react';

const INPUT={width:'100%',boxSizing:'border-box',fontFamily:'inherit',fontSize:'var(--text-body)',padding:'12px 14px',borderRadius:'var(--radius-sm)',border:'1.5px solid var(--color-border-default)',outline:'none',background:'var(--color-surface-card)',color:'var(--color-text-primary)'};

export function Field({label,required,as='input',hint,error,style,inputStyle,...rest}){
  const [focus,setFocus]=React.useState(false);
  const border=error?'var(--g2o-error)':focus?'var(--g2o-pink)':'var(--color-border-default)';
  return React.createElement('div',{style:{display:'flex',flexDirection:'column',gap:6,...style}},
    label&&React.createElement('label',{style:{fontSize:'var(--text-body-sm)',fontWeight:'var(--font-weight-medium)',color:'var(--color-text-primary)'}},label,required&&React.createElement('span',{style:{color:'var(--g2o-pink)'}},' *')),
    React.createElement(as,{onFocus:()=>setFocus(true),onBlur:()=>setFocus(false),style:{...INPUT,borderColor:border,...(as==='textarea'?{minHeight:120,resize:'vertical'}:null),...inputStyle},...rest}),
    (hint||error)&&React.createElement('span',{style:{fontSize:'var(--text-caption)',color:error?'var(--g2o-error)':'var(--color-text-muted)'}},error||hint)
  );
}
