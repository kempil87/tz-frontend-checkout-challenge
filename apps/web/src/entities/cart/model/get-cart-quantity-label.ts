import { pluralize } from '@/shared/lib';

export const getCartQuantityLabel = (
  quantity: number,
  forms: [one: string, few: string, many: string] = ['товар', 'товара', 'товаров'],
) => {
  return `${quantity} ${pluralize(quantity, forms)}`;
};
