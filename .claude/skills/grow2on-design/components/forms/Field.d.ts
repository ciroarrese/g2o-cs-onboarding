import * as React from 'react';

/** Labelled text input / textarea. 1.5px border that turns pink on focus. */
export interface FieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  /** Appends a pink asterisk to the label. */
  required?: boolean;
  /** @default "input" */
  as?: 'input' | 'textarea';
  hint?: string;
  /** Message + red border. */
  error?: string;
  inputStyle?: React.CSSProperties;
}
export declare function Field(props: FieldProps): JSX.Element;
