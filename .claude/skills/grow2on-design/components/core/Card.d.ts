import * as React from 'react';

/**
 * White surface, 1px #dcdadd border, 16px radius. Five source variants.
 * @startingPoint section="Core" subtitle="Card surfaces and the gradient-aurora visual" viewport="700x340"
 */
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** base = 28/24 padding; simple = centred logo+label tile; visual = holds a CardVisual; fx = animation-panel card; tile = square integration tile. @default "base" */
  variant?: 'base' | 'simple' | 'visual' | 'fx' | 'tile';
  /** Override padding. */
  padding?: string | number;
  /** Lift 3px + deepen shadow on hover (integration tiles do this). @default false */
  hoverLift?: boolean;
  children?: React.ReactNode;
}
export declare function Card(props: CardProps): JSX.Element;

/** Screenshot area that bleeds to the card's bottom corners over a blurred pink/orange/purple aurora. */
export interface CardVisualProps extends React.HTMLAttributes<HTMLDivElement> {
  src: string;
  alt?: string;
}
export declare function CardVisual(props: CardVisualProps): JSX.Element;
