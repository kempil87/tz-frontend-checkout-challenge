import { RouterProvider } from 'react-router-dom';

import { ErrorBoundary } from '@/shared/ui';

import { QueryProvider } from './query-provider';
import { router } from './router';

export const App = () => {
  return (
    <ErrorBoundary>
      <QueryProvider>
        <RouterProvider router={router} />
      </QueryProvider>
    </ErrorBoundary>
  );
};
