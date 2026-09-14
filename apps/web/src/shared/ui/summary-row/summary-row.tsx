import { type ElementType } from 'react';

import { Typography, type TypographyProps } from '../typography';

type SummaryRowProps = {
  as?: 'div' | 'li';
  label: string;
  labelTone?: TypographyProps['tone'];
  value: string;
};

export const SummaryRow = ({ as, label, labelTone, value }: SummaryRowProps) => {
  const Component: ElementType = as ?? 'div';

  return (
    <Component className="flex items-start justify-between gap-4">
      <Typography className="min-w-0 break-words" tone={labelTone}>
        {label}
      </Typography>

      <Typography as="span" className="shrink-0" variant="small">
        {value}
      </Typography>
    </Component>
  );
};
