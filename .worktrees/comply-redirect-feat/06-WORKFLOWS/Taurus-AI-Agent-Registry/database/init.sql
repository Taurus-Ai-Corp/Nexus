-- 🏰 Taurus AI Corp. - Empire Database Initialization
-- Sets up the complete local Supabase database schema

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- Agent Registry Tables
CREATE TABLE IF NOT EXISTS agents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) UNIQUE NOT NULL,
    version VARCHAR(50) NOT NULL,
    description TEXT,
    capabilities JSONB,
    dependencies JSONB,
    api_requirements JSONB,
    business_domains JSONB,
    github_repo VARCHAR(255),
    author VARCHAR(255),
    status VARCHAR(50) DEFAULT 'active',
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- MCP Registry Tables
CREATE TABLE IF NOT EXISTS mcps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) UNIQUE NOT NULL,
    version VARCHAR(50) NOT NULL,
    description TEXT,
    capabilities JSONB,
    connection_config JSONB,
    business_domains JSONB,
    status VARCHAR(50) DEFAULT 'active',
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Workflow Execution History
CREATE TABLE IF NOT EXISTS workflow_executions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workflow_id VARCHAR(255) NOT NULL,
    workflow_type VARCHAR(50) NOT NULL,
    agents_used JSONB,
    parameters JSONB,
    results JSONB,
    execution_time FLOAT,
    costs JSONB,
    models_used JSONB,
    status VARCHAR(50) NOT NULL,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Agent Usage Analytics
CREATE TABLE IF NOT EXISTS agent_usage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_name VARCHAR(255) NOT NULL,
    task_type VARCHAR(100),
    execution_time FLOAT,
    model_used VARCHAR(100),
    cost FLOAT DEFAULT 0.0,
    success BOOLEAN DEFAULT TRUE,
    parameters JSONB,
    results JSONB,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI Model Usage Tracking
CREATE TABLE IF NOT EXISTS ai_model_usage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    model_name VARCHAR(100) NOT NULL,
    model_type VARCHAR(50) NOT NULL, -- 'local' or 'cloud'
    tokens_used INTEGER,
    cost FLOAT DEFAULT 0.0,
    request_type VARCHAR(50),
    agent_name VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Business Intelligence Store
CREATE TABLE IF NOT EXISTS business_intelligence (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_domain VARCHAR(100) NOT NULL,
    intelligence_type VARCHAR(50) NOT NULL,
    data JSONB NOT NULL,
    embeddings vector(1536), -- For semantic search
    metadata JSONB,
    confidence_score FLOAT,
    created_by VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE
);

-- Campaign Data
CREATE TABLE IF NOT EXISTS campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    business_domain VARCHAR(100) NOT NULL,
    target_markets JSONB,
    campaign_data JSONB,
    generated_assets JSONB,
    performance_metrics JSONB,
    agents_used JSONB,
    status VARCHAR(50) DEFAULT 'draft',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Lead Management System
CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    company VARCHAR(255),
    source VARCHAR(100),
    status VARCHAR(50) DEFAULT 'new',
    score INTEGER DEFAULT 0,
    lead_data JSONB,
    assigned_to VARCHAR(255),
    last_contacted TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Lead Scoring Rules
CREATE TABLE IF NOT EXISTS lead_scoring_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rule_name VARCHAR(255) NOT NULL,
    condition_field VARCHAR(100) NOT NULL,
    condition_operator VARCHAR(50) NOT NULL,
    condition_value VARCHAR(255) NOT NULL,
    score_adjustment INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Marketing Analytics
CREATE TABLE IF NOT EXISTS marketing_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    metric_name VARCHAR(100) NOT NULL,
    metric_value FLOAT NOT NULL,
    metric_type VARCHAR(50) NOT NULL,
    business_domain VARCHAR(100),
    campaign_id UUID REFERENCES campaigns(id),
    metadata JSONB,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- System Configuration
