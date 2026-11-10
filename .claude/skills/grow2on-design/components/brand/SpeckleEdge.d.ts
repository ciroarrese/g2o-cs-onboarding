import * as React from 'react';

/**
 * Confetti speckle that hugs the page margins — tiny static pink/purple/orange dots, dense at the edge and thinning inward. The brand's way of filling empty side gutters without a background colour.
 * @startingPoint section="Brand" subtitle="Speckled page-edge decoration" viewport="900x320"
 */
export interface SpeckleEdgeProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Which edges to hug. @default ["left","right"] */
  edges?: ('left' | 'right' | 'top' | 'bottom')[];
  /** Total dots across all edges. @default 160 */
  count?: number;
  /** How far inward the field reaches, in % of the container. @default 26 */
  spread?: number;
  /** Deterministic layout seed. @default 3 */
  seed?: number;
}
export declare function SpeckleEdge(props: SpeckleEdgeProps): JSX.Element;
