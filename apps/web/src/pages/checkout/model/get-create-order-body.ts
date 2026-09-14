import type { CreateOrder } from '@checkout/contracts';

import type { CheckoutFormValues } from './checkout-form-schema';

export const getCreateOrderBody = (values: CheckoutFormValues, quoteId: string): CreateOrder => {
  return {
    customer: {
      email: values.customer.email.trim(),
      name: values.customer.name.trim(),
      phone: values.customer.phone.trim(),
    },
    paymentMethod: values.paymentMethod,
    quoteId,
  };
};
