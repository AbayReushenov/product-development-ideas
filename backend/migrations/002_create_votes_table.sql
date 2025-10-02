-- Создание таблицы votes
CREATE TABLE IF NOT EXISTS votes (
    id SERIAL PRIMARY KEY,
    idea_id INTEGER NOT NULL REFERENCES ideas(id) ON DELETE CASCADE,
    ip_address INET NOT NULL,
    voted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создание индексов для оптимизации запросов
CREATE INDEX IF NOT EXISTS idx_votes_idea_id ON votes(idea_id);
CREATE INDEX IF NOT EXISTS idx_votes_ip_address ON votes(ip_address);
CREATE INDEX IF NOT EXISTS idx_votes_idea_ip ON votes(idea_id, ip_address);

-- Создание уникального индекса для предотвращения повторного голосования
CREATE UNIQUE INDEX IF NOT EXISTS idx_votes_unique_idea_ip ON votes(idea_id, ip_address);