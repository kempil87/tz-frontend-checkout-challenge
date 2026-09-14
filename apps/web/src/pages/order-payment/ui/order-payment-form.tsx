import type { Order } from '@checkout/contracts';

import { amountFormat } from '@/shared/lib';
import { AppLoader, BusyCard, Button, Card, Typography } from '@/shared/ui';

import { useOrderPaymentForm } from '../model/use-order-payment-form';
import { SandboxCardOption } from './sandbox-card-option';

type OrderPaymentFormProps = {
  order: Order;
};

export const OrderPaymentForm = ({ order }: OrderPaymentFormProps) => {
  const {
    actionError,
    cards,
    handleCancel,
    handleCardChange,
    handleFormSubmit,
    isBusy,
    isSandboxPending,
    isWaiting,
    selectedCard,
    statusText,
    statusTone,
    submitLabel,
  } = useOrderPaymentForm(order);

  if (isSandboxPending) {
    return <AppLoader isStetched />;
  }

  return (
    <form className="flex flex-col gap-6" noValidate onSubmit={handleFormSubmit}>
      <BusyCard isBusy={isWaiting}>
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

          {statusText && <Typography tone={statusTone}>{statusText}</Typography>}

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
      </BusyCard>
    </form>
  );
};
