import type { Payment, Sandbox, Scenario, Simulation } from '@checkout/contracts';

import { type ApiRequestConfig, instance } from '@/shared/api';

export const paymentApi = {
  get: (paymentId: string, config?: ApiRequestConfig) =>
    instance.get<Payment>(`/payments/${paymentId}`, config),

  getSandbox: () => instance.get<Sandbox>('/sandbox'),

  simulate: (paymentId: string, scenario: Scenario) =>
    instance.post<Simulation>(`/payments/${paymentId}/simulations`, { scenario }),

  getSimulation: (paymentId: string, simulationId: string) =>
    instance.get<Simulation>(`/payments/${paymentId}/simulations/${simulationId}`),
};
