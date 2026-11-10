import * as React from 'react';

/**
 * Metric card: 36px gradient number over a 20px grey label, with an optional animated visual below.
 * @startingPoint section="Content" subtitle="Gradient metric cards" viewport="700x260"
 */
export interface StatCardProps {
  value: React.ReactNode;
  label: React.ReactNode;
  /** Visual area (chart, globe, gauge). */
  children?: React.ReactNode;
  /** @default 198 */
  minHeight?: number;
  style?: React.CSSProperties;
}
export declare function StatCard(props: StatCardProps): JSX.Element;
