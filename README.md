# Тестовое задание для фронтенд-разработчика

Нужно сделать интерфейс магазина: каталог, корзину, оформление заказа и оплату тестовой картой. Бэкенд готов, фронтенд добавьте в `apps/web`.

Для отбора нужно выполнить оба тестовых: [оформление заказа](https://github.com/instatdigital/frontend-checkout-challenge) и [канвас на React Flow](https://github.com/instatdigital/frontend-canvas-challenge). Пришлите ссылки на оба решения.

[Условия задания](docs/ASSIGNMENT.md) · [Работа с API](docs/INTEGRATION.md) · [Критерии оценки](docs/EVALUATION.md)

Главный критерий — обобщение кода и минимум повторяющихся операций. Одинаковые проверки HTTP-ответов и разбор ошибок в компонентах недопустимы. Отдельно оцениваем стоимость обработки данных: лишние проходы, копирования и повторные поиски снижают результат.

## Запуск

Потребуются Node.js 24.x и npm 11.x. Отдельная база данных и ключи внешних сервисов не нужны.

```sh
git clone https://github.com/instatdigital/frontend-checkout-challenge.git
cd frontend-checkout-challenge
npm ci
npm run dev
```

Фронтенд: [http://127.0.0.1:5173](http://127.0.0.1:5173). Запросы на `/api` проксируются на бэкенд. База клиента — `VITE_API_URL` в `apps/web/.env` (образец: `apps/web/.env.example`).

Swagger: [http://localhost:4000/docs/](http://localhost:4000/docs/). Спецификация: [http://localhost:4000/openapi.json](http://localhost:4000/openapi.json) или [файл в репозитории](docs/openapi.json).

В Swagger выполните `POST /api/sessions` с телом `{}`. Скопируйте `data.token` в **Authorize**, без слова `Bearer`.

Отдельно:

```sh
npm run dev:api    # только API
npm run dev:web    # только фронтенд, нужен запущенный API
npm run build:web  # сборка apps/web
```

## Структура

```text
apps/api/             бэкенд
apps/web/             ваш фронтенд
packages/contracts/   схемы API и типы TypeScript
docs/                 задание и документация
scripts/              проверки
```

Проект использует npm workspaces. Фронтенд — `@checkout/web` в `apps/web`. `npm run dev` поднимает API и Vite.

Устройство фронтенда, решения, сценарии и разбор обработки данных: [apps/web/README.md](apps/web/README.md).

## Проверки

```sh
npm run check       # форматирование, линт, сборка, тесты и OpenAPI
npm run build
npm start           # запуск собранного бэкенда
```

Перед коммитом husky гоняет lint-staged: Prettier по изменённым файлам и ESLint для `apps/web`.

При работающем API в другом терминале выполните `npm run smoke`. Эта команда проверяет покупку, отказ карты, отмену и повтор оплаты по HTTP.

## Настройки

Адрес по умолчанию — `127.0.0.1:4000`. Если порт занят, скопируйте `.env.example` в `.env` и измените `PORT`. Для проверки другого порта передайте `BASE_URL`, например `BASE_URL=http://localhost:4100 npm run smoke`.

Фронтенд может работать на любом HTTP-порту `localhost`, `127.0.0.1` или `[::1]`. Другие разрешённые адреса задаются в `CORS_ORIGINS`. Авторизация передаётся заголовком; cookies и `credentials: include` не нужны.

Данные сохраняются в `.data/store.json`. Запускайте один экземпляр API на один файл. Для сброса остановите сервер и выполните `npm run data:reset`; затем создайте новую сессию. Если меняли `DATA_FILE`, свой файл удалите вручную при остановленном сервере.

Товары и адреса вымышленные. Остаток ограничивает количество в одной корзине и не уменьшается у других покупателей. Для получателя используйте тестовые контакты, например `buyer@example.test`. Вместо ввода номера карты интерфейс должен предлагать тестовые карты из API.

`npm run build` собирает контракты, API и фронтенд. Тесты по-прежнему проверяют бэкенд. Схемы API в `packages/contracts` можно использовать напрямую или описать нужные типы у себя.
