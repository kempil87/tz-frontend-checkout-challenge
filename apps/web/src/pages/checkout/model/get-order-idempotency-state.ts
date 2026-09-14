import type { CreateOrder } from '@checkout/contracts';

type OrderIdempotencyState = {
  bodyKey: string;
  key: string;
  quoteId: string;
};

const getBodyKey = (body: CreateOrder) => {
  return JSON.stringify(body);
};

export const getOrderIdempotencyState = (
  current: OrderIdempotencyState | null,
  quoteId: string,
  body: CreateOrder,
) => {
  const bodyKey = getBodyKey(body);

  if (current && current.quoteId === quoteId && current.bodyKey === bodyKey) {
    return current;
  }

  return {
    bodyKey,
    key: crypto.randomUUID(),
    quoteId,
  };
};
