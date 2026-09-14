import { type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Slot, Slottable } from '@radix-ui/react-slot';
import { type VariantProps } from 'class-variance-authority';

import { cn } from '@/shared/lib';

import { buttonVariants } from './button-variants';

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    isLoading?: boolean;
    isIconOnly?: boolean;
    startContent?: ReactNode;
    endContent?: ReactNode;
  };

export const Button = ({
  className,
  variant,
  size,
  isLoading = false,
  isIconOnly = false,
  disabled,
  children,
  type = 'button',
  asChild = false,
  startContent,
  endContent,
  ...props
}: ButtonProps) => {
  const Comp = asChild ? Slot : 'button';
  const isDisabled = disabled || isLoading;

  return (
    <Comp
      className={cn(buttonVariants({ variant, size, isIconOnly }), className)}
      type={asChild ? undefined : type}
      disabled={asChild ? undefined : isDisabled}
      aria-busy={isLoading}
      aria-disabled={asChild && isDisabled ? true : undefined}
      {...props}
    >
      {startContent && startContent}

      <Slottable>{children}</Slottable>

      {endContent && endContent}
    </Comp>
  );
};
