import { type ComponentPropsWithoutRef, type ElementType } from 'react';

import { cn } from '@/shared/lib';

type CardRootProps<T extends ElementType = 'article'> = {
  as?: T;
} & Omit<ComponentPropsWithoutRef<T>, 'as'>;

type CardSectionProps = ComponentPropsWithoutRef<'div'>;

export const CardHeader = ({ className, ...props }: CardSectionProps) => {
  return <div className={cn('flex flex-col gap-2 p-4 pb-0', className)} {...props} />;
};

export const CardBody = ({ className, ...props }: CardSectionProps) => {
  return <div className={cn('flex flex-col gap-4 p-4', className)} {...props} />;
};

export const CardFooter = ({ className, ...props }: CardSectionProps) => {
  return <div className={cn('flex flex-col gap-4 p-4 pt-0', className)} {...props} />;
};

const CardRoot = <T extends ElementType = 'article'>({
  as,
  className,
  ...props
}: CardRootProps<T>) => {
  const Component = as ?? 'article';

  return <Component className={cn('rounded-3xl bg-layout', className)} {...props} />;
};

type CardComponent = typeof CardRoot & {
  Body: typeof CardBody;
  Footer: typeof CardFooter;
  Header: typeof CardHeader;
};

export const Card = CardRoot as CardComponent;

Card.Body = CardBody;
Card.Footer = CardFooter;
Card.Header = CardHeader;
