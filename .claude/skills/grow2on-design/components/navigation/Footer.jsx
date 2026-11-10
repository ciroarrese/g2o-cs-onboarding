import React from 'react';

export function Footer({logo='assets/brand/logo-grow2on.png',blurb,columns=[],offices=[],bottom,style}){
  return React.createElement('footer',{style:{background:'var(--color-surface-subtle)',borderTop:'1px solid var(--color-border-default)',...style}},
    React.createElement('div',{style:{padding:'48px 0 24px'}},
      React.createElement('div',{style:{maxWidth:'var(--container-max)',margin:'0 auto',padding:'0 var(--section-pad-x)',display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))',gap:32}},
        React.createElement('div',null,
          React.createElement('img',{src:logo,alt:'Grow2on',style:{height:34,width:'auto',marginBottom:12}}),
          blurb&&React.createElement('p',{style:{fontSize:'var(--text-body-sm)',color:'var(--color-text-secondary)',margin:0,maxWidth:260}},blurb)),
        columns.map(c=>React.createElement('div',{key:c.title},
          React.createElement('div',{style:{fontFamily:'var(--font-family-mono)',fontSize:11,color:'var(--g2o-gray-300)',marginBottom:12,letterSpacing:'var(--tracking-footer-label)'}},c.title),
          c.links.map(l=>React.createElement('a',{key:l.label,href:l.href||'#',style:{display:'block',color:'var(--color-text-primary)',fontSize:'var(--text-body-sm)',padding:'4px 0'}},l.label)))),
        offices.map(o=>React.createElement('div',{key:o.country},
          React.createElement('img',{src:o.flag,alt:o.country,style:{height:16,width:'auto',marginBottom:8}}),
          React.createElement('div',{style:{fontSize:'var(--text-body-sm)',color:'var(--color-text-secondary)',lineHeight:'var(--leading-body)',whiteSpace:'pre-line'}},o.address)))
      )),
    React.createElement('div',{style:{background:'var(--g2o-footer-bar)',padding:'16px var(--section-pad-x)',display:'flex',alignItems:'center',justifyContent:'center',gap:6,textAlign:'center',fontSize:'var(--text-caption)',color:'#fff'}},bottom)
  );
}
