import type { Order } from '@checkout/contracts';

export const shouldOpenPayment = (order: Order) => {
  if (order.paymentMethod !== 'card') {
    return false;
  }

  if (order.status === 'paid') {
    return false;
  }

  return true;
};
