-- Add missing columns to orders table for admin order processing
-- These fields are needed for complete order management

-- Add alternate phone field for additional contact information
ALTER TABLE orders ADD COLUMN IF NOT EXISTS alternate_phone VARCHAR(20);

-- Add customer message field for special customer requests/messages
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_message TEXT;

-- Add comments for documentation
COMMENT ON COLUMN orders.alternate_phone IS 'Alternate phone number for customer contact';
COMMENT ON COLUMN orders.customer_message IS 'Special message or instructions from customer';

-- Create index for faster searches on these fields
CREATE INDEX IF NOT EXISTS idx_orders_alternate_phone ON orders(alternate_phone) WHERE alternate_phone IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_orders_customer_message ON orders USING gin(to_tsvector('english', customer_message)) WHERE customer_message IS NOT NULL;
