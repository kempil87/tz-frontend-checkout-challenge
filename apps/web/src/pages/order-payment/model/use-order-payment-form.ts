import { type FormEvent, useEffect, useRef, useState } from 'react';
import type { Order, Scenario } from '@checkout/contracts';
import { useQueryClient } from '@tanstack/react-query';

import { useCreatePayment, useOrderPayments } from '@/entities/order';
import { getActivePayment, usePayment, useSandbox, useSimulatePayment } from '@/entities/payment';
import { QueryKeys, StorageKeys } from '@/shared/config';

import { getPaymentActionError } from './get-payment-action-error';
import {
  getPaymentFormState,
  getPaymentForOrder,
  getPaymentSubmitLabel,
} from './get-payment-form-state';
import { getPaymentStatusText, getPaymentStatusTone } from './get-payment-status-text';
import { getSelectedSandboxCard } from './get-selected-sandbox-card';

export const useOrderPaymentForm = (order: Order) => {
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

  const paymentForOrder = getPaymentForOrder(payment, order.id);
  const { canRetry, isFinished, isWaiting } = getPaymentFormState(paymentForOrder);
  const isBusy = isCreatePending || isSimulatePending || isWaiting;
  const cards = sandbox?.cards ?? [];
  const selectedCard = getSelectedSandboxCard(cards, selectedCardId);

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
      const action = getPaymentActionError(error, { orderId: order.id, paymentId });

      if (action.kind === 'invalidate') {
        queryClient.invalidateQueries({ queryKey: action.queryKey });
        return;
      }

      setActionError(action.message);
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

  return {
    actionError,
    cards,
    handleCancel,
    handleCardChange,
    handleFormSubmit,
    isBusy,
    isSandboxPending,
    isWaiting,
    selectedCard,
    statusText: getPaymentStatusText(paymentForOrder),
    statusTone: getPaymentStatusTone(paymentForOrder?.status),
    submitLabel: getPaymentSubmitLabel(canRetry),
  };
};
