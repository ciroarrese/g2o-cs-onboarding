import * as React from 'react';

/** Custom dropdown (the site replaces the native select). Pink chevron rotates 180° when open. */
export interface SelectProps {
  label?: string;
  required?: boolean;
  options: string[];
  value?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  style?: React.CSSProperties;
}
export declare function Select(props: SelectProps): JSX.Element;
