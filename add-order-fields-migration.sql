-- Migration to add missing order fields for better data tracking
-- Run this SQL in your database to add the new columns

-- Add customer message field to orders table
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_message TEXT;

-- Add receiver information fields for better organization
ALTER TABLE orders ADD COLUMN IF NOT EXISTS receiver_name VARCHAR(255);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS receiver_phone VARCHAR(20);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS alternate_phone VARCHAR(20);

-- Add uploaded files tracking
ALTER TABLE orders ADD COLUMN IF NOT EXISTS uploaded_files JSONB DEFAULT '[]';

-- Add delivery instructions separately from special instructions  
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_instructions TEXT;

-- Add order source tracking
ALTER TABLE orders ADD COLUMN IF NOT EXISTS order_source VARCHAR(50) DEFAULT 'website';

-- Update existing orders to extract receiver info from shipping_address
UPDATE orders 
SET 
  receiver_name = shipping_address->>'name',
  receiver_phone = shipping_address->>'phone',
  alternate_phone = shipping_address->>'alternate_phone'
WHERE receiver_name IS NULL;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_orders_receiver_name ON orders(receiver_name);
CREATE INDEX IF NOT EXISTS idx_orders_delivery_date ON orders(delivery_date);
CREATE INDEX IF NOT EXISTS idx_orders_customer_message ON orders USING gin(to_tsvector('english', customer_message));

-- Add comments for documentation
COMMENT ON COLUMN orders.customer_message IS 'Personal message from customer with the order';
COMMENT ON COLUMN orders.receiver_name IS 'Name of the person receiving the delivery';
COMMENT ON COLUMN orders.receiver_phone IS 'Phone number of the delivery recipient';
COMMENT ON COLUMN orders.alternate_phone IS 'Alternate contact number for delivery';
COMMENT ON COLUMN orders.uploaded_files IS 'JSON array of uploaded files for this order';
COMMENT ON COLUMN orders.delivery_instructions IS 'Specific delivery instructions separate from special instructions';
COMMENT ON COLUMN orders.order_source IS 'Source of the order (website, phone, etc.)';
