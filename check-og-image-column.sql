-- Check if og_image column exists in required tables
-- Run this to verify if the migration is needed

SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE column_name = 'og_image' 
AND table_name IN ('product_categories', 'pages', 'products')
ORDER BY table_name;

-- If no rows are returned, you need to run: add-og-image-fields-migration.sql

-- Also check what columns currently exist in product_categories
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'product_categories' 
ORDER BY ordinal_position;
