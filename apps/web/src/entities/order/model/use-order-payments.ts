import { useQuery } from '@tanstack/react-query';

import { QueryKeys } from '@/shared/config';

import { orderApi } from '../api/order-api';

export const useOrderPayments = (orderId?: string) => {
  return useQuery({
    enabled: Boolean(orderId),
    queryFn: () => {
      if (!orderId) {
        throw new Error('Не указан заказ.');
      }

      return orderApi.listPayments(orderId);
    },
    queryKey: QueryKeys.orderPayments(orderId ?? ''),
  });
};
