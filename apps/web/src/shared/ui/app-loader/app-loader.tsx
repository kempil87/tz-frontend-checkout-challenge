import { HTMLAttributes } from 'react';

import { cn } from '@/shared/lib';

import { Icon } from '../icon';

export interface AppLoaderProps extends HTMLAttributes<HTMLDivElement> {
  isStetched?: boolean;
}

export const AppLoader = ({ isStetched = false, className, ...props }: AppLoaderProps) => {
  return (
    <div
      className={cn(
        'flex items-center justify-center',
        {
          'h-full w-full': isStetched,
        },
        className,
      )}
      role="status"
      aria-label="Loading"
      {...props}
    >
      <Icon className="animate-spin text-inherit size-8" name="common:loading" />
    </div>
  );
};
