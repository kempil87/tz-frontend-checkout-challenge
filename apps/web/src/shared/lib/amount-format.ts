export const amountFormat = (value: number) =>
  new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  }).format(value / 100);

export const amountOrFree = (value: number) => {
  if (value === 0) {
    return 'Бесплатно';
  }

  return amountFormat(value);
};
