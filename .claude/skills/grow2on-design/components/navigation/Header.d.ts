import * as React from 'react';

/**
 * Sticky white site header: logo left, hover-dropdown nav centre, log-in + pink CTA right.
 * @startingPoint section="Navigation" subtitle="Grow2on site header with dropdown nav" viewport="1280x90"
 */
export interface HeaderLink { label: string; href?: string; items?: { label: string; href?: string }[] }
export interface HeaderProps {
  logo?: string;
  logoHref?: string;
  links?: HeaderLink[];
  loginLabel?: string;
  ctaLabel?: string;
  onCta?: () => void;
  /** @default true */
  sticky?: boolean;
  style?: React.CSSProperties;
}
export declare function Header(props: HeaderProps): JSX.Element;
