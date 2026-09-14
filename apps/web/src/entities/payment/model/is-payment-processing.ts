import type { Payment } from '@checkout/contracts';

export const isPaymentProcessing = (payment?: Payment) => {
  return payment?.status === 'processing';
};
