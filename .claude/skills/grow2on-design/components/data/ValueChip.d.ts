import * as React from 'react';

/** Tiny white data callout that floats over a visualisation (the "$8.250" marker on the globe). */
export interface ValueChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Small leading mark — usually a 12px platform iso. */
  icon?: React.ReactNode;
  children?: React.ReactNode;
}
export declare function ValueChip(props: ValueChipProps): JSX.Element;
