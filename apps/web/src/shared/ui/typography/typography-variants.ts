import { cva } from 'class-variance-authority';

export const typographyVariants = cva('', {
  variants: {
    variant: {
      h1: 'text-2xl font-semibold tracking-tight',
      h2: 'text-xl font-semibold tracking-tight',
      h3: 'text-lg font-medium',
      body: 'text-base leading-6',
      caption: 'text-sm leading-5',
      small: 'text-xs leading-4',
      overline: 'text-xs font-medium uppercase tracking-wide',
      price: 'text-lg font-semibold tracking-tight tabular-nums',
    },
    tone: {
      default: 'text-neutral-900',
      primary: 'text-primary',
      muted: 'text-neutral-600',
      danger: 'text-red-700',
      success: 'text-green-700',
    },
  },
  defaultVariants: {
    variant: 'body',
    tone: 'default',
  },
});
