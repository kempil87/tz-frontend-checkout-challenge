import type { Scenario } from '@checkout/contracts';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { QueryKeys } from '@/shared/config';

import { paymentApi } from '../api/payment-api';

type SimulatePaymentVars = {
  paymentId: string;
  scenario: Scenario;
};

export const useSimulatePayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ paymentId, scenario }: SimulatePaymentVars) =>
      paymentApi.simulate(paymentId, scenario),
    onSuccess: (_simulation, { paymentId }) => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.payment(paymentId) });
    },
  });
};
