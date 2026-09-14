import { type ButtonHTMLAttributes, type HTMLAttributes, type ReactNode } from 'react';

import { cn } from '@/shared/lib';

import { Icon } from '../icon';

export type CheckboxCheckedState = boolean | 'indeterminate';

export type CheckboxProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange' | 'value'> & {
  checked: CheckboxCheckedState;
  onCheckedChange?: (checked: boolean) => void;
  children?: ReactNode;
};

export const CheckboxIndicator = ({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn(
        'flex items-center justify-center text-white group-data-[state=unchecked]:hidden',
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
};

const CheckboxRoot = ({
  checked,
  onCheckedChange,
  disabled,
  className,
  children,
  type = 'button',
  ...props
}: CheckboxProps) => {
  const state = checked === 'indeterminate' ? 'indeterminate' : checked ? 'checked' : 'unchecked';

  const handleClick = () => {
    onCheckedChange?.(checked !== true);
  };

  return (
    <button
      aria-checked={checked === 'indeterminate' ? 'mixed' : checked}
      className={cn(
        'group flex size-5 shrink-0 items-center justify-center rounded-md border border-border bg-white',
        'data-[state=checked]:border-primary data-[state=checked]:bg-primary',
        'data-[state=indeterminate]:border-primary data-[state=indeterminate]:bg-primary',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      data-state={state}
      disabled={disabled}
      onClick={handleClick}
      role="checkbox"
      type={type}
      {...props}
    >
      {children ?? (
        <CheckboxIndicator>
          <Icon className="group-data-[state=indeterminate]:hidden" name="common:check" size={12} />

          <Icon
            className="hidden group-data-[state=indeterminate]:block"
            name="common:minus"
            size={12}
          />
        </CheckboxIndicator>
      )}
    </button>
  );
};

type CheckboxComponent = typeof CheckboxRoot & {
  Indicator: typeof CheckboxIndicator;
};

export const Checkbox = CheckboxRoot as CheckboxComponent;

Checkbox.Indicator = CheckboxIndicator;
