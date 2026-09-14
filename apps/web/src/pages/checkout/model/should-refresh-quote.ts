import { ApiClientError } from '@/shared/api';

export const shouldRefreshQuote = (error: unknown) => {
  if (!(error instanceof ApiClientError)) {
    return false;
  }

  if (error.code === 'QUOTE_EXPIRED') {
    return true;
  }

  if (error.code === 'CART_VERSION_CONFLICT') {
    return true;
  }

  return false;
};
