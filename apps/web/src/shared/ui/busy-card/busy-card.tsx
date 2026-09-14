import { type ReactNode } from 'react';

import { cn } from '@/shared/lib';

import { AppLoader } from '../app-loader';
import { Card } from '../card';

type BusyCardProps = {
  as?: 'article' | 'aside';
  children: ReactNode;
  className?: string;
  isBusy?: boolean;
  sticky?: boolean;
};

export const BusyCard = ({
  as,
  children,
  className,
  isBusy = false,
  sticky = false,
}: BusyCardProps) => {
  return (
    <Card
      as={as}
      className={cn(
        'relative transition-opacity duration-300 ease-in-out',
        sticky && 'lg:sticky lg:top-24',
        isBusy && 'opacity-50',
        className,
      )}
    >
      {isBusy && <AppLoader className="absolute inset-0" isStetched />}

      {children}
    </Card>
  );
};
