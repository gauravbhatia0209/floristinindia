-- Create order_items table if it doesn't exist
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  price DECIMAL(10, 2) NOT NULL,
  total_price DECIMAL(10, 2) GENERATED ALWAYS AS (quantity * price) STORED,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Drop existing indices if they exist
DROP INDEX IF EXISTS idx_order_items_order_id;
DROP INDEX IF EXISTS idx_order_items_product_id;
DROP INDEX IF EXISTS idx_order_items_created_at;

-- Create indices for faster queries
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);
CREATE INDEX idx_order_items_created_at ON order_items(created_at);

-- Drop existing policies
DROP POLICY IF EXISTS "Allow authenticated users to read order items" ON order_items;
DROP POLICY IF EXISTS "Allow anyone to insert order items" ON order_items;
DROP POLICY IF EXISTS "Allow authenticated users to update order items" ON order_items;
DROP POLICY IF EXISTS "Allow service role full access to order items" ON order_items;

-- Enable RLS (Row Level Security)
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow anyone (anon + authenticated) to read order items
CREATE POLICY "Allow anyone to read order items" ON order_items
  FOR SELECT USING (true);

-- Allow anyone to insert order items (for checkout)
CREATE POLICY "Allow anyone to insert order items" ON order_items
  FOR INSERT WITH CHECK (true);

-- Allow authenticated users to update
CREATE POLICY "Allow authenticated users to update order items" ON order_items
  FOR UPDATE USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- Allow service role (backend) full access
CREATE POLICY "Allow service role full access to order items" ON order_items
  FOR ALL USING (true) WITH CHECK (true);

-- Grant permissions
GRANT SELECT ON order_items TO anon;
GRANT SELECT ON order_items TO authenticated;
GRANT INSERT ON order_items TO anon;
GRANT INSERT ON order_items TO authenticated;
GRANT UPDATE ON order_items TO authenticated;
GRANT DELETE ON order_items TO authenticated;
