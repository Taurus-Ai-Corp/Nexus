-- ===========================================
-- BIZFLOW-NEOVIBE PLATFORM - PlanetScale MySQL Schema
-- Analytics & Reporting Database
-- ===========================================

-- ===========================================
-- CAMPAIGN METRICS (Time-series analytics)
-- ===========================================
CREATE TABLE IF NOT EXISTS campaign_metrics (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    campaign_id VARCHAR(36) NOT NULL,
    client_id VARCHAR(36) NOT NULL,
    metric_date DATE NOT NULL,
    hour TINYINT DEFAULT 0,

    -- Reach & Impressions
    impressions BIGINT DEFAULT 0,
    reach BIGINT DEFAULT 0,
    frequency DECIMAL(8,4) DEFAULT 0,

    -- Engagement
    clicks BIGINT DEFAULT 0,
    likes BIGINT DEFAULT 0,
    shares BIGINT DEFAULT 0,
    comments BIGINT DEFAULT 0,
    saves BIGINT DEFAULT 0,

    -- Conversions
    leads_generated INT DEFAULT 0,
    conversions INT DEFAULT 0,
    conversion_value DECIMAL(12,2) DEFAULT 0,

    -- Cost
    cost DECIMAL(12,2) DEFAULT 0,
    cpc DECIMAL(8,4) DEFAULT 0,
    cpm DECIMAL(8,4) DEFAULT 0,
    cpl DECIMAL(8,4) DEFAULT 0,

    -- Performance Ratios
    ctr DECIMAL(8,6) DEFAULT 0,
    conversion_rate DECIMAL(8,6) DEFAULT 0,
    engagement_rate DECIMAL(8,6) DEFAULT 0,
    roi DECIMAL(10,4) DEFAULT 0,

    -- Channel breakdown
    channel VARCHAR(50),
    platform VARCHAR(50),
    ad_set VARCHAR(100),

    -- Cultural context
    market VARCHAR(50),
    language VARCHAR(20),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_campaign_date (campaign_id, metric_date),
    INDEX idx_client_date (client_id, metric_date),
    INDEX idx_market (market),
    INDEX idx_channel (channel)
);

-- ===========================================
-- AGENT PERFORMANCE (AI Agent Analytics)
-- ===========================================
CREATE TABLE IF NOT EXISTS agent_performance (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    agent_name VARCHAR(100) NOT NULL,
    execution_date DATE NOT NULL,
    hour TINYINT DEFAULT 0,

    -- Task metrics
    tasks_received INT DEFAULT 0,
    tasks_completed INT DEFAULT 0,
    tasks_failed INT DEFAULT 0,
    tasks_cancelled INT DEFAULT 0,

    -- Performance metrics
    success_rate DECIMAL(5,2) DEFAULT 0,
    avg_response_time_ms INT DEFAULT 0,
    min_response_time_ms INT DEFAULT 0,
    max_response_time_ms INT DEFAULT 0,
    p95_response_time_ms INT DEFAULT 0,

    -- Resource usage
    cpu_usage_percent DECIMAL(5,2) DEFAULT 0,
    memory_usage_mb INT DEFAULT 0,
    api_calls INT DEFAULT 0,
    tokens_used BIGINT DEFAULT 0,

    -- Cost tracking
    compute_cost DECIMAL(10,4) DEFAULT 0,
    api_cost DECIMAL(10,4) DEFAULT 0,
    total_cost DECIMAL(10,4) DEFAULT 0,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_agent_date (agent_name, execution_date),
    INDEX idx_date (execution_date)
);

-- ===========================================
-- LEAD SCORING HISTORY
-- ===========================================
CREATE TABLE IF NOT EXISTS lead_scoring_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    lead_id VARCHAR(36) NOT NULL,
    campaign_id VARCHAR(36),

    -- Score changes
    previous_score INT DEFAULT 0,
    new_score INT DEFAULT 0,
    score_change INT DEFAULT 0,

    -- Scoring factors
    scoring_factors JSON,
    trigger_event VARCHAR(100),

    -- Context
    market VARCHAR(50),
    cultural_factors JSON,

    scored_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_lead (lead_id),
    INDEX idx_campaign (campaign_id),
    INDEX idx_scored_at (scored_at)
);

