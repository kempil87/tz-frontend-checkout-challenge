import type { Payment } from '@checkout/contracts';

export const isPaymentFinished = (payment?: Payment) => {
  if (!payment) {
    return false;
  }

  if (payment.status === 'succeeded') {
    return true;
  }

  if (payment.status === 'failed') {
    return true;
  }

  if (payment.status === 'cancelled') {
    return true;
  }

  return false;
};
