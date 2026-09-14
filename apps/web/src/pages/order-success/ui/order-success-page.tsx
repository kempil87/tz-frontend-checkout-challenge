import { Link, Navigate, useParams } from 'react-router-dom';

import { useInvalidateCheckoutOptions } from '@/entities/checkout';
import { getOrderDeliveryText, OrderItemRow, shouldOpenPayment, useOrder } from '@/entities/order';
import { AppRoutes, buildOrderPaymentPath } from '@/shared/config';
import { amountFormat, amountOrFree } from '@/shared/lib';
import { AppLoader, Button, Card, SummaryRow, Typography } from '@/shared/ui';

export const OrderSuccessPage = () => {
  const { orderId } = useParams();
  const { data: order, isPending } = useOrder(orderId);

  useInvalidateCheckoutOptions();

  if (isPending) {
    return <AppLoader isStetched />;
  }

  if (!order) {
    return <Navigate to={AppRoutes.cart} replace />;
  }

  if (shouldOpenPayment(order)) {
    return <Navigate to={buildOrderPaymentPath(order.id)} replace />;
  }

  return (
    <section aria-labelledby="order-success-heading" className="flex flex-col gap-6">
      <Typography id="order-success-heading" variant="h1">
        Заказ {order.number} оформлен
      </Typography>

      {order.paymentMethod === 'cash_on_delivery' && (
        <Typography>Заказ оформлен, оплата при получении</Typography>
      )}

      <Card>
        <Card.Header>
          <Card.Title>Состав заказа</Card.Title>
        </Card.Header>

        <Card.Body>
          <ul className="flex flex-col gap-4">
            {order.items.map((item) => (
              <OrderItemRow item={item} key={item.productId} />
            ))}
          </ul>
        </Card.Body>
      </Card>

      <Card>
        <Card.Body className="gap-3">
          <SummaryRow
            label={getOrderDeliveryText(order.delivery)}
            labelTone="muted"
            value={amountOrFree(order.shipping)}
          />

          <Typography variant="h2">Итого {amountFormat(order.total)}</Typography>
        </Card.Body>
      </Card>

      <Button asChild className="w-full sm:w-auto" size="lg">
        <Link to={AppRoutes.main}>На главную</Link>
      </Button>
    </section>
  );
};
