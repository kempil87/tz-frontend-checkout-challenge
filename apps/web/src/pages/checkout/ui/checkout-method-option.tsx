import { cn } from '@/shared/lib';
import { RadioField, Typography } from '@/shared/ui';

type CheckoutMethodOptionProps = {
  description?: string;
  id: string;
  name: string;
  priceLabel?: string;
  title: string;
  value: string;
};

export const CheckoutMethodOption = ({
  description,
  id,
  name,
  priceLabel,
  title,
  value,
}: CheckoutMethodOptionProps) => {
  return (
    <label
      className={cn(
        'flex cursor-pointer items-start gap-3 rounded-2xl p-3',
        'has-[[data-state=checked]]:bg-secondary',
      )}
      htmlFor={id}
    >
      <RadioField id={id} name={name} value={value} />

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
