import { OptionRow, RadioField } from '@/shared/ui';

type CheckoutMethodOptionProps = {
  description?: string;
  id: string;
  name: string;
  priceLabel?: string;
  title: string;
  value: string;
};

export const CheckoutMethodOption = ({
  description,
  id,
  name,
  priceLabel,
  title,
  value,
}: CheckoutMethodOptionProps) => {
  return (
    <OptionRow
      control={<RadioField id={id} name={name} value={value} />}
      description={description}
      id={id}
      priceLabel={priceLabel}
      title={title}
    />
  );
};
