import { type FormEvent, useEffect, useRef, useState } from 'react';
import type { Order, Scenario } from '@checkout/contracts';
import { useQueryClient } from '@tanstack/react-query';

import { useCreatePayment, useOrderPayments } from '@/entities/order';
import {
  getActivePayment,
  isPaymentFinished,
  isPaymentProcessing,
  usePayment,
  useSandbox,
  useSimulatePayment,
} from '@/entities/payment';
import { ApiClientError } from '@/shared/api';
import { QueryKeys, StorageKeys } from '@/shared/config';
import { amountFormat, cn } from '@/shared/lib';
import { AppLoader, Button, Card, Typography } from '@/shared/ui';

import { getPaymentStatusText, getPaymentStatusTone } from '../model/get-payment-status-text';
import { getSelectedSandboxCard } from '../model/get-selected-sandbox-card';
import { SandboxCardOption } from './sandbox-card-option';

type OrderPaymentFormProps = {
  order: Order;
};

export const OrderPaymentForm = ({ order }: OrderPaymentFormProps) => {
  const queryClient = useQueryClient();
  const idempotencyRef = useRef(crypto.randomUUID());
  const [selectedCardId, setSelectedCardId] = useState('');
  const [storedPaymentId, setStoredPaymentId] = useState(
    () => localStorage.getItem(StorageKeys.paymentId) ?? '',
  );
  const [actionError, setActionError] = useState<string>();

  const { data: sandbox, isPending: isSandboxPending } = useSandbox();
  const { data: payments } = useOrderPayments(order.id);
  const activePayment = getActivePayment(payments);
  const paymentId = storedPaymentId || activePayment?.id || '';
  const { data: payment } = usePayment(paymentId);
  const { isPending: isCreatePending, mutateAsync: createPayment } = useCreatePayment();
  const { isPending: isSimulatePending, mutateAsync: simulatePayment } = useSimulatePayment();

  const paymentForOrder = payment?.orderId === order.id ? payment : undefined;
  const isProcessing = isPaymentProcessing(paymentForOrder);
  const isFinished = isPaymentFinished(paymentForOrder);
  const isSucceeded = paymentForOrder?.status === 'succeeded';
  const canRetry = paymentForOrder?.status === 'failed' || paymentForOrder?.status === 'cancelled';
  const isWaiting = isProcessing || isSucceeded;
  const isBusy = isCreatePending || isSimulatePending || isWaiting;
  const cards = sandbox?.cards ?? [];
  const selectedCard = getSelectedSandboxCard(cards, selectedCardId);
  const statusText = getPaymentStatusText(paymentForOrder);
  const submitLabel = canRetry ? 'Повторить оплату' : 'Оплатить';

  const handleCardChange = (value: unknown) => {
    if (typeof value !== 'string') {
      return;
    }

    setSelectedCardId(value);
  };

  const runPayment = async (scenario: Scenario) => {
    if (isBusy) {
      return;
    }

    setActionError(undefined);

    try {
      let nextPaymentId = paymentForOrder?.id;

      if (!nextPaymentId || isFinished) {
        if (isFinished) {
          idempotencyRef.current = crypto.randomUUID();
        }

        const nextPayment = await createPayment({
          idempotencyKey: idempotencyRef.current,
          orderId: order.id,
        });

        nextPaymentId = nextPayment.id;
        setStoredPaymentId(nextPayment.id);
      }

      await simulatePayment({
        paymentId: nextPaymentId,
        scenario,
      });
    } catch (error) {
      if (error instanceof ApiClientError && error.code === 'ORDER_ALREADY_PAID') {
        queryClient.invalidateQueries({ queryKey: QueryKeys.order(order.id) });
        return;
      }

      if (error instanceof ApiClientError && error.code === 'PAYMENT_IN_PROGRESS') {
        queryClient.invalidateQueries({ queryKey: QueryKeys.orderPayments(order.id) });
        return;
      }

      if (error instanceof ApiClientError && error.code === 'PAYMENT_FINALIZED') {
        queryClient.invalidateQueries({ queryKey: QueryKeys.payment(paymentId) });
        return;
      }

      if (error instanceof ApiClientError) {
        setActionError(error.message);
        return;
      }

      setActionError('Не удалось выполнить оплату. Попробуйте ещё раз.');
    }
  };

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedCard) {
      return;
    }

    await runPayment(selectedCard.scenario);
  };

  const handleCancel = async () => {
    await runPayment('cancel');
  };

  useEffect(() => {
    if (paymentForOrder?.status !== 'succeeded') {
      return;
    }

    queryClient.invalidateQueries({ queryKey: QueryKeys.order(order.id) });
  }, [order.id, paymentForOrder?.status, queryClient]);

  if (isSandboxPending) {
    return <AppLoader isStetched />;
  }

  return (
    <form className="flex flex-col gap-6" noValidate onSubmit={handleFormSubmit}>
      <Card
        className={cn('relative transition-opacity duration-300 ease-in-out', {
          'opacity-50': isWaiting,
        })}
      >
        {isWaiting && <AppLoader className="absolute inset-0" isStetched />}

        <Card.Header>
          <Typography variant="h3">Тестовая карта</Typography>

          <Typography tone="muted" variant="small">
            К оплате {amountFormat(order.total)}
          </Typography>
        </Card.Header>

        <Card.Body>
          <ul aria-label="Тестовые карты" className="flex flex-col gap-1" role="radiogroup">
            {cards.map((card) => (
              <li key={card.id}>
                <SandboxCardOption
                  checked={selectedCard?.id ?? ''}
                  description={card.maskedNumber}
                  id={`sandbox-card-${card.id}`}
                  onCheckedChange={handleCardChange}
                  title={card.title}
                  value={card.id}
                />
              </li>
            ))}
          </ul>

          {statusText && (
            <Typography tone={getPaymentStatusTone(paymentForOrder?.status)}>
              {statusText}
            </Typography>
          )}

          {actionError && (
            <Typography tone="danger" variant="caption">
              {actionError}
            </Typography>
          )}
        </Card.Body>

        <Card.Footer className="flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Button
            className="w-full sm:w-auto"
            disabled={isBusy || !selectedCard}
            isLoading={isBusy}
            size="lg"
            type="submit"
          >
            {submitLabel}
          </Button>

          <Button
            className="w-full sm:w-auto"
            disabled={isBusy}
            onClick={handleCancel}
            size="lg"
            type="button"
            variant="secondary"
          >
            Отменить
          </Button>
        </Card.Footer>
      </Card>
    </form>
  );
};
