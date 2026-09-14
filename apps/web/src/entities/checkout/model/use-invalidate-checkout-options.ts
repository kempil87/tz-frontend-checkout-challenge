import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { QueryKeys } from '@/shared/config';

export const useInvalidateCheckoutOptions = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: QueryKeys.checkoutOptions });
  }, [queryClient]);
};
