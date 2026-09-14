import type { Order } from '@checkout/contracts';

import { amountFormat } from '@/shared/lib';
import { SummaryRow } from '@/shared/ui';

type OrderItemRowProps = {
  item: Order['items'][number];
};

export const OrderItemRow = ({ item }: OrderItemRowProps) => {
  return (
    <SummaryRow
      as="li"
      label={`${item.title}, ${item.quantity} шт.`}
      value={amountFormat(item.lineTotal)}
    />
  );
};
