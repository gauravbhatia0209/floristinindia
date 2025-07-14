-- Add checkout availability controls to payment gateway configurations

-- Add new columns for checkout availability
ALTER TABLE payment_gateway_configs 
ADD COLUMN IF NOT EXISTS available_at_checkout BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS checkout_display_name VARCHAR(100),
ADD COLUMN IF NOT EXISTS checkout_description TEXT,
ADD COLUMN IF NOT EXISTS checkout_icon VARCHAR(50),
ADD COLUMN IF NOT EXISTS checkout_priority INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS min_checkout_amount INTEGER DEFAULT 100,
ADD COLUMN IF NOT EXISTS max_checkout_amount INTEGER DEFAULT 10000000,
ADD COLUMN IF NOT EXISTS checkout_processing_message TEXT;

-- Update existing records with checkout settings
UPDATE payment_gateway_configs 
SET 
    available_at_checkout = enabled,
    checkout_display_name = name,
    checkout_description = CASE 
        WHEN id = 'phonepe' THEN 'Pay with UPI, Cards, Wallets & NetBanking'
        WHEN id = 'razorpay' THEN 'Cards, UPI, Wallets & NetBanking'
        WHEN id = 'cashfree' THEN 'All payment methods accepted'
        WHEN id = 'paypal' THEN 'International payments via PayPal'
        ELSE 'Secure payment processing'
    END,
    checkout_icon = CASE 
        WHEN id = 'phonepe' THEN 'smartphone'
        WHEN id = 'razorpay' THEN 'credit-card'
        WHEN id = 'cashfree' THEN 'banknote'
        WHEN id = 'paypal' THEN 'globe'
        ELSE 'credit-card'
    END,
    checkout_priority = priority,
    min_checkout_amount = min_amount,
    max_checkout_amount = max_amount,
    checkout_processing_message = CASE 
        WHEN id = 'phonepe' THEN 'Redirecting to PhonePe...'
        WHEN id = 'razorpay' THEN 'Processing payment...'
        WHEN id = 'cashfree' THEN 'Redirecting to payment gateway...'
        WHEN id = 'paypal' THEN 'Redirecting to PayPal...'
        ELSE 'Processing payment...'
    END
WHERE checkout_display_name IS NULL;

-- Create index for checkout queries
CREATE INDEX IF NOT EXISTS idx_payment_gateway_configs_checkout 
ON payment_gateway_configs(available_at_checkout, checkout_priority);

-- Add comment to explain the difference between enabled and available_at_checkout
COMMENT ON COLUMN payment_gateway_configs.enabled IS 'Whether the payment gateway is globally enabled in the system';
COMMENT ON COLUMN payment_gateway_configs.available_at_checkout IS 'Whether this payment method appears as an option during checkout';
COMMENT ON COLUMN payment_gateway_configs.checkout_display_name IS 'Name shown to customers at checkout (can be different from admin name)';
COMMENT ON COLUMN payment_gateway_configs.checkout_description IS 'Description shown to customers at checkout';
COMMENT ON COLUMN payment_gateway_configs.checkout_priority IS 'Display order at checkout (lower numbers appear first)';
COMMENT ON COLUMN payment_gateway_configs.min_checkout_amount IS 'Minimum order amount to show this payment method at checkout';
COMMENT ON COLUMN payment_gateway_configs.max_checkout_amount IS 'Maximum order amount to allow this payment method at checkout';
