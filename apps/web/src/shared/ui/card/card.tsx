import { type ComponentPropsWithoutRef, type ElementType, type ReactNode } from 'react';

import { cn } from '@/shared/lib';

import { Typography, type TypographyProps } from '../typography';

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

type CardTitleProps = {
  children: ReactNode;
  id?: string;
};

export const CardTitle = ({ children, id }: CardTitleProps) => {
  return (
    <div className="rounded-2xl bg-card-foreground px-3 py-3.5">
      <Typography id={id} variant="h3">
        {children}
      </Typography>
    </div>
  );
};

type CardTotalProps = {
  tone?: TypographyProps['tone'];
  value: string;
};

export const CardTotal = ({ tone, value }: CardTotalProps) => {
  return (
    <CardFooter className="flex-row items-center justify-between gap-4">
      <Typography as="span" variant="h2">
        Итого
      </Typography>

      <Typography as="span" tone={tone} variant="price">
        {value}
      </Typography>
    </CardFooter>
  );
};

type CardComponent = typeof CardRoot & {
  Body: typeof CardBody;
  Footer: typeof CardFooter;
  Header: typeof CardHeader;
  Title: typeof CardTitle;
  Total: typeof CardTotal;
};

export const Card = CardRoot as CardComponent;

Card.Body = CardBody;
Card.Footer = CardFooter;
Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Total = CardTotal;
