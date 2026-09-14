import { Navigate, useParams } from 'react-router-dom';

import { useInvalidateCheckoutOptions } from '@/entities/checkout';
import { shouldOpenPayment, useOrder } from '@/entities/order';
import { AppRoutes, buildOrderPath } from '@/shared/config';
import { AppLoader, Typography } from '@/shared/ui';

import { OrderPaymentForm } from './order-payment-form';

export const OrderPaymentPage = () => {
  const { orderId } = useParams();
  const { data: order, isPending } = useOrder(orderId);

  useInvalidateCheckoutOptions();

  if (isPending) {
    return <AppLoader isStetched />;
  }

  if (!order) {
    return <Navigate to={AppRoutes.cart} replace />;
  }

  if (!shouldOpenPayment(order)) {
    return <Navigate to={buildOrderPath(order.id)} replace />;
  }

  return (
    <section aria-labelledby="order-payment-heading" className="flex flex-col gap-6">
      <Typography id="order-payment-heading" variant="h1">
        Оплата заказа {order.number}
      </Typography>

      <OrderPaymentForm order={order} />
    </section>
  );
};
