import type { CreateOrder, Order, Payment } from '@checkout/contracts';

import { instance } from '@/shared/api';

export const orderApi = {
  list: () => instance.get<Order[]>('/orders'),

  get: (orderId: string) => instance.get<Order>(`/orders/${orderId}`),

  create: (body: CreateOrder, idempotencyKey: string) =>
    instance.post<Order>('/orders', body, { idempotencyKey }),

  listPayments: (orderId: string) => instance.get<Payment[]>(`/orders/${orderId}/payments`),

  createPayment: (orderId: string, idempotencyKey: string) =>
    instance.post<Payment>(`/orders/${orderId}/payments`, {}, { idempotencyKey }),
};
