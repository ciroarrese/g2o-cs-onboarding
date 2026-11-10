import * as React from 'react';

/** Numbered step in the "Conectá → Centralizá → Sincronizá → Vendé más" flow. Uses the brand's hand-drawn arrow PNG. */
export interface StepItemProps {
  number: React.ReactNode;
  title: React.ReactNode;
  body: React.ReactNode;
  /** Arrow artwork path. @default "assets/brand/flecha-pasos.png" */
  arrow?: string;
  /** Hide on the last step. @default true */
  showArrow?: boolean;
  style?: React.CSSProperties;
}
export declare function StepItem(props: StepItemProps): JSX.Element;
