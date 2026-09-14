import type { FieldValues, Path, UseFormSetError } from 'react-hook-form';

import { ApiClientError } from '@/shared/api';

const toFieldName = (path: string) => {
  return path.replace(/^body\/?/, '').replaceAll('/', '.');
};

export const applyApiFormErrors = <T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>,
) => {
  if (!(error instanceof ApiClientError) || !error.fields?.length) {
    return false;
  }

  for (const field of error.fields) {
    setError(toFieldName(field.path) as Path<T>, {
      message: field.message,
      type: 'server',
    });
  }

  return true;
};
