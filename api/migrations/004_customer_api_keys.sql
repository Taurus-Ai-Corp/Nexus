-- Customer API Keys Table
-- Nexus Social Suite — Per-user model API keys for AI campaign generation

CREATE TABLE IF NOT EXISTS customer_api_keys (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    config JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id)
);

CREATE INDEX idx_customer_api_keys_user_id ON customer_api_keys(user_id);

-- Add model preference column to users
ALTER TABLE users ADD COLUMN IF NOT EXISTS preferred_model VARCHAR(100) DEFAULT 'anthropic/claude-sonnet-4.6';
ALTER TABLE users ADD COLUMN IF NOT EXISTS auto_generate_visuals BOOLEAN DEFAULT true;
