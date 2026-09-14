import { Link } from 'react-router-dom';

import { AppRoutes } from '@/shared/config';
import { Badge, Button, Icon, Typography } from '@/shared/ui';

import { useCart } from '../model/use-cart';

export const CartButton = () => {
  const { data: cart } = useCart();
  const quantity = cart?.quantity ?? 0;

  return (
    <span className="relative">
      {quantity !== 0 && (
        <Badge
          aria-hidden
          className="pointer-events-none absolute z-10 ring-2 ring-layout -top-2.5 -right-2.5"
        >
          {quantity}
        </Badge>
      )}

      <Button
        asChild
        className="relative max-sm:aspect-square max-sm:px-0"
        endContent={<Icon className="size-5" name="common:cart" />}
        variant="secondary"
      >
        <Link aria-label="Корзина" to={AppRoutes.cart}>
          <Typography as="span" className="max-sm:sr-only">
            Корзина
          </Typography>
        </Link>
      </Button>
    </span>
  );
};
