-- Create order_items table
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

-- Create indices for faster queries
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);
CREATE INDEX IF NOT EXISTS idx_order_items_created_at ON order_items(created_at);

-- Enable RLS (Row Level Security)
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Create policies (allow authenticated users to read, anyone to insert during checkout)
CREATE POLICY "Allow authenticated users to read order items" ON order_items
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow anyone to insert order items" ON order_items
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update order items" ON order_items
  FOR UPDATE USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- Grant permissions
GRANT SELECT ON order_items TO authenticated;
GRANT INSERT ON order_items TO anon;
GRANT UPDATE ON order_items TO authenticated;
