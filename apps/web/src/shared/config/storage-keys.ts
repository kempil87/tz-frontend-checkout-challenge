export const StorageKeys = {
  sessionToken: 'session-token',
  orderId: 'order-id',
  paymentId: 'payment-id',
} as const;

export type StorageKey = (typeof StorageKeys)[keyof typeof StorageKeys];
