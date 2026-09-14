import { Button } from '../button';
import { Typography } from '../typography';

type ErrorFallbackProps = {
  error: Error;
  onReset: () => void;
};

export const ErrorFallback = ({ error, onReset }: ErrorFallbackProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 px-4 text-center" role="alert">
      <Typography variant="h1">Что-то пошло не так</Typography>

      <Typography variant="body" tone="muted">
        {error.message || 'Неизвестная ошибка'}
      </Typography>

      <Button type="button" onClick={onReset}>
        Попробовать снова
      </Button>
    </div>
  );
};
