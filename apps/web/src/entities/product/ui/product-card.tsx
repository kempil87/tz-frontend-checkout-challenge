import type { Product } from '@checkout/contracts';

import { amountFormat } from '@/shared/lib';
import { Button, Icon, Typography } from '@/shared/ui';

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
  const onAddInCart = () => !quantityInCart && onAddQuantity(product);

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

        <div className="flex flex-col gap-2 flex-row items-center">
          <Button
            size="lg"
            className="grow"
            isLoading={isLoading}
            onClick={onAddInCart}
            disabled={!product.stock}
            variant={quantityInCart ? 'success' : 'primary'}
          >
            {getMainButtonText()}
          </Button>

          {quantityInCart > 0 && (
            <div className="flex items-center justify-center gap-2 sm:justify-start">
              <Button
                aria-label="Уменьшить количество"
                isIconOnly
                disabled={isLoading}
                onClick={() => onRemoveQuantity(product)}
                size="lg"
                variant="secondary"
              >
                <Icon name="common:minus" />
              </Button>

              <Typography className="max-w-[2ch] min-w-[2ch] text-center">
                {quantityInCart}
              </Typography>

              <Button
                aria-label="Увеличить количество"
                isIconOnly
                disabled={isLoading}
                onClick={() => onAddQuantity(product)}
                size="lg"
                variant="secondary"
              >
                <Icon name="common:plus" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
};
