import type { Cart } from '@checkout/contracts';

import { instance } from '@/shared/api';

const deleteItem = (productId: string) => instance.delete<void>(`/cart/items/${productId}`);

export const cartApi = {
  get: () => instance.get<Cart>('/cart'),

  setItem: (productId: string, quantity: number) =>
    instance.put<Cart['items'][number]>(`/cart/items/${productId}`, { quantity }),

  deleteItem,

  deleteItems: (productIds: string[]) => Promise.all(productIds.map(deleteItem)),
};
