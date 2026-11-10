import * as React from 'react';

/** Multi-step form progress indicator. Done steps fill pink; the active step is pink outline + bold label. */
export interface ProgressStepsProps {
  steps: string[];
  /** Zero-based index of the active step. @default 0 */
  current?: number;
  style?: React.CSSProperties;
}
export declare function ProgressSteps(props: ProgressStepsProps): JSX.Element;
