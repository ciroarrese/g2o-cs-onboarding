import * as React from 'react';

/** Scattered pink/orange/purple pinpricks that pulse — the ambient texture behind the globe and gauge stat cards. Absolutely positioned; put it in a relative parent. */
export interface ParticleFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  /** @default 90 */
  count?: number;
  /** Deterministic layout seed. @default 7 */
  seed?: number;
}
export declare function ParticleField(props: ParticleFieldProps): JSX.Element;