CREATE TABLE IF NOT EXISTS system_config (
    key VARCHAR(255) PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Empire Performance Metrics
CREATE TABLE IF NOT EXISTS empire_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    metric_type VARCHAR(100) NOT NULL,
    metric_value FLOAT NOT NULL,
    agents_count INTEGER,
    capabilities_count INTEGER,
    total_executions INTEGER,
    total_cost FLOAT DEFAULT 0.0,
    success_rate FLOAT,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_agents_name ON agents(name);
CREATE INDEX IF NOT EXISTS idx_agents_business_domains ON agents USING GIN(business_domains);
CREATE INDEX IF NOT EXISTS idx_agents_capabilities ON agents USING GIN(capabilities);

CREATE INDEX IF NOT EXISTS idx_workflow_executions_workflow_id ON workflow_executions(workflow_id);
CREATE INDEX IF NOT EXISTS idx_workflow_executions_created_at ON workflow_executions(created_at);

CREATE INDEX IF NOT EXISTS idx_agent_usage_agent_name ON agent_usage(agent_name);
CREATE INDEX IF NOT EXISTS idx_agent_usage_created_at ON agent_usage(created_at);
CREATE INDEX IF NOT EXISTS idx_agent_usage_success ON agent_usage(success);

CREATE INDEX IF NOT EXISTS idx_ai_model_usage_model_name ON ai_model_usage(model_name);
CREATE INDEX IF NOT EXISTS idx_ai_model_usage_model_type ON ai_model_usage(model_type);
CREATE INDEX IF NOT EXISTS idx_ai_model_usage_created_at ON ai_model_usage(created_at);

CREATE INDEX IF NOT EXISTS idx_business_intelligence_domain ON business_intelligence(business_domain);
CREATE INDEX IF NOT EXISTS idx_business_intelligence_type ON business_intelligence(intelligence_type);
CREATE INDEX IF NOT EXISTS idx_business_intelligence_embeddings ON business_intelligence USING ivfflat (embeddings vector_cosine_ops);

CREATE INDEX IF NOT EXISTS idx_campaigns_business_domain ON campaigns(business_domain);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);

CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_score ON leads(score);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at);
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);

CREATE INDEX IF NOT EXISTS idx_marketing_metrics_name ON marketing_metrics(metric_name);
CREATE INDEX IF NOT EXISTS idx_marketing_metrics_type ON marketing_metrics(metric_type);
CREATE INDEX IF NOT EXISTS idx_marketing_metrics_recorded_at ON marketing_metrics(recorded_at);

CREATE INDEX IF NOT EXISTS idx_empire_metrics_type ON empire_metrics(metric_type);
CREATE INDEX IF NOT EXISTS idx_empire_metrics_recorded_at ON empire_metrics(recorded_at);

-- Insert default system configuration
INSERT INTO system_config (key, value, description) VALUES 
('empire_mode', '"local"', 'AI Empire operating mode: local, hybrid, or cloud'),
('cost_limits', '{"daily": 5.0, "monthly": 100.0}', 'Cost limits for cloud AI usage'),
('default_models', '{"local": "llama3.1:8b", "cloud": "claude-3-haiku-20240307"}', 'Default AI models for routing'),
('business_domains', '["marketing", "creative", "intelligence", "visual_design", "analytics", "universal"]', 'Supported business domains'),
('lead_scoring_config', '{"max_score": 100, "qualification_threshold": 70}', 'Lead scoring system configuration'),
('empire_metrics', '{"agents": 3, "capabilities": 36, "domains": 12}', 'Current empire statistics')
ON CONFLICT (key) DO NOTHING;

-- Insert default lead scoring rules
INSERT INTO lead_scoring_rules (rule_name, condition_field, condition_operator, condition_value, score_adjustment) VALUES
('Has Company', 'company', 'not_null', '', 10),
('Has Phone', 'phone', 'not_null', '', 5),
('High-value Domain', 'email', 'contains', '@enterprise.com', 15),
('Recent Activity', 'created_at', 'within_days', '7', 20),
('Multiple Interactions', 'lead_data->interactions', 'count_greater_than', '3', 25)
ON CONFLICT DO NOTHING;

-- Create functions for common operations
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create function for automatic lead scoring
CREATE OR REPLACE FUNCTION calculate_lead_score(lead_id UUID)
RETURNS INTEGER AS $$
DECLARE
    total_score INTEGER := 0;
    rule RECORD;
    lead_record RECORD;
