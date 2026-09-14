import { useMutation, useQueryClient } from '@tanstack/react-query';

import { QueryKeys } from '@/shared/config';

import { cartApi } from '../api/cart-api';

type SetCartItemVars = {
  productId: string;
  quantity: number;
};

export const useSetCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, quantity }: SetCartItemVars) => cartApi.setItem(productId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.cart });
    },
  });
};
