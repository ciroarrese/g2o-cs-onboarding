import React from 'react';

export function ProgressSteps({steps=[],current=0,style}){
  return React.createElement('div',{style:{display:'flex',alignItems:'center',gap:12,...style}},
    steps.map((s,i)=>{
      const done=i<current,active=i===current;
      return React.createElement(React.Fragment,{key:s},
        React.createElement('div',{style:{display:'flex',alignItems:'center',gap:8}},
          React.createElement('span',{style:{width:28,height:28,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:600,border:'1.5px solid '+(done||active?'var(--g2o-pink)':'var(--color-border-default)'),background:done?'var(--g2o-pink)':'transparent',color:done?'#fff':active?'var(--g2o-pink)':'var(--color-text-muted)'}},done?'✓':i+1),
          React.createElement('span',{style:{fontSize:'var(--text-body-sm)',fontWeight:active?600:400,color:active?'var(--g2o-pink)':'var(--color-text-secondary)'}},s)),
        i<steps.length-1&&React.createElement('span',{style:{flex:1,height:1,background:'var(--color-border-default)',minWidth:24}})
      );
    })
  );
}
