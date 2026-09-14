import { Outlet, useNavigation } from 'react-router-dom';

import { AppLoader } from '@/shared/ui';

enum NavigationState {
  IDLE = 'idle',
  LOADING = 'loading',
  SUBMITTING = 'submitting',
}

export const RootLayout = () => {
  const navigation = useNavigation();

  if (navigation.state === NavigationState.LOADING) {
    return <AppLoader />;
  }

  return <Outlet />;
};
