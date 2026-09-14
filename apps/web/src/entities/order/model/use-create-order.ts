import type { CreateOrder } from '@checkout/contracts';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ApiClientError } from '@/shared/api';
import { QueryKeys, StorageKeys } from '@/shared/config';

import { orderApi } from '../api/order-api';

type CreateOrderVars = {
  body: CreateOrder;
  idempotencyKey: string;
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ body, idempotencyKey }: CreateOrderVars) =>
      orderApi.create(body, idempotencyKey),
    onError: (error) => {
      if (!(error instanceof ApiClientError)) {
        return;
      }

      if (error.code === 'QUOTE_EXPIRED' || error.code === 'CART_VERSION_CONFLICT') {
        queryClient.invalidateQueries({ queryKey: QueryKeys.cart });
        queryClient.invalidateQueries({ queryKey: QueryKeys.checkoutOptions });
      }
    },
    onSuccess: (order) => {
      localStorage.setItem(StorageKeys.orderId, order.id);
      queryClient.setQueryData(QueryKeys.order(order.id), order);
      queryClient.invalidateQueries({ queryKey: QueryKeys.cart });
      queryClient.invalidateQueries({ queryKey: QueryKeys.orders });
    },
  });
};
