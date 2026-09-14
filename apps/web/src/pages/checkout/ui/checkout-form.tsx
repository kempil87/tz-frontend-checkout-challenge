import { type FormEvent, useCallback, useEffect, useMemo, useRef } from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import type { CheckoutOptions, Order } from '@checkout/contracts';
import { zodResolver } from '@hookform/resolvers/zod';

import { useCreateQuote } from '@/entities/checkout';
import { shouldOpenPayment, useCreateOrder } from '@/entities/order';
import { ApiClientError } from '@/shared/api';
import { AppRoutes, buildOrderPath, buildOrderPaymentPath } from '@/shared/config';
import { applyApiFormErrors } from '@/shared/lib';
import { Card } from '@/shared/ui';

import { checkoutFormSchema, type CheckoutFormValues } from '../model/checkout-form-schema';
import { getCheckoutDelivery } from '../model/get-checkout-delivery';
import { getCreateOrderBody } from '../model/get-create-order-body';
import { getOrderIdempotencyState } from '../model/get-order-idempotency-state';
import { getQuoteErrorMessage, getVisibleQuote } from '../model/get-visible-quote';
import { shouldRefreshQuote } from '../model/should-refresh-quote';
import { CheckoutAddressFields } from './checkout-address-fields';
import { CheckoutAside } from './checkout-aside';
import { CheckoutCustomerFields } from './checkout-customer-fields';
import { CheckoutMethodOption } from './checkout-method-option';
import { DeliveryMethodItem } from './delivery-method-item';

const QUOTE_DEBOUNCE_MS = 400;

type CheckoutFormProps = {
  options: CheckoutOptions;
};

const getDefaultValues = (options: CheckoutOptions): CheckoutFormValues => {
  const pickupMethod = options.deliveryMethods.find((method) => method.id === 'pickup');

  return {
    address: {
      apartment: '',
      city: '',
      house: '',
      street: '',
    },
    customer: {
      email: '',
      name: '',
      phone: '',
    },
    deliveryMethod: options.deliveryMethods[0]?.id ?? 'pickup',
    paymentMethod: options.paymentMethods[0]?.id ?? 'card',
    pickupPointId: pickupMethod?.pickupPoints[0]?.id ?? '',
  };
};

