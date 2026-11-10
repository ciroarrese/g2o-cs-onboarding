import * as React from 'react';

/**
 * Closing conversion block: centred heading, ≤520px body, one pink button, drifting cloud background.
 * @startingPoint section="Content" subtitle="Closing CTA banner with cloud background" viewport="900x320"
 */
export interface CtaBannerProps {
  title: React.ReactNode;
  body?: React.ReactNode;
  ctaLabel?: string;
  ctaHref?: string;
  /** @default true */
  clouds?: boolean;
  style?: React.CSSProperties;
}
export declare function CtaBanner(props: CtaBannerProps): JSX.Element;
