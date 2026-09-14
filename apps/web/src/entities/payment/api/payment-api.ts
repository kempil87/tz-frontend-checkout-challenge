import type { Payment, Sandbox, Scenario, Simulation } from '@checkout/contracts';

import { api, type ApiRequestConfig } from '@/shared/api';

export const paymentApi = {
  get: (paymentId: string, config?: ApiRequestConfig) =>
    api.get<Payment>(`/payments/${paymentId}`, config),

  getSandbox: () => api.get<Sandbox>('/sandbox'),

  simulate: (paymentId: string, scenario: Scenario) =>
    api.post<Simulation>(`/payments/${paymentId}/simulations`, { scenario }),

  getSimulation: (paymentId: string, simulationId: string) =>
    api.get<Simulation>(`/payments/${paymentId}/simulations/${simulationId}`),
};
