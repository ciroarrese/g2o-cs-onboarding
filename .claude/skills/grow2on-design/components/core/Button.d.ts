import * as React from 'react';

/**
 * Pill-shaped brand action. Primary = solid Grow2on pink; outline inverts to solid on hover.
 * @startingPoint section="Core" subtitle="Pill buttons in every brand variant" viewport="700x150"
 */
export interface ButtonProps extends React.HTMLAttributes<HTMLElement> {
  /** Visual treatment. @default "primary" */
  variant?: 'primary' | 'pink' | 'outline' | 'ghost';
  /** 52px (md) or 44px (sm). @default "md" */
  size?: 'md' | 'sm';
  /** Renders as <a> when set. */
  href?: string;
  /** Override the rendered tag. */
  as?: keyof JSX.IntrinsicElements;
  /** Node placed before the label (usually an <img> icon). */
  icon?: React.ReactNode;
  /** Node placed after the label — the site uses "→" and "↓" characters. */
  iconRight?: React.ReactNode;
  disabled?: boolean;
  children?: React.ReactNode;
}
export declare function Button(props: ButtonProps): JSX.Element;
