import { TextField } from '@/shared/ui';

export const CheckoutAddressFields = () => {
  return (
    <div className="flex min-w-0 flex-col gap-3 pl-4 sm:pl-8">
      <TextField
        placeholder="Город"
        autoComplete="address-level2"
        label="Город"
        name="address.city"
      />

      <TextField
        placeholder="Улица"
        autoComplete="address-line1"
        label="Улица"
        name="address.street"
      />

      <div className="grid grid-cols-2 gap-3">
        <TextField placeholder="Дом" autoComplete="off" label="Дом" name="address.house" />

        <TextField
          placeholder="Квартира"
          autoComplete="off"
          label="Квартира"
          name="address.apartment"
        />
      </div>
    </div>
  );
};
