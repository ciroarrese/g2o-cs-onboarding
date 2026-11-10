import * as React from 'react';

/**
 * Square logo tile from the Integraciones grid — lifts 3px on hover.
 * @startingPoint section="Content" subtitle="Integration logo tiles and mega-menu pills" viewport="700x200"
 */
export interface IntegrationTileProps extends React.HTMLAttributes<HTMLElement> {
  src: string;
  alt?: string;
  href?: string;
}
export declare function IntegrationTile(props: IntegrationTileProps): JSX.Element;

/** Compact 44px logo pill from the Integraciones mega-menu. Border turns pink on hover. */
export interface IntegrationPillProps extends React.HTMLAttributes<HTMLElement> {
  src: string;
  alt?: string;
  label?: string;
  href?: string;
}
export declare function IntegrationPill(props: IntegrationPillProps): JSX.Element;
