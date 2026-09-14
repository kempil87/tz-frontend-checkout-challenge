import { isRouteErrorResponse, useRouteError } from 'react-router-dom';

import { ErrorFallback } from '@/shared/ui';

export const RouteErrorPage = () => {
  const error = useRouteError();

  const normalized =
    error instanceof Error
      ? error
      : isRouteErrorResponse(error)
        ? new Error(error.statusText || `Ошибка ${error.status}`)
        : new Error('Неизвестная ошибка маршрута');

  return (
    <ErrorFallback
      error={normalized}
      onReset={() => {
        window.location.assign('/');
      }}
    />
  );
};
