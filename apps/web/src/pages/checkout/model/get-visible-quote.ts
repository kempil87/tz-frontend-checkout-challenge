import type { Delivery, Quote } from '@checkout/contracts';

import { ApiClientError } from '@/shared/api';

import { isSameDelivery } from './get-checkout-delivery';

export const getVisibleQuote = (
  quote: Quote | undefined,
  delivery: Delivery | null,
  cartVersion: number,
) => {
  if (!quote) {
    return undefined;
  }

  if (!delivery) {
    return undefined;
  }

  if (quote.cartVersion !== cartVersion) {
    return undefined;
  }

  if (!isSameDelivery(quote.delivery, delivery)) {
    return undefined;
  }

  return quote;
};

export const getQuoteErrorMessage = (error: unknown) => {
  if (!(error instanceof ApiClientError)) {
    return undefined;
  }

  if (error.code === 'CART_EMPTY') {
    return undefined;
  }

  return error.message;
};
