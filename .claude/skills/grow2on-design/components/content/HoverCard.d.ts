import * as React from 'react';

/** Card whose face cross-fades to a description on hover (feature grid on /pages/funcionalidades). */
export interface HoverCardProps {
  /** Resting face — usually an icon plus a short title. */
  front: React.ReactNode;
  /** Description revealed on hover. */
  back: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function HoverCard(props: HoverCardProps): JSX.Element;
