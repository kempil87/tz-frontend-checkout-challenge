import { Link } from 'react-router-dom';

import { AppRoutes } from '@/shared/config';
import { Button, Typography } from '@/shared/ui';

export const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-6 px-4 text-center">
      <Typography variant="h1">Страница не найдена</Typography>

      <Typography className="max-w-lg text-balance" variant="caption" tone="muted">
        Такой страницы нет или&nbsp;её&nbsp;перенесли. Проверьте адрес или&nbsp;вернитесь
        на&nbsp;главную.
      </Typography>

      <Button asChild>
        <Link to={AppRoutes.main}>На главную</Link>
      </Button>
    </div>
  );
};
