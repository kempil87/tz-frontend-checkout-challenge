import type { Payment } from '@checkout/contracts';

export const getActivePayment = (payments?: Payment[]) => {
  if (!payments) {
    return undefined;
  }

  for (const payment of payments) {
    if (payment.status === 'pending') {
      return payment;
    }

    if (payment.status === 'processing') {
      return payment;
    }
  }

  return undefined;
};
