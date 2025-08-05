-- Add og_image fields to categories, pages, and products tables
-- This migration is idempotent and safe to run multiple times

-- Add og_image column to product_categories if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'product_categories' 
        AND column_name = 'og_image'
    ) THEN
        ALTER TABLE product_categories ADD COLUMN og_image TEXT;
        COMMENT ON COLUMN product_categories.og_image IS 'Open Graph image URL for social media sharing';
    END IF;
END $$;

-- Add og_image column to pages if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'pages' 
        AND column_name = 'og_image'
    ) THEN
        ALTER TABLE pages ADD COLUMN og_image TEXT;
        COMMENT ON COLUMN pages.og_image IS 'Open Graph image URL for social media sharing';
    END IF;
END $$;

-- Add og_image column to products if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'products' 
        AND column_name = 'og_image'
    ) THEN
        ALTER TABLE products ADD COLUMN og_image TEXT;
        COMMENT ON COLUMN products.og_image IS 'Open Graph image URL for social media sharing';
    END IF;
END $$;

-- Create indexes for better performance on og_image lookups
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_product_categories_og_image ON product_categories(og_image) WHERE og_image IS NOT NULL;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_pages_og_image ON pages(og_image) WHERE og_image IS NOT NULL;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_og_image ON products(og_image) WHERE og_image IS NOT NULL;

-- Show migration results
SELECT 
    'Migration completed successfully. og_image fields added to:' as status,
    'product_categories, pages, products' as tables;

-- Check the new columns
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE column_name = 'og_image' 
AND table_name IN ('product_categories', 'pages', 'products')
ORDER BY table_name;
