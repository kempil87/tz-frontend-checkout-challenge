import { Controller, useFormContext } from 'react-hook-form';

import { Radio, type RadioProps } from './radio';

type RadioFieldProps = Omit<RadioProps, 'checked' | 'onCheckedChange'> & {
  name: string;
  onChange?: RadioProps['onCheckedChange'];
};

export const RadioField = ({ name, onChange, ...props }: RadioFieldProps) => {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value: checked = false, onChange: onFieldChange, ...field } }) => {
        const handleCheckedChange = (next: unknown) => {
          onFieldChange(next);
          onChange?.(next);
        };

        return (
          <Radio {...props} checked={checked} onCheckedChange={handleCheckedChange} {...field} />
        );
      }}
    />
  );
};
