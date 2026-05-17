-- NeoSync™ Migration 003: Storage security hardening
-- TAURUS AI CORP - FZCO | Security Hardening v3.2.0
-- Addresses hunter report finding: BotCommerce exposes S3 bucket publicly

-- Add storage bucket configuration table with access control
CREATE TABLE IF NOT EXISTS storage_config (
    id SERIAL PRIMARY KEY,
    bucket_name VARCHAR(255) NOT NULL,
    bucket_type VARCHAR(50) NOT NULL DEFAULT 'private', -- 'private' | 'public-read' | 'signed-only'
    region VARCHAR(50) DEFAULT 'us-east-1',
    provider VARCHAR(50) DEFAULT 's3', -- 's3' | 'wasabi' | 'r2' | 'gcs'
    access_policy JSONB DEFAULT '{"public_read": false, "signed_urls": true, "cors_origins": []}',
    encryption VARCHAR(50) DEFAULT 'AES256',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Add file uploads table with access control
CREATE TABLE IF NOT EXISTS file_uploads (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    campaign_id INTEGER REFERENCES campaigns(id) ON DELETE SET NULL,
    file_key VARCHAR(512) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(100),
    file_size BIGINT,
    bucket_name VARCHAR(255),
    access_level VARCHAR(20) DEFAULT 'private', -- 'private' | 'public' | 'signed'
    signed_url_expires_at TIMESTAMP,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_file_uploads_user ON file_uploads(user_id);
CREATE INDEX IF NOT EXISTS idx_file_uploads_campaign ON file_uploads(campaign_id);
CREATE INDEX IF NOT EXISTS idx_file_uploads_key ON file_uploads(file_key);

-- Default config: all buckets private, signed URLs only
INSERT INTO storage_config (bucket_name, bucket_type, access_policy)
VALUES ('neosync-assets', 'private', '{"public_read": false, "signed_urls": true, "signed_url_ttl_seconds": 3600, "cors_origins": []}')
ON CONFLICT DO NOTHING;
