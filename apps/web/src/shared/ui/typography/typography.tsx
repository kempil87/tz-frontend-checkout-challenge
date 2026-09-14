import { type ComponentPropsWithoutRef, type ElementType } from 'react';
import { type VariantProps } from 'class-variance-authority';

import { cn } from '@/shared/lib';

import { typographyVariants } from './typography-variants';

const defaultTags = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  body: 'p',
  caption: 'span',
  small: 'span',
  overline: 'span',
  price: 'p',
} as const;

type TypographyVariant = NonNullable<VariantProps<typeof typographyVariants>['variant']>;

export type TypographyProps<T extends ElementType = 'p'> = {
  as?: T;
} & VariantProps<typeof typographyVariants> &
  Omit<ComponentPropsWithoutRef<T>, 'as'>;

export const Typography = <T extends ElementType = 'p'>({
  as,
  variant = 'body',
  tone,
  className,
  ...props
}: TypographyProps<T>) => {
  const Component = as ?? defaultTags[variant as TypographyVariant];

  return <Component className={cn(typographyVariants({ variant, tone, className }))} {...props} />;
};
