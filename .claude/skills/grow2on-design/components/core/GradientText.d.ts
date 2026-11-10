import * as React from 'react';

/** Pink→orange gradient text with the signature 3.5s shifting animation. */
export interface GradientTextProps extends React.HTMLAttributes<HTMLElement> {
  /** Tag to render. @default "span" */
  as?: keyof JSX.IntrinsicElements;
  /** Animation duration. @default "3.5s" */
  speed?: string;
  children?: React.ReactNode;
}
export declare function GradientText(props: GradientTextProps): JSX.Element;
