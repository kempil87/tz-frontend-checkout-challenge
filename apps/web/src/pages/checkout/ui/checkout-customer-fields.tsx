import { TextField } from '@/shared/ui';

export const CheckoutCustomerFields = () => {
  return (
    <div className="flex flex-col gap-3">
      <TextField autoComplete="name" label="Имя" name="customer.name" placeholder="Иван Иванов" />

      <TextField
        autoComplete="email"
        inputMode="email"
        label="Email"
        name="customer.email"
        placeholder="buyer@example.test"
        type="email"
      />

      <TextField
        autoComplete="tel"
        inputMode="tel"
        label="Телефон"
        name="customer.phone"
        placeholder="+79990000000"
        type="tel"
      />
    </div>
  );
};
