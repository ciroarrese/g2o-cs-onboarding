import * as React from 'react';

/**
 * The signature Grow2on orbit: the brand ring at the centre with platform logos floating on white circles around it, joined by hairlines.
 * @startingPoint section="Brand" subtitle="Platform orbit hub" viewport="1100x718"
 */
export interface HubNode {
  src: string;
  /** Tooltip title. */
  label?: string;
  /** Tooltip second line, e.g. "Sincronización en tiempo real". */
  sub?: string;
  href?: string;
}
export interface PlatformHubProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Centre artwork — assets/brand/platform-hub-center.png (the gradient ring + wordmark). */
  center?: string;
  /** Nodes are auto-placed on an ellipse in the order given. */
  nodes: HubNode[];
  /** Degrees of the first node, clockwise from 3 o'clock. @default -100 */
  startAngle?: number;
  /** Backplate. Pass "none" to sit on the page background. */
  background?: string;
}
export declare function PlatformHub(props: PlatformHubProps): JSX.Element;
