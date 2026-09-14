import type { CheckoutOptions, CreateQuote, Quote } from '@checkout/contracts';

import { api } from '@/shared/api';

export const checkoutApi = {
  getOptions: () => api.get<CheckoutOptions>('/checkout/options'),

  createQuote: (body: CreateQuote) => api.post<Quote>('/quotes', body),

  getQuote: (quoteId: string) => api.get<Quote>(`/quotes/${quoteId}`),
};
