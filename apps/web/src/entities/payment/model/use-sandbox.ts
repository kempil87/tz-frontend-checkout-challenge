import { useQuery } from '@tanstack/react-query';

import { QueryKeys } from '@/shared/config';

import { paymentApi } from '../api/payment-api';

export const useSandbox = () => {
  return useQuery({
    queryFn: paymentApi.getSandbox,
    queryKey: QueryKeys.sandbox,
  });
};
