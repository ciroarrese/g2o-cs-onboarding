import * as React from 'react';

/** Half-donut gauge with a pink→purple sweep, on a #eeedef track. Used for the 99.9% SLA card. */
export interface GaugeProps extends React.SVGAttributes<SVGSVGElement> {
  /** @default 99.9 */
  value?: number;
  /** @default 100 */
  max?: number;
  /** Outer diameter in px. @default 200 */
  size?: number;
  /** Stroke width. @default 22 */
  thickness?: number;
  /** Animate the sweep on mount. @default true */
  animate?: boolean;
}
export declare function Gauge(props: GaugeProps): JSX.Element;
