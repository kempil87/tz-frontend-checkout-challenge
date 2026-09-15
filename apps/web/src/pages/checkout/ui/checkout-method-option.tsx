import { type ComponentPropsWithoutRef } from 'react';

import { OptionRow, RadioField } from '@/shared/ui';

type CheckoutMethodOptionProps = Omit<ComponentPropsWithoutRef<typeof OptionRow>, 'control'> & {
  name: string;
  value: string;
};

export const CheckoutMethodOption = ({ id, name, value, ...props }: CheckoutMethodOptionProps) => {
  return (
    <OptionRow control={<RadioField id={id} name={name} value={value} />} id={id} {...props} />
  );
};
