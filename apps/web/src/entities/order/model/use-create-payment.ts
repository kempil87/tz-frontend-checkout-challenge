import { useMutation, useQueryClient } from '@tanstack/react-query';

import { QueryKeys, StorageKeys } from '@/shared/config';

import { orderApi } from '../api/order-api';

type CreatePaymentVars = {
  orderId: string;
  idempotencyKey: string;
};

export const useCreatePayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, idempotencyKey }: CreatePaymentVars) =>
      orderApi.createPayment(orderId, idempotencyKey),
    onSuccess: (payment) => {
      localStorage.setItem(StorageKeys.paymentId, payment.id);
      queryClient.setQueryData(QueryKeys.payment(payment.id), payment);
      queryClient.invalidateQueries({ queryKey: QueryKeys.orderPayments(payment.orderId) });
    },
  });
};
