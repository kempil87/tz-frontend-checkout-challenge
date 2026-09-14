import type { CreateQuote } from '@checkout/contracts';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ApiClientError } from '@/shared/api';
import { QueryKeys } from '@/shared/config';

import { checkoutApi } from '../api/checkout-api';

export const useCreateQuote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateQuote) => checkoutApi.createQuote(body),
    onError: (error) => {
      if (!(error instanceof ApiClientError)) {
        return;
      }

      if (error.code === 'CART_VERSION_CONFLICT' || error.code === 'QUOTE_EXPIRED') {
        queryClient.invalidateQueries({ queryKey: QueryKeys.cart });
        queryClient.invalidateQueries({ queryKey: QueryKeys.checkoutOptions });
      }
    },
    onSuccess: (quote) => {
      queryClient.setQueryData(QueryKeys.quote(quote.id), quote);
    },
  });
};
