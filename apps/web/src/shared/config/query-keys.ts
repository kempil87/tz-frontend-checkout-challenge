export const QueryKeys = {
  products: ['products'],
  cart: ['cart'],
  checkoutOptions: ['checkout-options'],
  quote: (quoteId: string) => ['quotes', quoteId] as const,
  orders: ['orders'],
  order: (orderId: string) => ['orders', orderId] as const,
  orderPayments: (orderId: string) => ['orders', orderId, 'payments'] as const,
  payment: (paymentId: string) => ['payments', paymentId] as const,
  simulation: (paymentId: string, simulationId: string) =>
    ['payments', paymentId, 'simulations', simulationId] as const,
  sandbox: ['sandbox'],
} as const;

export type QueryKey = readonly unknown[];
