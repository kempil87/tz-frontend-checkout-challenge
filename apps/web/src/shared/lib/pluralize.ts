const pluralRules = new Intl.PluralRules('ru-RU');

export const pluralize = (count: number, forms: [one: string, few: string, many: string]) => {
  const category = pluralRules.select(count);

  if (category === 'one') {
    return forms[0];
  }

  if (category === 'few') {
    return forms[1];
  }

  return forms[2];
};
