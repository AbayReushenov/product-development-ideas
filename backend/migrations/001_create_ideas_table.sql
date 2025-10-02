-- Создание таблицы ideas
CREATE TABLE IF NOT EXISTS ideas (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создание индекса для оптимизации запросов по дате создания
CREATE INDEX IF NOT EXISTS idx_ideas_created_at ON ideas(created_at);