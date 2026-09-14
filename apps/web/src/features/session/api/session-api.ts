import type { Session } from '@checkout/contracts';

import { api } from '@/shared/api';

export const sessionApi = {
  create: () => api.post<Session>('/sessions', {}),
};
