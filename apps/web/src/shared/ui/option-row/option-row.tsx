import { type ReactNode } from 'react';

import { cn } from '@/shared/lib';

import { Typography } from '../typography';

type OptionRowProps = {
  control: ReactNode;
  description?: string;
  id: string;
  priceLabel?: string;
  title: string;
};

export const OptionRow = ({ control, description, id, priceLabel, title }: OptionRowProps) => {
  return (
    <label
      className={cn(
        'flex cursor-pointer items-start gap-3 rounded-2xl p-3',
        'has-[[data-state=checked]]:bg-secondary',
      )}
      htmlFor={id}
    >
      {control}

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <Typography as="span" className="break-words">
          {title}
        </Typography>

        {description && (
          <Typography as="span" className="break-words" tone="muted" variant="caption">
            {description}
          </Typography>
        )}
      </div>

      {priceLabel && (
        <Typography as="span" className="shrink-0" variant="caption">
          {priceLabel}
        </Typography>
      )}
    </label>
  );
};
