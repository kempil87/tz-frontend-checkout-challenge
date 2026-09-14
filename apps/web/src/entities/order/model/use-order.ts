import { useQuery } from '@tanstack/react-query';

import { QueryKeys } from '@/shared/config';

import { orderApi } from '../api/order-api';

export const useOrder = (orderId?: string) => {
  return useQuery({
    enabled: Boolean(orderId),
    queryFn: () => {
      if (!orderId) {
        throw new Error('Не указан заказ.');
      }

      return orderApi.get(orderId);
    },
    queryKey: QueryKeys.order(orderId ?? ''),
  });
};
