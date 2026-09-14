import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import { useCart, useCartQuantity } from '@/entities/cart';
import { ProductCardMini, useProducts } from '@/entities/product';
import { AppRoutes } from '@/shared/config';
import { amountFormat, pluralize } from '@/shared/lib';
import {
  AppLoader,
  BusyCard,
  Button,
  Card,
  Checkbox,
  Icon,
  SummaryRow,
  Typography,
} from '@/shared/ui';

const FALLBACK_STOCK = 99;

export const CartPage = () => {
  const { data: cart, isPending, isFetching } = useCart();
  const { data: products = [] } = useProducts();
  const { addQuantity, isUpdating, removeItems, removeQuantity } = useCartQuantity();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const initialSelectRef = useRef(false);

  const stockByProductId = useMemo(() => {
    return products.reduce((acc, product) => {
      acc.set(product.id, product.stock);

      return acc;
    }, new Map<string, number>());
  }, [products]);

  const itemIds = useMemo(() => {
    return cart?.items.map((item) => item.productId) ?? [];
  }, [cart?.items]);

  const isAllSelected = selectedIds.length === cart?.items.length;

  const selectedIdsSet = new Set(selectedIds);

  const handleToggleAll = (checked: boolean) => {
    setSelectedIds(checked ? itemIds : []);
  };

  const handleItemSelectedChange = (productId: string, selected: boolean) => {
    setSelectedIds((current) => {
      const base = new Set(current);

      if (selected) {
        base.add(productId);
      } else {
        base.delete(productId);
      }

      return Array.from(base);
    });
  };

  const handleRemoveSelected = () => {
    removeItems(selectedIds);
  };

  useEffect(() => {
    if (itemIds && !initialSelectRef.current) {
      setSelectedIds(itemIds);

      initialSelectRef.current = true;
    }
  }, [itemIds]);

  if (isPending) {
    return <AppLoader isStetched />;
  }

  if (!cart?.items.length) {
    return (
      <Card>
        <Card.Body className="flex items-center justify-center gap-4 py-8 text-center lg:py-14">
          <Typography variant="h2">Корзина пуста</Typography>

          <Typography variant="caption" tone="muted">
            Похоже, что вы еще не добавили товары в корзину.
          </Typography>

          <Button asChild size="lg">
            <Link to={AppRoutes.main}>Перейти к покупкам</Link>
          </Button>
        </Card.Body>
      </Card>
    );
  }

  return (
    <section aria-labelledby="cart-heading" className="flex flex-col gap-6">
      <Typography id="cart-heading" variant="h1" className="flex items-start">
        Корзина{' '}
        {cart?.items.length !== 0 && (
          <Typography as="span" variant="caption" tone="muted" className="block">
            {cart.items.length}
          </Typography>
        )}
      </Typography>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_24rem]">
        <div className="flex min-w-0 flex-col gap-4">
          <Card>
            <Card.Body className="flex-row items-center justify-between">
              <label
                className="inline-flex cursor-pointer items-center gap-2"
                htmlFor="cart-select-all"
              >
                <Checkbox
                  checked={isAllSelected ? true : selectedIds.length > 0 ? 'indeterminate' : false}
                  id="cart-select-all"
                  onCheckedChange={handleToggleAll}
                />

                <Typography as="span">Выбрать все</Typography>
              </label>

              <Button
                aria-label="Удалить выбранные товары"
                disabled={selectedIds.length === 0 || selectedIds.some(isUpdating)}
                isIconOnly
                onClick={handleRemoveSelected}
                variant="secondary"
                size="sm"
              >
                <Icon name="common:trash" />
              </Button>
            </Card.Body>
          </Card>

          <Card>
            <Card.Header>
              <Card.Title>Доступны для заказа</Card.Title>
            </Card.Header>

            <Card.Body>
              <ul className="flex flex-col gap-6">
                {cart.items.map((item) => (
                  <li key={item.productId}>
                    <ProductCardMini
                      isLoading={isUpdating(item.productId)}
                      isSelected={selectedIdsSet.has(item.productId)}
                      onAddQuantity={addQuantity}
                      onRemoveQuantity={removeQuantity}
                      onSelectedChange={handleItemSelectedChange}
                      stock={stockByProductId.get(item.productId) ?? FALLBACK_STOCK}
                      {...item}
                    />
                  </li>
                ))}
              </ul>
            </Card.Body>
          </Card>
        </div>

        <BusyCard as="aside" isBusy={isFetching} sticky>
          <Card.Header className="gap-4.5">
            <Button asChild className="w-full" disabled={selectedIds.length === 0} size="lg">
              <Link to={AppRoutes.checkout}>Перейти к оформлению</Link>
            </Button>

            <Typography tone="muted" variant="small">
              Доступные способы доставки можно выбрать при оформлении заказа
            </Typography>
          </Card.Header>

          <Card.Body>
            <SummaryRow
              className="border-b border-border pb-4"
              label="Ваша корзина"
              labelTone="muted"
              value={`${cart.quantity} ${pluralize(cart.quantity, ['товар', 'товара', 'товаров'])}`}
            />
          </Card.Body>

          <Card.Total tone="success" value={amountFormat(cart.subtotal)} />
        </BusyCard>
      </div>
    </section>
  );
};
