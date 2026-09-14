import type { Quote } from '@checkout/contracts';

import { amountFormat, amountOrFree, pluralize } from '@/shared/lib';
import { BusyCard, Button, Card, SummaryRow, Typography } from '@/shared/ui';

type CheckoutAsideProps = {
  cartQuantity: number;
  cartSubtotal: number;
  isOrderPending: boolean;
  isQuotePending: boolean;
  quote?: Quote;
  quoteErrorMessage?: string;
};

export const CheckoutAside = ({
  cartQuantity,
  cartSubtotal,
  isOrderPending,
  isQuotePending,
  quote,
  quoteErrorMessage,
}: CheckoutAsideProps) => {
  const total = quote?.total ?? cartSubtotal;
  const isBusy = isQuotePending || isOrderPending;

  return (
    <BusyCard as="aside" isBusy={isBusy} sticky>
      <Card.Header className="gap-4.5">
        <Button
          className="w-full"
          disabled={!quote || isBusy}
          isLoading={isOrderPending}
          size="lg"
          type="submit"
        >
          Оформить заказ
        </Button>

        <Typography tone="muted" variant="small">
          Нажимая на кнопку, вы соглашаетесь с Условиями обработки персональных данных, а также с
          Условиями продажи
        </Typography>
      </Card.Header>

      <Card.Body className="gap-3">
        <SummaryRow
          label={`${cartQuantity} ${pluralize(cartQuantity, ['товар', 'товара', 'товаров'])}`}
          labelTone="muted"
          value={amountFormat(quote?.subtotal ?? cartSubtotal)}
        />

        <SummaryRow
          className="border-b border-border pb-4"
          label="Доставка"
          labelTone="muted"
          value={quote ? amountOrFree(quote.shipping) : '—'}
        />

        {quoteErrorMessage && (
          <Typography tone="danger" variant="caption">
            {quoteErrorMessage}
          </Typography>
        )}
      </Card.Body>

      <Card.Total value={amountFormat(total)} />
    </BusyCard>
  );
};
