-- Migration: Add new section types to homepage_sections constraint
-- This fixes the CHECK constraint to allow the new section types

BEGIN;

-- Drop the existing constraint
ALTER TABLE homepage_sections DROP CONSTRAINT IF EXISTS homepage_sections_type_check;

-- Add the new constraint with all supported section types
ALTER TABLE homepage_sections ADD CONSTRAINT homepage_sections_type_check
    CHECK (type IN ('hero', 'category_grid', 'product_carousel', 'product_grid', 'text_block', 'image_block', 'testimonials', 'newsletter', 'features', 'banner', 'hero_carousel', 'image', 'button', 'list', 'separator', 'heading', 'paragraph', 'image_with_link'));

COMMIT;
