import * as React from 'react';

/** FAQ accordion. Questions are pink and medium-weight; answers are grey body copy. */
export interface AccordionItem { q: string; a: React.ReactNode }
export interface AccordionProps {
  items: AccordionItem[];
  /** Index open on mount, -1 for all closed. @default -1 */
  defaultOpen?: number;
  style?: React.CSSProperties;
}
export declare function Accordion(props: AccordionProps): JSX.Element;
