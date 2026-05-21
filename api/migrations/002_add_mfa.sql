-- Nexus Migration 002: Add MFA (TOTP) support to users table
-- TAURUS AI CORP - FZCO | Security Hardening v3.1.0

ALTER TABLE users
ADD COLUMN IF NOT EXISTS totp_secret VARCHAR(64) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS mfa_enabled BOOLEAN DEFAULT FALSE;

-- Index for MFA lookups
CREATE INDEX IF NOT EXISTS idx_users_mfa_enabled ON users(mfa_enabled) WHERE mfa_enabled = TRUE;
