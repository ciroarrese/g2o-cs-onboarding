import * as React from 'react';

/** Small pill counter, as used on the integrations filter bar. */
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** @default "neutral" */
  tone?: 'neutral' | 'pink' | 'success' | 'warning' | 'error';
  children?: React.ReactNode;
}
export declare function Badge(props: BadgeProps): JSX.Element;
