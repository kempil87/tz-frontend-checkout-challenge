import { amountFormat } from '@/shared/lib';
import { Button, Checkbox, Icon, Typography } from '@/shared/ui';

type CartQuantityProduct = {
  id: string;
  stock: number;
};

type ProductCardMiniProps = {
  productId: string;
  title: string;
  unitPrice: number;
  quantity: number;
  stock: number;
  isLoading?: boolean;
  isSelected?: boolean;
  onSelectedChange: (productId: string, selected: boolean) => void;
  onAddQuantity: (product: CartQuantityProduct) => void;
  onRemoveQuantity: (product: CartQuantityProduct) => void;
};

export const ProductCardMini = ({
  productId,
  title,
  unitPrice,
  quantity,
  stock,
  isLoading = false,
  isSelected = false,
  onSelectedChange,
  onAddQuantity,
  onRemoveQuantity,
}: ProductCardMiniProps) => {
  const product = { id: productId, stock };

  const handleSelectedChange = (checked: boolean) => {
    onSelectedChange(productId, checked);
  };

  const handleAddQuantity = () => {
    onAddQuantity(product);
  };

  const handleRemoveQuantity = () => {
    onRemoveQuantity(product);
  };

  return (
    <article className="flex flex-col gap-3 sm:flex-row sm:gap-4">
      <div className="flex items-center gap-2 items-start lg:grow">
        <div
          className="relative flex size-20 shrink-0 items-center justify-center rounded-2xl bg-secondary before:absolute before:left-0 before:top-0 before:size-6 before:rounded-br-lg before:bg-card"
          aria-hidden
        >
          <Checkbox
            className="absolute top-0.5 left-0.5 cursor-pointer"
            aria-label={`Выбрать ${title}`}
            checked={isSelected}
            onCheckedChange={handleSelectedChange}
          />

          <Icon className="text-muted" name="common:circle-squares" size={28} />
        </div>

        <Typography className="min-w-0 flex-1 break-words font-medium" variant="body">
          {title}
        </Typography>

        <Typography
          as="span"
          className="shrink-0 sm:min-w-24 sm:text-right"
          tone="muted"
          variant="price"
        >
          {amountFormat(unitPrice * quantity)}
        </Typography>
      </div>

      <div className="flex flex-col gap-1.5 max-lg:items-end">
        <div className="flex items-center gap-2 sm:ml-auto">
          <Button
            aria-label="Уменьшить количество"
            disabled={isLoading}
            isIconOnly
            onClick={handleRemoveQuantity}
            size="md"
            variant="secondary"
          >
            <Icon name="common:minus" />
          </Button>

          <Typography className="min-w-[2ch] max-w-[2ch] text-center">{quantity}</Typography>

          <Button
            aria-label="Увеличить количество"
            disabled={isLoading || quantity >= stock}
            isIconOnly
            onClick={handleAddQuantity}
            size="md"
            variant="secondary"
          >
            <Icon name="common:plus" />
          </Button>
        </div>

        <Typography variant="small" className="lg:text-center">
          {amountFormat(unitPrice)}/ед
        </Typography>
      </div>
    </article>
  );
};
