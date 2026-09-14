import type { Delivery } from '@checkout/contracts';

import type { CheckoutFormValues } from './checkout-form-schema';

type PickupDelivery = Extract<Delivery, { method: 'pickup' }>;

type CheckoutDeliveryValues = Pick<CheckoutFormValues, 'deliveryMethod' | 'pickupPointId'> & {
  address?: CheckoutFormValues['address'];
};

export const getCheckoutDelivery = (values: CheckoutDeliveryValues): Delivery | null => {
  if (values.deliveryMethod === 'pickup') {
    if (!values.pickupPointId) {
      return null;
    }

    return {
      method: 'pickup',
      pickupPointId: values.pickupPointId as PickupDelivery['pickupPointId'],
    };
  }

  const city = values.address?.city?.trim() ?? '';
  const house = values.address?.house?.trim() ?? '';
  const street = values.address?.street?.trim() ?? '';
  const apartment = values.address?.apartment?.trim();

  if (city.length < 2 || house.length < 1 || street.length < 2) {
    return null;
  }

  return {
    address: {
      city,
      house,
      street,
      ...(apartment ? { apartment } : {}),
    },
    method: 'courier',
  };
};

export const isSameDelivery = (left: Delivery, right: Delivery) => {
  if (left.method !== right.method) {
    return false;
  }

  if (left.method === 'pickup' && right.method === 'pickup') {
    return left.pickupPointId === right.pickupPointId;
  }

  if (left.method === 'courier' && right.method === 'courier') {
    if (left.address.city !== right.address.city) {
      return false;
    }

    if (left.address.house !== right.address.house) {
      return false;
    }

    if (left.address.street !== right.address.street) {
      return false;
    }

    if ((left.address.apartment ?? '') !== (right.address.apartment ?? '')) {
      return false;
    }

    return true;
  }

  return false;
};