BEGIN
    -- Get the lead record
    SELECT * INTO lead_record FROM leads WHERE id = lead_id;
    
    -- Apply each active scoring rule
    FOR rule IN SELECT * FROM lead_scoring_rules WHERE is_active = TRUE
    LOOP
        -- Simple rule evaluation logic
        IF rule.condition_operator = 'not_null' THEN
            IF (lead_record.lead_data->>rule.condition_field) IS NOT NULL OR
               (CASE rule.condition_field 
                WHEN 'company' THEN lead_record.company
                WHEN 'phone' THEN lead_record.phone
                WHEN 'email' THEN lead_record.email
                ELSE NULL END) IS NOT NULL THEN
                total_score := total_score + rule.score_adjustment;
            END IF;
        ELSIF rule.condition_operator = 'contains' THEN
            IF lead_record.email ILIKE '%' || rule.condition_value || '%' THEN
                total_score := total_score + rule.score_adjustment;
            END IF;
        END IF;
    END LOOP;
    
    -- Update the lead score
    UPDATE leads SET score = total_score WHERE id = lead_id;
    
    RETURN total_score;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_agents_updated_at BEFORE UPDATE ON agents 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mcps_updated_at BEFORE UPDATE ON mcps 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_campaigns_updated_at BEFORE UPDATE ON campaigns 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create views for analytics
CREATE OR REPLACE VIEW agent_stats AS
SELECT 
    a.name,
    a.version,
    a.usage_count,
    a.status,
    COUNT(au.id) as total_executions,
    AVG(au.execution_time) as avg_execution_time,
    SUM(au.cost) as total_cost,
    (COUNT(au.id) FILTER (WHERE au.success = true))::float / NULLIF(COUNT(au.id), 0) as success_rate,
    a.created_at,
    a.updated_at
FROM agents a
LEFT JOIN agent_usage au ON a.name = au.agent_name
GROUP BY a.name, a.version, a.usage_count, a.status, a.created_at, a.updated_at;

-- Create view for model usage statistics  
CREATE OR REPLACE VIEW model_usage_stats AS
SELECT 
    model_name,
    model_type,
    COUNT(*) as request_count,
    SUM(tokens_used) as total_tokens,
    SUM(cost) as total_cost,
    AVG(cost) as avg_cost_per_request,
    DATE_TRUNC('day', created_at) as usage_date
FROM ai_model_usage
GROUP BY model_name, model_type, DATE_TRUNC('day', created_at)
ORDER BY usage_date DESC, total_cost DESC;

-- Create view for empire dashboard
CREATE OR REPLACE VIEW empire_dashboard AS
SELECT 
    COUNT(DISTINCT a.name) as total_agents,
    SUM(jsonb_array_length(a.capabilities)) as total_capabilities,
    COUNT(DISTINCT au.agent_name) as active_agents,
    COUNT(au.id) as total_executions,
    SUM(CASE WHEN au.success THEN 1 ELSE 0 END) as successful_executions,
    AVG(au.execution_time) as avg_execution_time,
    SUM(au.cost) as total_cost,
    COUNT(CASE WHEN au.model_used LIKE 'local:%' THEN 1 END) as local_requests,
    COUNT(CASE WHEN au.model_used NOT LIKE 'local:%' THEN 1 END) as cloud_requests
FROM agents a
LEFT JOIN agent_usage au ON a.name = au.agent_name;

-- Create view for lead pipeline
CREATE OR REPLACE VIEW lead_pipeline AS
SELECT 
    status,
    COUNT(*) as lead_count,
    AVG(score) as avg_score,
    SUM(CASE WHEN score >= 70 THEN 1 ELSE 0 END) as qualified_leads
FROM leads
GROUP BY status
ORDER BY 
    CASE status 
        WHEN 'new' THEN 1
        WHEN 'contacted' THEN 2
        WHEN 'qualified' THEN 3
        WHEN 'opportunity' THEN 4
        WHEN 'closed_won' THEN 5
        WHEN 'closed_lost' THEN 6
        ELSE 7
    END;

-- Insert initial sample data
INSERT INTO empire_metrics (metric_type, metric_value, agents_count, capabilities_count, total_executions, total_cost, success_rate) VALUES
('empire_initialization', 1.0, 3, 36, 0, 0.0, 0.0);

-- Success message
DO $$
BEGIN
    RAISE NOTICE '🏰 Taurus AI Corp. Empire Database initialized successfully!';
    RAISE NOTICE '📊 Tables created: agents, mcps, workflows, analytics, leads, campaigns, metrics';
    RAISE NOTICE '🔍 Indexes created for optimal performance';
    RAISE NOTICE '📈 Views created: agent_stats, model_usage_stats, empire_dashboard, lead_pipeline';
    RAISE NOTICE '🎯 Lead scoring system configured';
    RAISE NOTICE '✅ Your Local AI Empire database is ready for business!';
END $$;