-- ===========================================
-- CONTENT PERFORMANCE
-- ===========================================
CREATE TABLE IF NOT EXISTS content_performance (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    content_id VARCHAR(36) NOT NULL,
    campaign_id VARCHAR(36),

    metric_date DATE NOT NULL,

    -- Engagement
    views BIGINT DEFAULT 0,
    unique_views BIGINT DEFAULT 0,
    avg_time_spent_seconds INT DEFAULT 0,
    scroll_depth_percent DECIMAL(5,2) DEFAULT 0,

    -- Interactions
    clicks BIGINT DEFAULT 0,
    shares BIGINT DEFAULT 0,
    downloads INT DEFAULT 0,

    -- Conversions
    leads_captured INT DEFAULT 0,
    conversions INT DEFAULT 0,

    -- Content metadata
    content_type VARCHAR(50),
    platform VARCHAR(50),
    language VARCHAR(20),
    cultural_variant VARCHAR(50),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_content_date (content_id, metric_date),
    INDEX idx_campaign (campaign_id),
    INDEX idx_platform (platform)
);

-- ===========================================
-- REVENUE TRACKING
-- ===========================================
CREATE TABLE IF NOT EXISTS revenue_tracking (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    client_id VARCHAR(36) NOT NULL,

    period_date DATE NOT NULL,
    period_type ENUM('daily', 'weekly', 'monthly', 'quarterly') DEFAULT 'daily',

    -- Revenue
    mrr DECIMAL(12,2) DEFAULT 0,
    arr DECIMAL(12,2) DEFAULT 0,
    one_time_revenue DECIMAL(12,2) DEFAULT 0,
    total_revenue DECIMAL(12,2) DEFAULT 0,

    -- Costs
    campaign_costs DECIMAL(12,2) DEFAULT 0,
    platform_costs DECIMAL(12,2) DEFAULT 0,
    agent_costs DECIMAL(12,2) DEFAULT 0,
    total_costs DECIMAL(12,2) DEFAULT 0,

    -- Profitability
    gross_profit DECIMAL(12,2) DEFAULT 0,
    net_profit DECIMAL(12,2) DEFAULT 0,
    profit_margin DECIMAL(8,4) DEFAULT 0,
    roi DECIMAL(10,4) DEFAULT 0,

    -- Growth metrics
    revenue_growth_percent DECIMAL(8,4) DEFAULT 0,
    client_ltv DECIMAL(12,2) DEFAULT 0,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_client_period (client_id, period_date),
    INDEX idx_period_type (period_type, period_date)
);

-- ===========================================
-- MARKET INTELLIGENCE
-- ===========================================
CREATE TABLE IF NOT EXISTS market_intelligence (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    market VARCHAR(50) NOT NULL,
    industry VARCHAR(100),
    collected_date DATE NOT NULL,

    -- Competitor data
    competitor_name VARCHAR(255),
    competitor_data JSON,

    -- Market trends
    trend_data JSON,
    sentiment_score DECIMAL(5,4),

    -- Cultural events
    cultural_event VARCHAR(255),
    event_impact_score DECIMAL(5,4),

    -- Recommendations
    ai_recommendations JSON,

    source VARCHAR(100),
    confidence_score DECIMAL(5,4) DEFAULT 0,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_market_date (market, collected_date),
    INDEX idx_industry (industry)
);

-- ===========================================
-- API USAGE TRACKING
-- ===========================================
CREATE TABLE IF NOT EXISTS api_usage (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    api_name VARCHAR(100) NOT NULL,
    endpoint VARCHAR(255),
    usage_date DATE NOT NULL,
    hour TINYINT DEFAULT 0,

    -- Request metrics
    requests INT DEFAULT 0,
    successful_requests INT DEFAULT 0,
    failed_requests INT DEFAULT 0,

    -- Latency
    avg_latency_ms INT DEFAULT 0,
    p95_latency_ms INT DEFAULT 0,
    p99_latency_ms INT DEFAULT 0,

    -- Rate limiting
    rate_limited_requests INT DEFAULT 0,

    -- Cost
    estimated_cost DECIMAL(10,4) DEFAULT 0,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_api_date (api_name, usage_date),
    INDEX idx_date (usage_date)
);
