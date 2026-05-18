-- ===========================================
-- ONBOARDING PORTAL - Supabase Migration
-- Adds onboarding-specific tables to existing schema
-- ===========================================

-- ===========================================
-- ONBOARDING SESSIONS TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS onboarding_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    platform VARCHAR(50) NOT NULL CHECK (platform IN ('neovibe', 'q-grid', 'bizflow', 'mater-maria')),
    engagement_type VARCHAR(50) NOT NULL CHECK (engagement_type IN ('project', 'retainer', 'hybrid')),
    phase VARCHAR(50) DEFAULT 'prospect' CHECK (phase IN ('prospect', 'onboarding', 'active', 'upsell')),
    bdm_assigned VARCHAR(100),
    industry VARCHAR(100),
    kickoff_date DATE,
    status VARCHAR(50) DEFAULT 'in_progress' CHECK (status IN ('draft', 'in_progress', 'completed', 'cancelled')),
    created_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===========================================
-- ONBOARDING STEPS TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS onboarding_steps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES onboarding_sessions(id) ON DELETE CASCADE,
    step_key VARCHAR(100) NOT NULL,
    step_name VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'skipped', 'blocked')),
    order_index INTEGER NOT NULL,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    blocked_reason TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===========================================
-- ONBOARDING DOCUMENTS TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS onboarding_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES onboarding_sessions(id) ON DELETE CASCADE,
    doc_type VARCHAR(50) NOT NULL CHECK (doc_type IN ('contract', 'invoice', 'nda', 'proposal', 'brief', 'other')),
    file_name VARCHAR(255) NOT NULL,
    drive_file_id VARCHAR(255),
    drive_folder_id VARCHAR(255),
    file_url TEXT,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'generated', 'sent', 'signed', 'rejected')),
    generated_at TIMESTAMP WITH TIME ZONE,
    sent_at TIMESTAMP WITH TIME ZONE,
    signed_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===========================================
-- ONBOARDING NOTIFICATIONS TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS onboarding_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES onboarding_sessions(id) ON DELETE CASCADE,
    notification_type VARCHAR(50) NOT NULL CHECK (notification_type IN ('welcome_email', 'internal_alert', 'kickoff_reminder', 'step_complete', 'blocker_alert')),
    channel VARCHAR(50) NOT NULL CHECK (channel IN ('email', 'telegram', 'slack', 'sms')),
    recipient VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'read')),
    payload JSONB DEFAULT '{}',
    sent_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===========================================
-- PLATFORM CONFIG TABLE (per-platform onboarding defaults)
-- ===========================================
CREATE TABLE IF NOT EXISTS platform_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    platform VARCHAR(50) UNIQUE NOT NULL CHECK (platform IN ('neovibe', 'q-grid', 'bizflow', 'mater-maria')),
    brand_name VARCHAR(100) NOT NULL,
    domain VARCHAR(100),
    default_bdm VARCHAR(100),
    tracker_sheet_id VARCHAR(255),
    root_folder_id VARCHAR(255),
    onboarding_steps JSONB DEFAULT '[]',
    welcome_template_id VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===========================================
-- INDEXES
-- ===========================================
CREATE INDEX idx_onboarding_sessions_client ON onboarding_sessions(client_id);
CREATE INDEX idx_onboarding_sessions_platform ON onboarding_sessions(platform);
CREATE INDEX idx_onboarding_sessions_status ON onboarding_sessions(status);
CREATE INDEX idx_onboarding_steps_session ON onboarding_steps(session_id);
CREATE INDEX idx_onboarding_steps_status ON onboarding_steps(status);
CREATE INDEX idx_onboarding_documents_session ON onboarding_documents(session_id);
CREATE INDEX idx_onboarding_documents_type ON onboarding_documents(doc_type);
CREATE INDEX idx_onboarding_notifications_session ON onboarding_notifications(session_id);
CREATE INDEX idx_onboarding_notifications_status ON onboarding_notifications(status);

-- ===========================================
-- TRIGGERS
-- ===========================================
CREATE TRIGGER update_onboarding_sessions_updated_at BEFORE UPDATE ON onboarding_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_onboarding_steps_updated_at BEFORE UPDATE ON onboarding_steps FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_onboarding_documents_updated_at BEFORE UPDATE ON onboarding_documents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_platform_configs_updated_at BEFORE UPDATE ON platform_configs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===========================================
-- RLS POLICIES
-- ===========================================
ALTER TABLE onboarding_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE onboarding_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE onboarding_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE onboarding_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_configs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable all for authenticated users" ON onboarding_sessions FOR ALL USING (true);
CREATE POLICY "Enable all for authenticated users" ON onboarding_steps FOR ALL USING (true);
CREATE POLICY "Enable all for authenticated users" ON onboarding_documents FOR ALL USING (true);
CREATE POLICY "Enable all for authenticated users" ON onboarding_notifications FOR ALL USING (true);
CREATE POLICY "Enable read for all" ON platform_configs FOR SELECT USING (true);

-- ===========================================
-- SEED: Platform Configs
-- ===========================================
INSERT INTO platform_configs (platform, brand_name, domain, default_bdm, onboarding_steps) VALUES
('neovibe', 'NeoVibe by Taurus AI', 'neovibe.taurusai.io', 'Praveen Varkey', 
 '[{"key":"client_info","name":"Client Information","order":1},{"key":"platform_select","name":"Platform Selection","order":2},{"key":"engagement","name":"Engagement Type","order":3},{"key":"team_assign","name":"Team Assignment","order":4},{"key":"workspace","name":"Workspace Provisioning","order":5},{"key":"documents","name":"Document Generation","order":6},{"key":"crm_sync","name":"CRM Sync","order":7},{"key":"kickoff","name":"Kickoff Scheduling","order":8}]'::jsonb),
('q-grid', 'Q-Grid', 'q-grid.net', NULL,
 '[{"key":"client_info","name":"Client Information","order":1},{"key":"platform_select","name":"Platform Selection","order":2},{"key":"engagement","name":"Engagement Type","order":3},{"key":"team_assign","name":"Team Assignment","order":4},{"key":"workspace","name":"Workspace Provisioning","order":5},{"key":"documents","name":"Document Generation","order":6},{"key":"crm_sync","name":"CRM Sync","order":7},{"key":"kickoff","name":"Kickoff Scheduling","order":8}]'::jsonb),
('bizflow', 'BizFlow', 'bizflow.taurusai.io', NULL,
 '[{"key":"client_info","name":"Client Information","order":1},{"key":"platform_select","name":"Platform Selection","order":2},{"key":"engagement","name":"Engagement Type","order":3},{"key":"team_assign","name":"Team Assignment","order":4},{"key":"workspace","name":"Workspace Provisioning","order":5},{"key":"documents","name":"Document Generation","order":6},{"key":"crm_sync","name":"CRM Sync","order":7},{"key":"kickoff","name":"Kickoff Scheduling","order":8}]'::jsonb),
('mater-maria', 'Mater Maria', NULL, NULL,
 '[{"key":"client_info","name":"Client Information","order":1},{"key":"platform_select","name":"Platform Selection","order":2},{"key":"engagement","name":"Engagement Type","order":3},{"key":"team_assign","name":"Team Assignment","order":4},{"key":"workspace","name":"Workspace Provisioning","order":5},{"key":"documents","name":"Document Generation","order":6},{"key":"crm_sync","name":"CRM Sync","order":7},{"key":"kickoff","name":"Kickoff Scheduling","order":8}]'::jsonb)
ON CONFLICT (platform) DO NOTHING;
