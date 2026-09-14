import { type ElementType } from 'react';

import { cn } from '@/shared/lib';

import { Typography, type TypographyProps } from '../typography';

type SummaryRowProps = {
  as?: 'div' | 'li';
  className?: string;
  label: string;
  labelTone?: TypographyProps['tone'];
  value: string;
};

export const SummaryRow = ({ as, className, label, labelTone, value }: SummaryRowProps) => {
  const Component: ElementType = as ?? 'div';

  return (
    <Component className={cn('flex items-start justify-between gap-4', className)}>
      <Typography className="min-w-0 break-words" tone={labelTone}>
        {label}
      </Typography>

      <Typography as="span" className="shrink-0" variant="small">
        {value}
      </Typography>
    </Component>
  );
};
