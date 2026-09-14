import { type ButtonHTMLAttributes, type Ref } from 'react';

import { cn } from '@/shared/lib';

export type RadioProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> & {
  checked?: unknown;
  onCheckedChange?: (value: unknown) => void;
  ref?: Ref<HTMLButtonElement>;
};

export const Radio = ({
  checked,
  onCheckedChange,
  disabled,
  className,
  type = 'button',
  value,
  ref,
  ...props
}: RadioProps) => {
  const isChecked = checked === value;

  const handleClick = () => {
    if (isChecked) {
      return;
    }

    onCheckedChange?.(value);
  };

  return (
    <button
      aria-checked={isChecked}
      className={cn(
        'group flex size-5 shrink-0 items-center justify-center rounded-full border border-border bg-white',
        'data-[state=checked]:border-primary',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      data-state={isChecked ? 'checked' : 'unchecked'}
      disabled={disabled}
      onClick={handleClick}
      ref={ref}
      role="radio"
      type={type}
      value={value}
      {...props}
    >
      <span
        aria-hidden
        className="size-2.5 rounded-full bg-primary group-data-[state=unchecked]:hidden"
      />
    </button>
  );
};
