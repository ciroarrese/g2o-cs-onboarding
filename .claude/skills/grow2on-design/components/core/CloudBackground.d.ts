import * as React from 'react';

/** Blurred, slowly drifting pink/orange/purple blobs behind hero and CTA sections. */
export interface CloudBlob { color: string; size: string; left?: string; right?: string; top?: string; bottom?: string; anim?: string }
export interface CloudBackgroundProps extends React.HTMLAttributes<HTMLDivElement> {
  blobs?: CloudBlob[];
  /** @default 0.5 */
  opacity?: number;
}
export declare function CloudBackground(props: CloudBackgroundProps): JSX.Element;
