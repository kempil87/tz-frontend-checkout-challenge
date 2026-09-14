import type { Session } from '@checkout/contracts';

import { instance } from '@/shared/api';

export const sessionApi = {
  create: () => instance.post<Session>('/sessions', {}),
};
