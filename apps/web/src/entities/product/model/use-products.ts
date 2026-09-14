import { useQuery } from '@tanstack/react-query';

import { QueryKeys } from '@/shared/config';

import { productApi } from '../api/product-api';

export const useProducts = () => {
  return useQuery({
    queryKey: QueryKeys.products,
    queryFn: productApi.list,
  });
};
