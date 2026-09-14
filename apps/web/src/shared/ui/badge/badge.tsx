import { type ComponentPropsWithoutRef, type ReactNode } from 'react';

import { cn } from '@/shared/lib';

import { Typography } from '../typography';

type BadgeProps = {
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<'span'>, 'children'>;

export const Badge = ({ children, className, ...props }: BadgeProps) => {
  return (
    <Typography
      as="span"
      className={cn(
        'inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-xs leading-none text-white',
        className,
      )}
      variant="caption"
      {...props}
    >
      {children}
    </Typography>
  );
};
