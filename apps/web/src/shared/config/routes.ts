export const AppRoutes = {
  main: '/',
  cart: '/cart',
  checkout: '/checkout',
  order: '/orders/:orderId',
  orderPayment: '/orders/:orderId/payment',
  notFound: '*',
} as const;

export type AppRoute = (typeof AppRoutes)[keyof typeof AppRoutes];

export const buildOrderPath = (orderId: string) => {
  return `/orders/${orderId}`;
};

export const buildOrderPaymentPath = (orderId: string) => {
  return `/orders/${orderId}/payment`;
};
