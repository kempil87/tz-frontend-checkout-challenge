import { Link } from 'react-router-dom';

import { CartButton } from '@/entities/cart';
import { AppRoutes } from '@/shared/config';
import { Button, Icon, Typography } from '@/shared/ui';

export const AppHeader = () => {
  return (
    <header className="sticky top-0 z-10">
      <div className="mx-auto flex min-h-16.5 max-w-6xl items-center justify-between gap-2 rounded-b-3xl bg-layout px-4 py-2 sm:gap-4">
        <nav className="flex min-w-0 items-center gap-2 sm:gap-4 w-full">
          <Link className="shrink-0" to={AppRoutes.main}>
            <img
              alt="Logo"
              className="h-7 w-auto max-w-28 sm:h-8 sm:max-w-32"
              src="/images/logo.svg"
            />
          </Link>

          <Button
            asChild
            className="max-sm:aspect-square max-sm:px-0 max-lg:ml-auto"
            endContent={<Icon name="common:circle-squares" />}
            variant="primary"
          >
            <Link aria-label="Каталог" to={AppRoutes.main}>
              <Typography as="span" className="max-sm:sr-only text-current">
                Каталог
              </Typography>
            </Link>
          </Button>
        </nav>

        <CartButton />
      </div>
    </header>
  );
};
