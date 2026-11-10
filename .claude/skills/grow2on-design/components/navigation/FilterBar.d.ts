import * as React from 'react';

/** Segmented pill filter used on the Integraciones page. Active tab = white chip + shadow-sm inside a grey track. */
export interface FilterOption { label: string; count?: number }
export interface FilterBarProps {
  options: FilterOption[];
  value?: string;
  onChange?: (label: string) => void;
  style?: React.CSSProperties;
}
export declare function FilterBar(props: FilterBarProps): JSX.Element;
