import type { CheckoutOptions } from '@checkout/contracts';

import { amountFormat, amountOrFree } from '@/shared/lib';

import { CheckoutMethodOption } from './checkout-method-option';

type DeliveryMethod = CheckoutOptions['deliveryMethods'][number];

type DeliveryMethodItemProps = {
  method: DeliveryMethod;
};

export const DeliveryMethodItem = ({ method }: DeliveryMethodItemProps) => {
  return (
    <li>
      <CheckoutMethodOption
        description={method.freeFrom ? `Бесплатно от ${amountFormat(method.freeFrom)}` : undefined}
        id={`delivery-${method.id}`}
        name="deliveryMethod"
        priceLabel={amountOrFree(method.price)}
        title={method.title}
        value={method.id}
      />
    </li>
  );
};
