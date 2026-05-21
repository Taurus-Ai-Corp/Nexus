-- Nexus Database Initialization
-- PostgreSQL + pgvector + TimescaleDB
-- TAURUS AI CORP - FZCO

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgvector";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- Load TimescaleDB (must be in shared_preload_libraries)
-- CREATE EXTENSION IF NOT EXISTS timescaledb;

-- ── USERS ──
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'employee',
    organization_id INTEGER,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ── CAMPAIGNS ──
CREATE TABLE IF NOT EXISTS campaigns (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    name VARCHAR(255) NOT NULL,
    objective VARCHAR(100),
    platform VARCHAR(50),
    status VARCHAR(50) DEFAULT 'draft',
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    budget_daily DECIMAL(10, 2),
    budget_total DECIMAL(10, 2),
    targeting_json JSONB DEFAULT '{}',
    creatives_json JSONB DEFAULT '[]',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_campaigns_platform ON campaigns(platform);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);
CREATE INDEX IF NOT EXISTS idx_campaigns_user_id ON campaigns(user_id);

-- ── ASSETS ──
CREATE TABLE IF NOT EXISTS assets (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    campaign_id INTEGER REFERENCES campaigns(id),
    type VARCHAR(50),
    file_path VARCHAR(500),
    meta_data JSONB DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW()
);

-- ── CONTENT EMBEDDINGS (pgvector) ──
CREATE TABLE IF NOT EXISTS content_embeddings (
    id SERIAL PRIMARY KEY,
    content_id INTEGER,
    content_type VARCHAR(50),
    embedding vector(768),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_content_embeddings_vector ON content_embeddings USING ivfflat (embedding vector_cosine_ops);

-- ── ANALYTICS (Time-Series) ──
CREATE TABLE IF NOT EXISTS analytics_events (
    time TIMESTAMP NOT NULL,
    campaign_id INTEGER REFERENCES campaigns(id),
    metric_name VARCHAR(100),
    metric_value DECIMAL(15, 4),
    platform VARCHAR(50),
    tags JSONB DEFAULT '{}'
);

-- Convert to hypertable if TimescaleDB is available
-- SELECT create_hypertable('analytics_events', 'time', if_not_exists => TRUE);

CREATE INDEX IF NOT EXISTS idx_analytics_time ON analytics_events(time DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_campaign ON analytics_events(campaign_id);

-- ── AGENT SESSIONS ──
CREATE TABLE IF NOT EXISTS agent_sessions (
    id SERIAL PRIMARY KEY,
    session_id UUID DEFAULT uuid_generate_v4(),
    agent_type VARCHAR(100),
    platform VARCHAR(50),
    task_description TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    input_data JSONB DEFAULT '{}',
    output_data JSONB DEFAULT '{}',
    priority VARCHAR(20) DEFAULT 'medium',
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ── WEBHOOKS ──
CREATE TABLE IF NOT EXISTS webhooks (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    url VARCHAR(500) NOT NULL,
    event_type VARCHAR(100),
    secret VARCHAR(255),
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS webhook_deliveries (
    id SERIAL PRIMARY KEY,
    webhook_id INTEGER REFERENCES webhooks(id),
    event_type VARCHAR(100),
    payload JSONB,
    response_status INTEGER,
    response_body TEXT,
    delivered_at TIMESTAMP DEFAULT NOW()
);

-- ── APPROVALS (HITL) ──
CREATE TABLE IF NOT EXISTS approvals (
    id SERIAL PRIMARY KEY,
    campaign_id INTEGER REFERENCES campaigns(id),
    content_id INTEGER,
    reviewer_id INTEGER REFERENCES users(id),
    status VARCHAR(50) DEFAULT 'pending',
    feedback TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    reviewed_at TIMESTAMP
);

-- ── SEED DATA ──
INSERT INTO users (email, hashed_password, role) VALUES
    ('employee1@taurusai.corp', '$2b$12$LJ3m4ys3Lk4qKzKxKzKxK.KzKxKzKxKzKxKzKxKzKxKzKxKzKxKxK', 'employee')
    ON CONFLICT (email) DO NOTHING;
