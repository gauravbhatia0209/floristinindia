-- Add has_variations field to products table
ALTER TABLE products ADD COLUMN has_variations BOOLEAN DEFAULT false;

-- Update the column to be NOT NULL with default false
ALTER TABLE products ALTER COLUMN has_variations SET NOT NULL;
ALTER TABLE products ALTER COLUMN has_variations SET DEFAULT false;

-- Update existing products that have variants to set has_variations = true
UPDATE products 
SET has_variations = true 
WHERE id IN (
  SELECT DISTINCT product_id 
  FROM product_variants 
  WHERE is_active = true
);

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_products_has_variations ON products(has_variations);
