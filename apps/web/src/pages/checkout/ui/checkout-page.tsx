import { Link, Navigate } from 'react-router-dom';

import { useCheckoutOptions } from '@/entities/checkout';
import { AppRoutes } from '@/shared/config';
import { AppLoader, Typography } from '@/shared/ui';

import { CheckoutForm } from './checkout-form';

export const CheckoutPage = () => {
  const { data: options, isPending } = useCheckoutOptions();

  if (isPending) {
    return <AppLoader isStetched />;
  }

  if (!options?.cart.items.length) {
    return <Navigate to={AppRoutes.cart} replace />;
  }

  return (
    <section aria-labelledby="checkout-heading" className="flex flex-col gap-6">
      <div className="flex flex-col">
        <Link className="group" to={AppRoutes.cart}>
          <Typography
            className="group-hover:opacity-70 transition-opacity duration-300"
            tone="primary"
            variant="small"
          >
            Вернуться к корзине
          </Typography>
        </Link>

        <Typography id="checkout-heading" variant="h1">
          Оформление заказа
        </Typography>
      </div>

      <CheckoutForm options={options} />
    </section>
  );
};
