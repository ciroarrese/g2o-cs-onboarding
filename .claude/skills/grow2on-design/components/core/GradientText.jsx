import React from 'react';

export function GradientText({as='span',speed='3.5s',style,children,...rest}){
  return React.createElement(as,{style:{background:'var(--gradient-brand)',backgroundSize:'300% auto',WebkitBackgroundClip:'text',backgroundClip:'text',color:'transparent',WebkitTextFillColor:'transparent',animation:`g2o-gradient-shift ${speed} ease-in-out infinite`,...style},...rest},children);
}
