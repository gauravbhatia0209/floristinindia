-- Add meta fields to categories and pages if they don't exist
-- This migration is idempotent and safe to run multiple times

-- Add show_in_menu column to product_categories if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'product_categories' 
        AND column_name = 'show_in_menu'
    ) THEN
        ALTER TABLE product_categories ADD COLUMN show_in_menu BOOLEAN DEFAULT true;
        UPDATE product_categories SET show_in_menu = true WHERE show_in_menu IS NULL;
    END IF;
END $$;

-- Ensure meta_title and meta_description columns exist in product_categories
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'product_categories' 
        AND column_name = 'meta_title'
    ) THEN
        ALTER TABLE product_categories ADD COLUMN meta_title VARCHAR(200);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'product_categories' 
        AND column_name = 'meta_description'
    ) THEN
        ALTER TABLE product_categories ADD COLUMN meta_description TEXT;
    END IF;
END $$;

-- Ensure meta_title and meta_description columns exist in pages
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'pages' 
        AND column_name = 'meta_title'
    ) THEN
        ALTER TABLE pages ADD COLUMN meta_title VARCHAR(200);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'pages' 
        AND column_name = 'meta_description'
    ) THEN
        ALTER TABLE pages ADD COLUMN meta_description TEXT;
    END IF;
END $$;

-- Ensure meta_title and meta_description columns exist in products
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'products' 
        AND column_name = 'meta_title'
    ) THEN
        ALTER TABLE products ADD COLUMN meta_title VARCHAR(200);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'products' 
        AND column_name = 'meta_description'
    ) THEN
        ALTER TABLE products ADD COLUMN meta_description TEXT;
    END IF;
END $$;

-- Create an index on product slugs for better performance
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_slug_active ON products(slug) WHERE is_active = true;

-- Create an index on category slugs for better performance  
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_categories_slug_active ON product_categories(slug) WHERE is_active = true;

-- Create an index on page slugs for better performance
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_pages_slug_active ON pages(slug) WHERE is_active = true;

-- Add some helpful comments
COMMENT ON COLUMN product_categories.meta_title IS 'Custom meta title for SEO, overrides auto-generated title';
COMMENT ON COLUMN product_categories.meta_description IS 'Custom meta description for SEO';
COMMENT ON COLUMN product_categories.show_in_menu IS 'Whether this category should appear in navigation menus';

COMMENT ON COLUMN pages.meta_title IS 'Custom meta title for SEO, overrides page title';
COMMENT ON COLUMN pages.meta_description IS 'Custom meta description for SEO';

COMMENT ON COLUMN products.meta_title IS 'Custom meta title for SEO, overrides product name';
COMMENT ON COLUMN products.meta_description IS 'Custom meta description for SEO, overrides short_description';