export const CheckoutForm = ({ options }: CheckoutFormProps) => {
  const { cart, deliveryMethods, paymentMethods } = options;
  const navigate = useNavigate();
  const idempotencyRef = useRef<ReturnType<typeof getOrderIdempotencyState> | null>(null);

  const form = useForm<CheckoutFormValues>({
    defaultValues: getDefaultValues(options),
    resolver: zodResolver(checkoutFormSchema),
  });

  const {
    error: quoteError,
    isPending: isQuotePending,
    mutate: createQuote,
    reset: resetQuote,
    data: quote,
  } = useCreateQuote();

  const {
    error: orderError,
    isPending: isOrderPending,
    mutateAsync: createOrder,
  } = useCreateOrder();

  const [deliveryMethodId, pickupPointId, address] = useWatch({
    control: form.control,
    name: ['deliveryMethod', 'pickupPointId', 'address'],
  });

  const selectedDeliveryMethod = deliveryMethods.find((method) => method.id === deliveryMethodId);

  const delivery = useMemo(() => {
    if (!deliveryMethodId) {
      return null;
    }

    return getCheckoutDelivery({
      address,
      deliveryMethod: deliveryMethodId,
      pickupPointId,
    });
  }, [address, deliveryMethodId, pickupPointId]);

  const handleQuoteError = useCallback(
    (error: Error) => {
      if (error instanceof ApiClientError && error.code === 'CART_EMPTY') {
        navigate(AppRoutes.cart, { replace: true });
        return;
      }

      applyApiFormErrors(error, form.setError);
    },
    [form.setError, navigate],
  );

  const visibleQuote = getVisibleQuote(quote, delivery, cart.version);
  const quoteErrorMessage = getQuoteErrorMessage(quoteError) ?? getQuoteErrorMessage(orderError);

  const handleOrderError = (error: unknown) => {
    if (error instanceof ApiClientError && error.code === 'CART_EMPTY') {
      navigate(AppRoutes.cart, { replace: true });
      return;
    }

    if (shouldRefreshQuote(error)) {
      idempotencyRef.current = null;
      resetQuote();

      if (error instanceof ApiClientError && error.code === 'QUOTE_EXPIRED' && delivery) {
        createQuote({ cartVersion: cart.version, delivery }, { onError: handleQuoteError });
      }

      return;
    }

    applyApiFormErrors(error, form.setError);
  };

  const handleOrderSuccess = (order: Order) => {
    if (shouldOpenPayment(order)) {
      navigate(buildOrderPaymentPath(order.id), { replace: true });
      return;
    }

    navigate(buildOrderPath(order.id), { replace: true });
  };

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    const handleValidSubmit = async (values: CheckoutFormValues) => {
      if (isOrderPending) {
        return;
      }

      if (!visibleQuote) {
        return;
      }

      const body = getCreateOrderBody(values, visibleQuote.id);
      const idempotency = getOrderIdempotencyState(idempotencyRef.current, visibleQuote.id, body);
      idempotencyRef.current = idempotency;

      try {
        const order = await createOrder({
          body,
          idempotencyKey: idempotency.key,
        });

        handleOrderSuccess(order);
      } catch (error) {
        handleOrderError(error);
      }
    };

    await form.handleSubmit(handleValidSubmit)(event);
  };

  useEffect(() => {
    if (!delivery) {
      resetQuote();
      return;
    }

    const timeoutId = window.setTimeout(() => {
      createQuote({ cartVersion: cart.version, delivery }, { onError: handleQuoteError });
    }, QUOTE_DEBOUNCE_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [cart.version, createQuote, delivery, handleQuoteError, resetQuote]);

  return (
    <FormProvider {...form}>
      <form className="flex flex-col gap-6" noValidate onSubmit={handleFormSubmit}>
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_24rem]">
          <div className="flex min-w-0 flex-col gap-4">
            <Card>
              <Card.Header>
                <Card.Title id="delivery-heading">Доставка</Card.Title>
              </Card.Header>

              <Card.Body>
                <ul
                  aria-labelledby="delivery-heading"
                  className="flex flex-col gap-1"
                  role="radiogroup"
                >
                  {deliveryMethods.map((method) => (
                    <DeliveryMethodItem key={method.id} method={method} />
                  ))}
                </ul>

                {selectedDeliveryMethod && selectedDeliveryMethod.pickupPoints.length > 0 && (
                  <ul
                    aria-label="Пункт выдачи"
                    className="flex min-w-0 flex-col gap-1 pl-4 sm:pl-8"
                    role="radiogroup"
                  >
                    {selectedDeliveryMethod.pickupPoints.map((point) => (
                      <li key={point.id}>
                        <CheckoutMethodOption
                          description={point.address}
                          id={`pickup-${point.id}`}
                          name="pickupPointId"
                          title={point.title}
                          value={point.id}
                        />
                      </li>
                    ))}
                  </ul>
                )}

                {deliveryMethodId === 'courier' && <CheckoutAddressFields />}
              </Card.Body>
            </Card>

            <Card>
              <Card.Header>
                <Card.Title id="customer-heading">Контакты</Card.Title>
              </Card.Header>

              <Card.Body>
                <CheckoutCustomerFields />
              </Card.Body>
            </Card>

            <Card>
              <Card.Header>
                <Card.Title id="payment-heading">Оплата</Card.Title>
              </Card.Header>

              <Card.Body>
                <ul
                  aria-labelledby="payment-heading"
                  className="flex flex-col gap-1"
                  role="radiogroup"
                >
                  {paymentMethods.map((method) => (
                    <li key={method.id}>
                      <CheckoutMethodOption
                        id={`payment-${method.id}`}
                        name="paymentMethod"
                        title={method.title}
                        value={method.id}
                      />
                    </li>
                  ))}
                </ul>
              </Card.Body>
            </Card>
          </div>

          <CheckoutAside
            cartQuantity={cart.quantity}
            cartSubtotal={cart.subtotal}
            isOrderPending={isOrderPending}
            isQuotePending={isQuotePending}
            quote={visibleQuote}
            quoteErrorMessage={quoteErrorMessage}
          />
        </div>
      </form>
    </FormProvider>
  );
};
