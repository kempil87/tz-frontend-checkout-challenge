import { cn } from '@/shared/lib';

import { Button, type ButtonProps } from '../button';
import { Icon } from '../icon';
import { Typography } from '../typography';

type QuantityStepperProps = {
  className?: string;
  disabled?: boolean;
  increaseDisabled?: boolean;
  onDecrease: () => void;
  onIncrease: () => void;
  size?: ButtonProps['size'];
  value: number;
};

export const QuantityStepper = ({
  className,
  disabled = false,
  increaseDisabled = false,
  onDecrease,
  onIncrease,
  size = 'md',
  value,
}: QuantityStepperProps) => {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Button
        aria-label="Уменьшить количество"
        disabled={disabled}
        isIconOnly
        onClick={onDecrease}
        size={size}
        variant="secondary"
      >
        <Icon name="common:minus" />
      </Button>

      <Typography className="max-w-[2ch] min-w-[2ch] text-center">{value}</Typography>

      <Button
        aria-label="Увеличить количество"
        disabled={disabled || increaseDisabled}
        isIconOnly
        onClick={onIncrease}
        size={size}
        variant="secondary"
      >
        <Icon name="common:plus" />
      </Button>
    </div>
  );
};
