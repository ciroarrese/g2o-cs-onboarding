import * as React from 'react';

/** Infinite horizontal logo strip with edge mask fades. Used for customer and platform logos. */
export interface MarqueeProps {
  /** Image sources, or {src, alt} objects. The list is duplicated internally for the seamless loop. */
  logos: (string | { src: string; alt?: string })[];
  /** @default "26s" */
  speed?: string;
  /** Desaturate to 60% opacity grey (customer logos) vs full colour (platform logos). @default true */
  grayscale?: boolean;
  /** @default 36 */
  height?: number;
  /** @default 56 */
  gap?: number;
  style?: React.CSSProperties;
}
export declare function Marquee(props: MarqueeProps): JSX.Element;
