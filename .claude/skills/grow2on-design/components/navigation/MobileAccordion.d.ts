import * as React from 'react';

/** Collapsible nav group inside the mobile menu. 44px minimum touch target, pink chevron. */
export interface MobileAccordionProps {
  label: string;
  defaultOpen?: boolean;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function MobileAccordion(props: MobileAccordionProps): JSX.Element;
