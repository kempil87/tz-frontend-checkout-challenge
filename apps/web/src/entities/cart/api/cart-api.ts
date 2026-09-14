import type { Cart } from '@checkout/contracts';

import { api } from '@/shared/api';

const deleteItem = (productId: string) => api.delete<void>(`/cart/items/${productId}`);

export const cartApi = {
  get: () => api.get<Cart>('/cart'),

  setItem: (productId: string, quantity: number) =>
    api.put<Cart['items'][number]>(`/cart/items/${productId}`, { quantity }),

  deleteItem,

  deleteItems: (productIds: string[]) => Promise.all(productIds.map(deleteItem)),
};
