import { useQuery } from '@tanstack/react-query';

import { QueryKeys } from '@/shared/config';

import { paymentApi } from '../api/payment-api';
import { isPaymentProcessing } from './is-payment-processing';

const PAYMENT_POLL_MS = 500;

export const usePayment = (paymentId?: string) => {
  return useQuery({
    enabled: Boolean(paymentId),
    queryFn: ({ signal }) => {
      if (!paymentId) {
        throw new Error('Не указана попытка оплаты.');
      }

      return paymentApi.get(paymentId, { signal });
    },
    queryKey: QueryKeys.payment(paymentId ?? ''),
    refetchInterval: (query) => {
      if (isPaymentProcessing(query.state.data)) {
        return PAYMENT_POLL_MS;
      }

      return false;
    },
    refetchIntervalInBackground: false,
  });
};
