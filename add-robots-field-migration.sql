-- Add robots field to all content tables for SEO control
-- This migration is idempotent and safe to run multiple times

-- Add robots column to pages if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'pages' 
        AND column_name = 'robots'
    ) THEN
        ALTER TABLE pages ADD COLUMN robots VARCHAR(100);
    END IF;
END $$;

-- Add robots column to product_categories if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'product_categories' 
        AND column_name = 'robots'
    ) THEN
        ALTER TABLE product_categories ADD COLUMN robots VARCHAR(100);
    END IF;
END $$;

-- Add robots column to products if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'products' 
        AND column_name = 'robots'
    ) THEN
        ALTER TABLE products ADD COLUMN robots VARCHAR(100);
    END IF;
END $$;

-- Add defaultRobots setting to site_settings if it doesn't exist
INSERT INTO site_settings (key, value, category, description)
VALUES ('defaultRobots', 'index, follow', 'meta', 'Default robots directive for all pages')
ON CONFLICT (key) DO NOTHING;

-- Add helpful comments
COMMENT ON COLUMN pages.robots IS 'Custom robots directive for this page (e.g., "noindex, nofollow"). Leave empty to use default.';
COMMENT ON COLUMN product_categories.robots IS 'Custom robots directive for this category (e.g., "noindex, nofollow"). Leave empty to use default.';
COMMENT ON COLUMN products.robots IS 'Custom robots directive for this product (e.g., "noindex, nofollow"). Leave empty to use default.';
