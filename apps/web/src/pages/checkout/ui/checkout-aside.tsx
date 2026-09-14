import type { Quote } from '@checkout/contracts';

import { amountFormat, cn, pluralize } from '@/shared/lib';
import { AppLoader, Button, Card, Typography } from '@/shared/ui';

type CheckoutAsideProps = {
  cartQuantity: number;
  cartSubtotal: number;
  isOrderPending: boolean;
  isQuotePending: boolean;
  quote?: Quote;
  quoteErrorMessage?: string;
};

const getShippingLabel = (shipping: number) => {
  if (shipping === 0) {
    return 'Бесплатно';
  }

  return amountFormat(shipping);
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
    <Card
      as="aside"
      className={cn('relative lg:sticky lg:top-24 transition-opacity duration-300 ease-in-out', {
        'opacity-50': isBusy,
      })}
    >
      {isBusy && <AppLoader className="absolute inset-0" isStetched />}

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
        <div className="flex items-center justify-between gap-4">
          <Typography tone="muted">
            {cartQuantity} {pluralize(cartQuantity, ['товар', 'товара', 'товаров'])}
          </Typography>

          <Typography variant="small">{amountFormat(quote?.subtotal ?? cartSubtotal)}</Typography>
        </div>

        <div className="flex items-center justify-between gap-4 border-b border-border pb-4">
          <Typography tone="muted">Доставка</Typography>

          <Typography variant="small">{quote ? getShippingLabel(quote.shipping) : '—'}</Typography>
        </div>

        {quoteErrorMessage && (
          <Typography tone="danger" variant="caption">
            {quoteErrorMessage}
          </Typography>
        )}
      </Card.Body>

      <Card.Footer className="flex-row items-center justify-between gap-4">
        <Typography as="span" variant="h2">
          Итого
        </Typography>

        <Typography as="span" variant="price">
          {amountFormat(total)}
        </Typography>
      </Card.Footer>
    </Card>
  );
};
