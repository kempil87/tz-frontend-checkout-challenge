import type { Product } from '@checkout/contracts';

import { amountFormat } from '@/shared/lib';
import { Button, Icon, QuantityStepper, Typography } from '@/shared/ui';

type ProductCardProps = {
  product: Product;
  isLoading?: boolean;
  quantityInCart?: number;
  onAddQuantity: (product: Product) => void;
  onRemoveQuantity: (product: Product) => void;
};

export const ProductCard = ({
  product,
  isLoading = false,
  quantityInCart = 0,
  onAddQuantity,
  onRemoveQuantity,
}: ProductCardProps) => {
  const handleAddInCart = () => {
    if (quantityInCart) {
      return;
    }

    onAddQuantity(product);
  };

  const handleAddQuantity = () => {
    onAddQuantity(product);
  };

  const handleRemoveQuantity = () => {
    onRemoveQuantity(product);
  };

  const getMainButtonText = () => {
    if (!product.stock) {
      return 'Нет в наличии';
    }

    if (quantityInCart) {
      return 'В корзине';
    }

    return 'В корзину';
  };

  return (
    <article className="flex h-full flex-col gap-4 rounded-3xl bg-layout p-4">
      <div className="flex h-40 items-center justify-center rounded-2xl bg-secondary" aria-hidden>
        <Icon className="text-muted" name="common:circle-squares" size={32} />
      </div>

      <div className="flex flex-1 flex-col gap-2">
        <Typography variant="h3" className="break-words">
          {product.title}
        </Typography>

        <Typography variant="caption" tone="muted">
          {product.description}
        </Typography>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex min-w-0 flex-wrap items-center justify-between gap-2">
          <Typography variant="price">{amountFormat(product.price)}</Typography>

          {!!product.stock && (
            <Typography variant="caption" tone="muted">
              {`В наличии: ${product.stock}`}
            </Typography>
          )}
        </div>

        <div className="flex flex-row items-center gap-2">
          <Button
            size="lg"
            className="grow"
            isLoading={isLoading}
            onClick={handleAddInCart}
            disabled={!product.stock}
            variant={quantityInCart ? 'success' : 'primary'}
          >
            {getMainButtonText()}
          </Button>

          {quantityInCart > 0 && (
            <QuantityStepper
              disabled={isLoading}
              increaseDisabled={quantityInCart >= product.stock}
              onDecrease={handleRemoveQuantity}
              onIncrease={handleAddQuantity}
              size="lg"
              value={quantityInCart}
            />
          )}
        </div>
      </div>
    </article>
  );
};
