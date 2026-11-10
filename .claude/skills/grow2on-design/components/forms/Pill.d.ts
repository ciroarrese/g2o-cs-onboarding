import * as React from 'react';

/** Selectable option pill (form choices, integration links). 44px tall, 20px radius. */
export interface PillProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}
export declare function Pill(props: PillProps): JSX.Element;
