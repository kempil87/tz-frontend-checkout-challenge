import type { Product } from '@checkout/contracts';

import { instance } from '@/shared/api';

export const productApi = {
  list: () => instance.get<Product[]>('/products'),
};
