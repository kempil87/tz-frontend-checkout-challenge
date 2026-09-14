import type { Payment } from '@checkout/contracts';

import { isPaymentFinished, isPaymentProcessing } from '@/entities/payment';

export const getPaymentForOrder = (payment: Payment | undefined, orderId: string) => {
  if (payment?.orderId !== orderId) {
    return undefined;
  }

  return payment;
};

export const getPaymentFormState = (payment?: Payment) => {
  const isFinished = isPaymentFinished(payment);
  const isProcessing = isPaymentProcessing(payment);
  const isSucceeded = payment?.status === 'succeeded';
  const canRetry = payment?.status === 'failed' || payment?.status === 'cancelled';

  return {
    canRetry,
    isFinished,
    isSucceeded,
    isWaiting: isProcessing || isSucceeded,
  };
};

export const getPaymentSubmitLabel = (canRetry: boolean) => {
  if (canRetry) {
    return 'Повторить оплату';
  }

  return 'Оплатить';
};
