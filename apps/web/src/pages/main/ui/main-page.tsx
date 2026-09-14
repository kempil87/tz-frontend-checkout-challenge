import { useProducts } from '@/entities/product';
import { Typography } from '@/shared/ui';

import { ProductList } from './product-list';

export const MainPage = () => {
  const { data: products = [], isPending, isError, error, refetch: onRetry } = useProducts();

  return (
    <section
      aria-busy={isPending}
      aria-labelledby="catalog-heading"
      className="flex flex-col gap-6"
    >
      <Typography id="catalog-heading" variant="h1">
        Каталог
      </Typography>

      <ProductList {...{ products, isPending, isError, error, onRetry }} />
    </section>
  );
};
