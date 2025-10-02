# Идеи для изучения Английского языка

Веб-приложение для голосования за идеи изучения Английского языка с системой ограничений по IP-адресу.

## Описание проекта

Одностраничное веб-приложение с системой голосования без регистрации пользователей. Пользователи могут просматривать идеи и голосовать за них, с ограничением в 10 голосов на IP-адрес.

## Технологический стек

### Backend
- **Node.js** + **TypeScript**
- **Express.js** - веб-фреймворк
- **PostgreSQL** - база данных
- **pg** - драйвер PostgreSQL
- **CORS** - настройка CORS
- **Morgan** - логирование запросов
- **Helmet** - безопасность

### Frontend
- **React** + **TypeScript**
- **Bootstrap 5** - стилизация
- **Axios** - HTTP клиент

## Требования к системе

- **Node.js** версии 16.0.0 или выше
- **PostgreSQL** версии 12.0 или выше
- **npm** или **yarn** для управления зависимостями

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
│   ├── scripts/           # Скрипты (migrate, seed)
│   └── package.json
├── frontend/               # Frontend приложение
│   ├── src/
│   │   ├── components/     # React компоненты
│   │   ├── services/       # API сервисы
│   │   ├── types/          # TypeScript типы
│   │   └── utils/          # Утилиты
│   └── package.json
└── README.md
```

## Установка и запуск

### 1. Клонирование и установка зависимостей

```bash
# Установка зависимостей для backend
cd backend
npm install

# Установка зависимостей для frontend
cd ../frontend
npm install
```

### 2. Настройка переменных окружения

Создайте файл `.env` в папке `backend` на основе `.env.example`:

```bash
cp backend/.env.example backend/.env
```

Отредактируйте `.env` файл:

```env
PORT=3000
DATABASE_URL=postgresql://username:password@localhost:5432/ideas_db
NODE_ENV=development
```

### 3. Настройка базы данных

1. Создайте базу данных PostgreSQL:

```sql
CREATE DATABASE ideas_db;
```

2. Примените миграции:

```bash
cd backend
npm run migrate
```

3. Заполните базу тестовыми данными:

```bash
npm run seed
```

### 4. Запуск приложения

#### Backend (терминал 1):

```bash
cd backend
npm run dev
```

Backend будет доступен по адресу: http://localhost:3000

#### Frontend (терминал 2):

```bash
cd frontend
npm start
```

Frontend будет доступен по адресу: http://localhost:3001

## API Endpoints

### GET /api/ideas
Получить список всех идей с количеством голосов.

**Ответ:**
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

**Ответ при успехе:**
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

**Ответ при ошибке (лимит превышен):**
```json
{
  "success": false,
  "error": "Vote limit exceeded",
  "message": "You can vote for maximum 10 ideas"
}
```

**Ответ при ошибке (уже голосовал):**
```json
{
  "success": false,
  "error": "Already voted",
  "message": "You have already voted for this idea"
}
```

### GET /api/votes/my
Получить список идей, за которые проголосовал текущий IP.

**Ответ:**
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
- IP-адрес извлекается из заголовков X-Forwarded-For, X-Real-IP или req.ip

## Скрипты

### Backend
- `npm run dev` - запуск в режиме разработки
- `npm run build` - сборка проекта
- `npm run start` - запуск production-версии
- `npm run migrate` - применение миграций
- `npm run seed` - наполнение БД тестовыми данными

### Frontend
- `npm start` - запуск в режиме разработки
- `npm run build` - сборка проекта
- `npm test` - запуск тестов

## Архитектура

### Backend (Layered Architecture)
- **Routes** → **Controllers** → **Services** → **Repositories**
- Централизованная обработка ошибок
- Транзакции для операций голосования
- Параметризованные запросы для защиты от SQL-инъекций
- Connection pool для PostgreSQL

### Frontend (React + TypeScript)
- Компонентная архитектура
- Управление состоянием через useState/useEffect
- Типизация с TypeScript
- Responsive дизайн с Bootstrap 5

## Безопасность

- Защита от SQL-инъекций через параметризованные запросы
- CORS настройка для frontend
- Helmet для безопасности HTTP заголовков
- Валидация входных данных
- Ограничения на количество голосов

## Производительность

- Индексы в базе данных для оптимизации запросов
- Connection pool для PostgreSQL
- Транзакции для атомарности операций
- Оптимизированные SQL запросы с JOIN

## Разработка

Для разработки рекомендуется:

1. Запустить backend в режиме разработки с hot reload
2. Запустить frontend в режиме разработки
3. Использовать PostgreSQL для локальной разработки
4. Следить за логами в консоли для отладки

## Лицензия

MIT
