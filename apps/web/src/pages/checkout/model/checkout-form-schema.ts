import { z } from 'zod';

export const checkoutFormSchema = z
  .object({
    address: z.object({
      apartment: z.string().optional(),
      city: z.string(),
      house: z.string(),
      street: z.string(),
    }),
    customer: z.object({
      email: z
        .string()
        .email({ message: 'Укажите корректный email' })
        .max(150, { message: 'Email слишком длинный' }),
      name: z
        .string()
        .min(2, { message: 'Укажите имя' })
        .max(100, { message: 'Имя слишком длинное' })
        .regex(/\S/, { message: 'Укажите имя' }),
      phone: z.string().regex(/^\+[1-9]\d{9,14}$/, {
        message: 'Укажите телефон в формате +79990000000',
      }),
    }),
    deliveryMethod: z.enum(['pickup', 'courier'], {
      message: 'Выберите способ доставки',
    }),
    paymentMethod: z.enum(['card', 'cash_on_delivery'], {
      message: 'Выберите способ оплаты',
    }),
    pickupPointId: z.string().optional(),
  })
  .superRefine((value, ctx) => {
    if (value.deliveryMethod === 'pickup' && !value.pickupPointId) {
      ctx.addIssue({
        code: 'custom',
        message: 'Выберите пункт выдачи',
        path: ['pickupPointId'],
      });
    }

    if (value.deliveryMethod !== 'courier') {
      return;
    }

    if (value.address.city.trim().length < 2) {
      ctx.addIssue({
        code: 'custom',
        message: 'Укажите город',
        path: ['address', 'city'],
      });
    }

    if (value.address.street.trim().length < 2) {
      ctx.addIssue({
        code: 'custom',
        message: 'Укажите улицу',
        path: ['address', 'street'],
      });
    }

    if (value.address.house.trim().length < 1) {
      ctx.addIssue({
        code: 'custom',
        message: 'Укажите дом',
        path: ['address', 'house'],
      });
    }
  });

export type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;
