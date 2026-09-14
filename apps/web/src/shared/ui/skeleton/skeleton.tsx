import { HTMLAttributes } from 'react';

import { cn } from '@/shared/lib';

export type SkeletonProps = HTMLAttributes<HTMLDivElement>;

export const Skeleton = ({ className, ...props }: SkeletonProps) => {
  return <div className={cn('animate-pulse rounded-lg bg-secondary', className)} {...props} />;
};
