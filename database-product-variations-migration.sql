-- Product Variations Enhancement Migration
-- This migration enhances the product_variants table to support variation groups and better flexibility

-- Add new columns to product_variants table
DO $$ 
BEGIN
    -- Add variation_type column (e.g., 'Size', 'Color', 'Weight')
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'product_variants' AND column_name = 'variation_type') THEN
        ALTER TABLE product_variants ADD COLUMN variation_type VARCHAR(100);
    END IF;
    
    -- Add variation_value column (e.g., 'Small', 'Large', 'Red', 'Blue')
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'product_variants' AND column_name = 'variation_value') THEN
        ALTER TABLE product_variants ADD COLUMN variation_value VARCHAR(100);
    END IF;
    
    -- Add price_override column (nullable - if null, use base product price)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'product_variants' AND column_name = 'price_override') THEN
        ALTER TABLE product_variants ADD COLUMN price_override DECIMAL(10, 2);
    END IF;
    
    -- Add sale_price_override column (nullable)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'product_variants' AND column_name = 'sale_price_override') THEN
        ALTER TABLE product_variants ADD COLUMN sale_price_override DECIMAL(10, 2);
    END IF;
    
    -- Add image_url column for variation-specific images
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'product_variants' AND column_name = 'image_url') THEN
        ALTER TABLE product_variants ADD COLUMN image_url TEXT;
    END IF;
    
    -- Add weight column for weight-based variations
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'product_variants' AND column_name = 'weight') THEN
        ALTER TABLE product_variants ADD COLUMN weight DECIMAL(8, 3);
    END IF;
    
    -- Add dimensions columns
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'product_variants' AND column_name = 'length') THEN
        ALTER TABLE product_variants ADD COLUMN length DECIMAL(8, 2);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'product_variants' AND column_name = 'width') THEN
        ALTER TABLE product_variants ADD COLUMN width DECIMAL(8, 2);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'product_variants' AND column_name = 'height') THEN
        ALTER TABLE product_variants ADD COLUMN height DECIMAL(8, 2);
    END IF;
    
    -- Add display_order for within variation type ordering
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'product_variants' AND column_name = 'display_order') THEN
        ALTER TABLE product_variants ADD COLUMN display_order INTEGER DEFAULT 0;
    END IF;
END $$;

-- Create new table for variation combinations (for complex variations with multiple attributes)
CREATE TABLE IF NOT EXISTS product_variation_combinations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    combination_name VARCHAR(255) NOT NULL, -- e.g., "Small-Red", "Large-Blue"
    price_override DECIMAL(10, 2),
    sale_price_override DECIMAL(10, 2),
    sku VARCHAR(100),
    stock_quantity INTEGER DEFAULT 0,
    image_url TEXT,
    weight DECIMAL(8, 3),
    length DECIMAL(8, 2),
    width DECIMAL(8, 2),
    height DECIMAL(8, 2),
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create junction table to link combinations with individual variations
CREATE TABLE IF NOT EXISTS product_variation_combination_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    combination_id UUID REFERENCES product_variation_combinations(id) ON DELETE CASCADE,
    variant_id UUID REFERENCES product_variants(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Update existing product_variants to use new structure
-- Migrate existing data by setting variation_type and variation_value from name
UPDATE product_variants 
SET variation_type = 'Size', 
    variation_value = name,
    price_override = price,
    sale_price_override = sale_price
WHERE variation_type IS NULL;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_product_variants_type ON product_variants(variation_type);
CREATE INDEX IF NOT EXISTS idx_product_variants_value ON product_variants(variation_value);
CREATE INDEX IF NOT EXISTS idx_product_variants_display_order ON product_variants(display_order);
CREATE INDEX IF NOT EXISTS idx_variation_combinations_product ON product_variation_combinations(product_id);
CREATE INDEX IF NOT EXISTS idx_combination_items_combination ON product_variation_combination_items(combination_id);
CREATE INDEX IF NOT EXISTS idx_combination_items_variant ON product_variation_combination_items(variant_id);

-- Add triggers for updated_at
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_timestamp_variation_combinations') THEN
        CREATE TRIGGER set_timestamp_variation_combinations BEFORE UPDATE ON product_variation_combinations FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
    END IF;
END $$;

-- Insert sample variations for flower products
DO $$
DECLARE
    rose_product_id UUID;
    lily_product_id UUID;
BEGIN
    -- Get sample product IDs
    SELECT id INTO rose_product_id FROM products WHERE slug = 'red-rose-bouquet-12' LIMIT 1;
    SELECT id INTO lily_product_id FROM products WHERE slug = 'white-lily-arrangement' LIMIT 1;
    
    -- Add size variations for rose bouquet
    IF rose_product_id IS NOT NULL THEN
        INSERT INTO product_variants (product_id, variation_type, variation_value, price_override, sale_price_override, stock_quantity, display_order) VALUES
        (rose_product_id, 'Size', 'Small (6 Roses)', 549.00, 449.00, 25, 1),
        (rose_product_id, 'Size', 'Medium (12 Roses)', 899.00, 749.00, 20, 2),
        (rose_product_id, 'Size', 'Large (24 Roses)', 1599.00, 1299.00, 15, 3)
        ON CONFLICT DO NOTHING;
        
        -- Add color variations
        INSERT INTO product_variants (product_id, variation_type, variation_value, stock_quantity, display_order) VALUES
        (rose_product_id, 'Color', 'Red', 30, 1),
        (rose_product_id, 'Color', 'Pink', 25, 2),
        (rose_product_id, 'Color', 'White', 20, 3),
        (rose_product_id, 'Color', 'Yellow', 15, 4)
        ON CONFLICT DO NOTHING;
    END IF;
    
    -- Add variations for lily arrangement
    IF lily_product_id IS NOT NULL THEN
        INSERT INTO product_variants (product_id, variation_type, variation_value, price_override, sale_price_override, stock_quantity, display_order) VALUES
        (lily_product_id, 'Size', 'Standard', 799.00, 699.00, 20, 1),
        (lily_product_id, 'Size', 'Premium', 1199.00, 999.00, 15, 2),
        (lily_product_id, 'Size', 'Deluxe', 1899.00, 1599.00, 10, 3)
        ON CONFLICT DO NOTHING;
    END IF;
END $$;
