import { StorageKeys } from '@/shared/config';

import { sessionApi } from '../api/session-api';

export const sessionLoader = async () => {
  const token = localStorage.getItem(StorageKeys.sessionToken);

  if (token) {
    return { token };
  }

  const session = await sessionApi.create();

  if (!session?.token) {
    return { token: null };
  }

  localStorage.setItem(StorageKeys.sessionToken, session.token);

  return { token: session.token };
};
