# Идеи для развития продукта

Веб-приложение для голосования за идеи развития продукта с системой ограничений по IP-адресу.

## Описание проекта

Одностраничное веб-приложение с системой голосования без регистрации пользователей. Пользователи могут просматривать идеи и голосовать за них, с ограничением в 10 голосов на IP-адрес.

## Технологический стек

### Backend
- **Node.js** + **TypeScript**
- **Express.js** — веб-фреймворк
- **PostgreSQL** — база данных
- **pg** — драйвер PostgreSQL
- **CORS** — настройка CORS
- **Morgan** — логирование запросов
- **Helmet** — безопасность

### Frontend
- **React** + **TypeScript**
- **Bootstrap 5** — стилизация
- **Axios** — HTTP клиент

## Требования к системе

- **Node.js** 16+ (рекомендовано LTS)
- **PostgreSQL** 12+
- **npm** или **yarn**

## Структура проекта

```
product_development_ideas/
├── backend/                 # Backend приложение
│   ├── src/
│   │   ├── config/         # Конфигурация
│   │   ├── controllers/    # Контроллеры
│   │   ├── middleware/     # Middleware
│   │   ├── models/         # Модели данных
│   │   ├── repositories/   # Репозитории
│   │   ├── routes/         # Маршруты
│   │   ├── services/       # Бизнес-логика
│   │   └── utils/          # Утилиты
│   ├── migrations/         # SQL миграции
│   ├── scripts/            # Скрипты (migrate, seed)
│   └── package.json
├── frontend/               # Frontend приложение
│   ├── public/
│   └── src/
│       ├── components/     # React компоненты
│       ├── services/       # API сервисы
│       ├── types/          # TypeScript типы
│       └── utils/          # Утилиты
├── package.json            # Корневые скрипты
└── README.md
```
## Скриншот главной страницы

![Главная страница](frontend/screenshots/screenshot_main.png)


## Установка и настройка

### 1) Установка зависимостей

```bash
# из корня проекта
npm run install:all
```

### 2) Переменные окружения

- Backend (`backend/.env`):

```env
PORT=3000
DATABASE_URL=postgresql://username:password@localhost:5432/ideas_db
NODE_ENV=development
```

- Frontend (`frontend/.env.development` — опционально):

```env
# URL backend API
REACT_APP_API_URL=http://localhost:3000/api
```

Подсказка: в проекте есть примеры в `.env.example` (в корне) и `backend/.env.example`.

### 3) Подготовка базы данных

1. Создайте базу данных PostgreSQL:

```sql
CREATE DATABASE ideas_db;
```

2. Примените миграции и залейте тестовые данные:

```bash
# из корня проекта
npm run migrate
npm run seed
```

(Команды используют ts-node и выполняют скрипты из `backend/scripts`).

## Запуск приложения

Откройте два терминала.

- Backend (терминал 1):

```bash
npm run dev:backend
```

Доступен по адресу: `http://localhost:3000`

- Frontend (терминал 2):

```bash
npm run dev:frontend
```

Доступен по адресу: `http://localhost:3001`

Если порт `3000` занят, измените `PORT` в `backend/.env` и убедитесь, что `REACT_APP_API_URL` указывает на актуальный адрес API.

## API Endpoints

### GET /api/ideas
Получить список всех идей с количеством голосов.

Пример ответа:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Название идеи",
      "description": "Описание идеи",
      "vote_count": 5,
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### POST /api/ideas/:id/vote
Проголосовать за идею.

Успех:
```json
{
  "success": true,
  "data": {
    "idea_id": 1,
    "vote_count": 6,
    "message": "Vote recorded successfully"
  }
}
```

Лимит превышен (HTTP 409):
```json
{
  "success": false,
  "error": "Vote limit exceeded",
  "message": "You can vote for maximum 10 ideas"
}
```

Повторное голосование (HTTP 409):
```json
{
  "success": false,
  "error": "Already voted",
  "message": "You have already voted for this idea"
}
```

### GET /api/votes/my
Получить список id идей, за которые проголосовал текущий IP.

Пример ответа:
```json
{
  "success": true,
  "data": [1, 3, 5]
}
```

## Бизнес-логика

- Один IP-адрес может проголосовать максимум за 10 разных идей
- Повторное голосование за одну идею с того же IP невозможно
- Доступ к приложению без регистрации и авторизации
- IP извлекается из заголовков: `X-Forwarded-For` → `X-Real-IP` → `req.ip`

## Скрипты

### Корневые
- `npm run install:all` — установить зависимости фронта и бэка
- `npm run migrate` — применить миграции (ts-node)
- `npm run seed` — наполнить БД тестовыми данными (ts-node)
- `npm run dev:backend` — старт backend (nodemon + ts-node)
- `npm run dev:frontend` — старт frontend (react-scripts)

### Backend
- `npm run dev` — разработка (nodemon)
- `npm run build` — сборка TypeScript в `dist`
- `npm run start` — запуск production-версии из `dist`

### Frontend
- `npm start` — разработка
- `npm run build` — сборка

## Архитектура

### Backend (Layered Architecture)
- Routes → Controllers → Services → Repositories
- Централизованная обработка ошибок
- Транзакции для операций голосования
- Параметризованные запросы и пул подключений PostgreSQL

### Frontend (React + TypeScript)
- Компонентная архитектура
- Состояние через `useState`/`useEffect`
- Responsive дизайн с Bootstrap 5

## Производительность и безопасность

- Индексы в БД для ускорения запросов
- Транзакции для атомарности
- Helmet + CORS
- Параметризованные запросы (SQL-инъекции)

## Траблшутинг

- «EADDRINUSE: address already in use :::3000» — порт занят. Измените `PORT` в `backend/.env` и обновите `REACT_APP_API_URL` во фронтенде.
- Ошибки миграций — проверьте `DATABASE_URL` и доступ к PostgreSQL, затем `npm run migrate` ещё раз.

## Лицензия

MIT
