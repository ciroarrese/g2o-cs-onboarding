import React from 'react';

export function BarChart({values=[],height=110,gap=4,radius=3,animate=true,style,...rest}){
  const max=Math.max(...values,1);
  return React.createElement('div',{style:{display:'flex',alignItems:'flex-end',justifyContent:'space-between',gap,height,width:'100%',...style},...rest},
    values.map((v,i)=>React.createElement('span',{key:i,style:{
      flex:1,minWidth:2,height:Math.max(6,(v/max)*height),
      background:'linear-gradient(180deg,var(--g2o-purple) 0%,#9a45f2 100%)',
      borderRadius:`${radius}px ${radius}px 0 0`,transformOrigin:'bottom',
      animation:animate?`g2o-bar-grow ${2.4+(i%5)*.25}s ease-in-out infinite`:'none',
      animationDelay:animate?`${(i%7)*.12}s`:undefined
    }}))
  );
}
