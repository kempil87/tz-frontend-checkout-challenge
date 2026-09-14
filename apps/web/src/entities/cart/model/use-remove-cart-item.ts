import { useMutation, useQueryClient } from '@tanstack/react-query';

import { QueryKeys } from '@/shared/config';

import { cartApi } from '../api/cart-api';

export const useRemoveCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productIds: string[]) => cartApi.deleteItems(productIds),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.cart });
    },
  });
};
