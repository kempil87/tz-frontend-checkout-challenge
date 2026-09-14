import type { Product } from '@checkout/contracts';

import { api } from '@/shared/api';

export const productApi = {
  list: () => api.get<Product[]>('/products'),
};
