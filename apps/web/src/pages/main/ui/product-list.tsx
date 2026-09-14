import { PropsWithChildren } from 'react';

import { useCartQuantity } from '@/entities/cart';
import { Product, ProductCard, ProductCardSkeleton } from '@/entities/product';
import { Button, Typography } from '@/shared/ui';

interface ProductListProps {
  isPending: boolean;
  isError: boolean;
  error: Error | null;
  products: Product[];
  onRetry: () => void;
}

const SKELETON_PLACEHOLDERS = Array.from({ length: 3 }, (_, index) => index);

export const ProductList = ({ isPending, isError, error, products, onRetry }: ProductListProps) => {
  const { addQuantity, getQuantity, isUpdating, removeQuantity } = useCartQuantity();

  if (isPending) {
    return (
      <ProductGrid>
        {SKELETON_PLACEHOLDERS.map((placeholder) => (
          <li key={placeholder}>
            <ProductCardSkeleton />
          </li>
        ))}
      </ProductGrid>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-start gap-4">
        <Typography tone="muted">
          {error instanceof Error ? error.message : 'Не удалось загрузить каталог.'}
        </Typography>

        <Button onClick={onRetry} type="button">
          Повторить
        </Button>
      </div>
    );
  }

  if (!products?.length) {
    return <Typography tone="muted">Товаров пока нет.</Typography>;
  }

  return (
    <ProductGrid>
      {products.map((product) => (
        <li className="min-w-0" key={product.id}>
          <ProductCard
            isLoading={isUpdating(product.id)}
            onAddQuantity={addQuantity}
            onRemoveQuantity={removeQuantity}
            product={product}
            quantityInCart={getQuantity(product.id)}
          />
        </li>
      ))}
    </ProductGrid>
  );
};

const ProductGrid = ({ children }: PropsWithChildren) => (
  <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">{children}</ul>
);
