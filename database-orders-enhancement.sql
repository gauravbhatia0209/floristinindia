-- Add missing columns to orders table for admin order processing
-- These fields are needed for complete order management

-- Add alternate phone field for additional contact information
ALTER TABLE orders ADD COLUMN IF NOT EXISTS alternate_phone VARCHAR(20);

-- Add customer message field for special customer requests/messages
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_message TEXT;

-- Add receiver information fields
ALTER TABLE orders ADD COLUMN IF NOT EXISTS receiver_name VARCHAR(255);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS receiver_phone VARCHAR(20);

-- Add delivery instructions field (separate from special_instructions)
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_instructions TEXT;

-- Add uploaded files field for storing file attachments
ALTER TABLE orders ADD COLUMN IF NOT EXISTS uploaded_files JSONB DEFAULT '[]';

-- Add comments for documentation
COMMENT ON COLUMN orders.alternate_phone IS 'Alternate phone number for customer contact';
COMMENT ON COLUMN orders.customer_message IS 'Special message or instructions from customer';
COMMENT ON COLUMN orders.receiver_name IS 'Name of the person receiving the order';
COMMENT ON COLUMN orders.receiver_phone IS 'Phone number of the person receiving the order';
COMMENT ON COLUMN orders.delivery_instructions IS 'Specific delivery instructions for the order';
COMMENT ON COLUMN orders.uploaded_files IS 'JSON array of uploaded file information';

-- Create indexes for faster searches on these fields
CREATE INDEX IF NOT EXISTS idx_orders_alternate_phone ON orders(alternate_phone) WHERE alternate_phone IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_orders_customer_message ON orders USING gin(to_tsvector('english', customer_message)) WHERE customer_message IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_orders_receiver_name ON orders(receiver_name) WHERE receiver_name IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_orders_receiver_phone ON orders(receiver_phone) WHERE receiver_phone IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_orders_delivery_instructions ON orders USING gin(to_tsvector('english', delivery_instructions)) WHERE delivery_instructions IS NOT NULL;
