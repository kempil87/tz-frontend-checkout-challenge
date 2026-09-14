import { Cart } from '@checkout/contracts';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { QueryKeys } from '@/shared/config';

import { cartApi } from '../api/cart-api';

export const useCart = (options?: UseQueryOptions<Cart>) => {
  return useQuery({
    queryKey: QueryKeys.cart,
    queryFn: cartApi.get,
    ...options,
  });
};
