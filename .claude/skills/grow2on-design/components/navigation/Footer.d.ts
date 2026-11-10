import * as React from 'react';

/** Site footer: light-grey link grid + a dark #3c3c3c copyright bar. */
export interface FooterColumn { title: string; links: { label: string; href?: string }[] }
export interface FooterOffice { country: string; flag: string; address: string }
export interface FooterProps {
  logo?: string;
  blurb?: string;
  columns?: FooterColumn[];
  offices?: FooterOffice[];
  bottom?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function Footer(props: FooterProps): JSX.Element;
