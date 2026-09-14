import { Outlet } from 'react-router-dom';

import { AppHeader } from '@/widgets/app-header';

export const MainLayout = () => {
  return (
    <main className="flex h-full w-full flex-1 flex-col">
      <AppHeader />

      <div className="mx-auto w-full min-w-0 max-w-6xl flex-1 px-4 py-6">
        <Outlet />
      </div>
    </main>
  );
};
