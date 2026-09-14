import type { CheckoutOptions, CreateQuote, Quote } from '@checkout/contracts';

import { instance } from '@/shared/api';

export const checkoutApi = {
  getOptions: () => instance.get<CheckoutOptions>('/checkout/options'),

  createQuote: (body: CreateQuote) => instance.post<Quote>('/quotes', body),

  getQuote: (quoteId: string) => instance.get<Quote>(`/quotes/${quoteId}`),
};
