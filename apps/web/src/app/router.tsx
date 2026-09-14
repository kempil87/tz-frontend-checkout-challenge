import { type ComponentType, lazy, type LazyExoticComponent, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';

import { sessionLoader } from '@/features/session';
import { RouteErrorPage } from '@/pages/error';
import { AppRoutes } from '@/shared/config';
import { AppLoader } from '@/shared/ui';
import { MainLayout } from '@/widgets/main-layout/ui/main-layout';

import { RootLayout } from './root-layout';

const withSuspense = (Component: LazyExoticComponent<ComponentType>) => (
  <Suspense fallback={<AppLoader />}>
    <Component />
  </Suspense>
);

export const router = createBrowserRouter([
  {
    id: 'root',
    shouldRevalidate: () => false,
    loader: sessionLoader,
    element: <RootLayout />,
    errorElement: <RouteErrorPage />,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            index: true,
            path: AppRoutes.main,
            element: withSuspense(
              lazy(() =>
                import('@/pages/main/ui/main-page').then((m) => ({
                  default: m.MainPage,
                })),
              ),
            ),
          },
          {
            path: AppRoutes.cart,
            element: withSuspense(
              lazy(() =>
                import('@/pages/cart').then((m) => ({
                  default: m.CartPage,
                })),
              ),
            ),
          },
          {
            path: AppRoutes.checkout,
            element: withSuspense(
              lazy(() =>
                import('@/pages/checkout').then((m) => ({
                  default: m.CheckoutPage,
                })),
              ),
            ),
          },
          {
            path: AppRoutes.orderPayment,
            element: withSuspense(
              lazy(() =>
                import('@/pages/order-payment').then((m) => ({
                  default: m.OrderPaymentPage,
                })),
              ),
            ),
          },
          {
            path: AppRoutes.order,
            element: withSuspense(
              lazy(() =>
                import('@/pages/order-success').then((m) => ({
                  default: m.OrderSuccessPage,
                })),
              ),
            ),
          },
          {
            path: AppRoutes.notFound,
            element: withSuspense(
              lazy(() =>
                import('@/pages/not-found').then((m) => ({
                  default: m.NotFoundPage,
                })),
              ),
            ),
          },
        ],
      },
    ],
  },
]);
