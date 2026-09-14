import type { Payment } from '@checkout/contracts';

export const getPaymentStatusText = (payment?: Payment) => {
  if (!payment) {
    return undefined;
  }

  if (payment.status === 'processing') {
    return 'Ожидаем подтверждение оплаты';
  }

  if (payment.status === 'failed') {
    return 'Карта отклонена. Можно выбрать другую карту и повторить оплату.';
  }

  if (payment.status === 'cancelled') {
    return 'Оплата отменена. Можно повторить оплату этого заказа.';
  }

  if (payment.status === 'succeeded') {
    return 'Оплата подтверждается';
  }

  return undefined;
};

export const getPaymentStatusTone = (status?: Payment['status']) => {
  if (status === 'failed') {
    return 'danger' as const;
  }

  return 'muted' as const;
};
