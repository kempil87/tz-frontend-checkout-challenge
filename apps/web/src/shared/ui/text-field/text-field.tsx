import { type ChangeEvent, type InputHTMLAttributes, useId } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { cn } from '@/shared/lib';

import { Typography } from '../typography';

type TextFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'name' | 'value' | 'onChange'> & {
  name: string;
  label: string;
  onChange?: (value: string) => void;
};

export const TextField = ({ name, label, className, id, onChange, ...props }: TextFieldProps) => {
  const { control } = useFormContext();
  const uniqueId = useId();
  const inputId = id ?? uniqueId;

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value = '', onChange: onFieldChange, ...field }, fieldState }) => {
        const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
          onFieldChange(event.target.value);
          onChange?.(event.target.value);
        };

        return (
          <div className="flex flex-col gap-1.5">
            <Typography as="label" variant="small" htmlFor={inputId}>
              {label}
            </Typography>

            <input
              className={cn(
                'h-11 rounded-xl border border-border/50 text-sm bg-white px-3 text-neutral-900 transition-colors duration-300 ease-in-out hover:bg-card-foreground',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-1',
                fieldState.error && 'border-red-700',
                className,
              )}
              id={inputId}
              {...props}
              {...field}
              onChange={handleChange}
              value={value}
            />

            {fieldState.error?.message && (
              <Typography tone="danger" variant="small">
                {fieldState.error.message}
              </Typography>
            )}
          </div>
        );
      }}
    />
  );
};
