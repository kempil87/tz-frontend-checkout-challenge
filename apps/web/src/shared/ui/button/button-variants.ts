import { cva } from 'class-variance-authority';

export const buttonVariants = cva(
  'cursor-pointer inline-flex shrink-0 items-center justify-center gap-2 rounded-xl font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-20',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-white hover:bg-primary/80',
        secondary: 'bg-secondary text-neutral-900 hover:bg-secondary/80',
        ghost: 'text-neutral-900 hover:bg-neutral-100',
        danger: 'bg-red-600 text-white hover:bg-red-700',
        success: 'bg-success text-white hover:bg-success/80',
      },
      size: {
        sm: 'h-8 text-sm',
        md: 'h-10 text-sm',
        lg: 'h-12 text-sm',
      },
      isIconOnly: {
        true: 'aspect-square p-0',
        false: '',
      },
    },
    compoundVariants: [
      { isIconOnly: false, size: 'sm', class: 'px-3' },
      { isIconOnly: false, size: 'md', class: 'px-4' },
      { isIconOnly: false, size: 'lg', class: 'px-5' },
      { isIconOnly: true, size: 'sm', class: 'w-8' },
      { isIconOnly: true, size: 'md', class: 'w-10' },
      { isIconOnly: true, size: 'lg', class: 'w-12' },
    ],
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      isIconOnly: false,
    },
  },
);
