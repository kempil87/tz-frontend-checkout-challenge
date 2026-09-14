import type { CreateOrder, Order, Payment } from '@checkout/contracts';

import { api } from '@/shared/api';

export const orderApi = {
  list: () => api.get<Order[]>('/orders'),

  get: (orderId: string) => api.get<Order>(`/orders/${orderId}`),

  create: (body: CreateOrder, idempotencyKey: string) =>
    api.post<Order>('/orders', body, { idempotencyKey }),

  listPayments: (orderId: string) => api.get<Payment[]>(`/orders/${orderId}/payments`),

  createPayment: (orderId: string, idempotencyKey: string) =>
    api.post<Payment>(`/orders/${orderId}/payments`, {}, { idempotencyKey }),
};
