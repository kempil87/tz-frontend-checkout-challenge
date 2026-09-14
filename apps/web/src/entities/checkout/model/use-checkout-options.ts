import { useQuery } from '@tanstack/react-query';

import { QueryKeys } from '@/shared/config';

import { checkoutApi } from '../api/checkout-api';

export const useCheckoutOptions = () => {
  return useQuery({
    queryKey: QueryKeys.checkoutOptions,
    queryFn: checkoutApi.getOptions,
  });
};
