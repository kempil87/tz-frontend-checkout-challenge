import { useMemo } from 'react';
import type { Product } from '@checkout/contracts';

import { useCart } from './use-cart';
import { useRemoveCartItem } from './use-remove-cart-item';
import { useSetCartItem } from './use-set-cart-item';

type CartQuantityProduct = Pick<Product, 'id' | 'stock'>;

export const useCartQuantity = () => {
  const { mutate: setCartItem, isPending: isAdding, variables: setItemVars } = useSetCartItem();
  const { data: cart } = useCart();

  const {
    mutate: removeCartItem,
    isPending: isRemoving,
    variables: removeItemIds,
  } = useRemoveCartItem();

  const quantityByProductId = useMemo(() => {
    return (cart?.items ?? []).reduce((acc, item) => {
      acc.set(item.productId, item.quantity);

      return acc;
    }, new Map<string, number>());
  }, [cart]);

  const getQuantity = (productId: string) => {
    return quantityByProductId.get(productId) ?? 0;
  };

  const addQuantity = (product: CartQuantityProduct) => {
    const quantityInCart = getQuantity(product.id);

    if (quantityInCart >= product.stock) {
      return;
    }

    setCartItem({ productId: product.id, quantity: quantityInCart + 1 });
  };

  const removeQuantity = (product: CartQuantityProduct) => {
    const quantityInCart = getQuantity(product.id);

    if (quantityInCart <= 0) {
      return;
    }

    if (quantityInCart === 1) {
      removeCartItem([product.id]);
      return;
    }

    setCartItem({ productId: product.id, quantity: quantityInCart - 1 });
  };

  const isUpdating = (productId: string) => {
    return (
      (isAdding && setItemVars?.productId === productId) ||
      (isRemoving && new Set(removeItemIds)?.has(productId))
    );
  };

  const removeItems = (productIds: string[]) => {
    if (productIds.length === 0) {
      return;
    }

    removeCartItem(productIds);
  };

  return {
    addQuantity,
    getQuantity,
    isUpdating,
    removeItems,
    removeQuantity,
  };
};
