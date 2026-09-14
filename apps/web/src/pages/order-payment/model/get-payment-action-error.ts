import { ApiClientError } from '@/shared/api';
import { QueryKeys } from '@/shared/config';

type PaymentActionIds = {
  orderId: string;
  paymentId: string;
};

type PaymentActionError =
  { kind: 'invalidate'; queryKey: readonly unknown[] } | { kind: 'message'; message: string };

const FALLBACK_MESSAGE = 'Не удалось выполнить оплату. Попробуйте ещё раз.';

export const getPaymentActionError = (
  error: unknown,
  ids: PaymentActionIds,
): PaymentActionError => {
  if (!(error instanceof ApiClientError)) {
    return { kind: 'message', message: FALLBACK_MESSAGE };
  }

  if (error.code === 'ORDER_ALREADY_PAID') {
    return { kind: 'invalidate', queryKey: QueryKeys.order(ids.orderId) };
  }

  if (error.code === 'PAYMENT_IN_PROGRESS') {
    return { kind: 'invalidate', queryKey: QueryKeys.orderPayments(ids.orderId) };
  }

  if (error.code === 'PAYMENT_FINALIZED') {
    return { kind: 'invalidate', queryKey: QueryKeys.payment(ids.paymentId) };
  }

  return { kind: 'message', message: error.message };
};
