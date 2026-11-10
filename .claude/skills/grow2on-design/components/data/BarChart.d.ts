import * as React from 'react';

/** Violet gradient bar series used inside StatCard ("4.2M de ventas promedio por mes"). Bars breathe on the g2o-bar-grow loop. */
export interface BarChartProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Raw values; the tallest bar fills the height. */
  values: number[];
  /** @default 110 */
  height?: number;
  /** @default 4 */
  gap?: number;
  /** Top corner radius. @default 3 */
  radius?: number;
  /** Run the breathing loop. @default true */
  animate?: boolean;
}
export declare function BarChart(props: BarChartProps): JSX.Element;
