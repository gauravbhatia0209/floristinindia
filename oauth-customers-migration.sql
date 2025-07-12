-- Add OAuth support fields to customers table
ALTER TABLE customers 
ADD COLUMN IF NOT EXISTS auth_provider VARCHAR(50),
ADD COLUMN IF NOT EXISTS provider_id VARCHAR(255);

-- Create index for OAuth lookups
CREATE INDEX IF NOT EXISTS idx_customers_provider_id ON customers(provider_id);
CREATE INDEX IF NOT EXISTS idx_customers_auth_provider ON customers(auth_provider);

-- Make password_hash optional for OAuth users
ALTER TABLE customers 
ALTER COLUMN password_hash DROP NOT NULL;
