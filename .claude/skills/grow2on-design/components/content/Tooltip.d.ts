import * as React from 'react';

/** Dark tooltip above its trigger, with an optional pulsing gradient-dot status line. */
export interface TooltipProps {
  label: React.ReactNode;
  /** Secondary line, prefixed by a pulsing gradient dot — e.g. "Sincronización en tiempo real". */
  sub?: React.ReactNode;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function Tooltip(props: TooltipProps): JSX.Element;
