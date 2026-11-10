import * as React from 'react';

/** Blog index item. Without an image the thumbnail is the animated peach/pink/lilac gradient. */
export interface BlogCardProps {
  title: React.ReactNode;
  excerpt?: React.ReactNode;
  date?: string;
  /** Uppercase pink eyebrow. */
  tag?: string;
  image?: string;
  href?: string;
  style?: React.CSSProperties;
}
export declare function BlogCard(props: BlogCardProps): JSX.Element;
