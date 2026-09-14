import type { Delivery } from '@checkout/contracts';

export const getOrderDeliveryText = (delivery: Delivery) => {
  if (delivery.method === 'pickup') {
    return 'Самовывоз';
  }

  const { city, street, house, apartment } = delivery.address;

  if (!apartment) {
    return `${city}, ${street}, ${house}`;
  }

  return `${city}, ${street}, ${house}, кв. ${apartment}`;
};
