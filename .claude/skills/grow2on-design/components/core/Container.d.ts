import * as React from 'react';

/** 1160px max-width wrapper with responsive side padding (64/32/20px). */
export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> { children?: React.ReactNode }
export declare function Container(props: ContainerProps): JSX.Element;

/** Vertical section rhythm: 64px top and bottom. */
export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  /** 32px top, 0 bottom. @default false */
  tight?: boolean;
  background?: string;
  children?: React.ReactNode;
}
export declare function Section(props: SectionProps): JSX.Element;
