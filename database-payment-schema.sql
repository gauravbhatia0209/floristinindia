-- Payment Gateway Tables

-- Payment Gateway Configurations
CREATE TABLE IF NOT EXISTS payment_gateway_configs (
    id VARCHAR(20) PRIMARY KEY, -- 'paypal', 'razorpay', 'cashfree', 'phonepe'
    name VARCHAR(100) NOT NULL,
    enabled BOOLEAN DEFAULT false,
    sandbox BOOLEAN DEFAULT true,
    priority INTEGER DEFAULT 0,
    min_amount INTEGER DEFAULT 100, -- Minimum amount in paise
    max_amount INTEGER DEFAULT 10000000, -- Maximum amount in paise (1 crore)
    processing_fee DECIMAL(5,2) DEFAULT 0, -- Percentage fee
    fixed_fee INTEGER DEFAULT 0, -- Fixed fee in paise
    supported_currencies TEXT[] DEFAULT ARRAY['INR'],
    config JSONB NOT NULL DEFAULT '{}', -- Gateway-specific configuration
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payment Intents
CREATE TABLE IF NOT EXISTS payment_intents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    gateway VARCHAR(20) NOT NULL REFERENCES payment_gateway_configs(id),
    order_id UUID NOT NULL REFERENCES orders(id),
    amount INTEGER NOT NULL, -- Amount in paise
    currency VARCHAR(3) DEFAULT 'INR',
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded', 'partial_refund')),
    gateway_payment_id VARCHAR(255), -- Gateway's payment ID
    gateway_order_id VARCHAR(255), -- Gateway's order ID
    gateway_signature VARCHAR(512), -- Gateway's signature for verification
    payment_method VARCHAR(100), -- Specific payment method used (UPI, Card, etc.)
    error_message TEXT,
    refund_amount INTEGER DEFAULT 0, -- Total refunded amount in paise
    webhook_verified BOOLEAN DEFAULT false,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payment Webhooks Log
CREATE TABLE IF NOT EXISTS payment_webhooks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    payment_intent_id UUID REFERENCES payment_intents(id),
    gateway VARCHAR(20) NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    status VARCHAR(20) NOT NULL,
    signature VARCHAR(512),
    verified BOOLEAN DEFAULT false,
    raw_payload JSONB NOT NULL,
    processed BOOLEAN DEFAULT false,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payment Refunds
CREATE TABLE IF NOT EXISTS payment_refunds (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    payment_intent_id UUID NOT NULL REFERENCES payment_intents(id),
    refund_id VARCHAR(255) NOT NULL, -- Our refund ID
    gateway_refund_id VARCHAR(255), -- Gateway's refund ID
    amount INTEGER NOT NULL, -- Refund amount in paise
    reason TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processed', 'failed')),
    gateway_response JSONB,
    processed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payment Methods Analytics
CREATE TABLE IF NOT EXISTS payment_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE NOT NULL,
    gateway VARCHAR(20) NOT NULL,
    payment_method VARCHAR(100),
    total_transactions INTEGER DEFAULT 0,
    successful_transactions INTEGER DEFAULT 0,
    failed_transactions INTEGER DEFAULT 0,
    total_amount INTEGER DEFAULT 0, -- Total amount in paise
    successful_amount INTEGER DEFAULT 0, -- Successful amount in paise
    average_amount INTEGER DEFAULT 0, -- Average amount in paise
    refund_count INTEGER DEFAULT 0,
    refund_amount INTEGER DEFAULT 0, -- Refund amount in paise
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(date, gateway, payment_method)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_payment_intents_order_id ON payment_intents(order_id);
CREATE INDEX IF NOT EXISTS idx_payment_intents_gateway ON payment_intents(gateway);
CREATE INDEX IF NOT EXISTS idx_payment_intents_status ON payment_intents(status);
CREATE INDEX IF NOT EXISTS idx_payment_intents_gateway_payment_id ON payment_intents(gateway_payment_id);
CREATE INDEX IF NOT EXISTS idx_payment_intents_created_at ON payment_intents(created_at);

CREATE INDEX IF NOT EXISTS idx_payment_webhooks_payment_intent_id ON payment_webhooks(payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_payment_webhooks_gateway ON payment_webhooks(gateway);
CREATE INDEX IF NOT EXISTS idx_payment_webhooks_created_at ON payment_webhooks(created_at);

CREATE INDEX IF NOT EXISTS idx_payment_refunds_payment_intent_id ON payment_refunds(payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_payment_refunds_status ON payment_refunds(status);

CREATE INDEX IF NOT EXISTS idx_payment_analytics_date ON payment_analytics(date);
CREATE INDEX IF NOT EXISTS idx_payment_analytics_gateway ON payment_analytics(gateway);

-- Insert default payment gateway configurations
INSERT INTO payment_gateway_configs (id, name, enabled, sandbox, priority, min_amount, max_amount, processing_fee, fixed_fee, config) 
VALUES 
    ('phonepe', 'PhonePe', true, true, 1, 100, 10000000, 1.8, 0, '{}'),
    ('razorpay', 'Razorpay', true, true, 2, 100, 10000000, 2.0, 0, '{}'),
    ('cashfree', 'Cashfree', false, true, 3, 100, 10000000, 1.75, 0, '{}'),
    ('paypal', 'PayPal', false, true, 4, 100, 10000000, 3.5, 0, '{}')
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    priority = EXCLUDED.priority,
    min_amount = EXCLUDED.min_amount,
    max_amount = EXCLUDED.max_amount,
    processing_fee = EXCLUDED.processing_fee,
    fixed_fee = EXCLUDED.fixed_fee,
    updated_at = NOW();

-- Function to update payment analytics
CREATE OR REPLACE FUNCTION update_payment_analytics()
RETURNS TRIGGER AS $$
BEGIN
    -- Update analytics when payment intent status changes
    IF TG_OP = 'UPDATE' AND OLD.status != NEW.status THEN
        INSERT INTO payment_analytics (
            date, 
            gateway, 
            payment_method, 
            total_transactions,
            successful_transactions,
            failed_transactions,
            total_amount,
            successful_amount
        )
        VALUES (
            CURRENT_DATE,
            NEW.gateway,
            COALESCE(NEW.payment_method, 'unknown'),
            1,
            CASE WHEN NEW.status = 'completed' THEN 1 ELSE 0 END,
            CASE WHEN NEW.status = 'failed' THEN 1 ELSE 0 END,
            NEW.amount,
            CASE WHEN NEW.status = 'completed' THEN NEW.amount ELSE 0 END
        )
        ON CONFLICT (date, gateway, payment_method) 
        DO UPDATE SET
            total_transactions = payment_analytics.total_transactions + 1,
            successful_transactions = payment_analytics.successful_transactions + 
                CASE WHEN NEW.status = 'completed' THEN 1 ELSE 0 END,
            failed_transactions = payment_analytics.failed_transactions + 
                CASE WHEN NEW.status = 'failed' THEN 1 ELSE 0 END,
            total_amount = payment_analytics.total_amount + NEW.amount,
            successful_amount = payment_analytics.successful_amount + 
                CASE WHEN NEW.status = 'completed' THEN NEW.amount ELSE 0 END,
            average_amount = (payment_analytics.total_amount + NEW.amount) / 
                (payment_analytics.total_transactions + 1);
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for payment analytics
DROP TRIGGER IF EXISTS payment_analytics_trigger ON payment_intents;
CREATE TRIGGER payment_analytics_trigger
    AFTER UPDATE OF status ON payment_intents
    FOR EACH ROW
    EXECUTE FUNCTION update_payment_analytics();

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_payment_gateway_configs_updated_at ON payment_gateway_configs;
CREATE TRIGGER update_payment_gateway_configs_updated_at
    BEFORE UPDATE ON payment_gateway_configs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_payment_intents_updated_at ON payment_intents;
CREATE TRIGGER update_payment_intents_updated_at
    BEFORE UPDATE ON payment_intents
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
